# Calculator Producție - Band 41

O aplicație web modernă pentru calcularea producției în funcție de schimburi de lucru și ore lucrate de angajați.

## 🎯 Funcționalități

- **Calcul automat al producției** - Calculează numărul total de bucăți produse pe baza ratei de producție și orelor lucrate
- **Suport pentru 2 facilități de producție** - WERK 1 (33.3 buc/oră) și WERK 2 (34.4 buc/oră)
- **Două schimburi de lucru predefinite**:
  - **Frühschicht** (05:45 - 14:00) cu 3 pauze
  - **Spätschicht** (14:00 - 22:15) cu 3 pauze
- **Gestionare angajați** - Adăugare/ștergere angajați cu ore de lucru personalizate
- **Calcul automat al pauzelor** - Scade automat pauzele din timpul de lucru
- **Temă întunecată/luminoasă** - Schimbare ușoară între teme cu salvare preferință
- **Salvare automată** - Starea aplicației este salvată automat în localStorage
- **Funcționalitate offline** - Service Worker pentru acces offline
- **Design responsive** - Optimizat pentru desktop și mobil

## 🚀 Utilizare

1. Deschide `index.html` într-un browser modern
2. Selectează facilitatea de producție (WERK 1 sau WERK 2)
3. Alege schimbul de lucru (Frühschicht sau Spätschicht)
4. Adaugă angajați folosind butonul "Adaugă angajat"
5. Introdu orele de început și sfârșit pentru fiecare angajat
6. Vezi calculul automat al totalului de bucăți produse

## ⚙️ Configurare schimburi

### Frühschicht (Schimbul de dimineață)
- **Program**: 05:45 - 14:00
- **Pauze**:
  - 07:30 - 07:45
  - 09:30 - 09:45
  - 11:45 - 12:00

### Spätschicht (Schimbul de seară)
- **Program**: 14:00 - 22:15
- **Pauze**:
  - 16:00 - 16:15
  - 18:15 - 18:30
  - 20:30 - 20:45

## 💡 Caracteristici tehnice

- **Fără dependențe backend** - Aplicație 100% client-side
- **Framework CSS**: Bootstrap 5.3.2
- **Iconițe**: Google Material Icons Round
- **Font**: Inter (Google Fonts)
- **Stocare**: localStorage pentru persistența datelor
- **PWA-ready**: Service Worker pentru funcționalitate offline

## 📱 Compatibilitate

- Chrome/Edge (recomandat)
- Firefox
- Safari
- Orice browser modern cu suport pentru ES6+

## 🎨 Teme

Aplicația suportă temă luminoasă și întunecată:
- Apasă butonul din colțul din dreapta sus pentru a schimba tema
- Preferința este salvată automat în localStorage

## 📝 Versiune

**v1.2** - Calculator producție Band 41

---

**© 2025 Calculator Producție - Toate drepturile rezervate**
