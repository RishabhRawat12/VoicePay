import os
import pickle
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash
from ml_models.fraud_detection_model import FraudDetector
from ml_models.voice_parsing_utils import parse_payment_details

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    balance = db.Column(db.Float, nullable=False, default=1000.0)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    recipient = db.Column(db.String(80), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Load intent model if exists
try:
    with open('intent_model.pkl', 'rb') as f:
        intent_model = pickle.load(f)
except FileNotFoundError:
    intent_model = None

fraud_detector = FraudDetector()

# ------------------- ROUTES -------------------

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if db.session.query(User).filter_by(username=data['username']).first():
        return jsonify({'message': 'User already exists'}), 409
    if db.session.query(User).filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 409
    balance = data.get('balance', 1000.0)
    new_user = User(username=data['username'], email=data['email'], balance=balance)
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully', 'balance': new_user.balance}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = db.session.query(User).filter_by(username=data['username']).first()
    if user is None or not user.check_password(data['password']):
        return jsonify({'message': 'User does not exist or wrong password'}), 401
    return jsonify({'message': 'Login successful', 'user_id': user.id}), 200

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.get(User, user_id)
    if user:
        return jsonify({'username': user.username, 'balance': user.balance})
    return jsonify({'message': 'User not found'}), 404

@app.route('/transactions/<int:user_id>', methods=['GET'])
def get_transactions(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    transactions = db.session.query(Transaction).filter(
        (Transaction.user_id == user_id) | (Transaction.recipient == user.username)
    ).order_by(Transaction.timestamp.desc()).all()

    result = []
    for t in transactions:
        tx_type = 'sent' if t.user_id == user_id else 'received'
        party = t.recipient if tx_type == 'sent' else db.session.get(User, t.user_id).username
        result.append({
            'type': tx_type,
            'party': party,
            'amount': t.amount,
            'timestamp': t.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        })

    return jsonify(result)

@app.route('/parse-voice-command', methods=['POST'])
def parse_voice_command():
    data = request.get_json()
    text = data.get('voice_input')
    if not text:
        return jsonify({'message': 'No voice input provided.'}), 400
    if not intent_model:
        return jsonify({'message': 'Voice model is not loaded on the server.'}), 500
    prediction_list = intent_model.predict([text])
    intent = prediction_list[0]
    if intent != "transfer_money":
        return jsonify({'message': f'I understood you wanted to "{intent}", but this app only handles money transfers.'}), 200
    payment_details = parse_payment_details(text)
    if not payment_details or not payment_details.get('amount') or not payment_details.get('recipient'):
        return jsonify({'message': 'Could not extract amount and recipient from command.'}), 400
    recipient_username = payment_details.get('recipient')
    amount = payment_details.get('amount')
    recipient_user = db.session.query(User).filter_by(username=recipient_username).first()
    if not recipient_user:
        return jsonify({'message': f"Recipient '{recipient_username}' not found."}), 404
    return jsonify({'amount': amount, 'recipient': recipient_username}), 200

@app.route('/transaction', methods=['POST'])
def create_transaction():
    data = request.get_json()
    sender_id = data['sender_id']
    recipient_username = data['recipient_username']
    amount = float(data['amount'])

    sender = db.session.get(User, sender_id)
    recipient = db.session.query(User).filter_by(username=recipient_username).first()

    if not sender:
        return jsonify({'message': 'Sender not found.'}), 404
    if not recipient:
        return jsonify({'message': 'Recipient does not exist.'}), 404
    if sender.id == recipient.id:
        return jsonify({'message': 'You cannot send money to yourself.'}), 400
    if sender.balance < amount:
        return jsonify({'message': 'Insufficient funds.'}), 400

    user_transactions = db.session.query(Transaction).filter(
        Transaction.user_id == sender.id
    ).order_by(Transaction.timestamp.desc()).all()

    # Train fraud detector on sufficient history
    if len(user_transactions) >= 5:
        fraud_detector.train_model(user_transactions, sender.balance, sender.id)

    # Check if transaction is suspicious
    if fraud_detector.is_fraudulent({"amount": amount, "recipient": recipient_username},
                                     user_transactions, sender.balance, sender.id):
        return jsonify({'message': 'Transaction flagged as suspicious!'}), 403

    sender.balance -= amount
    recipient.balance += amount
    new_transaction = Transaction(amount=amount, recipient=recipient_username, user_id=sender_id)
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction successful!', 'new_balance': sender.balance}), 200

# ------------------- RUN APP -------------------
if __name__ == '__main__':
    with app.app_context():
        if not os.path.exists('database.db'):
            db.create_all()
    app.run(debug=True)
