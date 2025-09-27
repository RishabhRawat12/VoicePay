import pickle
import os
from sklearn.ensemble import RandomForestClassifier
import numpy as np

class FraudDetector:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), "fraud_model.pkl")
        self.model = None
        if os.path.exists(self.model_path):
            with open(self.model_path, "rb") as f:
                self.model = pickle.load(f)

    def _filter_recent_transactions(self, user_transactions, N=50):
        transactions = sorted(user_transactions, key=lambda t: t.timestamp, reverse=True)[:N]
        amounts = np.array([t.amount for t in transactions])
        if len(amounts) == 0:
            return [], 0, 0
        threshold = np.percentile(amounts, 95)
        filtered = [t for t in transactions if t.amount <= threshold]
        max_amount = max([t.amount for t in filtered]) if filtered else 0
        avg_amount = np.mean([t.amount for t in filtered]) if filtered else 0
        return filtered, avg_amount, max_amount

    def _extract_features(self, transaction, user_history):
        amount = transaction["amount"]
        recipient = transaction["recipient"]
        avg_amount = user_history.get("avg_amount", 0)
        max_amount = user_history.get("max_amount", 0)
        tx_count = user_history.get("tx_count_24h", 0)
        unique_recipients = user_history.get("unique_recipients", 0)
        balance = user_history.get("balance", 1)
        balance_ratio = amount / balance if balance > 0 else 0
        new_recipient = 1 if recipient not in user_history.get("known_recipients", []) else 0
        return [amount, avg_amount, max_amount, tx_count, unique_recipients, balance_ratio, new_recipient]

    def is_fraudulent(self, transaction, user_transactions, sender_balance, sender_id):
        sent_tx = [t for t in user_transactions if t.user_id == sender_id]
        filtered_tx, avg_amount, max_amount = self._filter_recent_transactions(sent_tx)
        tx_count = len(filtered_tx)
        unique_recipients = len(set(t.recipient for t in filtered_tx))
        known_recipients = [t.recipient for t in filtered_tx]

        user_history = {
            "avg_amount": avg_amount,
            "max_amount": max_amount,
            "tx_count_24h": tx_count,
            "unique_recipients": unique_recipients,
            "known_recipients": known_recipients,
            "balance": sender_balance
        }

        features = np.array([self._extract_features(transaction, user_history)])

        if tx_count < 5:  # updated threshold for quick testing
            if transaction["amount"] > 1.5 * max_amount and max_amount > 0:
                return True
            return False

        if self.model:
            prediction = self.model.predict(features)
            return bool(prediction[0])
        return False

    def train_model(self, user_transactions, sender_balance, sender_id):
        sent_tx = [t for t in user_transactions if t.user_id == sender_id]
        filtered_tx, avg_amount, max_amount = self._filter_recent_transactions(sent_tx)
        if len(filtered_tx) < 5:  # updated threshold
            return
        X = []
        y = []
        for t in filtered_tx:
            feature = self._extract_features({
                "amount": t.amount,
                "recipient": t.recipient
            }, {
                "avg_amount": avg_amount,
                "max_amount": max_amount,
                "tx_count_24h": len(filtered_tx),
                "unique_recipients": len(set(tt.recipient for tt in filtered_tx)),
                "known_recipients": [tt.recipient for tt in filtered_tx],
                "balance": sender_balance
            })
            X.append(feature)
            y.append(1 if t.amount > 1.3 * max_amount else 0)
        if X and y:
            clf = RandomForestClassifier(n_estimators=100, random_state=42)
            clf.fit(X, y)
            self.model = clf
            with open(self.model_path, "wb") as f:
                pickle.dump(self.model, f)
