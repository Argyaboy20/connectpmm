(function() {
    // Cek URL parameter SEGERA saat script loaded
    const urlParams = new URLSearchParams(window.location.search);
    const menu = urlParams.get('menu');
    
    if (menu) {
        // Set localStorage flag
        sessionStorage.setItem('fromProfile', menu);
        
        // Inject CSS untuk force sidebar collapsed SEBELUM DOM ready
        const style = document.createElement('style');
        style.id = 'pre-collapse-style';
        style.innerHTML = `
            .left-sidebar {
                width: 60px !important;
            }
            .left-sidebar .logo-text,
            .left-sidebar .menu-text {
                display: none !important;
            }
            .right-sidebar {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
})();

/* Handles sidebar toggling, tab navigation, and interactive elements */
class SidebarManager {
    constructor() {
        this.leftSidebar = document.getElementById('leftSidebar');
        this.rightSidebar = document.getElementById('rightSidebar');
        this.mainContent = document.getElementById('mainContent');
        this.leftToggle = document.getElementById('leftToggle');
        this.rightToggle = document.getElementById('rightToggle');
        this.selectedEmojis = [];
        this.pollData = null;
        this.emojiDatabase = this.initEmojiDatabase();
        this.selectedImageFiles = [];
        
        // TAMBAHKAN INI - Mock data untuk feed
        this.mockFeedPosts = this.initMockFeedPosts();
        this.mockFeedConex = this.initMockFeedConex();

        this.rightSidebarOriginalHTML = this.rightSidebar ? this.rightSidebar.innerHTML : '';
        this.init();
    }

    /* Initialize mock feed posts */
    initMockFeedPosts() {
        return [
            { id: 1, image: '/image/pmm1.jpeg', likes: 234, comments: 12, date: '2025-10-24T10:30:00', username: 'user_demo', userAvatar: 'https://ui-avatars.com/api/?name=Demo+User&size=80&background=667eea&color=fff' },
            { id: 2, image: '/image/pmm2.jpeg', likes: 189, comments: 8, date: '2025-10-23T14:20:00', username: 'admin_pmm', userAvatar: 'https://ui-avatars.com/api/?name=Admin+PMM&size=80&background=f56565&color=fff' },
            { id: 3, image: '/image/pmm3.jpeg', likes: 456, comments: 23, date: '2025-10-22T09:15:00', username: 'mahasiswa_aktif', userAvatar: 'https://ui-avatars.com/api/?name=Mahasiswa+Aktif&size=80&background=48bb78&color=fff' },
            { id: 4, image: '/image/pmm4.jpeg', likes: 321, comments: 15, date: '2025-10-21T16:45:00', username: 'pmm_connect', userAvatar: 'https://ui-avatars.com/api/?name=PMM+Connect&size=80&background=ed8936&color=fff' },
            { id: 5, image: '/image/pmm5.jpeg', likes: 567, comments: 34, date: '2025-10-20T11:00:00', username: 'user_demo', userAvatar: 'https://ui-avatars.com/api/?name=Demo+User&size=80&background=667eea&color=fff' },
            { id: 6, image: '/image/pmm6.jpeg', likes: 123, comments: 7, date: '2025-10-19T13:30:00', username: 'koordinator_pmm', userAvatar: 'https://ui-avatars.com/api/?name=Koordinator+PMM&size=80&background=9f7aea&color=fff' },
            { id: 7, image: '/image/pmm7.jpeg', likes: 890, comments: 45, date: '2025-10-18T08:20:00', username: 'admin_pmm', userAvatar: 'https://ui-avatars.com/api/?name=Admin+PMM&size=80&background=f56565&color=fff' },
            { id: 8, image: '/image/pmm8.jpeg', likes: 234, comments: 19, date: '2025-10-17T15:10:00', username: 'mahasiswa_aktif', userAvatar: 'https://ui-avatars.com/api/?name=Mahasiswa+Aktif&size=80&background=48bb78&color=fff' }
        ];
    }

    /* Initialize mock feed conex */
    initMockFeedConex() {
        return [
            {
                id: 1,
                username: 'admin_pmm',
                userAvatar: 'https://ui-avatars.com/api/?name=Admin+PMM&size=80&background=f56565&color=fff',
                content: 'Hari ini adalah hari yang indah untuk memulai sesuatu yang baru! 🌟 Semangat untuk semua yang sedang berjuang mencapai impiannya.',
                likes: 45,
                comments: 12,
                shares: 3,
                date: '2025-10-24T10:30:00',
                timeAgo: '2 jam yang lalu'
            },
            {
                id: 2,
                username: 'mahasiswa_aktif',
                userAvatar: 'https://ui-avatars.com/api/?name=Mahasiswa+Aktif&size=80&background=48bb78&color=fff',
                content: 'Kadang kita perlu melambat untuk bisa melihat keindahan di sekitar kita. Jangan terburu-buru, nikmati prosesnya. 🌸',
                likes: 67,
                comments: 8,
                shares: 5,
                date: '2025-10-23T14:20:00',
                timeAgo: '1 hari yang lalu'
            },
            {
                id: 3,
                username: 'user_demo',
                userAvatar: 'https://ui-avatars.com/api/?name=Demo+User&size=80&background=667eea&color=fff',
                content: 'Belajar dari kesalahan adalah bagian dari pertumbuhan. Terus maju, jangan menyerah! 💪',
                likes: 123,
                comments: 23,
                shares: 10,
                date: '2025-10-22T09:15:00',
                timeAgo: '2 hari yang lalu'
            },
            {
                id: 4,
                username: 'pmm_connect',
                userAvatar: 'https://ui-avatars.com/api/?name=PMM+Connect&size=80&background=ed8936&color=fff',
                content: 'Kesuksesan bukanlah tujuan akhir, tapi perjalanan yang terus berlanjut. Keep going! ✨',
                likes: 89,
                comments: 15,
                shares: 7,
                date: '2025-10-21T16:45:00',
                timeAgo: '3 hari yang lalu'
            },
            {
                id: 5,
                username: 'koordinator_pmm',
                userAvatar: 'https://ui-avatars.com/api/?name=Koordinator+PMM&size=80&background=9f7aea&color=fff',
                content: 'Setiap langkah kecil yang kita ambil hari ini adalah investasi untuk masa depan yang lebih baik. 🚀',
                likes: 156,
                comments: 28,
                shares: 12,
                date: '2025-10-20T11:00:00',
                timeAgo: '4 hari yang lalu'
            }
        ];
    }

    /* Shuffle array untuk randomize feed */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /* Render Post Feed */
    renderPostFeed() {
        const postFeed = document.getElementById('postFeed');
        if (!postFeed) return;
        
        const shuffledPosts = this.shuffleArray(this.mockFeedPosts);
        
        postFeed.innerHTML = shuffledPosts.map(post => `
            <div class="feed-post-item" data-id="${post.id}">
                <div class="feed-post-header">
                    <img src="${post.userAvatar}" alt="${post.username}" class="feed-user-avatar">
                    <div class="feed-user-info">
                        <span class="feed-username">${post.username}</span>
                    </div>
                    <button class="feed-post-menu">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                <div class="feed-post-image">
                    <img src="${post.image}" alt="Post ${post.id}" loading="lazy">
                </div>
                <div class="feed-post-actions">
                    <div class="feed-action-left">
                        <button class="feed-action-btn like-btn">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="feed-action-btn">
                            <i class="far fa-comment"></i>
                        </button>
                        <button class="feed-action-btn">
                            <i class="far fa-share-square"></i>
                        </button>
                    </div>
                    <button class="feed-action-btn">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
                <div class="feed-post-stats">
                    <span class="feed-likes">${post.likes} suka</span>
                </div>
                <div class="feed-post-caption">
                    <span class="feed-caption-username">${post.username}</span>
                    <span class="feed-caption-text">Post dari ${post.username}</span>
                </div>
                <button class="feed-view-comments">Lihat semua ${post.comments} komentar</button>
                <div class="feed-post-time">${this.getTimeAgo(post.date)}</div>
            </div>
        `).join('');
        
        this.setupPostFeedInteractions();
    }

    /* Render Conex Feed */
    renderConexFeed() {
        const conexFeed = document.getElementById('conexFeed');
        if (!conexFeed) return;
        
        const shuffledConex = this.shuffleArray(this.mockFeedConex);
        
        conexFeed.innerHTML = shuffledConex.map(conex => `
            <div class="feed-conex-item" data-id="${conex.id}">
                <div class="conex-header">
                    <img src="${conex.userAvatar}" alt="${conex.username}" class="conex-avatar">
                    <div class="conex-info">
                        <div class="conex-username">${conex.username}</div>
                        <div class="conex-date">${conex.timeAgo}</div>
                    </div>
                    <button class="conex-menu">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                <div class="conex-content">${conex.content}</div>
                <div class="conex-stats">
                    <button class="conex-stat-btn">
                        <i class="far fa-heart"></i>
                        <span>${conex.likes}</span>
                    </button>
                    <button class="conex-stat-btn">
                        <i class="far fa-comment"></i>
                        <span>${conex.comments}</span>
                    </button>
                    <button class="conex-stat-btn">
                        <i class="fas fa-share"></i>
                        <span>${conex.shares}</span>
                    </button>
                </div>
            </div>
        `).join('');
        
        this.setupConexFeedInteractions();
    }

    /* Get time ago string */
    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Baru saja';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} menit yang lalu`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam yang lalu`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari yang lalu`;
        return `${Math.floor(seconds / 604800)} minggu yang lalu`;
    }

    /* Setup Post Feed Interactions */
    setupPostFeedInteractions() {
        const likeBtns = document.querySelectorAll('.feed-action-btn.like-btn');
        likeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const icon = btn.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#e74c3c';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                }
            });
        });
        
        const viewCommentBtns = document.querySelectorAll('.feed-view-comments');
        viewCommentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showAlert('Komentar', 'Fitur komentar akan tersedia setelah database terhubung.');
            });
        });
    }

    /* Setup Conex Feed Interactions */
    setupConexFeedInteractions() {
        const statBtns = document.querySelectorAll('.conex-stat-btn');
        statBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const icon = btn.querySelector('i');
                if (icon.classList.contains('fa-heart')) {
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        icon.style.color = '#e74c3c';
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        icon.style.color = '';
                    }
                } else {
                    this.showAlert('Fitur', 'Fitur ini akan tersedia setelah database terhubung.');
                }
            });
        });
    }

    // Screen size breakpoints
    static BREAKPOINTS = {
        MOBILE: 640,
        TABLET: 768
    };

    // Sidebar dimensions
    static SIDEBAR_WIDTH = {
        LEFT_EXPANDED: 250,
        LEFT_COLLAPSED: 60,
        RIGHT_EXPANDED: 300,
        RIGHT_COLLAPSED: 60
    };

    /* Initialize all event listeners and setup components */
    init() {
        const fromProfile = sessionStorage.getItem('fromProfile');
        
        if (fromProfile) {
            if (this.leftSidebar) {
                this.leftSidebar.classList.add('collapsed');
            }
            if (this.rightSidebar) {
                this.rightSidebar.style.display = 'none';
            }
            
            const preCollapseStyle = document.getElementById('pre-collapse-style');
            if (preCollapseStyle) {
                preCollapseStyle.remove();
            }
        }
        
        this.setupSidebarToggles();
        this.setupTabNavigation();
        this.setupConexInput();
        this.setupMenuItems();
        this.setupMobileTopBar();
        this.setupEmojiPicker();
        this.setupPollCreator();
        this.handleResponsive();
        
        if (!fromProfile) {
            this.handleTabletView();
        }
        
        // TAMBAHKAN INI - Render feed saat pertama kali load
        requestAnimationFrame(() => {
            this.initialRenderFeed();
        });
        
        if (fromProfile) {
            this.checkURLParameters();
            sessionStorage.removeItem('fromProfile');
        }
    }

    /* Initial render feed on page load */
    initialRenderFeed() {
        const postFeed = document.getElementById('postFeed');
        const conexFeed = document.getElementById('conexFeed');
        
        if (postFeed) {
            this.renderPostFeed();
        }
        
        if (conexFeed) {
            this.renderConexFeed();
        }
    }

    checkURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const menu = urlParams.get('menu');
        
        if (menu) {
            // Remove URL parameter
            window.history.replaceState({}, '', '/homeumum');
            
            // Show content (sidebar sudah collapsed dari init)
            switch(menu) {
                case 'pencarian':
                    this.showPencarianContentDirect();
                    this.setActiveMenu('Pencarian');
                    break;
                case 'pesan':
                    this.showPesanContentDirect();
                    this.setActiveMenu('Pesan');
                    break;
                case 'notifikasi':
                    this.showNotifikasiContentDirect();
                    this.setActiveMenu('Notifikasi');
                    break;
                case 'buat':
                    this.showBuatContentDirect();
                    this.setActiveMenu('Buat');
                    break;
            }
        }
    }

    /* Show Pesan content - Direct version */
    showPesanContentDirect() {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getPesanTemplate();
            this.setupPesanInteractions();
        }
        this.updateMainContentMargins();
    }

    /* Show Notifikasi content - Direct version */
    showNotifikasiContentDirect() {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getNotifikasiTemplate();
            this.setupNotifikasiInteractions();
        }
        this.updateMainContentMargins();
    }

    /* Show Buat content - Direct version */
    showBuatContentDirect() {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getBuatTemplate();
            this.setupBuatPostFlow();
        }
        this.updateMainContentMargins();
    }

    /* Set active menu by text */
    setActiveMenu(menuText) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const text = item.querySelector('.menu-text')?.textContent.trim();
            if (text === menuText) {
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
            }
        });
    }

    /* Setup sidebar toggle functionality */
    setupSidebarToggles() {
        if (this.leftToggle) {
            this.leftToggle.addEventListener('click', () => this.toggleLeftSidebar());
        }

        if (this.rightToggle) {
            this.rightToggle.addEventListener('click', () => this.toggleRightSidebar());
        }
    }

    /* Toggle left sidebar visibility */
    toggleLeftSidebar() {
        if (!this.leftSidebar) return;

        this.leftSidebar.classList.toggle('collapsed');
        this.updateMainContentMargins();
        this.updateToggleIcon(this.leftToggle, this.leftSidebar.classList.contains('collapsed'));
    }

    /* Toggle right sidebar visibility */
    toggleRightSidebar() {
        if (!this.rightSidebar) return;

        this.rightSidebar.classList.toggle('collapsed');
        this.updateMainContentMargins();
        this.updateToggleIcon(this.rightToggle, this.rightSidebar.classList.contains('collapsed'), true);
    }

    /* Update toggle button icons based on sidebar state */
    updateToggleIcon(toggleBtn, isCollapsed, isRight = false) {
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('i');
        if (!icon) return;

        if (isRight) {
            // Right sidebar: collapsed = arrow left, expanded = arrow right
            icon.className = isCollapsed ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
        } else {
            // Left sidebar: collapsed = arrow right, expanded = arrow left
            icon.className = isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
        }
    }

    /* Update main content margins based on sidebar states */
    updateMainContentMargins() {
        if (!this.mainContent) return;

        // Check if we're on mobile
        if (window.innerWidth <= 640) {
            this.mainContent.style.position = 'relative';
            this.mainContent.style.left = 'auto';
            this.mainContent.style.transform = 'none';
            this.mainContent.style.width = '100%';
            this.mainContent.style.maxWidth = 'none';
            return;
        }

        // Check if we're on tablet
        if (window.innerWidth <= 768) {
            this.mainContent.style.position = 'fixed';
            this.mainContent.style.left = '50%';
            this.mainContent.style.transform = 'translateX(-50%)';
            this.mainContent.style.width = '600px';
            this.mainContent.style.maxWidth = '600px';
            return;
        }

        // Desktop - keep centered regardless of sidebar state
        this.mainContent.style.position = 'fixed';
        this.mainContent.style.left = '50%';
        this.mainContent.style.transform = 'translateX(-50%)';
        this.mainContent.style.width = '600px';
        this.mainContent.style.maxWidth = '600px';
    }

    /* Setup tab navigation functionality */
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, tabButtons, tabContents);
                
                // TAMBAHKAN INI - Re-render feed ketika switch tab
                if (targetTab === 'post') {
                    setTimeout(() => this.renderPostFeed(), 50);
                } else if (targetTab === 'conex') {
                    setTimeout(() => this.renderConexFeed(), 50);
                }
            });
        });
    }

    /* Switch between tabs */
    switchTab(targetTab, tabButtons, tabContents) {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const activeContent = document.getElementById(`${targetTab}Tab`);

        if (activeButton) activeButton.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    }

    /* Setup Conex input functionality */
    setupConexInput() {
        const textarea = document.querySelector('.create-conex textarea');
        const shareBtn = document.querySelector('.share-btn');

        if (textarea && shareBtn) {
            this.setupTextareaInput(textarea, shareBtn);
            this.setupAutoResize(textarea);
            this.setupShareButton(textarea, shareBtn);
        }

        this.setupConexOptions();
    }

    /* Setup textarea input monitoring */
    setupTextareaInput(textarea, shareBtn) {
        textarea.addEventListener('input', () => {
            const hasContent = textarea.value.trim().length > 0;

            if (hasContent) {
                shareBtn.style.opacity = '1';
                shareBtn.disabled = false;
            } else {
                shareBtn.style.opacity = '0.5';
                shareBtn.disabled = true;
            }
        });
    }

    /* Setup textarea auto-resize */
    setupAutoResize(textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        });
    }

    /* Setup share button functionality */
    setupShareButton(textarea, shareBtn) {
        shareBtn.addEventListener('click', () => {
            const content = textarea.value.trim();

            if (content) {
                this.handleConexShare(content);
                this.resetConexInput(textarea, shareBtn);
            }
        });
    }

    /* Setup Conex option buttons */
    setupConexOptions() {
        const emojiBtn = document.querySelector('.option-btn .fa-smile')?.parentElement;
        const pollBtn = document.querySelector('.option-btn .fa-poll')?.parentElement;

        if (emojiBtn) {
            emojiBtn.addEventListener('click', () => this.toggleEmojiPicker());
        }

        if (pollBtn) {
            pollBtn.addEventListener('click', () => this.togglePollCreator());
        }
    }

    /* === EMOJI PICKER FUNCTIONALITY === */
    initEmojiDatabase() {
        return {
            smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴'],
            gestures: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
            people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👱‍♀️', '👱', '👱‍♂️', '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲', '🧑‍🦲', '👨‍🦲', '🧔', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳', '👳‍♂️'],
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗'],
            food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕'],
            travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈', '🛫', '🛬', '🛩'],
            activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸', '🥌', '🎿', '⛷', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺'],
            objects: ['⌚', '📱', '📲', '💻', '⌨', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯'],
            symbols: ['❤', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮', '✝', '☪', '🕉', '☸', '✡', '🔯', '🕎', '☯', '☦', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'],
            flags: ['🏁', '🚩', '🎌', '🏴', '🏳', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫']
        };
    }

    setupEmojiPicker() {
        const emojiPicker = document.getElementById('emojiPicker');
        const closeBtn = document.getElementById('closeEmoji');
        const emojiSearch = document.getElementById('emojiSearch');
        const categoryBtns = document.querySelectorAll('.emoji-category');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideEmojiPicker());
        }

        if (emojiSearch) {
            emojiSearch.addEventListener('input', (e) => this.searchEmoji(e.target.value));
        }

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category');
                this.renderEmojiCategory(category);
            });
        });

        // Initial render
        this.renderEmojiCategory('smileys');

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (emojiPicker && !emojiPicker.contains(e.target) &&
                !e.target.closest('.option-btn .fa-smile')) {
                this.hideEmojiPicker();
            }
        });
    }

    toggleEmojiPicker() {
        const emojiPicker = document.getElementById('emojiPicker');
        if (emojiPicker) {
            const isVisible = emojiPicker.style.display !== 'none';
            emojiPicker.style.display = isVisible ? 'none' : 'flex';

            // Hide poll creator if open
            if (!isVisible) {
                this.hidePollCreator();
            }
        }
    }

    hideEmojiPicker() {
        const emojiPicker = document.getElementById('emojiPicker');
        if (emojiPicker) {
            emojiPicker.style.display = 'none';
        }
    }

    renderEmojiCategory(category) {
        const emojiGrid = document.getElementById('emojiGrid');
        if (!emojiGrid) return;

        const emojis = this.emojiDatabase[category] || [];
        emojiGrid.innerHTML = '';

        emojis.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'emoji-item';
            button.textContent = emoji;
            button.addEventListener('click', () => this.insertEmoji(emoji));
            emojiGrid.appendChild(button);
        });
    }

    searchEmoji(query) {
        const emojiGrid = document.getElementById('emojiGrid');
        if (!emojiGrid || !query.trim()) {
            // If empty search, show current category
            const activeCategory = document.querySelector('.emoji-category.active');
            if (activeCategory) {
                this.renderEmojiCategory(activeCategory.getAttribute('data-category'));
            }
            return;
        }

        // Flatten all emojis for search
        const allEmojis = Object.values(this.emojiDatabase).flat();
        emojiGrid.innerHTML = '';

        // Simple display (in real app, you'd match against emoji names)
        allEmojis.slice(0, 80).forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'emoji-item';
            button.textContent = emoji;
            button.addEventListener('click', () => this.insertEmoji(emoji));
            emojiGrid.appendChild(button);
        });
    }

    insertEmoji(emoji) {
        const textarea = document.querySelector('.create-conex textarea');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;

            textarea.value = text.substring(0, start) + emoji + text.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
            textarea.focus();

            // Trigger input event to update button state
            textarea.dispatchEvent(new Event('input'));
        }

        this.hideEmojiPicker();
    }

    /* === POLL CREATOR FUNCTIONALITY === */
    setupPollCreator() {
        const pollCreator = document.getElementById('pollCreator');
        const closeBtn = document.getElementById('closePoll');
        const addOptionBtn = document.getElementById('addPollOption');
        const applyBtn = document.getElementById('applyPoll');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hidePollCreator());
        }

        if (addOptionBtn) {
            addOptionBtn.addEventListener('click', () => this.addPollOption());
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyPoll());
        }

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (pollCreator && !pollCreator.contains(e.target) &&
                !e.target.closest('.option-btn .fa-poll')) {
                this.hidePollCreator();
            }
        });
    }

    togglePollCreator() {
        const pollCreator = document.getElementById('pollCreator');
        if (pollCreator) {
            const isVisible = pollCreator.style.display !== 'none';
            pollCreator.style.display = isVisible ? 'none' : 'block';

            // Hide emoji picker if open
            if (!isVisible) {
                this.hideEmojiPicker();
            }
        }
    }

    hidePollCreator() {
        const pollCreator = document.getElementById('pollCreator');
        if (pollCreator) {
            pollCreator.style.display = 'none';
        }
    }

    addPollOption() {
        const container = document.querySelector('.poll-options-container');
        if (!container) return;

        const currentOptions = container.querySelectorAll('.poll-option').length;

        if (currentOptions >= 6) {
            this.showAlert('Maksimal Opsi', 'Anda hanya dapat menambahkan maksimal 6 opsi.');
            return;
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'poll-option';
        input.placeholder = `Opsi ${currentOptions + 1}`;
        input.maxLength = 50;

        container.appendChild(input);
    }

    applyPoll() {
        const options = Array.from(document.querySelectorAll('.poll-option'))
            .map(input => input.value.trim())
            .filter(value => value !== '');

        if (options.length < 2) {
            this.showAlert('Opsi Tidak Cukup', 'Poll harus memiliki minimal 2 opsi.');
            return;
        }

        const multiple = document.getElementById('pollMultiple')?.checked || false;
        const duration = document.getElementById('pollDuration')?.value || '7';

        this.pollData = {
            options: options,
            allowMultiple: multiple,
            duration: parseInt(duration),
            createdAt: new Date()
        };

        this.renderPollIndicator();
        this.hidePollCreator();
        this.updateShareButtonState();
    }

    renderPollIndicator() {
        // Remove existing indicator
        const existing = document.querySelector('.poll-indicator');
        if (existing) {
            existing.remove();
        }

        if (!this.pollData) return;

        const container = document.querySelector('.input-container');
        if (!container) return;

        const indicator = document.createElement('div');
        indicator.className = 'poll-indicator';
        indicator.innerHTML = `
        <i class="fas fa-poll"></i>
        <span>Poll dengan ${this.pollData.options.length} opsi</span>
        <button class="remove-poll" title="Hapus Poll">
            <i class="fas fa-times"></i>
        </button>
    `;

        const removeBtn = indicator.querySelector('.remove-poll');
        removeBtn.addEventListener('click', () => this.removePoll());

        container.appendChild(indicator);
    }

    removePoll() {
        this.pollData = null;
        const indicator = document.querySelector('.poll-indicator');
        if (indicator) {
            indicator.remove();
        }
        this.updateShareButtonState();
    }

    /* === UPDATE SHARE BUTTON STATE === */
    updateShareButtonState() {
        const textarea = document.querySelector('.create-conex textarea');
        const shareBtn = document.querySelector('.share-btn');

        if (!shareBtn) return;

        const hasText = textarea?.value.trim().length > 0;
        const hasPoll = this.pollData !== null;

        const hasContent = hasText || hasPoll;

        if (hasContent) {
            shareBtn.style.opacity = '1';
            shareBtn.disabled = false;
        } else {
            shareBtn.style.opacity = '0.5';
            shareBtn.disabled = true;
        }
    }

    /* === UPDATE HANDLE CONEX SHARE === */
    handleConexShare(content) {
        // Simulate sharing (replace with actual API call)
        this.showAlert('Conex akan dibagikan!', 'Database belum terhubung.');
        console.log('Sharing Conex:', content);
    }

    /* Reset Conex input to initial state */
    resetConexInput(textarea, shareBtn) {
        textarea.value = '';
        textarea.style.height = 'auto';
        shareBtn.style.opacity = '0.5';
        shareBtn.disabled = true;
    }

    /* Setup menu item interactions */
    setupMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const menuText = item.querySelector('.menu-text')?.textContent || 'Menu';
                
                // Remove active class from all menu items
                document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                
                // Handle different menu items
                switch(menuText.trim()) {
                    case 'Beranda':
                        this.showBerandaContent();
                        break;
                    case 'Pencarian':
                        this.showPencarianContent();
                        break;
                    case 'Pesan':
                        this.showPesanContent();
                        break;
                    case 'Notifikasi':
                        this.showNotifikasiContent();
                        break;
                    case 'Buat':
                        this.showBuatContent();
                        break;
                    case 'Profil':
                        window.location.href = '/profil';
                        break;
                    case 'Lainnya':
                        window.location.href = '/setting';
                        break;
                    default:
                        this.showAlert(`${menuText}`, 'Fitur akan tersedia setelah database terhubung.');
                }
            });
        });
    }

    /* Setup Mobile Top Bar interactions */
    setupMobileTopBar() {
        const notifIcon = document.querySelector('.mobile-top-actions .fa-bell');
        const messageIcon = document.querySelector('.mobile-top-actions .fa-envelope');
        
        if (notifIcon) {
            notifIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotifikasiContent();
                // Set active menu
                this.setActiveMenu('Notifikasi');
            });
            
            // Tambahkan cursor pointer
            notifIcon.style.cursor = 'pointer';
            notifIcon.parentElement.style.cursor = 'pointer';
        }
        
        if (messageIcon) {
            messageIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPesanContent();
                // Set active menu
                this.setActiveMenu('Pesan');
            });
            
            // Tambahkan cursor pointer
            messageIcon.style.cursor = 'pointer';
            messageIcon.parentElement.style.cursor = 'pointer';
        }
    }

    /* Show Beranda content */
    showBerandaContent() {
        this.hideAllMenuContents();
        
        this.expandLeftSidebar();
        this.showRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getBerandaTemplate();
            this.setupTabNavigation();
            this.setupConexInput();
            this.setupEmojiPicker();
            this.setupPollCreator();
            
            // TAMBAHKAN INI - Render feed
            this.renderPostFeed();
            this.renderConexFeed();
        }
        
        this.updateMainContentMargins();
    }

    /* Show Pencarian content */
    showPencarianContent() {
        this.hideAllMenuContents();
        this.collapseLeftSidebar();
        this.hideRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getPencarianTemplate();
            this.setupPencarianSearch();
        }
        
        this.updateMainContentMargins();
    }


    /* Show Pesan content */
    showPesanContent() {
        this.hideAllMenuContents();
        this.collapseLeftSidebar();
        this.hideRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getPesanTemplate();
            this.setupPesanInteractions();
        }
        
        this.updateMainContentMargins();
    }

    /* Show Notifikasi content */
    showNotifikasiContent() {
        this.hideAllMenuContents();
        this.collapseLeftSidebar();
        this.hideRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getNotifikasiTemplate();
            this.setupNotifikasiInteractions();
        }
        
        this.updateMainContentMargins();
    }

    /* Show Buat content */
    showBuatContent() {
        this.hideAllMenuContents();
        this.collapseLeftSidebar();
        this.hideRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getBuatTemplate();
            this.setupBuatPostFlow();
        }
        
        this.updateMainContentMargins();
    }

    /* Hide all menu-specific contents */
    hideAllMenuContents() {
    }

    /* Hide right sidebar */
    hideRightSidebar() {
        if (this.rightSidebar) {
            this.rightSidebar.style.display = 'none';
        }
    }

    /* Show right sidebar */
        showRightSidebar() {
        if (this.rightSidebar) {
            this.rightSidebar.style.display = 'flex';
            this.rightSidebar.style.flexDirection = 'column';
            
            // Pastikan right sidebar tidak collapsed
            if (this.rightSidebar.classList.contains('collapsed')) {
                this.rightSidebar.classList.remove('collapsed');
                this.updateToggleIcon(this.rightToggle, false, true);
            }
        }
    }

    /* Collapse left sidebar */
    collapseLeftSidebar() {
        if (this.leftSidebar && !this.leftSidebar.classList.contains('collapsed')) {
            this.leftSidebar.classList.add('collapsed');
            this.updateToggleIcon(this.leftToggle, true);
        }
    }

    /* Expand left sidebar */
    expandLeftSidebar() {
        if (this.leftSidebar && this.leftSidebar.classList.contains('collapsed')) {
            this.leftSidebar.classList.remove('collapsed');
            this.updateToggleIcon(this.leftToggle, false);
            this.updateMainContentMargins();
        }
    }

    /* === TEMPLATE METHODS === */
    /* Get Beranda template - original content */
    getBerandaTemplate() {
        return `
            <!-- Tab Navigation -->
            <div class="tab-navigation">
                <button class="tab-button active" data-tab="post">
                    <i class="fas fa-image"></i>
                    Post
                </button>
                <button class="tab-button" data-tab="conex">
                    <i class="fas fa-comment"></i>
                    Connex
                </button>
            </div>

            <!-- Post Tab Content -->
            <div class="tab-content active" id="postTab">
                <div class="content-placeholder">
                    <div class="placeholder-icon">
                        <i class="fas fa-image"></i>
                    </div>
                    <h3>Tidak Ada Post</h3>
                    <p>Belum ada konten post untuk ditampilkan.</p>
                </div>
            </div>

            <!-- Conex Tab Content -->
            <div class="tab-content" id="conexTab">
                <!-- Create Conex Input -->
                <div class="create-conex">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="input-container">
                        <textarea placeholder="Ada cerita yang ingin dibagikan?" rows="3"></textarea>
                        <div class="conex-actions">
                            <div class="conex-options">
                                <button class="option-btn" title="Tambah Emoji">
                                    <i class="fas fa-smile"></i>
                                </button>
                                <button class="option-btn" title="Buat Poll">
                                    <i class="fas fa-poll"></i>
                                </button>

                                <!-- Emoji Picker -->
                                <div class="emoji-picker" id="emojiPicker" style="display: none;">
                                    <div class="emoji-header">
                                        <h4>Pilih Emoji</h4>
                                        <button class="close-emoji" id="closeEmoji">&times;</button>
                                    </div>
                                    <div class="emoji-search">
                                        <input type="text" placeholder="Cari emoji..." id="emojiSearch">
                                    </div>
                                    <div class="emoji-categories">
                                        <button class="emoji-category active" data-category="smileys">😊</button>
                                        <button class="emoji-category" data-category="gestures">👋</button>
                                        <button class="emoji-category" data-category="people">👨</button>
                                        <button class="emoji-category" data-category="animals">🐶</button>
                                        <button class="emoji-category" data-category="food">🍕</button>
                                        <button class="emoji-category" data-category="travel">✈️</button>
                                        <button class="emoji-category" data-category="activities">⚽</button>
                                        <button class="emoji-category" data-category="objects">💡</button>
                                        <button class="emoji-category" data-category="symbols">❤️</button>
                                        <button class="emoji-category" data-category="flags">🚩</button>
                                    </div>
                                    <div class="emoji-grid" id="emojiGrid"></div>
                                </div>

                                <!-- Poll Creator -->
                                <div class="poll-creator" id="pollCreator" style="display: none;">
                                    <div class="poll-header">
                                        <h4>Buat Polling</h4>
                                        <button class="close-poll" id="closePoll">&times;</button>
                                    </div>
                                    <div class="poll-options-container">
                                        <input type="text" class="poll-option" placeholder="Opsi 1" maxlength="50">
                                        <input type="text" class="poll-option" placeholder="Opsi 2" maxlength="50">
                                    </div>
                                    <button class="add-poll-option" id="addPollOption">
                                        <i class="fas fa-plus"></i> Tambah Opsi
                                    </button>
                                    <div class="poll-settings">
                                        <label>
                                            <input type="checkbox" id="pollMultiple"> Izinkan pilihan ganda
                                        </label>
                                        <div class="poll-duration">
                                            <label>Durasi:</label>
                                            <select id="pollDuration">
                                                <option value="1">1 Hari</option>
                                                <option value="3">3 Hari</option>
                                                <option value="7" selected>7 Hari</option>
                                                <option value="14">14 Hari</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button class="apply-poll-btn" id="applyPoll">Terapkan Poll</button>
                                </div>
                            </div>
                            <button class="share-btn" disabled>Bagikan</button>
                        </div>
                    </div>
                </div>
                <div class="content-separator"></div>
                <div class="content-placeholder">
                    <div class="placeholder-icon">
                        <i class="fas fa-comment"></i>
                    </div>
                    <h3>Tidak Ada Connex</h3>
                    <p>Belum ada konten connex untuk ditampilkan.</p>
                </div>
            </div>
        `;
    }

    /* Get Pencarian template */
    getPencarianTemplate() {
        return `
            <div class="search-content">
                <div class="search-header">
                    <h2>Pencarian</h2>
                </div>
                
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Cari akun..." autocomplete="off">
                    <button class="clear-search" id="clearSearch" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="search-results" id="searchResults">
                    <div class="search-placeholder">
                        <i class="fas fa-search"></i>
                        <p>Cari akun untuk mulai</p>
                    </div>
                </div>

                <div class="recent-searches" id="recentSearches">
                    <div class="section-header">
                        <h3>Pencarian Terakhir</h3>
                        <button class="clear-all-btn" id="clearAllSearches">Hapus Semua</button>
                    </div>
                    <div class="recent-list">
                        <p class="no-recent">Belum ada pencarian terakhir</p>
                    </div>
                </div>
            </div>
        `;
    }

    /* Get Pesan template */
    getPesanTemplate() {
        return `
            <div class="message-content">
                <div class="message-header">
                    <h2>Pesan</h2>
                    <button class="new-message-btn" title="Pesan Baru">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>

                <div class="message-search">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Cari pesan..." id="messageSearch">
                </div>

                <div class="message-list" id="messageList">
                    <!-- Sample messages for demo -->
                    <div class="message-item">
                        <div class="message-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="message-info">
                            <div class="message-user">
                                <span class="message-name">Admin PMM Connect</span>
                                <span class="message-time">2 jam lalu</span>
                            </div>
                            <div class="message-preview">
                                <span class="message-text">Selamat datang di PMM Connect! 🎉</span>
                            </div>
                        </div>
                        <div class="message-unread">1</div>
                    </div>

                    <div class="message-placeholder" style="display: none;">
                        <i class="fas fa-envelope"></i>
                        <h3>Pesan Anda</h3>
                        <p>Kirim pesan pribadi ke teman atau grup.</p>
                        <button class="send-message-btn">Kirim Pesan</button>
                    </div>
                </div>
            </div>
        `;
    }

    /* Get Notifikasi template */
    getNotifikasiTemplate() {
        return `
            <div class="notification-content">
                <div class="notification-header">
                    <h2>Notifikasi</h2>
                </div>

                <div class="notification-tabs">
                    <button class="notif-tab active" data-type="all">Semua</button>
                    <button class="notif-tab" data-type="mentions">Sebutan</button>
                </div>

                <div class="notification-list" id="notificationList">
                    <!-- Welcome notification -->
                    <div class="notification-item unread">
                        <div class="notification-icon welcome">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="notification-content-text">
                            <p><strong>Selamat datang di PMM Connect!</strong></p>
                            <p class="notification-detail">Mulai berbagi cerita dan terhubung dengan teman-teman Anda.</p>
                            <span class="notification-time">Baru saja</span>
                        </div>
                    </div>

                    <div class="notification-item">
                        <div class="notification-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="notification-content-text">
                            <p><strong>admin_pmm</strong> mulai mengikuti Anda.</p>
                            <span class="notification-time">5 menit lalu</span>
                        </div>
                        <button class="follow-back-btn">Ikuti Balik</button>
                    </div>

                    <div class="notification-placeholder" style="display: none;">
                        <i class="fas fa-bell"></i>
                        <h3>Tidak ada notifikasi</h3>
                        <p>Notifikasi Anda akan muncul di sini.</p>
                    </div>
                </div>
            </div>
        `;
    }

    /* Get Buat template */
    getBuatTemplate() {
        return `
            <div class="create-post-content">
                <div class="create-header">
                    <button class="back-btn" id="backFromCreate">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2>Buat Post Baru</h2>
                    <button class="next-btn" id="nextToCaption" style="display: none;">
                        Selanjutnya
                    </button>
                </div>

                <!-- Step 1: Image Selection -->
                <div class="create-step" id="stepImageSelect">
                    <div class="image-upload-area">
                        <input type="file" id="imageInput" accept="image/*" multiple style="display: none;">
                        <div class="upload-placeholder" id="uploadPlaceholder">
                            <i class="fas fa-images"></i>
                            <h3>Pilih foto dari perangkat Anda</h3>
                            <button class="select-images-btn" id="selectImagesBtn">Pilih Foto</button>
                        </div>
                        <div class="image-preview-container" id="imagePreviewContainer" style="display: none;">
                            <div class="selected-images" id="selectedImages"></div>
                            <button class="add-more-btn" id="addMoreImages">
                                <i class="fas fa-plus"></i> Tambah Foto
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Caption & Location -->
                <div class="create-step" id="stepCaption" style="display: none;">
                    <div class="caption-container">
                        <div class="selected-image-display" id="selectedImageDisplay"></div>
                        <div class="caption-form">
                            <div class="form-group">
                                <textarea id="postCaption" placeholder="Tulis caption..." maxlength="2200"></textarea>
                                <span class="char-count">0 / 2200</span>
                            </div>
                            <div class="form-group location-group">
                                <i class="fas fa-map-marker-alt"></i>
                                <input type="text" id="postLocation" placeholder="Tambahkan lokasi">
                            </div>
                            <button class="publish-btn" id="publishPost">Bagikan</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /* === SETUP METHODS FOR EACH MENU === */
    setupPencarianSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        const searchResults = document.getElementById('searchResults');
        const clearAllBtn = document.getElementById('clearAllSearches');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                
                if (clearSearch) {
                    clearSearch.style.display = query ? 'flex' : 'none';
                }

                if (query.length > 0) {
                    this.performSearch(query, searchResults);
                } else {
                    searchResults.innerHTML = `
                        <div class="search-placeholder">
                            <i class="fas fa-search"></i>
                            <p>Cari akun untuk mulai</p>
                        </div>
                    `;
                }
            });

            searchInput.focus();
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                clearSearch.style.display = 'none';
                searchResults.innerHTML = `
                    <div class="search-placeholder">
                        <i class="fas fa-search"></i>
                        <p>Cari akun untuk mulai</p>
                    </div>
                `;
                searchInput.focus();
            });
        }

        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                const recentList = document.querySelector('.recent-list');
                if (recentList) {
                    recentList.innerHTML = '<p class="no-recent">Belum ada pencarian terakhir</p>';
                }
            });
        }
    }

    /* Perform search (mock data) */
    performSearch(query, resultsContainer) {
        // Simulate search delay
        resultsContainer.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Mencari...</div>';

        setTimeout(() => {
            // Mock search results
            const mockResults = [
                { username: 'admin_pmm', name: 'Admin PMM Connect', verified: true },
                { username: 'user_demo', name: 'Demo User', verified: false },
                { username: 'user_umum', name: 'Umum User', verified: false },
                { username: 'pmm_connect', name: 'PMM Connect Official', verified: true }
            ].filter(user => 
                user.username.toLowerCase().includes(query.toLowerCase()) ||
                user.name.toLowerCase().includes(query.toLowerCase())
            );

            if (mockResults.length > 0) {
                resultsContainer.innerHTML = mockResults.map(user => `
                    <div class="search-result-item">
                        <div class="result-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="result-info">
                            <div class="result-name">
                                ${user.name}
                                ${user.verified ? '<i class="fas fa-check-circle verified"></i>' : ''}
                            </div>
                            <div class="result-username">@${user.username}</div>
                        </div>
                        <button class="follow-btn">Ikuti</button>
                    </div>
                `).join('');
            } else {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>Tidak ada hasil untuk "${query}"</p>
                    </div>
                `;
            }
        }, 500);
    }

    /* Setup Pesan interactions */
    setupPesanInteractions() {
        const messageItems = document.querySelectorAll('.message-item');
        const newMessageBtn = document.querySelector('.new-message-btn');
        const sendMessageBtn = document.querySelector('.send-message-btn');

        messageItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showAlert('Fitur Pesan', 'Fitur chat akan tersedia setelah database terhubung.');
            });
        });

        if (newMessageBtn) {
            newMessageBtn.addEventListener('click', () => {
                this.showAlert('Pesan Baru', 'Fitur pesan baru akan tersedia setelah database terhubung.');
            });
        }

        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => {
                this.showAlert('Kirim Pesan', 'Fitur kirim pesan akan tersedia setelah database terhubung.');
            });
        }
    }

    /* Setup Notifikasi interactions */
    setupNotifikasiInteractions() {
        const notifTabs = document.querySelectorAll('.notif-tab');
        const followBtns = document.querySelectorAll('.follow-back-btn');

        notifTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                notifTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const type = tab.getAttribute('data-type');
                this.filterNotifications(type);
            });
        });

        followBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.textContent = 'Mengikuti';
                btn.classList.add('following');
                btn.disabled = true;
            });
        });
    }

    /* Filter notifications */
    filterNotifications(type) {
        // This would filter based on type in real implementation
        console.log('Filter notifications:', type);
    }

    /* Setup Buat post flow */
    setupBuatPostFlow() {
        const imageInput = document.getElementById('imageInput');
        const selectImagesBtn = document.getElementById('selectImagesBtn');
        const addMoreBtn = document.getElementById('addMoreImages');
        const nextBtn = document.getElementById('nextToCaption');
        const backBtn = document.getElementById('backFromCreate');
        const publishBtn = document.getElementById('publishPost');
        const postCaption = document.getElementById('postCaption');

        // Initialize array untuk tracking selected files
        this.selectedImageFiles = [];

        if (selectImagesBtn) {
            selectImagesBtn.addEventListener('click', () => {
                imageInput?.click();
            });
        }

        if (addMoreBtn) {
            addMoreBtn.addEventListener('click', () => {
                imageInput?.click();
            });
        }

        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                const newFiles = Array.from(e.target.files);
                
                if (newFiles.length > 0) {
                    // PERBAIKAN: Tambahkan ke array existing, bukan replace
                    if (this.selectedImageFiles.length === 0) {
                        // First time upload
                        this.selectedImageFiles = newFiles;
                    } else {
                        // Adding more files
                        this.selectedImageFiles = [...this.selectedImageFiles, ...newFiles];
                    }
                    
                    this.displaySelectedImages(this.selectedImageFiles);
                    
                    // Show next button
                    if (nextBtn) {
                        nextBtn.style.display = 'block';
                    }
                    
                    // Reset input value agar bisa pilih file yang sama lagi
                    imageInput.value = '';
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.showCaptionStep(this.selectedImageFiles);
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                const stepCaption = document.getElementById('stepCaption');
                const stepImageSelect = document.getElementById('stepImageSelect');
                
                if (stepCaption && stepCaption.style.display !== 'none') {
                    // Go back to image selection
                    stepCaption.style.display = 'none';
                    stepImageSelect.style.display = 'block';
                    if (nextBtn) {
                        nextBtn.style.display = 'block';
                        nextBtn.textContent = 'Selanjutnya';
                    }
                } else {
                    // Go back to beranda
                    this.resetBuatPost();
                    this.showBerandaContent();
                    this.setActiveMenu('Beranda');
                }
            });
        }

        if (postCaption) {
            postCaption.addEventListener('input', (e) => {
                const charCount = document.querySelector('.char-count');
                if (charCount) {
                    charCount.textContent = `${e.target.value.length} / 2200`;
                }
            });
        }

        if (publishBtn) {
            publishBtn.addEventListener('click', () => {
                this.handlePublishPost(this.selectedImageFiles);
            });
        }
    }

    /* Render PMM image previews */
    renderPmmImagePreviews(images, container) {
        if (!container) return;
        
        container.innerHTML = '';
        
        images.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'pmm-preview-item';
                wrapper.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button class="pmm-remove-image" data-index="${index}" title="Hapus foto">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                const removeBtn = wrapper.querySelector('.pmm-remove-image');
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removePmmImage(index);
                });
                
                container.appendChild(wrapper);
            };
            reader.readAsDataURL(file);
        });
    }

    /* Remove PMM image */
    removePmmImage(index) {
        if (!this.pmmSelectedImages) return;
        
        this.pmmSelectedImages.splice(index, 1);
        
        const container = document.getElementById('pmmImagesPreview');
        this.renderPmmImagePreviews(this.pmmSelectedImages, container);
    }

    /* Reset Buat Post state */
    resetBuatPost() {
        this.selectedImageFiles = [];
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.value = '';
        }
    }

    /* Display selected images */
    displaySelectedImages(files) {
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const selectedImages = document.getElementById('selectedImages');

        if (!uploadPlaceholder || !imagePreviewContainer || !selectedImages) return;

        // Hide placeholder, show preview container
        uploadPlaceholder.style.display = 'none';
        imagePreviewContainer.style.display = 'block';

        // Clear existing display
        selectedImages.innerHTML = '';
        
        // Render all images
        files.forEach((file, index) => {
            this.renderImagePreview(file, index, selectedImages);
        });
    }

    /* Render single image preview */
    renderImagePreview(file, index, container) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'preview-image';
            imageWrapper.setAttribute('data-index', index);
            imageWrapper.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button class="remove-image" data-index="${index}" title="Hapus foto">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            container.appendChild(imageWrapper);
            
            // Setup remove button
            const removeBtn = imageWrapper.querySelector('.remove-image');
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeSelectedImage(index);
            });
        };
        
        reader.readAsDataURL(file);
    }

    /* Remove selected image by index */
    removeSelectedImage(index) {
        // Validate index
        if (index < 0 || index >= this.selectedImageFiles.length) return;
        
        // Remove from array
        this.selectedImageFiles.splice(index, 1);
        
        // Check if there are remaining images
        if (this.selectedImageFiles.length > 0) {
            this.updateImagePreview();
        } else {
            this.resetToUploadPlaceholder();
        }
    }

    /* Update image preview after removal */
    updateImagePreview() {
        const selectedImages = document.getElementById('selectedImages');
        if (!selectedImages) return;
        
        // Clear and re-render
        selectedImages.innerHTML = '';
        
        this.selectedImageFiles.forEach((file, index) => {
            this.renderImagePreview(file, index, selectedImages);
        });
    }

    /* Reset to upload placeholder when no images */
    resetToUploadPlaceholder() {
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const nextBtn = document.getElementById('nextToCaption');
        
        if (imagePreviewContainer) {
            imagePreviewContainer.style.display = 'none';
        }
        
        if (uploadPlaceholder) {
            uploadPlaceholder.style.display = 'block';
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        // Reset file input
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.value = '';
        }
    }

    /* Show caption step */
    showCaptionStep(files) {
        const stepImageSelect = document.getElementById('stepImageSelect');
        const stepCaption = document.getElementById('stepCaption');
        const nextBtn = document.getElementById('nextToCaption');
        const selectedImageDisplay = document.getElementById('selectedImageDisplay');

        if (stepImageSelect && stepCaption && nextBtn) {
            stepImageSelect.style.display = 'none';
            stepCaption.style.display = 'block';
            nextBtn.style.display = 'none';

            // Display all selected images using grid
            if (selectedImageDisplay && files.length > 0) {
                // Ubah struktur untuk grid layout
                selectedImageDisplay.innerHTML = '';
                
                files.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = `Post image ${index + 1}`;
                        selectedImageDisplay.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    }

    /* Handle publish post */
    handlePublishPost(files) {
        const caption = document.getElementById('postCaption')?.value || '';
        const location = document.getElementById('postLocation')?.value || '';

        this.showAlert('Post Dibuat!', 'Database belum terhubung. Post akan dipublikasikan setelah integrasi database.');
        
        console.log('Publishing post:', {
            filesCount: files.length,
            caption,
            location
        });

        // Reset Buat Post state
        this.resetBuatPost();
        
        // Return to beranda
        this.showBerandaContent();
        this.setActiveMenu('Beranda');
    }

    /* Handle responsive behavior */
    handleResponsive() {
        window.addEventListener('resize', () => {
            this.updateMainContentMargins();
            this.handleMobileView();
            this.handleTabletView();
        });

        // Initial check
        this.handleMobileView();
        this.handleTabletView();
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
            
            if (this.rightSidebar && !this.rightSidebar.classList.contains('collapsed')) {
                this.rightSidebar.classList.add('collapsed');
                this.updateToggleIcon(this.rightToggle, true, true);
            }
        }
    }

    /* Handle mobile view adjustments */
    handleMobileView() {
        const isMobile = window.innerWidth <= 640;
        const toggleButtons = document.querySelectorAll('.sidebar-toggle');
        const mobileTopBar = document.querySelector('.mobile-top-bar');

        toggleButtons.forEach(btn => {
            btn.style.display = isMobile ? 'none' : 'flex';
        });

        // Tampilkan/sembunyikan mobile top bar
        if (mobileTopBar) {
            mobileTopBar.style.display = isMobile ? 'flex' : 'none';
        }
    }

    /* Show alert messages */
    showAlert(title, message = '') {
        const alertText = message ? `${title}\n${message}` : title;
        alert(alertText);
    }

    /* Utility method to get current screen size category */
    getScreenSize() {
        const width = window.innerWidth;
        if (width <= SidebarManager.BREAKPOINTS.MOBILE) return 'mobile';
        if (width <= SidebarManager.BREAKPOINTS.TABLET) return 'tablet';
        return 'desktop';
    }
}

