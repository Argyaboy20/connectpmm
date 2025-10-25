// List of Indonesian Universities (100+ universities)
const universities = [
    'Universitas Indonesia (UI)',
    'Institut Teknologi Bandung (ITB)',
    'Universitas Gadjah Mada (UGM)',
    'Institut Pertanian Bogor (IPB)',
    'Institut Teknologi Sepuluh Nopember (ITS)',
    'Universitas Airlangga (UNAIR)',
    'Universitas Brawijaya (UB)',
    'Universitas Diponegoro (UNDIP)',
    'Universitas Sebelas Maret (UNS)',
    'Universitas Padjadjaran (UNPAD)',
    'Universitas Hasanuddin (UNHAS)',
    'Universitas Sumatera Utara (USU)',
    'Universitas Andalas (UNAND)',
    'Universitas Riau (UNRI)',
    'Universitas Jambi (UNJA)',
    'Universitas Bengkulu (UNIB)',
    'Universitas Sriwijaya (UNSRI)',
    'Universitas Lampung (UNILA)',
    'Universitas Jenderal Soedirman (UNSOED)',
    'Universitas Negeri Semarang (UNNES)',
    'Universitas Pendidikan Indonesia (UPI)',
    'Universitas Islam Indonesia (UII)',
    'Universitas Muhammadiyah Yogyakarta (UMY)',
    'Universitas Katolik Parahyangan (UNPAR)',
    'Universitas Kristen Petra',
    'Universitas Bina Nusantara (BINUS)',
    'Universitas Trisakti',
    'Universitas Tarumanagara (UNTAR)',
    'Universitas Atma Jaya Yogyakarta',
    'Universitas Sanata Dharma',
    'Universitas Dian Nuswantoro (UDINUS)',
    'Universitas Telkom (Tel-U)',
    'Universitas Maranatha',
    'Universitas Kristen Maranatha',
    'Universitas Widyatama',
    'Universitas Komputer Indonesia (UNIKOM)',
    'Universitas Pasundan (UNPAS)',
    'Universitas Islam Bandung (UNISBA)',
    'Universitas Pendidikan Ganesha (UNDIKSHA)',
    'Universitas Udayana (UNUD)',
    'Universitas Warmadewa',
    'Universitas Mahasaraswati Denpasar',
    'Universitas Hindu Indonesia (UNHI)',
    'Universitas Sam Ratulangi (UNSRAT)',
    'Universitas Negeri Manado (UNIMA)',
    'Universitas Mulawarman (UNMUL)',
    'Universitas Lambung Mangkurat (ULM)',
    'Universitas Palangka Raya (UPR)',
    'Universitas Tanjungpura (UNTAN)',
    'Universitas Tadulako (UNTAD)',
    'Universitas Halu Oleo (UHO)',
    'Universitas Gorontalo (UNG)',
    'Universitas Negeri Makassar (UNM)',
    'Universitas Muslim Indonesia (UMI)',
    'Universitas Islam Negeri Alauddin Makassar',
    'Universitas Bosowa',
    'Universitas Fajar',
    'Universitas Pattimura (UNPATTI)',
    'Universitas Cenderawasih (UNCEN)',
    'Universitas Negeri Papua (UNIPA)',
    'Universitas Papua',
    'Universitas Terbuka (UT)',
    'Universitas Mercu Buana',
    'Universitas Gunadarma',
    'Universitas Pancasila',
    'Universitas Nasional',
    'Universitas YARSI',
    'Universitas Esa Unggul',
    'Universitas Sahid Jakarta',
    'Universitas Borobudur',
    'Universitas Persada Indonesia YAI',
    'Universitas Jayabaya',
    'Universitas Krisnadwipayana (UNKRIS)',
    'Universitas Bhayangkara Jakarta Raya',
    'Universitas Negeri Jakarta (UNJ)',
    'Universitas Islam Negeri Syarif Hidayatullah',
    'Universitas Muhammadiyah Jakarta',
    'Universitas Al Azhar Indonesia',
    'Universitas Paramadina',
    'Universitas Prof. Dr. Moestopo (Beragama)',
    'STIE Perbanas',
    'Universitas Bakrie',
    'Universitas Suryadarma',
    'Universitas Darma Persada',
    'Universitas Ibnu Chaldun Jakarta',
    'Universitas Muhammadiyah Prof. Dr. Hamka',
    'Universitas Veteran Jakarta',
    'Politeknik Negeri Jakarta (PNJ)',
    'Institut Sains dan Teknologi Terpadu Surabaya',
    'Universitas Kristen Petra Surabaya',
    'Universitas Negeri Surabaya (UNESA)',
    'Universitas 17 Agustus 1945 Surabaya',
    'Universitas Muhammadiyah Surabaya',
    'Universitas Narotama',
    'Universitas Wijaya Kusuma Surabaya',
    'Universitas Dr. Soetomo',
    'Universitas Hang Tuah Surabaya',
    'Institut Teknologi Adhi Tama Surabaya',
    'Universitas Pembangunan Nasional Veteran Jawa Timur',
    'Universitas Islam Negeri Sunan Ampel',
    'Politeknik Elektronika Negeri Surabaya (PENS)',
    'Politeknik Perkapalan Negeri Surabaya (PPNS)',
    'Universitas Negeri Malang (UM)',
    'Universitas Islam Negeri Maulana Malik Ibrahim',
    'Universitas Muhammadiyah Malang',
    'Universitas Kanjuruhan Malang',
    'Universitas Wisnuwardhana Malang',
    'Politeknik Negeri Malang (POLINEMA)',
    'Universitas Islam Malang (UNISMA)'
];

