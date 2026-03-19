const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const auth    = require('../middleware/authMiddleware');

// GET /api/courses — public list (Active only)
router.get('/', async (req, res) => {
  try {
    const status = req.query.status || 'Active';
    const query =
      status === 'all'
        ? 'SELECT * FROM courses ORDER BY CreatedAt DESC'
        : 'SELECT * FROM courses WHERE Status = ? ORDER BY CreatedAt DESC';
    const params = status === 'all' ? [] : [status];
    const [courses] = await pool.query(query, params);
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/courses/:id — single course
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses WHERE CourseID = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, course: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/courses — create (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { CourseName, Category, Instructor, Price = 0, Status = 'Active', Image = null, Description = null } = req.body;
    if (!CourseName || !Category || !Instructor) {
      return res.status(400).json({ success: false, message: 'CourseName, Category, and Instructor are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO courses (CourseName, Category, Instructor, Price, Status, Image, Description) VALUES (?,?,?,?,?,?,?)',
      [CourseName, Category, Instructor, Price, Status, Image, Description]
    );
    res.status(201).json({ success: true, message: 'Course created.', CourseID: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/courses/:id — update (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { CourseName, Category, Instructor, Price, Status, Image, Description } = req.body;
    await pool.query(
      'UPDATE courses SET CourseName=?, Category=?, Instructor=?, Price=?, Status=?, Image=?, Description=? WHERE CourseID=?',
      [CourseName, Category, Instructor, Price, Status, Image, Description, req.params.id]
    );
    res.json({ success: true, message: 'Course updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/courses/:id — delete (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE CourseID = ?', [req.params.id]);
    res.json({ success: true, message: 'Course deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
