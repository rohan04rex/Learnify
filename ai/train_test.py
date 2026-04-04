import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score
from sklearn.datasets import fetch_20newsgroups
import os

def train_and_evaluate_model():
    print("--- AI Model Training & Testing Workflow ---")
    
    # 1. Load Dataset (Using scikit-learn's built-in dataset as requested)
    # We'll use a subset of categories relevant to an LMS (tech, science, etc.)
    categories = ['sci.crypt', 'sci.electronics', 'sci.med', 'sci.space', 'comp.graphics']
    print(f"Loading dataset categories: {categories}...")
    newsgroups = fetch_20newsgroups(subset='all', categories=categories, remove=('headers', 'footers', 'quotes'))
    
    X = newsgroups.data
    y = newsgroups.target
    
    # 2. Preprocessing & Feature Extraction
    print("Vectorizing text data using TF-IDF...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    X_tfidf = vectorizer.fit_transform(X)
    
    # 3. Train/Test Split
    print("Splitting data into 80% training and 20% testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)
    
    # 4. Model Selection & Training
    print("Training Multinomial Naive Bayes classifier...")
    model = MultinomialNB()
    model.fit(X_train, y_train)
    
    # 5. Testing & Evaluation
    print("Evaluating model performance...")
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=newsgroups.target_names)
    
    print("\n" + "="*30)
    print(f"Model Accuracy: {accuracy:.2%}")
    print("="*30)
    print("Classification Report:")
    print(report)
    
    # 6. Saving results (Simulation of persistence)
    print("\nTraining complete. Model weights and vectorizer metadata are ready for deployment.")

if __name__ == "__main__":
    train_and_evaluate_model()
