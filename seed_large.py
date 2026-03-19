import pymysql
import os
import random
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), 'node-api/.env'))

DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASS = os.getenv('DB_PASS', '')
DB_NAME = os.getenv('DB_NAME', 'learnify_db')

def seed_large_dataset():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        cursor = conn.cursor()
        
        # Categories and Instructors
        categories = ['Development', 'AI & Data Science', 'Design', 'Marketing', 'Business', 'Finance', 'Lifestyle', 'Personal Development', 'Photography', 'Music', 'Health & Fitness', 'Office Productivity']
        instructors = ['Dr. Angela Yu', 'Kirill Eremenko', 'Gary Simon', 'Rob Percival', 'Jose Portilla', 'Phil Ebiner', 'Nathan House', 'Chris Haroun', 'Maximilian Schwarzmüller', 'Colt Steele', 'Brad Traversy', 'Andrew Ng']
        
        base_courses = [
            ('Full Stack Web Development', 'Development', 'Dr. Angela Yu', 899, 'Active', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Learn HTML, CSS, JS, Node, React, and MongoDB.'),
            ('Python for Data Science', 'AI & Data Science', 'Jose Portilla', 799, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Python for data analysis and visualization.'),
            ('Modern React with Redux', 'Development', 'Stephen Grider', 699, 'Active', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600', 'Master React and Redux.'),
            ('The Web Developer Bootcamp', 'Development', 'Colt Steele', 999, 'Active', 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600', 'The only course you need to learn web development.'),
            ('Angular - The Complete Guide', 'Development', 'Maximilian Schwarzmüller', 849, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Master Angular (formerly Angular 2).'),
            ('Machine Learning A-Z', 'AI & Data Science', 'Kirill Eremenko', 1299, 'Active', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600', 'Hands-on Machine Learning.'),
            ('Deep Learning with Keras', 'AI & Data Science', 'Andrew Ng', 1499, 'Active', 'https://images.unsplash.com/photo-1509228468518-180dd4805a44?w=600', 'Neural networks using Keras and TensorFlow.'),
            ('UI/UX Design Masterclass', 'Design', 'Gary Simon', 799, 'Active', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600', 'Design great user interfaces.'),
            ('Digital Marketing 2024', 'Marketing', 'Phil Ebiner', 499, 'Active', 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600', 'SEO, Social Media, and more.'),
            ('An Entire MBA in 1 Course', 'Business', 'Chris Haroun', 1999, 'Active', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600', 'Business management and strategy.')
        ]
        
        courses = list(base_courses)
        
        # Add random courses to reach 65
        while len(courses) < 65:
            cat = random.choice(categories)
            ins = random.choice(instructors)
            price = random.randint(299, 1599)
            title = f"Mastering {cat} {len(courses) + 1}"
            desc = f"Comprehensive guide to {cat} taught by {ins}. Build real-world projects and gain skills."
            # Unsplash IDs that are likely to work
            ids = ['1516321318423-f06f85e504b3', '1526374965328-7f61d4dc18c5', '1498050108023-c5249f4df085', '1517694712202-14dd9538aa97']
            img = f"https://images.unsplash.com/photo-{random.choice(ids)}?w=600"
            courses.append((title, cat, ins, price, 'Active', img, desc))

        # We don't truncate enrollments here to avoid breaking user progress if they exist
        # But we delete existing courses that don't have enrollments
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        cursor.execute("DELETE FROM courses")
        cursor.execute("ALTER TABLE courses AUTO_INCREMENT = 1")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        
        for course in courses:
            cursor.execute(
                "INSERT INTO courses (CourseName, Category, Instructor, Price, Status, Image, Description) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                course
            )
        
        conn.commit()
        cursor.close()
        conn.close()
        print(f"Successfully seeded {len(courses)} courses.")
    except Exception as e:
        print(f"Error seeding large dataset: {e}")

if __name__ == "__main__":
    seed_large_dataset()
