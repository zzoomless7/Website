# 📊 SISTEM TRACKING VIZITATORI - Documentație Completă

## 🎯 CE FACE SISTEMUL?

Salvează **FIECARE vizitator** într-un **fișier JSON separat** cu toate datele:

✅ **Identitate** - Fingerprint unic, session ID, user agent  
✅ **Locație** - IP, oraș, țară, coordonate GPS, ISP  
✅ **Device** - Screen, GPU, CPU, RAM, battery, connection  
✅ **Comportament** - Clicks, scroll, mouse movements, time on page  
✅ **Preferințe** - Dark mode, limba, plugins, permissions  
✅ **Unic** - Canvas, WebGL, Audio fingerprints, fonts  

---

## 📁 STRUCTURĂ FIȘIERE

```
/workspace/
├── track-visitor.js          # Script colectare date (JavaScript)
├── save-visitor.php           # Script salvare date (PHP backend)
├── visitor-data/              # Director cu fișiere vizitatori
│   ├── visitor_20251010_143245_a7f3d91b_abc123.json
│   ├── visitor_20251010_150812_b8e4c2f9_def456.json
│   ├── visitor_20251010_162134_c9d5f7a3_ghi789.json
│   └── visitor_20251010_173556_d1e6a8b4_jkl012.json
└── IMPLEMENTARE-TRACKING.md  # Această documentație
```

---

## 🚀 IMPLEMENTARE PAS CU PAS

### **PASUL 1: Upload fișiere pe server**

```bash
# Upload prin FTP/SFTP:
/public_html/track-visitor.js
/public_html/save-visitor.php
/public_html/visitor-data/  # Creează director (chmod 755)
```

### **PASUL 2: Adaugă în index.html**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Reședința Budaș</title>
</head>
<body>
  
  <!-- CONTENT -->
  
  <!-- TRACKING SCRIPT - Adaugă la FINAL, înainte de </body> -->
  <script src="track-visitor.js"></script>
  
</body>
</html>
```

### **PASUL 3: Verificare permisiuni**

```bash
# Pe server, rulează:
chmod 755 /public_html/visitor-data
chmod 644 /public_html/save-visitor.php
chmod 644 /public_html/track-visitor.js
```

---

## 📊 FORMAT FIȘIER VIZITATOR

### **Nume fișier:**
```
visitor_[DATA]_[ORA]_[FINGERPRINT]_[RANDOM].json

Exemplu:
visitor_20251010_143245_a7f3d91b_abc123.json
         └─┬─┘  └─┬─┘  └───┬───┘  └─┬─┘
         Data   Ora    Fingerprint Random
```

### **Conținut JSON:**

```json
{
  "timestamp": "2025-10-10T14:32:45.234Z",
  
  "identitate": {
    "fingerprint": "a7f3d91b2c4e8f1a",
    "sessionId": "k9m3n7p2q5r8",
    "userAgent": "Mozilla/5.0...",
    "vendor": "Google Inc.",
    "platform": "Win32"
  },
  
  "locatie": {
    "ip": "79.114.235.142",
    "country": "Romania",
    "city": "București",
    "latitude": 44.4268,
    "longitude": 26.1025,
    "isp": "RCS & RDS",
    "timezone": "Europe/Bucharest"
  },
  
  "device": {
    "type": "Desktop",
    "screenWidth": 1920,
    "screenHeight": 1080,
    "cpuCores": 8,
    "deviceMemory": "8GB",
    "gpu": {
      "vendor": "Google Inc. (Intel)",
      "renderer": "Intel(R) UHD Graphics 620"
    },
    "battery": {
      "level": 85,
      "charging": true
    }
  },
  
  "comportament": {
    "referrer": "https://www.google.com/",
    "scrollDepth": 45,
    "mouseMovements": [...],
    "clicks": [...],
    "timeOnPage": 0
  },
  
  "preferinte": {
    "colorScheme": "light",
    "localStorage": true,
    "plugins": [...]
  },
  
  "unic": {
    "canvasFingerprint": "a7f3d91b2c4e8f1a",
    "webglFingerprint": "d4f2a8c1b9e7f3a2",
    "audioFingerprint": "7b3f1d9c4a8e2f6d",
    "fontsDetected": [...]
  }
}
```

---

## 📈 STATISTICI & ANALIZĂ

### **Citire toate fișierele:**

```php
<?php
// list-visitors.php
$files = glob('visitor-data/*.json');
$visitors = [];

