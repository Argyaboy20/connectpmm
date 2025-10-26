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

    /* Detect user type from storage */
    getUserType() {
        const userType = localStorage.getItem('userType');
        return userType || 'peserta';
    }

    isKoordinator() {
        return this.getUserType() === 'koordinator';
    }

    /* Get home URL based on user type */
    getHomeUrl() {
        const userType = this.getUserType();
        
        const homeUrls = {
            'peserta': '/home',
            'koordinator': '/koordinator',
            'umum': '/homeumum'
        };
        
        return homeUrls[userType] || '/home';
    }

    /* Get URL with menu parameter based on user type */
    getMenuUrl(menuName) {
        const userType = this.getUserType();
        
        const baseUrls = {
            'peserta': '/home',
            'koordinator': '/koordinator',
            'umum': '/homeumum'
        };
        
        const baseUrl = baseUrls[userType] || '/home';
        
        return `${baseUrl}?menu=${menuName}`;
    }

    /* Initialize all components */
    init() {
        this.renderDynamicSidebar();
        this.setupSidebarToggle();
        this.setupMenuItems();
        this.setupBioCounter();
        this.setupPhotoUpload();
        this.setupFormSubmit();
        this.setupLogout();
        this.handleResponsive();
        this.handleTabletView();
    }

    /* Render sidebar based on user type */
    renderDynamicSidebar() {
        if (!this.isKoordinator()) return;
        
        const menuList = document.querySelector('.menu-list');
        if (!menuList) return;
        
        const koordinatorMenu = `
            <li class="menu-item">
                <i class="fas fa-home"></i>
                <span class="menu-text">Dashboard</span>
            </li>
            <li class="menu-item">
                <i class="fas fa-file-alt"></i>
                <span class="menu-text">Laporan Mahasiswa</span>
            </li>
            <li class="menu-item">
                <i class="fas fa-users"></i>
                <span class="menu-text">Data Mahasiswa</span>
            </li>
            <li class="menu-item">
                <i class="fas fa-envelope"></i>
                <span class="menu-text">Pesan</span>
            </li>
            <li class="menu-item">
                <i class="fas fa-bell"></i>
                <span class="menu-text">Notifikasi</span>
            </li>
            <li class="menu-item">
                <i class="fas fa-user-circle"></i>
                <span class="menu-text">Profil</span>
            </li>
        `;
        
        menuList.innerHTML = koordinatorMenu;
        
        const sidebarFooter = document.querySelector('.sidebar-footer .menu-item');
        if (sidebarFooter) {
            sidebarFooter.classList.add('active');
        }
        
        // TAMBAHKAN INI: Force visibility di mobile
        const isMobile = window.innerWidth <= 640;
        if (isMobile && this.leftSidebar) {
            this.leftSidebar.style.display = 'flex';
            this.leftSidebar.style.visibility = 'visible';
            menuList.style.display = 'flex';
        }
        
        setTimeout(() => {
            this.setupMenuItems();
            this.handleMobileView(); // Re-check mobile view
        }, 100);
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
                
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                
                // Jika user adalah koordinator, gunakan routing koordinator
                if (this.isKoordinator()) {
                    this.handleKoordinatorMenu(menuText);
                } else {
                    this.handleDefaultMenu(menuText);
                }
            });
        });
    }

    /* Handle koordinator menu navigation */
    handleKoordinatorMenu(menuText) {
        switch(menuText) {
            case 'Dashboard':
                window.location.href = '/koordinator';
                break;
            case 'Laporan Mahasiswa':
                window.location.href = '/koordinator?menu=laporan';
                break;
            case 'Data Mahasiswa':
                window.location.href = '/koordinator?menu=data';
                break;
            case 'Pesan':
                window.location.href = '/koordinator?menu=pesan';
                break;
            case 'Notifikasi':
                window.location.href = '/koordinator?menu=notifikasi';
                break;
            case 'Profil':
                window.location.href = '/profil';
                break;
            case 'Lainnya':
                // Already on settings page
                break;
            default:
                this.showAlert(`${menuText}`, 'Fitur akan tersedia setelah database terhubung.');
        }
    }

    /* Handle default menu navigation (peserta/umum) */
    handleDefaultMenu(menuText) {
        if (menuText === 'Beranda') {
            window.location.href = this.getHomeUrl();
        } else if (menuText === 'Profil') {
            window.location.href = '/profil';
        } else if (menuText === 'Pencarian') {
            window.location.href = this.getMenuUrl('pencarian');
        } else if (menuText === 'Pesan') {
            window.location.href = this.getMenuUrl('pesan');
        } else if (menuText === 'Notifikasi') {
            window.location.href = this.getMenuUrl('notifikasi');
        } else if (menuText === 'Buat') {
            window.location.href = this.getMenuUrl('buat');
        } else if (menuText === 'Lainnya') {
            // Already on settings page
        } else {
            this.showAlert(`${menuText}`, 'Fitur akan tersedia setelah database terhubung.');
        }
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
                // Hapus user type saat logout
                localStorage.removeItem('userType');

                // Lalu redirect
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
        
        if (isMobile) {
            // Force show sidebar di mobile
            if (this.leftSidebar) {
                this.leftSidebar.style.display = 'flex';
                this.leftSidebar.style.visibility = 'visible';
                this.leftSidebar.style.opacity = '1';
            }
            
            // Hide toggle button
            if (this.leftToggle) {
                this.leftToggle.style.display = 'none';
            }
            
            // Ensure menu list is visible
            const menuList = document.querySelector('.menu-list');
            if (menuList) {
                menuList.style.display = 'flex';
            }
            
            // Log untuk debugging
            console.log('Mobile view active - sidebar should be visible');
        } else {
            // Desktop/tablet view
            if (this.leftToggle) {
                this.leftToggle.style.display = 'flex';
            }
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
            