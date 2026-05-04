<?php
// register.php — Student Registration
// Method: POST
// Body: { name, email, password }

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
// Also support form POST
$name     = trim($data['name']     ?? ($_POST['name']     ?? ''));
$email    = trim($data['email']    ?? ($_POST['email']    ?? ''));
$password = trim($data['password'] ?? ($_POST['password'] ?? ''));

if (!$name || !$email || !$password) {
    jsonResponse(['success' => false, 'message' => 'All fields are required.'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Invalid email address.'], 400);
}
if (strlen($password) < 6) {
    jsonResponse(['success' => false, 'message' => 'Password must be at least 6 characters.'], 400);
}

$pdo = getPDO();

// Check duplicate email
$stmt = $pdo->prepare('SELECT UserID FROM users WHERE Email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Email already registered.'], 409);
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $pdo->prepare('INSERT INTO users (Name, Email, PasswordHash, Role) VALUES (?, ?, ?, \'student\')');
$stmt->execute([$name, $email, $hash]);

jsonResponse([
    'success' => true,
    'message' => 'Registration successful! Please log in.',
    'userID'  => (int) $pdo->lastInsertId(),
]);
