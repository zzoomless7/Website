<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    echo json_encode([
        'success' => false,
        'message' => 'Nu ești autentificat'
    ]);
    exit;
}

// Return user data
echo json_encode([
    'success' => true,
    'user' => [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'],
        'email' => $_SESSION['user_email']
    ]
]);
?>
