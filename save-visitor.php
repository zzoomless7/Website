<?php
// ===================================================================
// VISITOR TRACKING - Save to File
// ===================================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Directorul unde se salvează datele
$dataDir = __DIR__ . '/visitor-data';

// Creează directorul dacă nu există
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Primește datele din POST
$jsonData = file_get_contents('php://input');
$visitorData = json_decode($jsonData, true);

if (!$visitorData) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// === COMPLETEAZĂ DATELE SERVER-SIDE ===

// IP Address
$ip = $_SERVER['REMOTE_ADDR'];
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
}

$visitorData['locatie']['ip'] = $ip;

// Geolocation din IP (folosind un API gratuit)
try {
    $geoData = @file_get_contents("http://ip-api.com/json/{$ip}");
    if ($geoData) {
        $geo = json_decode($geoData, true);
        $visitorData['locatie']['country'] = $geo['country'] ?? 'N/A';
        $visitorData['locatie']['countryCode'] = $geo['countryCode'] ?? 'N/A';
        $visitorData['locatie']['region'] = $geo['regionName'] ?? 'N/A';
        $visitorData['locatie']['city'] = $geo['city'] ?? 'N/A';
        $visitorData['locatie']['latitude'] = $geo['lat'] ?? null;
        $visitorData['locatie']['longitude'] = $geo['lon'] ?? null;
        $visitorData['locatie']['isp'] = $geo['isp'] ?? 'N/A';
        $visitorData['locatie']['org'] = $geo['org'] ?? 'N/A';
    }
} catch (Exception $e) {
    // Ignore geolocation errors
}

// HTTP Headers
$visitorData['headers'] = [
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'N/A',
    'accept_language' => $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'N/A',
    'accept_encoding' => $_SERVER['HTTP_ACCEPT_ENCODING'] ?? 'N/A',
    'host' => $_SERVER['HTTP_HOST'] ?? 'N/A',
    'referer' => $_SERVER['HTTP_REFERER'] ?? 'N/A',
    'dnt' => $_SERVER['HTTP_DNT'] ?? 'N/A'
];

// Server timestamp
$visitorData['serverTimestamp'] = date('Y-m-d H:i:s');

// === GENEREAZĂ NUME FIȘIER UNIC ===
$timestamp = date('Ymd_His');
$fingerprint = substr($visitorData['unic']['combinedFingerprint'], 0, 8);
$randomId = substr(md5(uniqid(rand(), true)), 0, 6);

$filename = "visitor_{$timestamp}_{$fingerprint}_{$randomId}.json";
$filepath = $dataDir . '/' . $filename;

// === SALVEAZĂ ÎN FIȘIER ===
$jsonOutput = json_encode($visitorData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
file_put_contents($filepath, $jsonOutput);

// === RĂSPUNS ===
echo json_encode([
    'success' => true,
    'message' => 'Visitor data saved successfully',
    'filename' => $filename,
    'fingerprint' => $visitorData['unic']['combinedFingerprint'],
    'timestamp' => $visitorData['serverTimestamp']
]);
?>
