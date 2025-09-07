from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import or_
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from main import parse_amount,parse_payment
import os

app= Flask(__name__)
CORS(app, supports_credentials=True) # <<< I ADDED THIS LINE

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#configuration
db= SQLAlchemy(app)


class User(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(80),unique=True, nullable=False)
    email=db.Column(db.String(120), unique=True, nullable=False)
    password_hash=db.Column(db.String(128))
    balance=db.Column(db.Float,nullable=False,default=1000.0)

    def set_password(self,password):
        self.password_hash=generate_password_hash(password)

    def check_password(self,password):
        return check_password_hash(self.password_hash,password)
    
    def __repr__(self):
        return f'<User {self.username}>'


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    recipient = db.Column(db.String(80), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)




@app.route('/register',methods=['POST'])
def register():
    data=request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message':'user already exists'}),409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message':'email already exists'}),409
    
    new_user=User(
        username=data['username'],
        email=data['email']
    )

    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message':'user created successfully'}),201

@app.route('/login',methods=['POST'])
def login():
    data=request.get_json()
    user=User.query.filter_by(username=data['username']).first()

    if user is None or not user.check_password(data['password']):
        return jsonify({'message':'user doesn\'t exists or wrong password'}),401
    
    return jsonify({'message':'login successfull','user_id':user.id}),200


@app.route('/transaction', methods=['POST'])
def create_transaction():
    data = request.get_json()
    
    sender_id = data['sender_id']
    recipient_username = data['recipient_username']
    amount = float(data['amount'])
    
    sender = User.query.get(sender_id)
    recipient = User.query.filter_by(username=recipient_username).first()
    
    if recipient is None:
        return jsonify({'message': 'Recipient does not exist.'}), 404
        
    if sender.id == recipient.id:
        return jsonify({'message': 'You cannot send money to yourself.'}), 400

    if sender.balance < amount:
        return jsonify({'message': 'Insufficient funds.'}), 400
        
    sender.balance -= amount
    recipient.balance += amount
    
    new_transaction = Transaction(
        amount=amount,
        recipient=recipient_username,
        user_id=sender_id
    )
    
    db.session.add(new_transaction)
    db.session.commit()
    
    return jsonify({
        'message': 'Transaction successful!',
        'new_balance': sender.balance
    }), 200

@app.route('/user/<int:user_id>',methods=['GET'])
def get_user(user_id):
    user=User.query.get(user_id)
    if(user):
        return jsonify({
            'username':user.username,
            'balance':user.balance
        })
    
    return jsonify({'message':'user not found'}),404


@app.route('/transactions/<int:user_id>',methods=['GET'])
def get_transactions(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    all_transactions = Transaction.query.filter(
        or_(Transaction.user_id == user_id, Transaction.recipient == user.username)
    ).order_by(Transaction.timestamp.desc()).all()

    result = []
    for t in all_transactions:
        if t.user_id == user_id:
            result.append({
                'type': 'sent',
                'party': t.recipient, 
                'amount': t.amount,
                'timestamp': t.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            })
        else:
            sender = User.query.get(t.user_id)
            result.append({
                'type': 'received',
                'party': sender.username if sender else 'Unknown User', 
                'amount': t.amount,
                'timestamp': t.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            })
            
    return jsonify(result)
    
@app.route('/voice-transaction',methods=['POST'])
def voice_transaction():
    data=request.get_json()
    user_id=data['user_id']

    text=data['voice_input']
    payment_details=parse_payment(text)
    if not payment_details:
        return jsonify({'message': 'Could not extract payment details'}), 400
    
    recipient_name=payment_details['recipient']
    amount=payment_details['amount']

    sender=User.query.get(user_id)
    recipient=User.query.filter_by(username=recipient_name).first()

    if recipient is None:
        return jsonify({'message':'recipient does not exist'}),404
    
    if sender.id==recipient.id:
        return jsonify({'message':'cannot send money to yourself'}),400
    
    if sender.balance<amount :
        return jsonify({'message':'insufficient balance'}),400
    
    sender.balance-=amount
    recipient.balance+=amount

    new_transaction = Transaction(amount=amount , recipient=recipient_name , user_id=user_id)
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({
        'message':f'paid {amount} to {recipient_name} successfully','new_balance':sender.balance
    }),200
    

@app.route('/parse-voice-command', methods=['POST'])
def parse_voice_command():
    data = request.get_json()
    text = data.get('voice_input')
    if not text:
        return jsonify({'message': 'No voice input provided.'}), 400

    payment_details = parse_payment(text)
    if not payment_details:
        return jsonify({'message': 'Could not extract payment details from command.'}), 400

    recipient = User.query.filter_by(username=payment_details['recipient']).first()
    if not recipient:
        return jsonify({'message': f"Recipient '{payment_details['recipient']}' not found."}), 404

    return jsonify(payment_details), 200

if __name__ == '__main__':
    print("Database path:", os.path.abspath("database.db"))
    with app.app_context():
        db.create_all()
    app.run(debug=True)