class SignUpManager {
    constructor() {
        this.activeTab = 'peserta';
        this.init();
    }

    init() {
        this.populateUniversities();
        this.setupTabSwitching();
        this.setupPasswordValidation();
        this.setupEyeToggle();
        this.setupCustomInputToggle();
        this.setupKoordinatorStatusChange();
        this.setupFormSubmission();
    }

    populateUniversities() {
        const selectors = [
            '#pt-pengirim-peserta',
            '#pt-penerima-peserta',
            '#pt-koordinator'
        ];

        selectors.forEach(selector => {
            const selectElement = document.querySelector(selector);
            if (selectElement) {
                universities.forEach(university => {
                    const option = document.createElement('option');
                    option.value = university;
                    option.textContent = university;
                    selectElement.appendChild(option);
                });
            }
        });
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        const container = document.querySelector('.signup-container');

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
                    container.className = 'signup-container';
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

    setupPasswordValidation() {
        const passwordInputs = [
            '#password-peserta',
            '#password-koordinator',
            '#password-umum'
        ];

        passwordInputs.forEach(selector => {
            const input = document.querySelector(selector);
            if (input) {
                const container = input.closest('.form-group');
                const requirements = container.querySelector('.password-requirements');

                // Show requirements on focus
                input.addEventListener('focus', () => {
                    if (requirements) {
                        requirements.classList.add('show');
                    }
                });

                // Hide requirements on blur if password is valid
                input.addEventListener('blur', (e) => {
                    if (requirements && this.validatePassword(e.target)) {
                        setTimeout(() => {
                            requirements.classList.remove('show');
                        }, 1000);
                    }
                });

                input.addEventListener('input', (e) => {
                    this.validatePassword(e.target);
                    if (requirements && !requirements.classList.contains('show')) {
                        requirements.classList.add('show');
                    }
                });
            }
        });
    }

    validatePassword(passwordInput) {
        const password = passwordInput.value;
        const container = passwordInput.closest('.form-group');
        const requirements = container.querySelectorAll('.requirement');

        const validations = {
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        requirements.forEach(req => {
            const requirement = req.getAttribute('data-requirement');
            if (validations[requirement]) {
                req.classList.add('valid');
            } else {
                req.classList.remove('valid');
            }
        });

        return Object.values(validations).every(v => v);
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
                    eyeIcon.textContent = '👁';
                    toggle.setAttribute('title', 'Sembunyikan password');
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.textContent = '👁';
                    toggle.setAttribute('title', 'Tampilkan password');
                }
            });
        });
    }

    setupCustomInputToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-input');

        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const selectElement = document.querySelector(`#${target}-${this.activeTab}`);
                const customInput = document.querySelector(`#${target}-custom-${this.activeTab}`);

                if (!customInput) {
                    // For koordinator tab, handle differently
                    const koordinatorCustom = document.querySelector(`#${target}-custom`);
                    const koordinatorSelect = document.querySelector(`#${target}`);

                    if (koordinatorCustom && koordinatorSelect) {
                        if (koordinatorCustom.style.display === 'none') {
                            koordinatorCustom.style.display = 'block';
                            koordinatorSelect.style.display = 'none';
                            koordinatorCustom.required = true;
                            koordinatorSelect.required = false;
                            button.textContent = 'Pilih dari daftar?';
                        } else {
                            koordinatorCustom.style.display = 'none';
                            koordinatorSelect.style.display = 'block';
                            koordinatorCustom.required = false;
                            koordinatorSelect.required = true;
                            button.textContent = 'Tidak ada dalam daftar?';
                        }
                    }
                    return;
                }

                if (customInput.style.display === 'none') {
                    customInput.style.display = 'block';
                    selectElement.style.display = 'none';
                    customInput.required = true;
                    selectElement.required = false;
                    button.textContent = 'Pilih dari daftar?';
                } else {
                    customInput.style.display = 'none';
                    selectElement.style.display = 'block';
                    customInput.required = false;
                    selectElement.required = true;
                    button.textContent = 'Tidak ada dalam daftar?';
                }
            });
        });
    }

    setupKoordinatorStatusChange() {
        const statusSelect = document.getElementById('status-koordinator');
        const ptGroup = document.getElementById('pt-koordinator-group');
        const ptLabel = document.getElementById('pt-koordinator-label');

        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                const value = e.target.value;

                if (value) {
                    ptGroup.style.display = 'block';
                    ptLabel.textContent = value === 'pengirim' ? 'PT Pengirim' : 'PT Penerima';
                    document.getElementById('pt-koordinator').required = true;
                } else {
                    ptGroup.style.display = 'none';
                    document.getElementById('pt-koordinator').required = false;
                }
            });
        }
    }

    setupFormSubmission() {
        const forms = document.querySelectorAll('.signup-form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const userType = form.querySelector('input[name="userType"]').value;
                const passwordInput = form.querySelector('input[type="password"]');

                // Validasi password
                if (passwordInput && !this.validatePassword(passwordInput)) {
                    e.preventDefault();
                    alert('Password tidak memenuhi kriteria yang ditentukan');
                    return;
                }

                // Validasi khusus berdasarkan userType
                if (!this.validateFormByType(form, userType)) {
                    e.preventDefault();
                    return;
                }

                // Basic form validation
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                let firstErrorField = null;

                requiredFields.forEach(field => {
                    // Skip hidden fields
                    if (field.style.display === 'none' || field.offsetParent === null) {
                        return;
                    }

                    if (!field.value.trim()) {
                        isValid = false;
                        field.style.borderColor = '#dc3545';
                        if (!firstErrorField) {
                            firstErrorField = field;
                        }
                    } else {
                        field.style.borderColor = '#e9ecef';
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    alert('Mohon lengkapi semua field yang wajib diisi');
                    if (firstErrorField) {
                        firstErrorField.focus();
                    }
                    return;
                }

                // Show loading state
                const submitBtn = form.querySelector('.btn-daftar');
                showLoading(submitBtn);
            });
        });
    }

    validateFormByType(form, userType) {
        switch (userType) {
            case 'peserta':
                return this.validatePesertaForm(form);
            case 'koordinator':
                return this.validateKoordinatorForm(form);
            case 'umum':
                return this.validateUmumForm(form);
            default:
                return false;
        }
    }

    validatePesertaForm(form) {
        const ptPengirim = form.querySelector('[name="ptPengirim"]').value;
        const ptPengirimCustom = form.querySelector('[name="ptPengirimCustom"]').value;
        const ptPenerima = form.querySelector('[name="ptPenerima"]').value;
        const ptPenerimaCustom = form.querySelector('[name="ptPenerimaCustom"]').value;

        if (!ptPengirim && !ptPengirimCustom) {
            alert('PT Pengirim harus dipilih atau diisi');
            return false;
        }

        if (!ptPenerima && !ptPenerimaCustom) {
            alert('PT Penerima harus dipilih atau diisi');
            return false;
        }

        if ((ptPengirim || ptPengirimCustom) === (ptPenerima || ptPenerimaCustom)) {
            alert('PT Pengirim dan PT Penerima tidak boleh sama');
            return false;
        }

        return true;
    }

    validateKoordinatorForm(form) {
        const status = form.querySelector('[name="statusKoordinator"]').value;
        
        if (!status) {
            alert('Status Koordinator harus dipilih');
            return false;
        }

        const ptKoordinator = form.querySelector('[name="ptKoordinator"]').value;
        const ptKoordinatorCustom = form.querySelector('[name="ptKoordinatorCustom"]').value;

        if (!ptKoordinator && !ptKoordinatorCustom) {
            alert('PT harus dipilih atau diisi');
            return false;
        }

        return true;
    }

    validateUmumForm(form) {
        // Untuk umum hanya perlu validasi basic yang sudah ada
        return true;
    }

}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignUpManager();
});

// Additional utility functions
function showLoading(button) {
    button.disabled = true;
    button.textContent = 'Mendaftar...';
    button.style.opacity = '0.7';
}

function hideLoading(button, originalText = 'Daftar') {
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = '1';
}

// Search functionality for university select
function filterUniversities(input, selectId) {
    const filter = input.value.toLowerCase();
    const select = document.getElementById(selectId);
    const options = select.querySelectorAll('option');

    options.forEach(option => {
        if (option.value === '') return; // Skip empty option

        if (option.textContent.toLowerCase().includes(filter)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
}

// Enhanced form validation messages
const validationMessages = {
    id: {
        empty: 'Field ini wajib diisi',
        invalid: 'Format tidak valid',
        tooShort: 'Terlalu pendek',
        tooLong: 'Terlalu panjang'
    },
    en: {
        empty: 'This field is required',
        invalid: 'Invalid format',
        tooShort: 'Too short',
        tooLong: 'Too long'
    }
};

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignUpManager;
}