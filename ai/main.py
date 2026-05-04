from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn
import os
import sys

# Add current directory to path so it can import recommender
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from recommender import get_recommendations
from predictor import predict_grade, predict_grade_rules

app = FastAPI(title="Learnify AI Service - Recommendations + Performance Predictor")

# Add CORS middleware to allow requests from Frontend/Node-API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Learnify AI Service is running.",
        "endpoints": [
            {"path": "/recommend", "description": "Course Recommendation System"},
            {"path": "/predict", "description": "Student Performance Predictor"}
        ]
    }

@app.get("/recommend")
def recommend_courses(interests: str = Query(..., description="Comma-separated user interests"), 
                      top_n: int = Query(3, description="Number of recommendations")):
    """
    Returns recommended courses based on user interests.
    Example: GET /recommend?interests=web,python&top_n=3
    """
    if not interests:
        raise HTTPException(status_code=400, detail="Interests parameter is required.")
        
    recommendations = get_recommendations(interests, top_n)
    return {
        "user_interests": interests,
        "recommendations": recommendations,
        "count": len(recommendations)
    }

@app.get("/predict")
def predict_performance(
    attendance: int = Query(..., description="Student attendance percentage (0-100)", ge=0, le=100),
    marks: int = Query(..., description="Student marks/score (0-100)", ge=0, le=100)
):
    """
    Predict student grade based on attendance and marks.
    Uses Logistic Regression (ML) with rule-based fallback.
    Example: GET /predict?attendance=85&marks=72
    """
    try:
        result = predict_grade(attendance, marks)
    except Exception as e:
        # Fallback to rule-based if ML model fails
        print(f"ML model failed, using rule-based fallback: {e}")
        result = predict_grade_rules(attendance, marks)
    
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
