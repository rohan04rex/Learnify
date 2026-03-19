# Learnify
🎓 Learnify: A full-stack LMS platform built with Vanilla JS, Bootstrap 5, PHP, MySQL, and a Node.js/React administration dashboard.


# Learnify 🎓

Learnify is a comprehensive modern e-learning platform designed to provide a seamless learning experience for students and powerful management tools for administrators.

## 🚀 Features

### For Students
* **User Authentication:** Secure registration and login system.
* **Course Catalog:** Browse and search through a wide variety of courses.
* **Shopping Cart:** Add desired courses to your cart. Cart functionality is secured for authenticated users only.
* **Student Dashboard:** Dedicated student panel to track enrolled courses and learning progress.

### For Administrators
* **Admin Dashboard:** A modern, React-based dashboard built with Vite to manage the platform.
* **Course Management:** Add, edit, and orchestrate the overall course catalog.

## 🛠️ Tech Stack

**Frontend:**
* HTML5, CSS3, Vanilla JavaScript
* Bootstrap 5 (Responsive UI)
* React.js & Vite (Admin Dashboard)

**Backend:**
* PHP (Core API for user auth, courses, and cart logic)
* Node.js & Express (API for the React Admin Dashboard)

**Database:**
* MySQL (Structured schemas for users, courses, and enrollments)

## ⚙️ Local Installation (XAMPP environment)

1. Clone this repository into your XAMPP `htdocs` directory (e.g., `C:\xampp\htdocs\Learnify XAMP`).
2. Start **Apache** and **MySQL** via the XAMPP Control Panel.
3. Import the database schema:
   * Open `http://localhost/phpmyadmin`
   * Create a new database.
   * Import the [schema.sql](cci:7://file:///c:/xampppppp/htdocs/Learnify%20XAMP/schema.sql:0:0-0:0) file located in the root directory.
4. Start the Node.js Admin API:
   ```bash
   cd node-api
   npm install
   npm start

