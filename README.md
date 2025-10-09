# Production Calculator - Band 41

A modern web application for calculating production output based on employee work hours and production rates. Designed for manufacturing environments with support for multiple shifts and work locations.

## Features

### Core Functionality
- **Production Rate Management**: Configure production rates per hour (default: 33.3 for WERK 1, 34.4 for WERK 2)
- **Shift Management**: Support for two shifts:
  - Frühschicht (Early shift): 05:45 - 14:00
  - Spätschicht (Late shift): 14:00 - 22:15
- **Employee Time Tracking**: Add multiple employees with custom start/end times
- **Automatic Break Deduction**: Calculates work time excluding predefined break periods
- **Real-time Production Calculation**: Instantly calculates total pieces produced

### User Experience
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Offline Support**: Full functionality even without internet connection (PWA)
- **Auto-save**: Automatically saves state to localStorage
- **Real-time Clock**: Displays current date and time in Romanian format
- **Modern UI**: Clean, intuitive interface with Material Icons and Bootstrap 5

## Installation

### Quick Start (No Installation)
Simply open `index.html` in your web browser. The app runs entirely in the browser with no server required.

### Local Development Server

1. **Using npm scripts** (requires Node.js):
```bash
# Install dependencies (first time only)
npm install

# Start with http-server (opens automatically)
npm start

# Alternative: Start with live-reload
npm run dev

# Alternative: Start with serve
npm run serve
```

2. **Using Python** (if you have Python installed):
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

3. **Using any static server**:
Place the files in your web server's directory and navigate to the index.html file.

## Usage

### Basic Operation

1. **Select Work Location (WERK)**
   - Click WERK 1 (33.3 pieces/hour) or WERK 2 (34.4 pieces/hour)
   - Or manually enter a custom production rate

2. **Select Shift**
   - Choose Frühschicht (early) or Spätschicht (late)
   - Employee times automatically adjust to shift hours

3. **Add Employees**
   - Click "Adaugă angajat" to add a new employee
   - Adjust start/end times if needed (format: HH:MM:SS)
   - Times outside shift hours are automatically excluded from calculations

4. **View Results**
   - Total production is calculated automatically
   - Updates in real-time as you modify inputs

### Time Input
- Format: HH:MM:SS (e.g., 08:30:00)
- Auto-formatting on blur (leaving the field)
- Validation prevents invalid times
- Quick entry: type numbers without colons (e.g., 0830 becomes 08:30:00)

### Break Times

**Frühschicht breaks:**
- 07:30 - 07:45 (15 min)
- 09:30 - 09:45 (15 min)
- 11:45 - 12:00 (15 min)

**Spätschicht breaks:**
- 16:00 - 16:15 (15 min)
- 18:15 - 18:30 (15 min)
- 20:30 - 20:45 (15 min)

Break times are automatically deducted from work hours.

## Calculation Formula

```
Production = (Work Hours - Break Hours) × Production Rate

Where:
- Work Hours = Time overlap between employee hours and shift hours
- Break Hours = Time overlap between employee hours and break periods
- Production Rate = Pieces per hour (e.g., 33.3 for WERK 1)
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, animations, responsive design
- **JavaScript**: Vanilla JS (ES6+)
- **Bootstrap 5.3.2**: UI components and grid system
- **Material Icons**: Icon library
- **Service Worker**: Offline functionality

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Data Storage
- **localStorage**: Saves calculator state (employees, selected shift, werk, theme)
- **No server required**: All processing happens client-side
- **Privacy**: No data is sent to any server

### Offline Functionality
The app includes a Service Worker that caches all necessary resources, allowing full functionality even without an internet connection. After the first load, the app works completely offline.

## File Structure

```
production-calculator/
│
├── index.html          # Main application file
├── sw.js              # Service Worker for offline support
├── package.json       # Node.js dependencies and scripts
└── README.md          # This file
```

## Customization

### Modify Production Rates
Edit the `werkRates` object in index.html:
```javascript
const werkRates = { 
  werk1: 33.3,  // Change this value
  werk2: 34.4   // Change this value
};
```

### Modify Shift Times
Edit the `shifts` object in index.html:
```javascript
const shifts = {
  fruh: {
    start: '05:45:00',  // Change start time
    end: '14:00:00',    // Change end time
    pauses: [           // Modify break times
      ['07:30:00','07:45:00'],
      // Add or remove breaks
    ]
  },
  // Similar for spat shift
};
```

## Troubleshooting

### App doesn't load offline
- Ensure you've visited the page at least once while online
- Check if Service Worker is registered (Developer Tools > Application > Service Workers)
- Clear cache and reload if needed

### Calculations seem incorrect
- Verify employee times fall within shift hours
- Check that break times are configured correctly
- Ensure production rate is set properly

### Theme doesn't persist
- Check if localStorage is enabled in your browser
- Clear browser data and try again

## License

MIT License - Feel free to use and modify for your needs.

## Version History

- **v1.2.0** - Current version with full feature set
- **v1.1.0** - Added dark mode and localStorage
- **v1.0.0** - Initial release

## Support

For issues or questions, please check the browser console for errors and ensure you're using a modern, updated browser.