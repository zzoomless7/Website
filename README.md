# ⚽🏐 Sistem de Management Turneu Multi-Sport

Un sistem complet de management pentru turnee sportive, suportând **FOTBAL** și **VOLEI**, cu toate funcționalitățile necesare pentru organizarea și urmărirea unui turneu profesionist.

## 🎯 Sporturi Suportate

### ⚽ **Fotbal**
- Sistem clasic de puncte (3 puncte victorie, 1 punct egal)
- Goluri și golaveraj
- Statistici complete (V/E/Î)

### 🏐 **Volei**  
- Sistem de seturi (best of 3 sau best of 5)
- 2 puncte pentru victorie (fără egaluri)
- Statistici seturi câștigate/pierdute
- Validare automată scoruri (2-0, 2-1, 3-0, 3-1, 3-2)

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

### 2. **Selectează Sportul**
- Click pe **⚽ Fotbal** sau **🏐 Volei** în header
- Fiecare sport are date separate și independente
- Poți comuta între sporturi oricând

### 3. **Adaugă Echipe**
- Mergi la secțiunea "👥 Echipe"
- Click pe "➕ Adaugă Echipă"
- Completează informațiile echipei
- Salvează

### 4. **Generează Grupe**
- După ce ai adăugat cel puțin 4 echipe
- Mergi la secțiunea "📊 Grupe"
- Click pe "🔄 Generează Grupe"
- Grupele vor fi create automat

### 5. **Adaugă Meciuri**
- Mergi la secțiunea "⚽ Meciuri"
- Click pe "➕ Adaugă Meci"
- Selectează echipele, data și faza
- Salvează

### 6. **Actualizează Rezultate**
- În secțiunea "⚽ Meciuri"
- Introdu scorurile în meciurile programate
- Click pe "✅ Salvează Scor"
- Statisticile se actualizează automat!

### 7. **Urmărește Progresul**
- Vezi clasamentele în "📊 Grupe"
- Urmărește bracket-ul în "🏆 Faza Eliminatorie"
- Analizează statisticile în "📈 Statistici"

## 💡 Sfaturi

1. **Logo-uri Echipe**: 
   - Fotbal: 🔴, 🔵, ⚫, ⭐, ⚽
   - Volei: 🏐, 🔴, 🔵, ⚫, 🟡
   - Sau URL-uri către imagini
2. **Organizare**: Adaugă toate echipele înainte de a genera grupele
3. **Backup**: Datele sunt salvate separat pentru fiecare sport în browser
4. **Meciuri**: Adaugă meciurile în ordinea cronologică pentru o mai bună organizare
5. **Volei**: Scorurile reprezintă seturile câștigate (ex: 2-0, 2-1, 3-2)

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

- ✅ Turnee școlare și universitare (fotbal & volei)
- ✅ Competiții locale
- ✅ Turnee de cartier
- ✅ Campionate amicale
- ✅ Evenimente corporative
- ✅ Campionate interscholare
- ✅ Orice alt tip de turneu sportiv!

## 📱 Compatibilitate

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ✅ Browsere mobile

---

## 🆕 Ce este Nou?

### Multi-Sport Support! 🎉
- ✅ Suport complet pentru **Fotbal** ⚽
- ✅ Suport complet pentru **Volei** 🏐
- ✅ Date separate pentru fiecare sport
- ✅ Comutare ușoară între sporturi
- ✅ Reguli și statistici specifice fiecărui sport

### Diferențe Fotbal vs Volei

| Caracteristică | ⚽ Fotbal | 🏐 Volei |
|---|---|---|
| **Scor** | Goluri | Seturi (best of 3/5) |
| **Victorie** | 3 puncte | 2 puncte |
| **Egal** | 1 punct | Nu există |
| **Statistici** | Goluri marcate/primite | Seturi câștigate/pierdute |
| **Clasament** | Puncte → Golaveraj | Puncte → Diferență seturi |

---

**Dezvoltat cu ❤️ pentru pasionații de sport! ⚽🏐**

Bucură-te de organizarea turneului tău!
