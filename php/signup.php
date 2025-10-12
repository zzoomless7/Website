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
$fullName = trim($_POST['fullName'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Validate input
if (empty($fullName) || empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Te rugăm să completezi toate câmpurile!'
    ]);
    exit;
}

// Validate full name length
if (strlen($fullName) < 2) {
    echo json_encode([
        'success' => false,
        'message' => 'Numele trebuie să aibă cel puțin 2 caractere!'
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

// Validate password length
if (strlen($password) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'Parola trebuie să aibă cel puțin 6 caractere!'
    ]);
    exit;
}

try {
    $conn = getDBConnection();
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Email-ul este deja înregistrat!'
        ]);
        $stmt->close();
        $conn->close();
        exit;
    }
    $stmt->close();
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $fullName, $email, $hashedPassword);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Cont creat cu succes! Vei fi redirecționat către pagina de autentificare.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'A apărut o eroare la crearea contului. Te rugăm să încerci din nou.'
        ]);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'A apărut o eroare. Te rugăm să încerci din nou.'
    ]);
}
?>
