// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';
    } else {
        field.type = 'password';
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Clear error message
function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
    }
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('error');
    }
}

// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
    }
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Handle form submission
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous errors
    clearError('fullName');
    clearError('email');
    clearError('password');
    clearError('confirmPassword');
    clearError('agreement');

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreement = document.getElementById('agreement').checked;

    let hasError = false;

    // Validate full name
    if (!fullName) {
        showError('fullName', 'Te rugăm să introduci numele complet!');
        hasError = true;
    } else if (fullName.length < 2) {
        showError('fullName', 'Numele trebuie să aibă cel puțin 2 caractere!');
        hasError = true;
    }

    // Validate email
    if (!email) {
        showError('email', 'Te rugăm să introduci email-ul!');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError('email', 'Te rugăm să introduci un email valid!');
        hasError = true;
    }

    // Validate password
    if (!password) {
        showError('password', 'Te rugăm să introduci parola!');
        hasError = true;
    } else if (password.length < 6) {
        showError('password', 'Parola trebuie să aibă cel puțin 6 caractere!');
        hasError = true;
    }

    // Validate confirm password
    if (!confirmPassword) {
        showError('confirmPassword', 'Te rugăm să confirmi parola!');
        hasError = true;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Parolele nu se potrivesc!');
        hasError = true;
    }

    // Validate agreement
    if (!agreement) {
        showError('agreement', 'Trebuie să accepți termenii și condițiile!');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Disable submit button
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Se procesează...';

    try {
        // Send data to PHP backend
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('php/signup.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showNotification(result.message, 'success');
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('A apărut o eroare. Te rugăm să încerci din nou.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Înregistrare';
    }
});

// Clear error on input
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        clearError(this.id);
    });
});
