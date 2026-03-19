import pymysql
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), 'node-api/.env'))

DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASS = os.getenv('DB_PASS', '')
DB_NAME = os.getenv('DB_NAME', 'learnify_db')

def seed_courses():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        cursor = conn.cursor()
        
        courses_to_add = [
            ('Python for Data Science', 'AI & Data Science', 'Jose Portilla', 599.00, 'Active', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 'Learn Python from scratch for data analysis and visualization.'),
            ('Advanced React UI', 'Development', 'Cassidy Williams', 799.00, 'Active', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600', 'Build complex user interfaces with React and modern CSS.'),
            ('Cyber Security Fundamentals', 'Security', 'Nathan House', 699.00, 'Active', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600', 'Protect your systems from cyber threats and learn ethical hacking.'),
            ('Business Strategy Masterclass', 'Business', 'Chris Haroun', 449.00, 'Active', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600', 'Learn how to scale businesses and execute complex strategies.'),
            ('Digital Marketing 2024', 'Marketing', 'Phil Ebiner', 349.00, 'Active', 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600', 'Master digital marketing including SEO, social media, and paid ads.'),
            ('Java Programming for Beginners', 'Development', 'John Smith', 499.00, 'Active', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'Learn the basics of Java programming and software development.'),
            ('Full Stack Web with Node.js', 'Development', 'Maximilian Schwarzmüller', 699.00, 'Active', 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600', 'Complete course on Node.js, Express, and MongoDB for full-stack apps.'),
            ('Deep Learning with Keras', 'AI & Data Science', 'Andrew Ng', 899.00, 'Active', 'https://images.unsplash.com/photo-1509228468518-180dd4805a44?w=600', 'Deep dive into neural networks using Keras and TensorFlow.')
        ]
        
        for course in courses_to_add:
            cursor.execute(
                "INSERT INTO courses (CourseName, Category, Instructor, Price, Status, Image, Description) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                course
            )
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Courses seeded successfully.")
    except Exception as e:
        print(f"Error seeding courses: {e}")

if __name__ == "__main__":
    seed_courses()
