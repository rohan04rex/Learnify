<?php
// cart.php — Enrollment (Cart) Management
//
// GET  ?action=list   → list enrolled courses for logged-in student
// GET  ?action=check  → check if logged in (for frontend auth gates)
// POST { courseID }   → enroll (add to cart)
// DELETE ?courseID    → unenroll

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

session_start();
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = getPDO();
$action = $_GET['action'] ?? null;

// ── Session check (used by JS before add-to-cart) ────────────────────────────
if ($method === 'GET' && $action === 'check') {
    if (!isset($_SESSION['userID'])) {
        jsonResponse(['loggedIn' => false]);
    }
    jsonResponse([
        'loggedIn' => true,
        'user' => [
            'userID' => $_SESSION['userID'],
            'name'   => $_SESSION['name'],
            'role'   => $_SESSION['role'],
        ],
    ]);
}

// ── Auth guard for everything else ────────────────────────────────────────────
if (!isset($_SESSION['userID'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.', 'redirect' => 'register.html'], 401);
}

$userID = (int)$_SESSION['userID'];

// ── GET: list enrolled courses ────────────────────────────────────────────────
if ($method === 'GET' && $action === 'list') {
    $stmt = $pdo->prepare(
        'SELECT e.EnrollmentID, e.EnrolledAt, c.CourseID, c.CourseName, c.Category, c.Instructor, c.Price, c.Image
         FROM enrollments e
         JOIN courses c ON c.CourseID = e.CourseID
         WHERE e.UserID = ?
         ORDER BY e.EnrolledAt DESC'
    );
    $stmt->execute([$userID]);
    jsonResponse(['success' => true, 'enrollments' => $stmt->fetchAll()]);
}

// ── POST: enroll in a course ──────────────────────────────────────────────────
if ($method === 'POST') {
    $d        = json_decode(file_get_contents('php://input'), true) ?? [];
    $courseID = (int)($d['courseID'] ?? $_POST['courseID'] ?? 0);
    if (!$courseID) jsonResponse(['success' => false, 'message' => 'courseID is required.'], 400);

    // Verify course exists
    $c = $pdo->prepare('SELECT CourseID FROM courses WHERE CourseID = ?');
    $c->execute([$courseID]);
    if (!$c->fetch()) jsonResponse(['success' => false, 'message' => 'Course not found.'], 404);

    // Insert (ignore if already enrolled)
    try {
        $stmt = $pdo->prepare('INSERT INTO enrollments (UserID, CourseID) VALUES (?, ?)');
        $stmt->execute([$userID, $courseID]);
        jsonResponse(['success' => true, 'message' => 'Enrolled successfully!', 'enrollmentID' => (int)$pdo->lastInsertId()]);
    } catch (PDOException $e) {
        // Duplicate entry — already enrolled
        jsonResponse(['success' => false, 'message' => 'You are already enrolled in this course.'], 409);
    }
}

// ── DELETE: unenroll ──────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    $courseID = (int)($_GET['courseID'] ?? 0);
    if (!$courseID) jsonResponse(['success' => false, 'message' => 'courseID is required.'], 400);
    $stmt = $pdo->prepare('DELETE FROM enrollments WHERE UserID = ? AND CourseID = ?');
    $stmt->execute([$userID, $courseID]);
    jsonResponse(['success' => true, 'message' => 'Unenrolled successfully.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
