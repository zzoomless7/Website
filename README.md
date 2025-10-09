# Calculator Producție Band 41 🏭

O aplicație web modernă pentru calcularea producției pe Band 41, optimizată pentru utilizare pe dispozitive mobile și desktop.

## 📋 Descriere

Această aplicație permite calcularea automată a numărului de bucăți produse pe baza:
- Ratei de producție (WERK 1: 33.3 buc/oră, WERK 2: 34.4 buc/oră)
- Schimbului de lucru (Frühschicht sau Spätschicht)
- Orelor lucrate de fiecare angajat
- Pauselor programate automat deduse

## ✨ Caracteristici

### 🎯 Funcționalități principale
- **Calculator inteligent** - Calculează automat bucățile produse
- **Gestionare angajați** - Adaugă/elimină angajați dinamic
- **Schimburi predefinite** - Frühschicht (05:45-14:00) și Spätschicht (14:00-22:15)
- **Pauze automate** - Deduce automat pausele din timpul lucrat
- **Salvare automată** - Starea aplicației se salvează local
- **Validare timp** - Validare inteligentă pentru câmpurile de timp

### 🎨 Design și UX
- **Temă întunecată/luminoasă** - Comutare facilă între teme
- **Design responsive** - Optimizat pentru mobile și desktop
- **Interfață modernă** - Utilizează Material Icons și Bootstrap 5
- **Animații fluide** - Tranziții și efecte vizuale plăcute

### 📱 PWA (Progressive Web App)
- **Instalabilă** - Poate fi instalată ca aplicație nativă
- **Funcționare offline** - Service Worker pentru cache
- **Icoane adaptive** - Suport pentru toate dimensiunile
- **Manifest complet** - Configurație PWA completă

## 🚀 Utilizare

### Accesare rapidă
1. Deschide `index.html` în browser
2. Sau servește fișierele printr-un server web local

### Configurare schimb
1. **Selectează WERK-ul** - Apasă butonul WERK 1 sau WERK 2
2. **Alege schimbul** - Frühschicht sau Spätschicht
3. **Rata se actualizează automat** conform selecției

### Adăugare angajați
1. **Apasă "Adaugă angajat"** - Se creează un card nou
2. **Setează orele** - Ora de început și sfârșit
3. **Validare automată** - Timpul se validează și formatează automat
4. **Calculul se actualizează** în timp real

### Funcții avansate
- **Formatare automată timp** - Acceptă formate multiple (HH, HHMM, HHMMSS)
- **Validare inteligentă** - Previne introducerea timpilor invalizi
- **Salvare stare** - Toate datele se salvează automat în localStorage
- **Comutare temă** - Butonul din colțul dreapta-sus

## 🏗️ Structura proiectului

```
/
├── index.html          # Aplicația principală
├── manifest.json       # Manifest PWA
├── sw.js              # Service Worker pentru cache
└── README.md          # Documentația proiectului
```

## ⚙️ Configurare schimburi

### Frühschicht (Schimbul de dimineață)
- **Program**: 05:45 - 14:00
- **Pauze**:
  - 07:30 - 07:45 (15 min)
  - 09:30 - 09:45 (15 min)  
  - 11:45 - 12:00 (15 min)

### Spätschicht (Schimbul de seară)
- **Program**: 14:00 - 22:15
- **Pauze**:
  - 16:00 - 16:15 (15 min)
  - 18:15 - 18:30 (15 min)
  - 20:30 - 20:45 (15 min)

## 🔧 Dezvoltare

### Tehnologii utilizate
- **HTML5** - Structura aplicației
- **CSS3** - Stilizare cu CSS custom properties
- **JavaScript ES6+** - Logica aplicației
- **Bootstrap 5.3.2** - Framework CSS
- **Material Icons** - Iconografie
- **Service Worker** - Cache și funcționare offline

### Instalare pentru dezvoltare
```bash
# Clonează repository-ul
git clone [url-repository]

# Navighează în director
cd production-calculator

# Servește local (opțional)
python -m http.server 8000
# sau
npx serve .
```

### Customizare
Pentru a modifica ratele de producție, editează obiectul `werkRates` în `index.html`:
```javascript
const werkRates = { 
  werk1: 33.3,  // Modifică aici rata pentru WERK 1
  werk2: 34.4   // Modifică aici rata pentru WERK 2
};
```

## 📱 Instalare ca PWA

### Pe Android
1. Deschide aplicația în Chrome
2. Apasă meniul (⋮) → "Adaugă la ecranul de pornire"
3. Confirmă instalarea

### Pe iOS
1. Deschide aplicația în Safari
2. Apasă butonul Share (📤)
3. Selectează "Adaugă la ecranul de pornire"

### Pe Desktop
1. Deschide aplicația în Chrome/Edge
2. Caută iconița de instalare în bara de adrese
3. Apasă "Instalează"

## 🎯 Exemple de utilizare

### Scenariul 1: Un angajat, schimb complet
- **WERK**: 1 (33.3 buc/oră)
- **Schimb**: Frühschicht
- **Angajat**: 05:45 - 14:00
- **Rezultat**: ~229 bucăți (7.75 ore efective × 33.3)

### Scenariul 2: Angajat cu program redus
- **WERK**: 2 (34.4 buc/oră)  
- **Schimb**: Spätschicht
- **Angajat**: 16:00 - 20:00
- **Rezultat**: ~120 bucăți (3.5 ore efective × 34.4)

## 🔒 Confidențialitate

- **Fără colectare date** - Toate datele rămân local
- **Fără tracking** - Nu se folosesc servicii de analiză
- **Fără server** - Aplicația funcționează complet client-side

## 📄 Licență

Acest proiect este dezvoltat pentru uz intern. Toate drepturile rezervate.

## 🆘 Suport

Pentru probleme sau sugestii:
1. Verifică că browser-ul suportă JavaScript
2. Asigură-te că localStorage nu este blocat
3. Reîncarcă pagina pentru a reseta starea

---

**Versiunea curentă**: 1.2  
**Ultima actualizare**: Octombrie 2025  
**Compatibilitate**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+