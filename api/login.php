<?php
// login.php — Student / Admin Login
// Method: POST
// Body: { email, password }

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

session_start();
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$data     = json_decode(file_get_contents('php://input'), true);
$email    = trim($data['email']    ?? ($_POST['email']    ?? ''));
$password = trim($data['password'] ?? ($_POST['password'] ?? ''));

if (!$email || !$password) {
    jsonResponse(['success' => false, 'message' => 'Email and password are required.'], 400);
}

$pdo  = getPDO();
$stmt = $pdo->prepare('SELECT UserID, Name, Email, PasswordHash, Role FROM users WHERE Email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['PasswordHash'])) {
    jsonResponse(['success' => false, 'message' => 'Invalid email or password.'], 401);
}

// Store session
$_SESSION['userID'] = $user['UserID'];
$_SESSION['name']   = $user['Name'];
$_SESSION['email']  = $user['Email'];
$_SESSION['role']   = $user['Role'];

jsonResponse([
    'success' => true,
    'message' => 'Login successful.',
    'user'    => [
        'userID' => $user['UserID'],
        'name'   => $user['Name'],
        'email'  => $user['Email'],
        'role'   => $user['Role'],
    ],
]);
