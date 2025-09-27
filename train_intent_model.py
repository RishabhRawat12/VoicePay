import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import pickle

df = pd.read_csv("dataset.csv")

X = df['command']
y = df['intent']

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2))),  # consider unigrams + bigrams
    ('clf', LogisticRegression(max_iter=1000))
])

pipeline.fit(X, y)

accuracy = pipeline.score(X, y)
print(f"Training set accuracy: {accuracy*100:.2f}%")

with open("intent_model.pkl", "wb") as f:
    pickle.dump(pipeline, f)

print("Model saved as intent_model.pkl")
