/* Profile Page Manager */
class ProfileManager {
    constructor() {
        this.leftSidebar = document.getElementById('leftSidebar');
        this.mainContent = document.getElementById('mainContent');
        this.leftToggle = document.getElementById('leftToggle');

        this.init();
    }

    /* Initialize all components */
    init() {
        this.setupSidebarToggle();
        this.setupMenuItems();
        this.setupProfileTabs();
        this.setupSortFilters();
        this.loadMockContent();
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
                // Get menu text from .menu-text element
                const menuTextElement = item.querySelector('.menu-text');
                const menuText = menuTextElement ? menuTextElement.textContent.trim() : '';
                
                console.log('Profile menu clicked:', menuText); // Debug log
                
                // Remove active from all menu items
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                
                // Navigation logic based on menu text
                if (menuText === 'Beranda') {
                    window.location.href = '/home';
                } else if (menuText === 'Profil') {
                    // Already on profile page, do nothing
                } else if (menuText === 'Pencarian') {
                    window.location.href = '/home?menu=pencarian';
                } else if (menuText === 'Pesan') {
                    window.location.href = '/home?menu=pesan';
                } else if (menuText === 'Notifikasi') {
                    window.location.href = '/home?menu=notifikasi';
                } else if (menuText === 'Buat') {
                    window.location.href = '/home?menu=buat';
                } else if (menuText === 'Lainnya') {
                    this.showAlert('Menu Lainnya', 'Fitur akan tersedia setelah database terhubung.');
                } else {
                    // Fallback untuk menu yang tidak dikenali
                    this.showAlert(`${menuText}`, 'Fitur akan tersedia setelah database terhubung.');
                }
            });
        });
    }

    /* Setup profile tabs */
    setupProfileTabs() {
        const tabButtons = document.querySelectorAll('.profile-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, tabButtons, tabContents);
            });
        });
    }

    /* Setup sort filter functionality */
    setupSortFilters() {
        const sortButtons = document.querySelectorAll('.sort-btn');
        
        sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sortType = button.getAttribute('data-sort');
                const tabType = button.getAttribute('data-tab');
                
                // Update active state
                const siblingButtons = button.parentElement.querySelectorAll('.sort-btn');
                siblingButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Sort content
                this.sortContent(tabType, sortType);
            });
        });
    }

    /* Sort content based on type and order */
    sortContent(tabType, sortOrder) {
        if (tabType === 'post') {
            this.sortPostContent(sortOrder);
        } else if (tabType === 'conex') {
            this.sortConexContent(sortOrder);
        }
    }

    /* Sort post content */
    sortPostContent(order) {
        const grid = document.getElementById('postGrid');
        if (!grid) return;
        
        const posts = Array.from(grid.children);
        
        posts.sort((a, b) => {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            
            return order === 'newest' ? dateB - dateA : dateA - dateB;
        });
        
        // Re-append sorted posts
        posts.forEach(post => grid.appendChild(post));
    }

    /* Sort conex content */
    sortConexContent(order) {
        const feed = document.getElementById('conexFeed');
        if (!feed) return;
        
        const conexPosts = Array.from(feed.children);
        
        conexPosts.sort((a, b) => {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            
            return order === 'newest' ? dateB - dateA : dateA - dateB;
        });
        
        // Re-append sorted posts
        conexPosts.forEach(post => feed.appendChild(post));
    }

    /* Load mock content for demonstration */
    loadMockContent() {
        this.loadMockPosts();
        this.loadMockConex();
    }

    /* Load mock posts */
    loadMockPosts() {
        const grid = document.getElementById('postGrid');
        const emptyState = document.getElementById('postEmpty');
        
        if (!grid) return;
        
        // Mock data - replace with actual API call
        const mockPosts = [
            { id: 1, image: 'https://picsum.photos/400/400?random=1', likes: 234, comments: 12, date: '2025-10-24T10:30:00' },
            { id: 2, image: 'https://picsum.photos/400/400?random=2', likes: 189, comments: 8, date: '2025-10-23T14:20:00' },
            { id: 3, image: 'https://picsum.photos/400/400?random=3', likes: 456, comments: 23, date: '2025-10-22T09:15:00' },
            { id: 4, image: 'https://picsum.photos/400/400?random=4', likes: 321, comments: 15, date: '2025-10-21T16:45:00' },
            { id: 5, image: 'https://picsum.photos/400/400?random=5', likes: 567, comments: 34, date: '2025-10-20T11:00:00' },
            { id: 6, image: 'https://picsum.photos/400/400?random=6', likes: 123, comments: 7, date: '2025-10-19T13:30:00' },
            { id: 7, image: 'https://picsum.photos/400/400?random=7', likes: 890, comments: 45, date: '2025-10-18T08:20:00' },
            { id: 8, image: 'https://picsum.photos/400/400?random=8', likes: 234, comments: 19, date: '2025-10-17T15:10:00' }
        ];
        
        if (mockPosts.length > 0) {
            emptyState.style.display = 'none';
            grid.innerHTML = mockPosts.map(post => `
                <div class="post-item" data-date="${post.date}" data-id="${post.id}">
                    <img src="${post.image}" alt="Post ${post.id}" loading="lazy">
                    <div class="post-item-overlay">
                        <div class="post-stat">
                            <i class="fas fa-bell"></i>
                            <span>${post.likes}</span>
                        </div>
                        <div class="post-stat">
                            <i class="fas fa-comment"></i>
                            <span>${post.comments}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    /* Load mock conex posts */
    loadMockConex() {
        const feed = document.getElementById('conexFeed');
        const emptyState = document.getElementById('conexEmpty');
        
        if (!feed) return;
        
        // Mock data - replace with actual API call
        const mockConex = [
            {
                id: 1,
                content: 'Hari ini adalah hari yang indah untuk memulai sesuatu yang baru! 🌟 Semangat untuk semua yang sedang berjuang mencapai impiannya.',
                likes: 45,
                comments: 12,
                shares: 3,
                date: '2025-10-24T10:30:00',
                timeAgo: '2 jam yang lalu'
            },
            {
                id: 2,
                content: 'Kadang kita perlu melambat untuk bisa melihat keindahan di sekitar kita. Jangan terburu-buru, nikmati prosesnya. 🌸',
                likes: 67,
                comments: 8,
                shares: 5,
                date: '2025-10-23T14:20:00',
                timeAgo: '1 hari yang lalu'
            },
            {
                id: 3,
                content: 'Belajar dari kesalahan adalah bagian dari pertumbuhan. Terus maju, jangan menyerah! 💪',
                likes: 123,
                comments: 23,
                shares: 10,
                date: '2025-10-22T09:15:00',
                timeAgo: '2 hari yang lalu'
            },
            {
                id: 4,
                content: 'Kesuksesan bukanlah tujuan akhir, tapi perjalanan yang terus berlanjut. Keep going! ✨',
                likes: 89,
                comments: 15,
                shares: 7,
                date: '2025-10-21T16:45:00',
                timeAgo: '3 hari yang lalu'
            }
        ];
        
        if (mockConex.length > 0) {
            emptyState.style.display = 'none';
            feed.innerHTML = mockConex.map(conex => `
                <div class="conex-item" data-date="${conex.date}" data-id="${conex.id}">
                    <div class="conex-header">
                        <img src="https://ui-avatars.com/api/?name=User&size=80&background=667eea&color=fff" 
                            alt="Avatar" class="conex-avatar">
                        <div class="conex-info">
                            <div class="conex-username">username_demo</div>
                            <div class="conex-date">${conex.timeAgo}</div>
                        </div>
                    </div>
                    <div class="conex-content">${conex.content}</div>
                    <div class="conex-stats">
                        <div class="conex-stat">
                            <i class="fas fa-bell"></i>
                            <span>${conex.likes}</span>
                        </div>
                        <div class="conex-stat">
                            <i class="fas fa-comment"></i>
                            <span>${conex.comments}</span>
                        </div>
                        <div class="conex-stat">
                            <i class="fas fa-share"></i>
                            <span>${conex.shares}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    /* Switch between tabs */
    switchTab(targetTab, tabButtons, tabContents) {
        // Remove active class from all
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to target
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const activeContent = document.getElementById(`${targetTab}Content`);

        if (activeButton) activeButton.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
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
    const profileManager = new ProfileManager();
    
    console.log('Profile Page initialized');
    console.log('Screen size:', profileManager.getScreenSize());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Toggle sidebar with Ctrl/Cmd + [
        if ((e.ctrlKey || e.metaKey) && e.key === '[') {
            e.preventDefault();
            profileManager.toggleLeftSidebar();
        }

        // Switch tabs with Ctrl/Cmd + 1/2
        if ((e.ctrlKey || e.metaKey) && (e.key === '1' || e.key === '2')) {
            e.preventDefault();
            const tab = e.key === '1' ? 'post' : 'conex';
            const tabButtons = document.querySelectorAll('.profile-tab');
            const tabContents = document.querySelectorAll('.tab-content');
            profileManager.switchTab(tab, tabButtons, tabContents);
        }
    });
});