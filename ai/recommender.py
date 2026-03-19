import pandas as pd
import numpy as np
import pymysql
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv

# Load env variables if .env exists
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../node-api/.env'))

DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASS = os.getenv('DB_PASS', '')
DB_NAME = os.getenv('DB_NAME', 'learnify_db')

def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME
    )

def get_recommendations(user_interests, top_n=3):
    """
    Get recommendations based on user interests using Content-Based Filtering.
    user_interests: A string (e.g., 'web development, design')
    """
    try:
        conn = get_db_connection()
        # Fetch all columns needed by the frontend
        query = "SELECT CourseID, CourseName, Category, Description, Instructor, Image, Price FROM courses WHERE Status = 'Active'"
        df = pd.read_sql(query, conn)
        conn.close()

        if df.empty:
            return []

        # Combine features for TF-IDF
        # Handle cases where Description or Category is NULL
        df['Description'] = df['Description'].fillna('')
        df['Category'] = df['Category'].fillna('')
        df['features'] = df['CourseName'] + " " + df['Category'] + " " + df['Description']
        df['features'] = df['features'].str.lower()

        # Add the user's interests as a "pseudo-course"
        user_interests_clean = user_interests.lower().replace(',', ' ')
        
        user_row = pd.DataFrame({
            'CourseID': [-1],
            'CourseName': ['User Profile'],
            'Category': [''],
            'Description': [user_interests_clean],
            'features': [user_interests_clean]
        })

        # Temporarily append user row to dataframe
        temp_df = pd.concat([df, user_row], ignore_index=True)

        # TF-IDF Vectorization with ngram_range for better matching (e.g. "web dev")
        tfidf = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        tfidf_matrix = tfidf.fit_transform(temp_df['features'])

        # Compute cosine similarity
        cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])

        # Get top N similar courses
        sim_scores = list(enumerate(cosine_sim[0]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Take top N even if score is low, but skip 0 if possible
        top_indices = [i for i, score in sim_scores[:top_n] if score > 0]
        
        # Fallback to head if no matches
        recommended_courses_df = df.iloc[top_indices].copy() if top_indices else df.head(top_n).copy()
        
        # Convert to list of dicts and ensure types are JSON serializable
        recommended_courses = []
        for _, row in recommended_courses_df.iterrows():
            course_dict = {
                'CourseID': int(row['CourseID']),
                'CourseName': str(row['CourseName']),
                'Category': str(row['Category']),
                'Instructor': str(row['Instructor']),
                'Price': float(row['Price']) if row['Price'] is not None else 0.0,
                'Image': str(row['Image']) if row['Image'] else 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
                'Description': str(row['Description'])
            }
            recommended_courses.append(course_dict)
        
        # Add score if available
        if top_indices:
            for i, rec in enumerate(recommended_courses):
                if i < len(sim_scores):
                    rec['similarity_score'] = float(sim_scores[i][1])

        return recommended_courses
    except Exception as e:
        print(f"Error in recommendation engine: {e}")
        return []

if __name__ == "__main__":
    # Test with a dummy interest
    interests = "machine learning and data science"
    recs = get_recommendations(interests)
    print(f"Recommendations for '{interests}':")
    for r in recs:
        print(f"- {r['CourseName']} ({r['Category']}) [Score: {r['similarity_score']:.2f}]")
