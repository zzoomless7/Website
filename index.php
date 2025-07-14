<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Website</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>
    
    <!-- Hero Section -->
    <section class="hero-section" id="home">
        <div class="container">
            <div class="row align-items-center min-vh-100">
                <div class="col-lg-6">
                    <div class="hero-content">
                        <h1 class="hero-title">
                            <span class="text-gradient">Inovație</span> în fiecare 
                            <span class="text-gradient">pixel</span>
                        </h1>
                        <p class="hero-description">
                            Creăm experiențe digitale moderne care transformă ideile în realitate. 
                            Descoperă puterea design-ului și tehnologiei unite.
                        </p>
                        <div class="hero-buttons">
                            <a href="#about" class="btn btn-primary btn-lg me-3">
                                <i class="fas fa-rocket me-2"></i>Explorează
                            </a>
                            <a href="#contact" class="btn btn-outline-primary btn-lg">
                                <i class="fas fa-envelope me-2"></i>Contact
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="hero-image">
                        <div class="floating-elements">
                            <div class="floating-card card-1">
                                <i class="fas fa-code"></i>
                            </div>
                            <div class="floating-card card-2">
                                <i class="fas fa-palette"></i>
                            </div>
                            <div class="floating-card card-3">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="section-padding" id="about">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h2 class="section-title">Despre Noi</h2>
                    <p class="section-subtitle">
                        Suntem o echipă pasionată de tehnologie și design, dedicată creării 
                        de soluții digitale inovatoare.
                    </p>
                </div>
            </div>
            
            <div class="row mt-5">
                <div class="col-md-4 mb-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-lightning-bolt"></i>
                        </div>
                        <h4>Performanță</h4>
                        <p>Optimizăm fiecare element pentru viteza și eficiența maximă.</p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h4>Securitate</h4>
                        <p>Implementăm cele mai bune practici de securitate în toate proiectele.</p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h4>Experiență</h4>
                        <p>Proiectăm experiențe intuitive și plăcute pentru utilizatori.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="section-padding bg-light" id="services">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h2 class="section-title">Serviciile Noastre</h2>
                    <p class="section-subtitle">
                        Oferim soluții complete pentru prezența ta digitală
                    </p>
                </div>
            </div>
            
            <div class="row mt-5">
                <?php 
                $services = [
                    [
                        'icon' => 'fas fa-laptop-code',
                        'title' => 'Dezvoltare Web',
                        'description' => 'Creăm website-uri responsive și moderne folosind cele mai noi tehnologii.'
                    ],
                    [
                        'icon' => 'fas fa-mobile-alt',
                        'title' => 'Aplicații Mobile',
                        'description' => 'Dezvoltăm aplicații native și cross-platform pentru iOS și Android.'
                    ],
                    [
                        'icon' => 'fas fa-paint-brush',
                        'title' => 'UI/UX Design',
                        'description' => 'Proiectăm interfețe frumoase și funcționale pentru toate tipurile de aplicații.'
                    ],
                    [
                        'icon' => 'fas fa-chart-line',
                        'title' => 'Marketing Digital',
                        'description' => 'Strategii de marketing online pentru creșterea vizibilității brandului tău.'
                    ],
                    [
                        'icon' => 'fas fa-cloud',
                        'title' => 'Cloud Solutions',
                        'description' => 'Implementăm soluții cloud scalabile și sigure pentru businessul tău.'
                    ],
                    [
                        'icon' => 'fas fa-cog',
                        'title' => 'Consultanță IT',
                        'description' => 'Oferim consultanță tehnică pentru optimizarea proceselor și sistemelor.'
                    ]
                ];
                
                foreach($services as $service): ?>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="<?php echo $service['icon']; ?>"></i>
                        </div>
                        <h4><?php echo $service['title']; ?></h4>
                        <p><?php echo $service['description']; ?></p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section-padding" id="contact">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h2 class="section-title">Contactează-ne</h2>
                    <p class="section-subtitle">
                        Suntem aici să transformăm ideile tale în realitate
                    </p>
                </div>
            </div>
            
            <div class="row mt-5">
                <div class="col-lg-8 mx-auto">
                    <form class="contact-form" action="process_form.php" method="POST">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <input type="text" class="form-control" name="name" placeholder="Numele tău" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <input type="email" class="form-control" name="email" placeholder="Email-ul tău" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" name="subject" placeholder="Subiect" required>
                        </div>
                        <div class="mb-3">
                            <textarea class="form-control" name="message" rows="5" placeholder="Mesajul tău" required></textarea>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary btn-lg">
                                <i class="fas fa-paper-plane me-2"></i>Trimite Mesaj
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="assets/js/script.js"></script>
</body>
</html>