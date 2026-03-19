from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn
import os
import sys

# Add current directory to path so it can import recommender
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from recommender import get_recommendations

app = FastAPI(title="Learnify AI Recommendation Service")

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
    return {"message": "Learnify AI Recommendation Service is running."}

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

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
