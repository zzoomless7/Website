# ⚽ Sistem de Management Turneu de Fotbal

Un sistem complet de management pentru turnee de fotbal, cu toate funcționalitățile necesare pentru organizarea și urmărirea unui turneu profesionist.

## 🎯 Funcționalități

### 1. **Dashboard**
- Vizualizare rapidă a statisticilor turneului
- Total echipe înscrise
- Meciuri jucate
- Goluri marcate
- Faza curentă a turneului
- Meciuri recente

### 2. **Gestionare Echipe** 👥
- **Adăugare echipe** - Creează echipe noi cu:
  - Nume echipă
  - Logo (emoji sau URL imagine)
  - Oraș
  - Antrenor
- **Editare echipe** - Modifică informațiile echipelor existente
- **Ștergere echipe** - Elimină echipe din turneu
- **Statistici automate** pentru fiecare echipă:
  - Meciuri jucate
  - Victorii, egaluri, înfrângeri
  - Goluri marcate și primite
  - Puncte totale

### 3. **Faza Grupelor** 📊
- **Generare automată a grupelor** - Distribuie aleatoriu echipele în grupe de 4
- **Clasamente grupe**:
  - Poziție în grupă
  - Meciuri jucate (J)
  - Victorii (V)
  - Egaluri (E)
  - Înfrângeri (Î)
  - Golaveraj (G)
  - Puncte (P)
- **Evidențiere echipe calificate** - Primele 2 echipe din fiecare grupă

### 4. **Meciuri** ⚽
- **Adăugare meciuri** cu:
  - Selecție echipe
  - Data și ora
  - Faza turneului (Grupe, Optimi, Sferturi, Semifinale, Finala)
  - Locație
- **Filtrare meciuri**:
  - Toate meciurile
  - Meciuri programate
  - Meciuri finalizate
- **Actualizare scoruri** - Introduce și salvează rezultatele meciurilor
- **Statistici automate** - Actualizare automată a statisticilor echipelor după fiecare meci
- **Validare** - Previne ca o echipă să joace împotriva ei însăși

### 5. **Faza Eliminatorie** 🏆
Vizualizare bracket complet pentru:
- **Optimi de Finală** (16 echipe)
- **Sferturi de Finală** (8 echipe)
- **Semifinale** (4 echipe)
- **Finala** (2 echipe)

Fiecare meci afișează:
- Echipele participante
- Scorul (dacă meciul s-a jucat)
- Evidențiere câștigător

### 6. **Statistici** 📈
- **Top Marcatori**:
  - Clasament echipe după goluri marcate
  - Top 5 marcatori
- **Clasament General Echipe**:
  - Sortare după puncte și golaveraj
  - Afișare V/E/Î (Victorii/Egaluri/Înfrângeri)
- **Statistici Generale**:
  - Total meciuri
  - Meciuri finalizate
  - Total goluri
  - Media goluri pe meci
  - Total echipe

## 🎨 Caracteristici Design

- ✨ **Design Modern** - Interfață curată și profesională
- 📱 **Responsive** - Funcționează perfect pe desktop, tabletă și mobil
- 🎯 **Intuitivă** - Navigare ușoară și clară
- 🎭 **Animații** - Tranziții smooth și efecte hover
- 🌈 **Culori** - Paletă de culori modernă și plăcută
- 💾 **Salvare Automată** - Datele sunt salvate în browser (LocalStorage)

## 🚀 Cum să Folosești

### 1. **Deschide Website-ul**
Simplu deschide fișierul `index.html` în browser.

### 2. **Adaugă Echipe**
- Mergi la secțiunea "👥 Echipe"
- Click pe "➕ Adaugă Echipă"
- Completează informațiile echipei
- Salvează

### 3. **Generează Grupe**
- După ce ai adăugat cel puțin 4 echipe
- Mergi la secțiunea "📊 Grupe"
- Click pe "🔄 Generează Grupe"
- Grupele vor fi create automat

### 4. **Adaugă Meciuri**
- Mergi la secțiunea "⚽ Meciuri"
- Click pe "➕ Adaugă Meci"
- Selectează echipele, data și faza
- Salvează

### 5. **Actualizează Rezultate**
- În secțiunea "⚽ Meciuri"
- Introdu scorurile în meciurile programate
- Click pe "✅ Salvează Scor"
- Statisticile se actualizează automat!

### 6. **Urmărește Progresul**
- Vezi clasamentele în "📊 Grupe"
- Urmărește bracket-ul în "🏆 Faza Eliminatorie"
- Analizează statisticile în "📈 Statistici"

## 💡 Sfaturi

1. **Logo-uri Echipe**: Poți folosi emoji (🔴, 🔵, ⚫, ⭐) sau URL-uri către imagini
2. **Organizare**: Adaugă toate echipele înainte de a genera grupele
3. **Backup**: Datele sunt salvate în browser, dar poți face export manual din LocalStorage
4. **Meciuri**: Adaugă meciurile în ordinea cronologică pentru o mai bună organizare

## 📋 Exemplu de Flux de Lucru

1. ✅ Adaugă toate echipele participante (minim 4, recomandat 8, 16, sau 32)
2. ✅ Generează grupele automat
3. ✅ Creează meciurile pentru faza grupelor
4. ✅ Actualizează scorurile pe măsură ce meciurile se joacă
5. ✅ Consultă clasamentele din grupe
6. ✅ Creează meciurile pentru faza eliminatorie (Optimi, Sferturi, etc.)
7. ✅ Continuă până la Finală
8. ✅ Urmărește statisticile și câștigătorul!

## 🛠️ Tehnologii Folosite

- **HTML5** - Structura paginii
- **CSS3** - Design modern și responsive
- **JavaScript (Vanilla)** - Logică aplicație
- **LocalStorage** - Salvare date în browser

## 📦 Fișiere

- `index.html` - Pagina principală
- `styles.css` - Stiluri și design
- `app.js` - Logica aplicației
- `README.md` - Documentație

## 🎯 Perfect Pentru

- ✅ Turnee școlare și universitare
- ✅ Competiții locale
- ✅ Turnee de cartier
- ✅ Campionate amicale
- ✅ Evenimente corporative
- ✅ Orice alt tip de turneu de fotbal!

## 📱 Compatibilitate

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ✅ Browsere mobile

---

**Dezvoltat cu ❤️ pentru pasionații de fotbal! ⚽**

Bucură-te de organizarea turneului tău!
