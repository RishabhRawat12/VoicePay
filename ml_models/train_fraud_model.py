# ml_models/train_fraud_model.py
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

MODEL_PATH = os.path.join(os.path.dirname(__file__), "fraud_model.pkl")

def train():
    # Example dataset: [amount, avg_amount, tx_count_24h, unique_recipients, balance_ratio, new_recipient]
    X = [
        [100, 500, 5, 10, 0.3, 0],   # legit
        [200, 400, 3, 8, 0.4, 0],    # legit
        [150, 600, 6, 12, 0.2, 0],   # legit
        [5000, 800, 10, 15, 0.9, 1], # fraud
        [7000, 600, 12, 20, 0.95, 1],# fraud
        [9000, 1000, 20, 30, 0.85, 1]# fraud
    ]
    y = [0, 0, 0, 1, 1, 1]  # 0=legit, 1=fraud

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    preds = model.predict(X_test)
    print(classification_report(y_test, preds))

    # Save the model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    print(f"Fraud model saved at {MODEL_PATH}")

if __name__ == "__main__":
    train()
