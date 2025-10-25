/* Settings Page Manager */
class SettingsManager {
    constructor() {
        this.leftSidebar = document.getElementById('leftSidebar');
        this.mainContent = document.getElementById('mainContent');
        this.leftToggle = document.getElementById('leftToggle');
        this.settingsForm = document.getElementById('settingsForm');
        this.bioInput = document.getElementById('bioInput');
        this.charCount = document.getElementById('charCount');
        this.changePhotoBtn = document.getElementById('changePhotoBtn');
        this.photoInput = document.getElementById('photoInput');
        this.logoutBtn = document.getElementById('logoutBtn');

        this.init();
    }

    /* Initialize all components */
    init() {
        this.setupSidebarToggle();
        this.setupMenuItems();
        this.setupBioCounter();
        this.setupPhotoUpload();
        this.setupFormSubmit();
        this.setupLogout();
        this.handleResponsive();
        this.handleTabletView();
    }

    /* Setup sidebar toggle functionality */
    setupSidebarToggle() {
        if (this.leftToggle) {
            this.leftToggle.addEventListener('click', () => this.toggleLeftSidebar());
        }
    }

    /* Toggle left sidebar visibility */
    toggleLeftSidebar() {
        if (!this.leftSidebar) return;

        this.leftSidebar.classList.toggle('collapsed');
        this.updateToggleIcon(this.leftToggle, this.leftSidebar.classList.contains('collapsed'));
    }

    /* Update toggle button icon */
    updateToggleIcon(toggleBtn, isCollapsed) {
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('i');
        if (!icon) return;

        icon.className = isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
    }

    /* Setup menu item navigation */
    setupMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const menuTextElement = item.querySelector('.menu-text');
                const menuText = menuTextElement ? menuTextElement.textContent.trim() : '';
                
                console.log('Settings menu clicked:', menuText);
                
                // Remove active from all menu items
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                
                // Navigation logic based on menu text
                if (menuText === 'Beranda') {
                    window.location.href = '/home';
                } else if (menuText === 'Profil') {
                    window.location.href = '/profil';
                } else if (menuText === 'Pencarian') {
                    window.location.href = '/home?menu=pencarian';
                } else if (menuText === 'Pesan') {
                    window.location.href = '/home?menu=pesan';
                } else if (menuText === 'Notifikasi') {
                    window.location.href = '/home?menu=notifikasi';
                } else if (menuText === 'Buat') {
                    window.location.href = '/home?menu=buat';
                } else if (menuText === 'Lainnya') {
                    // Already on settings page, do nothing
                } else {
                    this.showAlert(`${menuText}`, 'Fitur akan tersedia setelah database terhubung.');
                }
            });
        });
    }

    /* Setup bio character counter */
    setupBioCounter() {
        if (!this.bioInput || !this.charCount) return;

        // Initial count
        this.updateCharCount();

        // Update on input
        this.bioInput.addEventListener('input', () => this.updateCharCount());
    }

    /* Update character count */
    updateCharCount() {
        const count = this.bioInput.value.length;
        this.charCount.textContent = count;

        // Change color if near limit
        if (count >= 150) {
            this.charCount.style.color = '#ef4444';
        } else if (count >= 130) {
            this.charCount.style.color = '#f59e0b';
        } else {
            this.charCount.style.color = '#8e8e8e';
        }
    }

    /* Setup photo upload functionality */
    setupPhotoUpload() {
        if (!this.changePhotoBtn || !this.photoInput) return;

        this.changePhotoBtn.addEventListener('click', () => {
            this.photoInput.click();
        });

        this.photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handlePhotoUpload(file);
            }
        });
    }

    /* Handle photo upload */
    handlePhotoUpload(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showAlert('Error', 'File harus berupa gambar');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showAlert('Error', 'Ukuran file maksimal 5MB');
            return;
        }

        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => {
            const profileImage = document.getElementById('profileImage');
            const profileIcon = document.getElementById('profileIcon');

            if (profileImage) {
                profileImage.src = e.target.result;
            } else if (profileIcon) {
                // Replace icon with image
                const photoAvatar = document.querySelector('.photo-avatar');
                photoAvatar.innerHTML = `<img src="${e.target.result}" alt="Profile" id="profileImage">`;
            }

            console.log('Photo uploaded successfully');
            // TODO: Send to server when database is connected
        };

        reader.readAsDataURL(file);
    }

    /* Setup form submit */
    setupFormSubmit() {
        if (!this.settingsForm) return;

        this.settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    /* Handle form submission */
    handleFormSubmit() {
        const bioValue = this.bioInput ? this.bioInput.value.trim() : '';
        const genderValue = document.getElementById('genderSelect')?.value || '';

        // Validate
        if (bioValue.length > 150) {
            this.showAlert('Error', 'Bio maksimal 150 karakter');
            return;
        }

        // Prepare data
        const formData = {
            bio: bioValue,
            gender: genderValue
        };

        console.log('Form data to save:', formData);

        // TODO: Send to server when database is connected
        // For now, just show success message
        this.showAlert('Berhasil', 'Profil berhasil diperbarui!');
        
        // Simulate success
        setTimeout(() => {
            console.log('Profile updated successfully');
        }, 500);
    }

    /* Setup logout functionality */
    setupLogout() {
        if (!this.logoutBtn) return;

        this.logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    /* Handle logout */
    handleLogout() {
        const confirmed = confirm('Apakah Anda yakin ingin keluar?');
        
        if (confirmed) {
            console.log('Logging out...');
            
            // TODO: Call logout API when database is connected
            // For now, redirect to login or home
            this.showAlert('Logout', 'Anda telah keluar dari akun');
            
            setTimeout(() => {
                // Redirect to login page
                window.location.href = '/signin';
            }, 1000);
        }
    }

    /* Handle responsive behavior */
    handleResponsive() {
        window.addEventListener('resize', () => {
            this.handleTabletView();
            this.handleMobileView();
        });

        // Initial check
        this.handleMobileView();
    }

    /* Handle tablet view - set default collapsed */
    handleTabletView() {
        const isTablet = window.innerWidth > 640 && window.innerWidth <= 768;
        
        if (isTablet) {
            // Set default collapsed untuk tablet
            if (this.leftSidebar && !this.leftSidebar.classList.contains('collapsed')) {
                this.leftSidebar.classList.add('collapsed');
                this.updateToggleIcon(this.leftToggle, true);
            }
        }
    }

    /* Handle mobile view adjustments */
    handleMobileView() {
        const isMobile = window.innerWidth <= 640;

        if (this.leftToggle) {
            this.leftToggle.style.display = isMobile ? 'none' : 'flex';
        }
    }

    /* Show alert messages */
    showAlert(title, message = '') {
        const alertText = message ? `${title}\n${message}` : title;
        alert(alertText);
    }

    /* Get current screen size category */
    getScreenSize() {
        const width = window.innerWidth;
        if (width <= 640) return 'mobile';
        if (width <= 768) return 'tablet';
        return 'desktop';
    }
}

/* Initialize when DOM is loaded */
document.addEventListener('DOMContentLoaded', () => {
    const settingsManager = new SettingsManager();
    
    console.log('Settings Page initialized');
    console.log('Screen size:', settingsManager.getScreenSize());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Toggle sidebar with Ctrl/Cmd + [
        if ((e.ctrlKey || e.metaKey) && e.key === '[') {
            e.preventDefault();
            settingsManager.toggleLeftSidebar();
        }

        // Save form with Ctrl/Cmd + S
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            settingsManager.handleFormSubmit();
        }
    });
});
            