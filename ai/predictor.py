"""
Student Performance Predictor — AI Feature 2
Uses Logistic Regression (scikit-learn) trained on synthetic student data.
Input:  Attendance (0-100) + Marks (0-100)
Output: Predicted Grade (A/B/C/Fail) + confidence + probability breakdown
"""

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# Grade mapping
GRADE_LABELS = {3: 'A', 2: 'B', 1: 'C', 0: 'Fail'}
GRADE_COLORS = {'A': '#10b981', 'B': '#3b82f6', 'C': '#f59e0b', 'Fail': '#ef4444'}


def _generate_training_data(n=500):
    """
    Generate synthetic student data that follows realistic academic patterns.
    Higher attendance + higher marks → better grades, with some natural noise.
    """
    np.random.seed(42)

    attendance = np.random.randint(0, 101, n).astype(float)
    marks = np.random.randint(0, 101, n).astype(float)

    # Weighted score: marks matter more (70%) than attendance (30%)
    scores = marks * 0.7 + attendance * 0.3

    # Map scores to grades
    grades = np.where(
        scores >= 75, 3,        # A
        np.where(
            scores >= 55, 2,    # B
            np.where(
                scores >= 35, 1,  # C
                0                 # Fail
            )
        )
    )

    # Add ~10% noise to make data realistic (some students over/under-perform)
    noise_indices = np.random.choice(n, size=int(n * 0.1), replace=False)
    noise_shift = np.random.choice([-1, 1], size=len(noise_indices))
    grades[noise_indices] = np.clip(grades[noise_indices] + noise_shift, 0, 3)

    return np.column_stack([attendance, marks]), grades


def _train_model():
    """Train a Logistic Regression model on synthetic data."""
    X, y = _generate_training_data()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = LogisticRegression(
        max_iter=1000,
        solver='lbfgs',
        C=1.0
    )
    model.fit(X_scaled, y)

    # Calculate training accuracy for info
    accuracy = model.score(X_scaled, y)
    print(f"[OK] Performance Predictor model trained - Accuracy: {accuracy:.1%}")

    return model, scaler


# Train once when module is imported
MODEL, SCALER = _train_model()


def predict_grade(attendance: int, marks: int) -> dict:
    """
    Predict student grade given attendance and marks.

    Args:
        attendance: Student attendance percentage (0-100)
        marks:      Student marks/score (0-100)

    Returns:
        dict with grade, confidence, weighted_score, and probability breakdown
    """
    # Validate
    attendance = max(0, min(100, int(attendance)))
    marks = max(0, min(100, int(marks)))

    X = np.array([[attendance, marks]], dtype=float)
    X_scaled = SCALER.transform(X)

    # ML prediction
    prediction = MODEL.predict(X_scaled)[0]
    probabilities = MODEL.predict_proba(X_scaled)[0]
    confidence = float(np.max(probabilities))

    # Build probability breakdown (map each class to its probability)
    classes = list(MODEL.classes_)
    breakdown = {}
    for grade_num, grade_label in GRADE_LABELS.items():
        if grade_num in classes:
            idx = classes.index(grade_num)
            breakdown[grade_label] = round(float(probabilities[idx]) * 100, 1)
        else:
            breakdown[grade_label] = 0.0

    # Weighted score for context
    weighted_score = round(marks * 0.7 + attendance * 0.3, 1)

    return {
        "grade": GRADE_LABELS[prediction],
        "confidence": round(confidence * 100, 1),
        "weighted_score": weighted_score,
        "attendance": attendance,
        "marks": marks,
        "breakdown": breakdown,
        "model_type": "Logistic Regression (scikit-learn)",
        "features_used": ["attendance", "marks"]
    }


# ── Rule-based fallback (Option A) ──────────────────────────────────────────
def predict_grade_rules(attendance: int, marks: int) -> dict:
    """Fallback rule-based predictor if ML model fails."""
    attendance = max(0, min(100, int(attendance)))
    marks = max(0, min(100, int(marks)))

    weighted_score = marks * 0.7 + attendance * 0.3

    if weighted_score >= 75:
        grade = 'A'
    elif weighted_score >= 55:
        grade = 'B'
    elif weighted_score >= 35:
        grade = 'C'
    else:
        grade = 'Fail'

    return {
        "grade": grade,
        "confidence": 100.0,
        "weighted_score": round(weighted_score, 1),
        "attendance": attendance,
        "marks": marks,
        "breakdown": {"A": 0, "B": 0, "C": 0, "Fail": 0, grade: 100.0},
        "model_type": "Rule-Based (fallback)",
        "features_used": ["attendance", "marks"]
    }


if __name__ == "__main__":
    # Quick test
    test_cases = [
        (95, 90),  # Expected: A
        (75, 70),  # Expected: B
        (50, 45),  # Expected: C
        (20, 15),  # Expected: Fail
        (80, 50),  # Borderline
        (30, 80),  # Low attendance, high marks
    ]
    print("\n--- Performance Predictor Test ---")
    for att, mrk in test_cases:
        result = predict_grade(att, mrk)
        print(f"  Attendance={att:3d}, Marks={mrk:3d} -> "
              f"Grade: {result['grade']:4s} "
              f"(Confidence: {result['confidence']:5.1f}%, "
              f"Score: {result['weighted_score']})")
    print()
