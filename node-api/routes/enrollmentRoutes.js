const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const auth    = require('../middleware/authMiddleware');

// GET /api/enrollments — all enrollments with student & course info (admin)
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         e.EnrollmentID,
         e.EnrolledAt,
         u.UserID,
         u.Name    AS StudentName,
         u.Email   AS StudentEmail,
         c.CourseID,
         c.CourseName,
         c.Category,
         c.Price
       FROM enrollments e
       JOIN users   u ON u.UserID   = e.UserID
       JOIN courses c ON c.CourseID = e.CourseID
       ORDER BY e.EnrolledAt DESC`
    );
    res.json({ success: true, enrollments: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/enrollments/stats — summary for dashboard cards
router.get('/stats', auth, async (req, res) => {
  try {
    const [[{ totalStudents }]] = await pool.query(
      'SELECT COUNT(DISTINCT UserID) AS totalStudents FROM enrollments'
    );
    const [[{ totalCourses }]] = await pool.query(
      'SELECT COUNT(*) AS totalCourses FROM courses'
    );
    const [[{ totalEnrollments }]] = await pool.query(
      'SELECT COUNT(*) AS totalEnrollments FROM enrollments'
    );
    const [[{ totalRevenue }]] = await pool.query(
      `SELECT COALESCE(SUM(c.Price), 0) AS totalRevenue
       FROM enrollments e JOIN courses c ON c.CourseID = e.CourseID`
    );
    res.json({ success: true, stats: { totalStudents, totalCourses, totalEnrollments, totalRevenue } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
