<?php
header('Content-Type: application/json');

// Set response headers for CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Initialize response array
$response = array(
    'success' => false,
    'message' => ''
);

// Check if form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Metodă de trimitere invalidă.';
    echo json_encode($response);
    exit;
}

// Sanitize and validate input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get form data
$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// Validation
$errors = array();

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Numele trebuie să conțină cel puțin 2 caractere.';
}

if (empty($email) || !validateEmail($email)) {
    $errors[] = 'Vă rugăm să introduceți o adresă de email validă.';
}

if (empty($subject) || strlen($subject) < 5) {
    $errors[] = 'Subiectul trebuie să conțină cel puțin 5 caractere.';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Mesajul trebuie să conțină cel puțin 10 caractere.';
}

// If there are validation errors
if (!empty($errors)) {
    $response['message'] = implode(' ', $errors);
    echo json_encode($response);
    exit;
}

// Save to database (optional)
try {
    // Database configuration - uncomment and configure if you want to save to database
    /*
    $host = 'localhost';
    $dbname = 'your_database';
    $username = 'your_username';
    $password = 'your_password';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$name, $email, $subject, $message]);
    */
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    // Don't send database errors to user, continue with email
}

// Prepare email
$to = "admin@yourwebsite.com"; // Change this to your email
$email_subject = "Mesaj nou din formularul de contact: " . $subject;

// Create email body
$email_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #495057; }
        .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #6366f1; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>📧 Mesaj nou din formularul de contact</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nume:</div>
                <div class='value'>" . htmlspecialchars($name) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>" . htmlspecialchars($email) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Subiect:</div>
                <div class='value'>" . htmlspecialchars($subject) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Mesaj:</div>
                <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Data:</div>
                <div class='value'>" . date('d/m/Y H:i:s') . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>IP:</div>
                <div class='value'>" . $_SERVER['REMOTE_ADDR'] . "</div>
            </div>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=utf-8',
    'From: ' . $name . ' <' . $email . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
);

// Attempt to send email
$mail_sent = false;

// Try using mail() function first
if (function_exists('mail')) {
    $mail_sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));
}

// If mail() failed or doesn't exist, you can try PHPMailer or other methods here
if (!$mail_sent) {
    // Log the message to a file as backup
    $log_entry = "
=== NEW CONTACT MESSAGE ===
Date: " . date('Y-m-d H:i:s') . "
Name: $name
Email: $email
Subject: $subject
Message: $message
IP: " . $_SERVER['REMOTE_ADDR'] . "
User Agent: " . (isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown') . "
===========================

";
    
    $log_file = 'contact_messages.log';
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

// Send auto-reply to user
$auto_reply_subject = "Confirmăm primirea mesajului dumneavoastră";
$auto_reply_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { color: #6366f1; font-weight: bold; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🚀 Mulțumim pentru mesaj!</h2>
        </div>
        <div class='content'>
            <p>Salut <span class='highlight'>" . htmlspecialchars($name) . "</span>,</p>
            
            <p>Mulțumim că ne-ai contactat! Am primit mesajul tău cu subiectul \"<em>" . htmlspecialchars($subject) . "</em>\" și îți vom răspunde în cel mai scurt timp posibil.</p>
            
            <p>Echipa noastră analizează fiecare mesaj cu atenție și de obicei răspundem în termen de 24 de ore în zilele lucrătoare.</p>
            
            <p>Cu stimă,<br>
            <strong>Echipa ModernWeb</strong></p>
            
            <hr style='margin: 20px 0; border: none; border-top: 1px solid #dee2e6;'>
            
            <p style='font-size: 12px; color: #6c757d;'>
                Acest email a fost generat automat. Vă rugăm să nu răspundeți la acest mesaj.
            </p>
        </div>
    </div>
</body>
</html>
";

$auto_reply_headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=utf-8',
    'From: ModernWeb <noreply@yourwebsite.com>',
    'X-Mailer: PHP/' . phpversion()
);

// Send auto-reply
if (function_exists('mail')) {
    mail($email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));
}

// Set success response
$response['success'] = true;
$response['message'] = 'Mesajul a fost trimis cu succes! Vă vom răspunde în cel mai scurt timp.';

// Return JSON response
echo json_encode($response);
?>