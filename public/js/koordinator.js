/* Handles sidebar toggling, navigation, and interactive elements for Koordinator Dashboard */
class KoordinatorManager {
    constructor() {
        this.leftSidebar = document.getElementById('leftSidebar');
        this.rightSidebar = document.getElementById('rightSidebar');
        this.mainContent = document.getElementById('mainContent');
        this.leftToggle = document.getElementById('leftToggle');
        this.rightToggle = document.getElementById('rightToggle');
        this.currentFilter = 'semua';
        this.init();
    }

    static BREAKPOINTS = {
        MOBILE: 640,
        TABLET: 768
    };

    /* Initialize all event listeners and setup components */
    init() {
        this.setupSidebarToggles();
        this.setupMenuItems();
        this.setupMobileTopBar();
        this.handleResponsive();
        this.handleTabletView();
        this.handleQueryParameters();
    }

    /* Handle query parameters on page load */
    handleQueryParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const menu = urlParams.get('menu');
        
        if (menu) {
            switch(menu) {
                case 'laporan':
                    this.showLaporanContent();
                    this.setActiveMenu('Laporan Mahasiswa');
                    break;
                case 'data':
                    this.showDataMahasiswaContent();
                    this.setActiveMenu('Data Mahasiswa');
                    break;
                case 'pesan':
                    this.showPesanContent();
                    this.setActiveMenu('Pesan');
                    break;
                case 'notifikasi':
                    this.showNotifikasiContent();
                    this.setActiveMenu('Notifikasi');
                    break;
                default:
                    // Tetap di dashboard jika menu tidak dikenali
                    this.showDashboardContent();
            }
        }
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
            icon.className = isCollapsed ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
        } else {
            icon.className = isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
        }
    }

    /* Update main content margins based on sidebar states */
    updateMainContentMargins() {
        if (!this.mainContent) return;

        if (window.innerWidth <= 640) {
            this.mainContent.style.position = 'relative';
            this.mainContent.style.left = 'auto';
            this.mainContent.style.transform = 'none';
            this.mainContent.style.width = '100%';
            this.mainContent.style.maxWidth = 'none';
            return;
        }

        if (window.innerWidth <= 768) {
            this.mainContent.style.position = 'fixed';
            this.mainContent.style.left = '50%';
            this.mainContent.style.transform = 'translateX(-50%)';
            this.mainContent.style.width = '600px';
            this.mainContent.style.maxWidth = '600px';
            return;
        }

        this.mainContent.style.position = 'fixed';
        this.mainContent.style.left = '50%';
        this.mainContent.style.transform = 'translateX(-50%)';
        this.mainContent.style.width = '600px';
        this.mainContent.style.maxWidth = '600px';
    }

    /* Setup menu item interactions */
    setupMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const menuText = item.querySelector('.menu-text')?.textContent || 'Menu';
                
                document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                
                switch(menuText.trim()) {
                    case 'Dashboard':
                        this.showDashboardContent();
                        break;
                    case 'Laporan Mahasiswa':
                        this.showLaporanContent();
                        break;
                    case 'Data Mahasiswa':
                        this.showDataMahasiswaContent();
                        break;
                    case 'Pesan':
                        this.showPesanContent();
                        break;
                    case 'Notifikasi':
                        this.showNotifikasiContent();
                        break;
                    case 'Profil':
                        window.location.href = '/profil';
                        break;
                    case 'Lainnya':
                        window.location.href = '/setting'; // Redirect ke halaman setting seperti homeumum
                        break;
                    default:
                        this.showAlert(`${menuText}`, 'Fitur akan tersedia setelah database terhubung.');
                }
            });
        });

        // Setup quick action buttons
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.querySelector('span')?.textContent;
                if (text === 'Lihat Laporan Baru') {
                    this.showLaporanContent();
                    this.setActiveMenu('Laporan Mahasiswa');
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
                this.setActiveMenu('Notifikasi');
            });
            
            notifIcon.style.cursor = 'pointer';
            notifIcon.parentElement.style.cursor = 'pointer';
        }
        
        if (messageIcon) {
            messageIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPesanContent();
                this.setActiveMenu('Pesan');
            });
            
            messageIcon.style.cursor = 'pointer';
            messageIcon.parentElement.style.cursor = 'pointer';
        }
    }

    /* Show Dashboard content */
    showDashboardContent() {
        this.expandLeftSidebar();
        this.showRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getDashboardTemplate();
            this.setupMenuItems(); // Reinitialize menu items
        }
        
        this.updateMainContentMargins();
    }

    /* Show Laporan Mahasiswa content */
    showLaporanContent() {
        this.collapseLeftSidebar();
        this.hideRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getLaporanTemplate();
            this.setupLaporanInteractions();
        }
        
        this.updateMainContentMargins();
    }

    /* Show Data Mahasiswa content */
    showDataMahasiswaContent() {
        this.collapseLeftSidebar();
        this.hideRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getDataMahasiswaTemplate();
        }
        
        this.updateMainContentMargins();
    }

    /* Show Pesan content */
    showPesanContent() {
        this.collapseLeftSidebar();
        this.hideRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getPesanTemplate();
            this.setupPesanInteractions(); // Tambahkan ini
        }
        
        this.updateMainContentMargins();
    }

    /* Show Notifikasi content */
    showNotifikasiContent() {
        this.collapseLeftSidebar();
        this.hideRightSidebar();
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = this.getNotifikasiTemplate();
            this.setupNotifikasiInteractions(); // Tambahkan ini
        }
        
        this.updateMainContentMargins();
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

    /* === TEMPLATE METHODS === */
    /* Get Dashboard template */
    getDashboardTemplate() {
        return `
            <div class="dashboard-header">
                <h1>Dashboard Koordinator</h1>
                <p class="welcome-text">Selamat datang, Koordinator</p>
            </div>

            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>24</h3>
                        <p>Total Laporan</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-info">
                        <h3>8</h3>
                        <p>Menunggu Review</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3>16</h3>
                        <p>Disetujui</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>45</h3>
                        <p>Mahasiswa Aktif</p>
                    </div>
                </div>
            </div>

            <div class="recent-activity">
                <div class="section-header">
                    <h2>Aktivitas Terbaru</h2>
                    <button class="see-all-btn">Lihat Semua</button>
                </div>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="activity-content">
                            <p><strong>Ahmad Fauzi</strong> mengirim laporan Kebhinekaan</p>
                            <span class="activity-time">5 menit yang lalu</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="activity-content">
                            <p>Laporan <strong>Siti Nurhaliza</strong> telah disetujui</p>
                            <span class="activity-time">1 jam yang lalu</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="activity-content">
                            <p><strong>Budi Santoso</strong> bergabung sebagai mahasiswa baru</p>
                            <span class="activity-time">2 jam yang lalu</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /* Get Laporan Mahasiswa template */
    getLaporanTemplate() {
        return `
            <div class="laporan-header">
                <h1>Laporan Mahasiswa</h1>
                <p>Kelola dan review laporan kegiatan mahasiswa</p>
            </div>

            <div class="filter-tabs">
                <button class="filter-tab active" data-filter="semua">Semua</button>
                <button class="filter-tab" data-filter="pending">Menunggu Review</button>
                <button class="filter-tab" data-filter="approved">Disetujui</button>
                <button class="filter-tab" data-filter="rejected">Ditolak</button>
            </div>

            <div class="laporan-list" id="laporanList">
                ${this.getLaporanItems()}
            </div>

            <!-- Modal -->
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Detail Laporan</h2>
                        <button class="modal-close" id="modalClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="modalBody">
                        <!-- Content will be inserted here -->
                    </div>
                </div>
            </div>
        `;
    }

    /* Get Laporan Items */
    getLaporanItems() {
        const mockData = [
            {
                id: 1,
                student: 'Ahmad Fauzi',
                nim: '2021001',
                type: 'Kebhinekaan',
                date: '2024-10-25',
                description: 'Mengikuti kegiatan diskusi lintas budaya dengan tema "Toleransi Beragama di Indonesia Modern".',
                status: 'pending',
                hasImage: true
            },
            {
                id: 2,
                student: 'Siti Nurhaliza',
                nim: '2021002',
                type: 'Inspirasi',
                date: '2024-10-24',
                description: 'Berbagi pengalaman tentang pentingnya pendidikan karakter kepada siswa SD.',
                status: 'approved',
                hasImage: true
            },
            {
                id: 3,
                student: 'Budi Santoso',
                nim: '2021003',
                type: 'Refleksi',
                date: '2024-10-23',
                description: 'Refleksi pembelajaran setelah mengikuti workshop kepemimpinan mahasiswa.',
                status: 'pending',
                hasImage: false
            },
            {
                id: 4,
                student: 'Dewi Lestari',
                nim: '2021004',
                type: 'Kontribusi Sosial',
                date: '2024-10-22',
                description: 'Membantu kegiatan bersih-bersih lingkungan di kampung sekitar kampus.',
                status: 'approved',
                hasImage: true
            },
            {
                id: 5,
                student: 'Eko Prasetyo',
                nim: '2021005',
                type: 'Kebhinekaan',
                date: '2024-10-21',
                description: 'Menghadiri perayaan budaya daerah dan belajar tarian tradisional.',
                status: 'rejected',
                hasImage: true
            }
        ];

        return mockData.map(item => `
            <div class="laporan-item" data-id="${item.id}" data-status="${item.status}">
                <div class="laporan-item-header">
                    <div class="laporan-student-info">
                        <div class="student-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="student-details">
                            <h4>${item.student}</h4>
                            <p>NIM: ${item.nim}</p>
                        </div>
                    </div>
                    <span class="laporan-status status-${item.status}">
                        ${item.status === 'pending' ? 'Menunggu' : item.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                    </span>
                </div>
                <div class="laporan-preview">
                    <div class="laporan-thumbnail">
                        ${item.hasImage ? '<i class="fas fa-image"></i>' : '<i class="fas fa-file-alt"></i>'}
                    </div>
                    <div class="laporan-preview-content">
                        <span class="laporan-type type-${item.type.toLowerCase().replace(' ', '-')}">
                            <i class="fas fa-tag"></i>
                            ${item.type}
                        </span>
                        <p class="laporan-desc">${item.description}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /* Get Data Mahasiswa template */
    getDataMahasiswaTemplate() {
        return `
            <div class="laporan-header">
                <h1>Data Mahasiswa</h1>
                <p>Kelola data mahasiswa yang terdaftar</p>
            </div>

            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>Data Mahasiswa</h3>
                <p>Fitur ini akan tersedia setelah database terhubung.</p>
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
                    <div class="message-item">
                        <div class="message-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="message-info">
                            <div class="message-user">
                                <span class="message-name">Ahmad Fauzi</span>
                                <span class="message-time">2 jam lalu</span>
                            </div>
                            <div class="message-preview">
                                <span class="message-text">Terima kasih atas feedback laporannya</span>
                            </div>
                        </div>
                        <div class="message-unread">1</div>
                    </div>

                    <div class="message-item">
                        <div class="message-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="message-info">
                            <div class="message-user">
                                <span class="message-name">Siti Nurhaliza</span>
                                <span class="message-time">5 jam lalu</span>
                            </div>
                            <div class="message-preview">
                                <span class="message-text">Pak/Bu, kapan deadline laporan berikutnya?</span>
                            </div>
                        </div>
                    </div>

                    <div class="message-placeholder" style="display: none;">
                        <i class="fas fa-envelope"></i>
                        <h3>Pesan Anda</h3>
                        <p>Kirim pesan pribadi ke mahasiswa.</p>
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
                    <button class="notif-tab" data-type="laporan">Laporan</button>
                </div>

                <div class="notification-list" id="notificationList">
                    <div class="notification-item unread">
                        <div class="notification-icon welcome">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="notification-content-text">
                            <p><strong>Laporan baru dari Ahmad Fauzi</strong></p>
                            <p class="notification-detail">Laporan Kebhinekaan perlu direview</p>
                            <span class="notification-time">5 menit yang lalu</span>
                        </div>
                    </div>

                    <div class="notification-item">
                        <div class="notification-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="notification-content-text">
                            <p><strong>Dewi Lestari</strong> mengirim pesan baru</p>
                            <span class="notification-time">1 jam yang lalu</span>
                        </div>
                    </div>

                    <div class="notification-item">
                        <div class="notification-icon welcome">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="notification-content-text">
                            <p><strong>Sistem</strong></p>
                            <p class="notification-detail">16 laporan telah disetujui bulan ini</p>
                            <span class="notification-time">2 jam yang lalu</span>
                        </div>
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

    /* Setup Laporan interactions */
    setupLaporanInteractions() {
        // Setup filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.getAttribute('data-filter');
                this.filterLaporan(filter);
            });
        });

        // Setup laporan item clicks
        const laporanItems = document.querySelectorAll('.laporan-item');
        laporanItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-id');
                this.showLaporanModal(id);
            });
        });

        // Setup modal close
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
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

        notifTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                notifTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const type = tab.getAttribute('data-type');
                this.filterNotifications(type);
            });
        });
    }

    /* Filter notifications */
    filterNotifications(type) {
        console.log('Filter notifications:', type);
        // Future implementation for filtering
    }

    /* Filter Laporan by status */
    filterLaporan(filter) {
        this.currentFilter = filter;
        const laporanItems = document.querySelectorAll('.laporan-item');
        
        laporanItems.forEach(item => {
            const status = item.getAttribute('data-status');
            if (filter === 'semua' || status === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    /* Show Laporan Modal */
    showLaporanModal(id) {
        const mockData = {
            1: {
                student: 'Ahmad Fauzi',
                nim: '2021001',
                type: 'Kebhinekaan',
                date: '25 Oktober 2024',
                description: 'Pada tanggal 25 Oktober 2024, saya mengikuti kegiatan diskusi lintas budaya dengan tema "Toleransi Beragama di Indonesia Modern". Kegiatan ini dihadiri oleh mahasiswa dari berbagai latar belakang agama dan budaya. Dalam diskusi ini, kami membahas tentang pentingnya menjaga kerukunan antarumat beragama dan menghormati perbedaan yang ada di masyarakat Indonesia.\n\nSaya mendapat banyak wawasan baru tentang bagaimana cara berkomunikasi yang baik dengan orang-orang yang memiliki keyakinan berbeda. Kegiatan ini sangat bermanfaat untuk mengembangkan sikap toleransi dan saling menghargai dalam kehidupan bermasyarakat.',
                status: 'pending',
                hasImage: true
            },
            2: {
                student: 'Siti Nurhaliza',
                nim: '2021002',
                type: 'Inspirasi',
                date: '24 Oktober 2024',
                description: 'Saya berkesempatan berbagi pengalaman dan memberikan motivasi kepada siswa-siswa SD Negeri 1 tentang pentingnya pendidikan karakter. Dalam sesi ini, saya menceritakan perjalanan saya sebagai mahasiswa dan bagaimana pendidikan karakter membantu saya dalam menghadapi berbagai tantangan.\n\nAnak-anak sangat antusias mendengarkan cerita saya dan banyak yang bertanya tentang bagaimana cara menjadi mahasiswa yang baik. Saya berharap pengalaman ini dapat menginspirasi mereka untuk terus belajar dan mengembangkan karakter yang baik.',
                status: 'approved',
                hasImage: true
            },
            3: {
                student: 'Budi Santoso',
                nim: '2021003',
                type: 'Refleksi',
                date: '23 Oktober 2024',
                description: 'Setelah mengikuti workshop kepemimpinan mahasiswa selama 3 hari, saya mendapat banyak pembelajaran berharga tentang bagaimana menjadi pemimpin yang baik. Workshop ini mengajarkan tentang komunikasi efektif, problem solving, dan team management.\n\nSaya menyadari bahwa menjadi pemimpin bukan hanya tentang memberi perintah, tetapi juga tentang mendengarkan, memahami, dan memberdayakan anggota tim. Pengalaman ini membuka wawasan saya tentang pentingnya kepemimpinan yang inklusif dan kolaboratif.',
                status: 'pending',
                hasImage: false
            },
            4: {
                student: 'Dewi Lestari',
                nim: '2021004',
                type: 'Kontribusi Sosial',
                date: '22 Oktober 2024',
                description: 'Bersama teman-teman, saya mengikuti kegiatan bersih-bersih lingkungan di kampung sekitar kampus. Kami membersihkan selokan, mengumpulkan sampah, dan menata taman kecil di area RW 05.\n\nMasyarakat setempat sangat mengapresiasi kegiatan ini dan turut bergabung membantu. Kegiatan ini tidak hanya membuat lingkungan menjadi lebih bersih, tetapi juga mempererat hubungan antara mahasiswa dan warga sekitar kampus.',
                status: 'approved',
                hasImage: true
            },
            5: {
                student: 'Eko Prasetyo',
                nim: '2021005',
                type: 'Kebhinekaan',
                date: '21 Oktober 2024',
                description: 'Saya menghadiri perayaan budaya daerah yang diadakan oleh komunitas adat di kota ini. Dalam acara tersebut, saya berkesempatan belajar tarian tradisional dan mengenal lebih dekat kearifan lokal masyarakat setempat.\n\nPengalaman ini membuka mata saya tentang kekayaan budaya Indonesia dan pentingnya melestarikan tradisi untuk generasi mendatang.',
                status: 'rejected',
                hasImage: true
            }
        };

        const data = mockData[id];
        if (!data) return;

        const modalBody = document.getElementById('modalBody');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="modal-student-info">
                <div class="modal-student-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="modal-student-details">
                    <h3>${data.student}</h3>
                    <p>NIM: ${data.nim}</p>
                </div>
            </div>

            <div class="modal-laporan-image">
                ${data.hasImage ? '<i class="fas fa-image"></i>' : '<i class="fas fa-file-alt"></i>'}
            </div>

            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <label>Tanggal Kegiatan</label>
                    <div class="value">${data.date}</div>
                </div>
                <div class="modal-info-item">
                    <label>Jenis Kegiatan</label>
                    <div class="value">${data.type}</div>
                </div>
            </div>

            <div class="modal-description">
                <h4>Deskripsi Kegiatan</h4>
                <p>${data.description}</p>
            </div>

            <div class="modal-actions">
                <button class="modal-btn btn-reject" onclick="koordinatorManager.handleReject(${id})">
                    <i class="fas fa-times"></i> Tolak
                </button>
                <button class="modal-btn btn-approve" onclick="koordinatorManager.handleApprove(${id})">
                    <i class="fas fa-check"></i> Setujui
                </button>
            </div>
        `;

        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.classList.add('active');
        }
    }

    /* Close Modal */
    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    }

    /* Handle Approve */
    handleApprove(id) {
        this.showAlert('Laporan Disetujui', `Laporan ID ${id} telah disetujui.`);
        this.closeModal();
        // Update the status in the list
        const item = document.querySelector(`.laporan-item[data-id="${id}"]`);
        if (item) {
            item.setAttribute('data-status', 'approved');
            const statusBadge = item.querySelector('.laporan-status');
            if (statusBadge) {
                statusBadge.className = 'laporan-status status-approved';
                statusBadge.textContent = 'Disetujui';
            }
        }
    }

    /* Handle Reject */
    handleReject(id) {
        this.showAlert('Laporan Ditolak', `Laporan ID ${id} telah ditolak.`);
        this.closeModal();
        // Update the status in the list
        const item = document.querySelector(`.laporan-item[data-id="${id}"]`);
        if (item) {
            item.setAttribute('data-status', 'rejected');
            const statusBadge = item.querySelector('.laporan-status');
            if (statusBadge) {
                statusBadge.className = 'laporan-status status-rejected';
                statusBadge.textContent = 'Ditolak';
            }
        }
    }

    /* Handle responsive behavior */
    handleResponsive() {
        window.addEventListener('resize', () => {
            this.updateMainContentMargins();
            this.handleMobileView();
            this.handleTabletView();
        });

        this.handleMobileView();
        this.handleTabletView();
    }

    /* Handle tablet view - set default collapsed */
    handleTabletView() {
        const isTablet = window.innerWidth > 640 && window.innerWidth <= 768;
        
        if (isTablet) {
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
        if (width <= KoordinatorManager.BREAKPOINTS.MOBILE) return 'mobile';
        if (width <= KoordinatorManager.BREAKPOINTS.TABLET) return 'tablet';
        return 'desktop';
    }
}

/* Initialize application when DOM is loaded */
let koordinatorManager;

document.addEventListener('DOMContentLoaded', () => {
    koordinatorManager = new KoordinatorManager();

    console.log('Koordinator Dashboard initialized');
    console.log('Screen size:', koordinatorManager.getScreenSize());

    // Setup keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '[') {
            e.preventDefault();
            koordinatorManager.toggleLeftSidebar();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === ']') {
            e.preventDefault();
            koordinatorManager.toggleRightSidebar();
        }

        if (e.key === 'Escape') {
            koordinatorManager.closeModal();
        }
    });
});