foreach ($files as $file) {
    $data = json_decode(file_get_contents($file), true);
    $visitors[] = $data;
}

// Total vizitatori
echo "Total vizitatori: " . count($visitors);

// Grupare pe orașe
$cities = array_count_values(array_column(array_column($visitors, 'locatie'), 'city'));
print_r($cities);

// Device types
$devices = array_count_values(array_column(array_column($visitors, 'device'), 'type'));
print_r($devices);
?>
```

### **Dashboard simplu:**

```php
<?php
// dashboard.php
$files = glob('visitor-data/*.json');
$totalVisitors = count($files);

$countries = [];
$browsers = [];
$devices = [];

foreach ($files as $file) {
    $data = json_decode(file_get_contents($file), true);
    
    $countries[$data['locatie']['country']] = ($countries[$data['locatie']['country']] ?? 0) + 1;
    $devices[$data['device']['type']] = ($devices[$data['device']['type']] ?? 0) + 1;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Visitor Analytics Dashboard</title>
</head>
<body>
    <h1>📊 Visitor Analytics</h1>
    
    <h2>Total Visitors: <?= $totalVisitors ?></h2>
    
    <h3>Countries:</h3>
    <?php foreach ($countries as $country => $count): ?>
        <p><?= $country ?>: <?= $count ?></p>
    <?php endforeach; ?>
    
    <h3>Devices:</h3>
    <?php foreach ($devices as $device => $count): ?>
        <p><?= $device ?>: <?= $count ?></p>
    <?php endforeach; ?>
</body>
</html>
```

---

## 🔐 SECURITATE & GDPR

### **⚠️ IMPORTANT - GDPR Compliance:**

```html
<!-- Adaugă Cookie Consent Banner -->
<div id="cookieConsent" style="position: fixed; bottom: 0; background: #000; color: #fff; padding: 20px; width: 100%;">
    <p>
        Folosim cookies și tehnologii de tracking pentru a îmbunătăți experiența ta.
        <button onclick="acceptTracking()">Accept</button>
        <button onclick="rejectTracking()">Refuz</button>
    </p>
</div>

<script>
function acceptTracking() {
    localStorage.setItem('trackingConsent', 'accepted');
    document.getElementById('cookieConsent').style.display = 'none';
    // Pornește tracking
    loadScript('track-visitor.js');
}

function rejectTracking() {
    localStorage.setItem('trackingConsent', 'rejected');
    document.getElementById('cookieConsent').style.display = 'none';
}

// Check consent
if (localStorage.getItem('trackingConsent') === 'accepted') {
    loadScript('track-visitor.js');
} else if (!localStorage.getItem('trackingConsent')) {
    // Arată banner
    document.getElementById('cookieConsent').style.display = 'block';
}

function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}
</script>
```

### **Protecție director:**

```apache
# .htaccess în /visitor-data/
Order Deny,Allow
Deny from all
Allow from 127.0.0.1
Allow from YOUR_IP_ADDRESS
```

---

## 📋 EXEMPLE FIȘIERE SALVATE

Am creat **4 exemple** în `/workspace/visitor-data/`:

1. **visitor_20251010_143245_a7f3d91b_abc123.json**
   - Windows Desktop, București, Chrome, Google referrer

2. **visitor_20251010_150812_b8e4c2f9_def456.json**
   - iPhone Mobile, Cluj-Napoca, Safari, Facebook referrer

3. **visitor_20251010_162134_c9d5f7a3_ghi789.json**
   - Mac Desktop, Timișoara, Chrome, Direct visit

4. **visitor_20251010_173556_d1e6a8b4_jkl012.json**
   - Linux Desktop, Brașov, Chrome, Bing referrer

---

## 🎯 NEXT STEPS

1. ✅ Upload fișiere pe server
2. ✅ Adaugă script în index.html
3. ✅ Testează (deschide site-ul)
4. ✅ Verifică `/visitor-data/` pentru fișiere noi
5. ✅ Creează dashboard pentru analiză
6. ✅ Adaugă GDPR consent banner

---

## 🔍 DEBUGGING

```javascript
// În browser Console (F12):

// Verifică dacă tracking funcționează:
trackVisitor().then(result => console.log(result));

// Vezi datele colectate:
collectVisitorData().then(data => console.log(data));

// Test fingerprint:
console.log('Fingerprint:', getCanvasFingerprint());
```

---

**✅ SISTEMUL E GATA! Testează și vezi rezultatele! 🚀**
