// ===================================================================
// VISITOR TRACKING SYSTEM - Colectare Date Complete
// ===================================================================

// === CANVAS FINGERPRINT ===
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Canvas fingerprint 🔍', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas fingerprint 🔍', 4, 17);
    
    const dataURL = canvas.toDataURL();
    return hashCode(dataURL);
  } catch (e) {
    return 'error';
  }
}

// === WEBGL FINGERPRINT ===
function getWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return { vendor: 'N/A', renderer: 'N/A' };
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    return {
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'N/A',
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'N/A',
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    };
  } catch (e) {
    return { vendor: 'error', renderer: 'error' };
  }
}

// === AUDIO FINGERPRINT ===
function getAudioFingerprint() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return 'N/A';
    
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gainNode = context.createGain();
    
    oscillator.type = 'triangle';
    oscillator.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(context.destination);
    
    const hash = hashCode(analyser.frequencyBinCount.toString());
    context.close();
    
    return hash;
  } catch (e) {
    return 'error';
  }
}

// === HASH FUNCTION ===
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).substring(0, 16);
}

// === DETECT FONTS ===
function getInstalledFonts() {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana',
    'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Calibri', 'Cambria'
  ];
  
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const baseFontWidths = {};
  baseFonts.forEach(baseFont => {
    ctx.font = testSize + ' ' + baseFont;
    baseFontWidths[baseFont] = ctx.measureText(testString).width;
  });
  
  const detectedFonts = [];
  testFonts.forEach(testFont => {
    let detected = false;
    baseFonts.forEach(baseFont => {
      ctx.font = testSize + " '" + testFont + "', " + baseFont;
      const width = ctx.measureText(testString).width;
      if (width !== baseFontWidths[baseFont]) {
        detected = true;
      }
    });
    if (detected) detectedFonts.push(testFont);
  });
  
  return detectedFonts;
}

// === GET BATTERY INFO ===
async function getBatteryInfo() {
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      };
    }
    return null;
  } catch (e) {
    return null;
  }
}

// === TRACK MOUSE MOVEMENTS ===
let mouseMovements = [];
let clicks = [];

document.addEventListener('mousemove', (e) => {
  if (mouseMovements.length < 50) { // Limită la primele 50
    mouseMovements.push({ x: e.clientX, y: e.clientY, time: Date.now() });
  }
});

document.addEventListener('click', (e) => {
  if (clicks.length < 20) { // Limită la primele 20
    clicks.push({ x: e.clientX, y: e.clientY, time: Date.now() });
  }
});

// === TRACK SCROLL ===
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
  const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
  maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);
});

// === COLLECT ALL DATA ===
async function collectVisitorData() {
  const webgl = getWebGLFingerprint();
  const battery = await getBatteryInfo();
  
  const visitorData = {
    // === TIMESTAMP ===
    timestamp: new Date().toISOString(),
    visitDate: new Date().toLocaleString('ro-RO'),
    
    // === IDENTITATE ===
    identitate: {
      fingerprint: getCanvasFingerprint(),
      sessionId: Math.random().toString(36).substring(2, 15),
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform
    },
    
    // === LOCATIE (va fi completată de server cu IP) ===
    locatie: {
      ip: 'SERVER_SIDE', // Va fi completat de PHP
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      language: navigator.language,
      languages: navigator.languages
    },
    
    // === DEVICE ===
    device: {
      type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      screenWidth: screen.width,
      screenHeight: screen.height,
      screenColorDepth: screen.colorDepth,
      screenOrientation: screen.orientation?.type || 'N/A',
      devicePixelRatio: window.devicePixelRatio,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      
      // Hardware
      cpuCores: navigator.hardwareConcurrency || 'N/A',
      deviceMemory: navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'N/A',
      maxTouchPoints: navigator.maxTouchPoints,
      
      // GPU
      gpu: {
        vendor: webgl.vendor,
        renderer: webgl.renderer,
        version: webgl.version,
        shadingLanguage: webgl.shadingLanguageVersion
      },
      
      // Battery
      battery: battery,
      
      // Connection
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      } : null
    },
    
    // === COMPORTAMENT ===
    comportament: {
      referrer: document.referrer || 'Direct',
      currentPage: window.location.href,
      urlParams: Object.fromEntries(new URLSearchParams(window.location.search)),
      timeOnPage: 0, // Va fi actualizat
      scrollDepth: maxScrollDepth,
      mouseMovements: mouseMovements.slice(0, 10), // Primele 10
      clicks: clicks.slice(0, 10),
      historyLength: window.history.length,
      
      // Engagement
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'N/A',
      webdriver: navigator.webdriver || false
    },
    
    // === PREFERINTE ===
    preferinte: {
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      localStorage: typeof(Storage) !== 'undefined',
      sessionStorage: typeof(sessionStorage) !== 'undefined',
      indexedDB: !!window.indexedDB,
      serviceWorker: 'serviceWorker' in navigator,
      
      // Permissions (cele care nu necesită prompt)
      plugins: Array.from(navigator.plugins || []).map(p => p.name).slice(0, 5)
    },
    
    // === UNIC (Fingerprints) ===
    unic: {
      canvasFingerprint: getCanvasFingerprint(),
      webglFingerprint: hashCode(JSON.stringify(webgl)),
      audioFingerprint: getAudioFingerprint(),
      fontsDetected: getInstalledFonts(),
      
      // Combined unique ID
      combinedFingerprint: hashCode(
        getCanvasFingerprint() + 
        navigator.userAgent + 
        screen.width + 
        screen.height + 
        new Date().getTimezoneOffset()
      )
    },
    
    // === PERFORMANCE ===
    performance: {
      pageLoadTime: performance.now(),
      memoryUsage: performance.memory ? {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB'
      } : null
    }
  };
  
  return visitorData;
}

// === SEND DATA TO SERVER ===
async function trackVisitor() {
  try {
    const data = await collectVisitorData();
    
    // Trimite către server
    const response = await fetch('save-visitor.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log('✅ Visitor tracked:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Tracking error:', error);
  }
}

// === AUTO-TRACK ON PAGE LOAD ===
window.addEventListener('DOMContentLoaded', () => {
  // Track după 1 secundă (pentru a captura mai multe date)
  setTimeout(trackVisitor, 1000);
});

// === UPDATE TIME ON PAGE ===
setInterval(() => {
  const timeOnPage = Math.round(performance.now() / 1000);
  // Poți trimite update periodic dacă vrei
}, 30000); // La fiecare 30 secunde
