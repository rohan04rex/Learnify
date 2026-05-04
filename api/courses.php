<?php
// courses.php — Public course listing
// Method: GET → list courses
// Method: POST → add course (admin only via session)
// Method: PUT  → update course (admin only)
// Method: DELETE → delete course (admin only)

require_once __DIR__ . '/db.php';
session_start();

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = getPDO();

// ── GET: list all active courses ──────────────────────────────────────────────
if ($method === 'GET') {
    $status = $_GET['status'] ?? 'Active';
    if ($status === 'all') {
        $stmt = $pdo->query('SELECT * FROM courses ORDER BY CreatedAt DESC');
    } else {
        $stmt = $pdo->prepare('SELECT * FROM courses WHERE Status = ? ORDER BY CreatedAt DESC');
        $stmt->execute([$status]);
    }
    jsonResponse(['success' => true, 'courses' => $stmt->fetchAll()]);
}

// Admin guard for write operations
function requireAdmin(): void {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        jsonResponse(['success' => false, 'message' => 'Unauthorized. Admin access required.'], 401);
    }
}

// ── POST: create course ───────────────────────────────────────────────────────
if ($method === 'POST') {
    requireAdmin();
    $d = json_decode(file_get_contents('php://input'), true) ?? [];
    $name        = trim($d['CourseName']  ?? '');
    $category    = trim($d['Category']    ?? '');
    $instructor  = trim($d['Instructor']  ?? '');
    $price       = (float)($d['Price']    ?? 0);
    $status      = $d['Status'] === 'Draft' ? 'Draft' : 'Active';
    $image       = trim($d['Image']       ?? '');
    $description = trim($d['Description'] ?? '');

    if (!$name || !$category || !$instructor) {
        jsonResponse(['success' => false, 'message' => 'Name, Category, and Instructor are required.'], 400);
    }

    $stmt = $pdo->prepare('INSERT INTO courses (CourseName, Category, Instructor, Price, Status, Image, Description) VALUES (?,?,?,?,?,?,?)');
    $stmt->execute([$name, $category, $instructor, $price, $status, $image ?: null, $description ?: null]);
    jsonResponse(['success' => true, 'message' => 'Course created.', 'CourseID' => (int)$pdo->lastInsertId()], 201);
}

// ── PUT: update course ────────────────────────────────────────────────────────
if ($method === 'PUT') {
    requireAdmin();
    $d  = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int)($d['CourseID'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'CourseID required.'], 400);

    $stmt = $pdo->prepare('UPDATE courses SET CourseName=?, Category=?, Instructor=?, Price=?, Status=?, Image=?, Description=? WHERE CourseID=?');
    $stmt->execute([
        trim($d['CourseName']  ?? ''),
        trim($d['Category']    ?? ''),
        trim($d['Instructor']  ?? ''),
        (float)($d['Price']    ?? 0),
        $d['Status'] === 'Draft' ? 'Draft' : 'Active',
        trim($d['Image']       ?? '') ?: null,
        trim($d['Description'] ?? '') ?: null,
        $id,
    ]);
    jsonResponse(['success' => true, 'message' => 'Course updated.']);
}

// ── DELETE: remove course ─────────────────────────────────────────────────────
if ($method === 'DELETE') {
    requireAdmin();
    $d  = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int)($d['CourseID'] ?? $_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'CourseID required.'], 400);

    $pdo->prepare('DELETE FROM courses WHERE CourseID = ?')->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Course deleted.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
