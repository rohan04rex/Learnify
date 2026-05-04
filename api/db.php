<?php
// db.php - Shared PDO database connection + CORS + session config
// Include this file in every API endpoint.

// Load environment variables if .env exists
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . '=' . trim($value));
    }
}

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_NAME', getenv('DB_NAME') ?: 'learnify_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');

// ── Shared CORS helper ───────────────────────────────────────────────────────
// Using wildcard '*' with credentials is not allowed by browsers.
// We mirror the requesting origin so session cookies are accepted.
function setCorsHeaders(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost';
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Apply CORS on every request
setCorsHeaders();

// Handle preflight early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Session cookie config (must be set BEFORE session_start) ─────────────────
// SameSite=Lax ensures cookies are sent on same-site navigations + sub-requests
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => false,       // set true in production with HTTPS
        'httponly'  => true,
        'samesite'  => 'Lax',
    ]);
}
function getPDO(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            DB_HOST, DB_NAME, DB_CHARSET
        );
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
        }
    }
    return $pdo;
}

// Helper: send JSON response and exit
function jsonResponse(array $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
