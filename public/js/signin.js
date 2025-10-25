class SignInManager {
    constructor() {
        this.activeTab = 'peserta';
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.setupTabSwitching();
        this.setupEyeToggle();
        this.setupFormSubmission();
        this.setupInputValidation();
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        const container = document.querySelector('.signin-container');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Update container class for responsive height
                if (container) {
                    container.className = 'signin-container';
                    container.classList.add(`tab-${targetTab}`);
                }
                
                this.activeTab = targetTab;
            });
        });
        
        // Set initial container class
        if (container) {
            container.classList.add('tab-peserta');
        }
    }

    setupEyeToggle() {
        const eyeToggles = document.querySelectorAll('.eye-toggle');

        eyeToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = toggle.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const eyeIcon = toggle.querySelector('.eye-icon');

                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.textContent = '🙈';
                    toggle.setAttribute('title', 'Sembunyikan password');
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.textContent = '👁';
                    toggle.setAttribute('title', 'Tampilkan password');
                }
            });
        });
    }

    setupInputValidation() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');

        inputs.forEach(input => {
            // Clear error styling on input
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });

            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.name;

        if (!value) {
            this.showFieldError(field, 'Field ini wajib diisi');
            return false;
        }

        // Specific validation based on field type
        switch (fieldType) {
            case 'nim':
                if (!/^\d+$/.test(value) || value.length < 8) {
                    this.showFieldError(field, 'NIM harus berupa angka minimal 8 digit');
                    return false;
                }
                break;
            
            case 'nidn':
                if (!/^\d+$/.test(value) || value.length < 10) {
                    this.showFieldError(field, 'NIDN harus berupa angka minimal 10 digit');
                    return false;
                }
                break;
            
            case 'password':
                if (value.length < 6) {
                    this.showFieldError(field, 'Password minimal 6 karakter');
                    return false;
                }
                break;
        }

        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const container = field.parentNode.classList.contains('password-container') 
            ? field.parentNode.parentNode 
            : field.parentNode;
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        if (field.parentNode.classList.contains('password-container')) {
            field.parentNode.parentNode.appendChild(errorDiv);
        } else {
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorMessage = field.parentNode.classList.contains('password-container') 
            ? field.parentNode.parentNode.querySelector('.error-message')
            : field.parentNode.querySelector('.error-message');
            
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    setupFormSubmission() {
        const forms = document.querySelectorAll('.signin-form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.isSubmitting) {
                    return;
                }

                const submitButton = form.querySelector('.btn-masuk');
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;

                // Validate all required fields
                requiredFields.forEach(field => {
                    if (!this.validateField(field)) {
                        isValid = false;
                    }
                });

                if (!isValid) {
                    this.showNotification('Mohon perbaiki kesalahan pada form', 'error');
                    return;
                }

                this.isSubmitting = true;

                // Show loading state
                this.showLoading(submitButton);

                // Submit form
                this.submitForm(form, submitButton);
            });
        });
    }

    async submitForm(form, button) {
        try {
            // Get form data
            const formData = new FormData(form);
            
            // For simplified version, just redirect to home after brief delay
            // This simulates a successful login without actual authentication
            setTimeout(() => {
                this.showNotification('Login berhasil! Mengalihkan...', 'success');
                setTimeout(() => {
                    window.location.href = '/home';
                }, 800);
            }, 500);
            
        } catch (error) {
            console.error('Submit error:', error);
            this.showNotification('Terjadi kesalahan saat login. Silakan coba lagi.', 'error');
            this.hideLoading(button);
            this.isSubmitting = false;
        }
    }

    handleFormErrors(errors) {
        // Clear all existing errors first
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        document.querySelectorAll('input.error').forEach(input => input.classList.remove('error'));
        
        // Show new errors
        Object.keys(errors).forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.showFieldError(field, errors[fieldName]);
            }
        });
    }

    showLoading(button) {
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner"></span>Masuk...';
        button.classList.add('loading');
    }

    hideLoading(button) {
        button.disabled = false;
        button.innerHTML = 'Masuk';
        button.classList.remove('loading');
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Utility functions
const ValidationUtils = {
    isValidNIM(nim) {
        return /^\d{8,}$/.test(nim);
    },

    isValidNIDN(nidn) {
        return /^\d{10,}$/.test(nidn);
    },

    isValidPassword(password) {
        return password.length >= 6;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignInManager();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Enter key to submit active form
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const activeForm = document.querySelector('.tab-content.active .signin-form');
        if (activeForm) {
            const submitButton = activeForm.querySelector('.btn-masuk');
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignInManager;
}