/* Utility functions for future database integration */
class DatabasePlaceholder {
    /* Simulate fetching user profile */
    static async fetchUserProfile() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    name: 'Nama Pengguna',
                    username: '@username',
                    avatar: null
                });
            }, 1000);
        });
    }

    /* Simulate fetching posts */
    static async fetchPosts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([]);
            }, 1000);
        });
    }

    /* Simulate fetching suggestions */
    static async fetchSuggestions() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([]);
            }, 1000);
        });
    }
}

/* Initialize application when DOM is loaded */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sidebar manager
    const sidebarManager = new SidebarManager();

    // Log initialization
    console.log('Social Media App initialized');
    console.log('Screen size:', sidebarManager.getScreenSize());

    // Setup keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Toggle left sidebar with Ctrl/Cmd + [
        if ((e.ctrlKey || e.metaKey) && e.key === '[') {
            e.preventDefault();
            sidebarManager.toggleLeftSidebar();
        }

        // Toggle right sidebar with Ctrl/Cmd + ]
        if ((e.ctrlKey || e.metaKey) && e.key === ']') {
            e.preventDefault();
            sidebarManager.toggleRightSidebar();
        }

        // Switch tabs with Ctrl/Cmd + 1/2
        if ((e.ctrlKey || e.metaKey) && (e.key === '1' || e.key === '2')) {
            e.preventDefault();
            const tab = e.key === '1' ? 'post' : 'conex';
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');
            sidebarManager.switchTab(tab, tabButtons, tabContents);
        }
    });
});