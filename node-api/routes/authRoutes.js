const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const router   = express.Router();
const pool     = require('../config/db');
require('dotenv').config();

// POST /api/auth/login — Issue JWT for admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE Email = ?', [email]);
    const user   = rows[0];

    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const valid = await bcrypt.compare(password, user.PasswordHash);
    if (!valid)  return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = jwt.sign(
      { userID: user.UserID, role: user.Role, name: user.Name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: { userID: user.UserID, name: user.Name, email: user.Email, role: user.Role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
