<?php
require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Metodă nepermisă'
    ]);
    exit;
}

// Get POST data
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Validate input
if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Te rugăm să completezi toate câmpurile!'
    ]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email invalid!'
    ]);
    exit;
}

try {
    $conn = getDBConnection();
    
    // Prepare and execute query
    $stmt = $conn->prepare("SELECT id, full_name, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Email sau parolă incorectă!'
        ]);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Email sau parolă incorectă!'
        ]);
        exit;
    }
    
    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['logged_in'] = true;
    
    echo json_encode([
        'success' => true,
        'message' => 'Autentificare reușită! Bun venit înapoi!'
    ]);
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'A apărut o eroare. Te rugăm să încerci din nou.'
    ]);
}
?>
