<?php
// logout.php — Destroy session
require_once __DIR__ . '/db.php';
session_start();
session_destroy();
jsonResponse(['success' => true, 'message' => 'Logged out successfully.']);
