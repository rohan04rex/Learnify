<?php
// logout.php — Destroy session
header('Access-Control-Allow-Origin: *');
session_start();
session_destroy();
require_once __DIR__ . '/db.php';
jsonResponse(['success' => true, 'message' => 'Logged out successfully.']);
