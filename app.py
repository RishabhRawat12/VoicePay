from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


app= Flask(__name__)
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



#model
if __name__ == '__main__ ':
    app.run(debug=True)