# Website - Sistem Autentificare

O aplicație web modernă cu pagini de login și signup folosind HTML, CSS, JavaScript și PHP cu design Ant Design.

## 🚀 Caracteristici

- 🎨 **Design frumos** cu stil Ant Design
- 🔐 **Pagină de login** cu validare email și parolă
- 📝 **Pagină de înregistrare** cu validare completă
- 🔒 **Backend PHP** pentru autentificare securizată
- 💾 **Bază de date MySQL** pentru stocarea utilizatorilor
- 🔑 **Sistem de sesiuni** PHP
- 📱 **Design responsive** - funcționează pe toate dispozitivele
- ✨ **Gradient modern** și animații fluide
- 🔄 **Dashboard** pentru utilizatori autentificați

## 📋 Cerințe

- PHP 7.4 sau mai nou
- MySQL 5.7 sau mai nou
- Apache/Nginx server cu mod_rewrite activat
- Extensii PHP: mysqli, session

## 🛠️ Instalare

### 1. Configurare Bază de Date

Importă fișierul SQL pentru a crea baza de date și tabelele necesare:

```bash
mysql -u root -p < database.sql
```

Sau rulează manual comenzile din `database.sql` în phpMyAdmin sau MySQL client.

### 2. Configurare PHP

Editează fișierul `php/config.php` și actualizează credențialele bazei de date:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');           // Username-ul tău MySQL
define('DB_PASS', '');               // Parola ta MySQL
define('DB_NAME', 'website_db');     // Numele bazei de date
```

### 3. Pornire Server

**Opțiune 1: PHP Built-in Server (pentru dezvoltare)**
```bash
php -S localhost:8000
```

**Opțiune 2: XAMPP/WAMP/MAMP**
- Copiază proiectul în folderul `htdocs` (pentru XAMPP) sau `www` (pentru WAMP)
- Accesează `http://localhost/website`

**Opțiune 3: Apache/Nginx**
- Configurează virtual host către directorul proiectului
- Asigură-te că mod_rewrite este activat

### 4. Acces Aplicație

Deschide browserul și accesează:
```
http://localhost:8000
```

## 📁 Structura Proiectului

```
website/
├── css/
│   └── style.css              # Stiluri CSS principale
├── js/
│   ├── login.js               # JavaScript pentru login
│   └── signup.js              # JavaScript pentru signup
├── php/
│   ├── config.php             # Configurare bază de date
│   ├── login.php              # Backend login
│   ├── signup.php             # Backend înregistrare
│   ├── logout.php             # Deconectare
│   └── check_auth.php         # Verificare autentificare
├── index.html                 # Pagina principală (redirect)
├── login.html                 # Pagina de login
├── signup.html                # Pagina de înregistrare
├── dashboard.html             # Dashboard utilizator
├── database.sql               # Script SQL pentru baza de date
└── README.md                  # Documentație
```

## 📄 Pagini

### Login (`login.html`)
- Formular de autentificare cu email și parolă
- Validare client-side și server-side
- Mesaje de eroare friendly
- Link către pagina de înregistrare

### Signup (`signup.html`)
- Formular de înregistrare cu:
  - Nume complet
  - Email
  - Parolă
  - Confirmare parolă
  - Checkbox termeni și condiții
- Validare completă pe ambele părți
- Verificare parolă duplicat
- Verificare email existent

### Dashboard (`dashboard.html`)
- Pagină protejată (necesită autentificare)
- Afișează informații utilizator
- Buton de deconectare

## 🔐 Securitate

- ✅ Parolele sunt hash-uite cu `password_hash()` și `PASSWORD_DEFAULT`
- ✅ Protecție împotriva SQL Injection prin prepared statements
- ✅ Validare input pe server și client
- ✅ Sesiuni PHP pentru gestionarea autentificării
- ✅ Verificare email format valid
- ✅ Protecție CSRF prin verificare POST

## 💾 Bază de Date

### Tabelul `users`

| Coloană      | Tip           | Descriere                    |
|--------------|---------------|------------------------------|
| id           | INT           | Primary key, auto increment  |
| full_name    | VARCHAR(100)  | Numele complet al utilizatorului |
| email        | VARCHAR(100)  | Email unic                   |
| password     | VARCHAR(255)  | Parolă hash-uită             |
| created_at   | TIMESTAMP     | Data creării                 |
| updated_at   | TIMESTAMP     | Data actualizării            |

## 🎨 Design

Design-ul este inspirat de Ant Design și include:
- Gradient violet-albastru pentru fundal
- Card-uri cu shadow pentru formularele
- Input-uri cu iconițe
- Butoane cu efecte hover
- Notificări animate
- Design responsive pentru mobile

## 🧪 Testare

### Utilizator de test (pre-creat):
- **Email:** test@example.com
- **Parolă:** 123456

## 🛠️ Tehnologii

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** PHP 7.4+
- **Bază de date:** MySQL
- **Design:** Inspirat de Ant Design
- **Icons:** SVG Icons (Bootstrap Icons)

## 📝 TODO Viitor

- [ ] Recuperare parolă prin email
- [ ] Validare email prin link de confirmare
- [ ] Profilul utilizatorului
- [ ] Schimbare parolă
- [ ] Remember me functionality
- [ ] Rate limiting pentru login
- [ ] reCAPTCHA pentru protecție spam

## 📧 Contact

Pentru întrebări sau sugestii, te rugăm să creezi un issue.

## 📜 Licență

Acest proiect este open source și disponibil sub licența MIT.