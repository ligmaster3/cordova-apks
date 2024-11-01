// Esperar a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Reset previous errors
        resetErrors();

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validate email
        if (!isValidEmail(email)) {
            showError('email');
            return;
        }

        // Validate password
        if (!isValidPassword(password)) {
            showError('password');
            return;
        }

        // Simulate login
        simulateLogin(email, password);
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        return password.length >= 6;
    }

    function showError(fieldId) {
        const formGroup = document.getElementById(fieldId).parentElement;
        formGroup.classList.add('error');
    }

    function resetErrors() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('error'));
        document.querySelector('.success-message').style.display = 'none';
    }

    function simulateLogin(email, password) {
        const form = document.getElementById('loginForm');
        const successMessage = document.querySelector('.success-message');
        const submitBtn = document.querySelector('.submit-btn');

        // Add loading state
        form.classList.add('loading');
        submitBtn.textContent = 'Signing in...';

        // Simulate API call
        setTimeout(() => {
            form.classList.remove('loading');
            submitBtn.textContent = 'Sign In';
            successMessage.style.display = 'block';

            // Reset form
            form.reset();

            // Redirect after successful login (uncomment and modify as needed)
            window.location.href = '/home.html';
        }, 1500);
    }


});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');

    // Validation functions
    const validators = {
        nombre: (value) => {
            return value.length >= 2;
        },
        apellido: (value) => {
            return value.length >= 2;
        },
        edad: (value) => {
            const age = parseInt(value);
            return age >= 18 && age <= 100;
        },
        correo: (value) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        contrasena: (value) => {
            return value.length >= 8;
        },
        confirmar_contrasena: (value, formData) => {
            return value === formData.get('contrasena');
        }
    };

    // Error messages
    const errorMessages = {
        nombre: 'El nombre debe tener al menos 2 caracteres',
        apellido: 'El apellido debe tener al menos 2 caracteres',
        edad: 'La edad debe ser entre 18 y 100 años',
        correo: 'Ingrese un correo electrónico válido',
        contrasena: 'La contraseña debe tener al menos 8 caracteres',
        confirmar_contrasena: 'Las contraseñas no coinciden'
    };

    // Password strength checker
    function checkPasswordStrength(password) {
        const strengthDiv = form.querySelector('.password-strength');
        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);

        const strength = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial]
            .filter(Boolean).length;

        let strengthText = '';
        let strengthClass = '';

        if (password.length === 0) {
            strengthDiv.textContent = '';
            return;
        }

        if (strength < 3) {
            strengthText = 'Débil';
            strengthClass = 'strength-weak';
        } else if (strength < 4) {
            strengthText = 'Media';
            strengthClass = 'strength-medium';
        } else {
            strengthText = 'Fuerte';
            strengthClass = 'strength-strong';
        }

        strengthDiv.textContent = `Fortaleza de la contraseña: ${strengthText}`;
        strengthDiv.className = `password-strength ${strengthClass}`;
    }

    // Real-time password strength checking
    form.querySelector('[name="contrasena"]').addEventListener('input', function (e) {
        checkPasswordStrength(e.target.value);
    });

    // Real-time validation for all fields
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function () {
            const formGroup = this.closest('.top-margin') || this.closest('.col-sm-6');
            formGroup.classList.remove('show-error');
            this.classList.remove('error');
        });
    });

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let hasErrors = false;
        const formData = new FormData(form);

        // Validate all fields
        for (const [field, value] of formData.entries()) {
            const validator = validators[field];
            if (validator) {
                const formGroup = form.querySelector(`[name="${field}"]`)
                    .closest('.top-margin') || form.querySelector(`[name="${field}"]`)
                        .closest('.col-sm-6');
                const input = form.querySelector(`[name="${field}"]`);

                if (!validator(value, formData)) {
                    formGroup.classList.add('show-error');
                    input.classList.add('error');
                    hasErrors = true;
                } else {
                    formGroup.classList.remove('show-error');
                    input.classList.remove('error');
                }
            }
        }

        if (!hasErrors) {
            // Simulate form submission
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Registrando...';

            setTimeout(() => {
                form.style.display = 'none';
                document.querySelector('.success-message').style.display = 'block';

                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/pages/home/login/login.php';
                }, 2000);
            }, 1500);
        }
    });
});

