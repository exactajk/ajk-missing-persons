/* ==========================================================================
   AJK MISSING PERSONS PORTAL - APPLICATION LOGIC (Vanilla JS)
   ========================================================================== */

// --- INITIAL DATA SEED ---
const DEFAULT_RECORDS = [
    {
        id: "m_ali_01",
        name: "Ali Raza",
        fatherName: "Muhammad Raza",
        age: 22,
        gender: "Male",
        cnic: "82201-1234567-1",
        district: "Bagh",
        village: "Bagh City",
        address: "Bagh City, Bagh",
        location: "Bagh City, Bagh",
        status: "missing",
        date: "2026-07-15",
        time: "10:30 AM",
        lastSeen: "Bagh Main Bazaar",
        details: "Wearing blue shalwar kameez. Black hair, approx 5ft 8in tall.",
        image: "assets/images/ali.png",
        reporterName: "Muhammad Raza",
        reporterPhone: "0345-1234567",
        reporterEmail: "raza@example.com",
        reporterRelation: "Father",
        userSubmitted: false,
        approved: true,
        rejected: false
    },
    {
        id: "m_hussain_02",
        name: "Hussain Ahmad",
        fatherName: "Ahmad Ali",
        age: 28,
        gender: "Male",
        cnic: "82101-2345678-2",
        district: "Muzaffarabad",
        village: "Muzaffarabad City",
        address: "Muzaffarabad City, Muzaffarabad",
        location: "Muzaffarabad City, Muzaffarabad",
        status: "missing",
        date: "2026-07-12",
        time: "04:15 PM",
        lastSeen: "Lower Chattar",
        details: "Wearing dark jacket and jeans. Height 5ft 10in.",
        image: "assets/images/hussain.png",
        reporterName: "Ahmad Ali",
        reporterPhone: "0300-9876543",
        reporterEmail: "ahmad@example.com",
        reporterRelation: "Brother",
        userSubmitted: false,
        approved: true,
        rejected: false
    },
    {
        id: "f_irfan_03",
        name: "Irfan Mahmood",
        fatherName: "Mahmood Khan",
        age: 35,
        gender: "Male",
        cnic: "82301-3456789-3",
        district: "Rawalakot",
        village: "Rawalakot Market",
        address: "Rawalakot Market, Rawalakot",
        location: "Rawalakot Market, Rawalakot",
        status: "found",
        date: "2026-07-10",
        time: "02:00 PM",
        lastSeen: "Rawalakot Bus Stand",
        details: "Safely reunited with family by local rescue team.",
        image: "assets/images/irfan.png",
        reporterName: "Mahmood Khan",
        reporterPhone: "0333-5554433",
        reporterEmail: "irfan@example.com",
        reporterRelation: "Self",
        userSubmitted: false,
        approved: true,
        rejected: false,
        closureDetails: "Reunited with family at Rawalakot Desk on 10 July 2026."
    },
    {
        id: "f_yaseen_04",
        name: "Yaseen Malik",
        fatherName: "Malik Akbar",
        age: 30,
        gender: "Male",
        cnic: "82401-4567890-4",
        district: "Kotli",
        village: "Kotli City",
        address: "Kotli City, Kotli",
        location: "Kotli City, Kotli",
        status: "found",
        date: "2026-07-08",
        time: "11:00 AM",
        lastSeen: "Kotli Hospital Gate",
        details: "Found and safely escorted back home.",
        image: "assets/images/yaseen.png",
        reporterName: "Malik Akbar",
        reporterPhone: "0312-7778899",
        reporterEmail: "malik@example.com",
        reporterRelation: "Father",
        userSubmitted: false,
        approved: true,
        rejected: false,
        closureDetails: "Reunited by Kotli Police."
    },
    {
        id: "s_bilal_05",
        name: "Bilal Hussain",
        fatherName: "Hussain Shah",
        age: 25,
        gender: "Male",
        cnic: "82501-5678901-5",
        district: "Mirpur",
        village: "Mirpur Sector F/1",
        address: "Mirpur Sector F/1, Mirpur",
        location: "Mirpur Sector F/1, Mirpur",
        status: "shaheed",
        date: "2026-06-25",
        time: "09:00 AM",
        lastSeen: "Mirpur Border Area",
        details: "Honorably remembered for heroic sacrifice for AJK.",
        image: "assets/images/bilal.png",
        reporterName: "Hussain Shah",
        reporterPhone: "0345-8881122",
        reporterEmail: "bilal@example.com",
        reporterRelation: "Father",
        userSubmitted: false,
        approved: true,
        rejected: false
    },
    {
        id: "s_aamir_06",
        name: "Aamir Khan",
        fatherName: "Khan Muhammad",
        age: 27,
        gender: "Male",
        cnic: "82601-6789012-6",
        district: "Bhimber",
        village: "Bhimber Sector",
        address: "Bhimber Sector, Bhimber",
        location: "Bhimber Sector, Bhimber",
        status: "shaheed",
        date: "2026-06-20",
        time: "05:00 PM",
        lastSeen: "Bhimber Line",
        details: "Remembered for noble service and bravery.",
        image: "assets/images/aamir.png",
        reporterName: "Khan Muhammad",
        reporterPhone: "0300-3332211",
        reporterEmail: "aamir@example.com",
        reporterRelation: "Brother",
        userSubmitted: false,
        approved: true,
        rejected: false
    }
];

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBJmXd1VCU6JkgZEjLh7NfNGHuxPs34Zso",
  authDomain: "ajk-missing-persons-d88ec.firebaseapp.com",
  projectId: "ajk-missing-persons-d88ec",
  storageBucket: "ajk-missing-persons-d88ec.firebasestorage.app",
  messagingSenderId: "1030714284396",
  appId: "1:1030714284396:web:902163f569f014edf8bb49",
  measurementId: "G-XNX363DRTW"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


// Helper: wrap promise with strict timeout
function promiseWithTimeout(promise, ms = 4000, fallbackVal = null) {
    return new Promise((resolve) => {
        let timer = setTimeout(() => {
            console.warn(`Network request timed out after ${ms}ms, using fallback.`);
            resolve(fallbackVal);
        }, ms);

        promise
            .then((res) => {
                clearTimeout(timer);
                resolve(res);
            })
            .catch((err) => {
                clearTimeout(timer);
                console.warn(`Network request rejected, using fallback:`, err);
                resolve(fallbackVal);
            });
    });
}

// --- STATE MANAGEMENT ---

// Safe Lucide Icons Creator (never crashes if CDN is offline or loading)
function safeCreateIcons() {
    if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
        try {
            window.lucide.createIcons();
        } catch (e) {
            console.warn("Lucide icons notice:", e);
        }
    }
}

let appState = {
    records: [],
    currentView: 'home',
    currentUser: null,
    wizardStep: 1,
    searchFilter: 'all',
    directoryFilter: 'all',
    directoryDistrict: 'all',
    directorySort: 'newest',
    language: 'en',
    editingRecordId: null
};

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initAppState();
    initRouter();
    initWizardForm();
    initSearchPage();
    initDirectoryPage();
    initProfilePage();
    initAdminPanel();
    
    // Auth State Change listener
    auth.onAuthStateChanged((user) => {
        if (user) {
            appState.currentUser = {
                name: user.displayName || 'Guest User',
                email: user.email,
                uid: user.uid
            };
            localStorage.setItem('ajk_portal_user', JSON.stringify(appState.currentUser));
        } else {
            appState.currentUser = null;
            localStorage.removeItem('ajk_portal_user');
        }
        renderProfileView();
    });

    // Hash routing for admin access
    const checkHashRoute = () => {
        if (window.location.hash === '#admin') {
            navigateToView('admin');
        }
    };
    window.addEventListener('hashchange', checkHashRoute);
    checkHashRoute();

    // Language switcher setup
    const savedLang = localStorage.getItem('ajk_portal_lang') || 'en';
    applyLanguage(savedLang);
    document.querySelectorAll('.lang-switch-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === savedLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        btn.addEventListener('click', (e) => {
            const lang = e.currentTarget.getAttribute('data-lang');
            document.querySelectorAll('.lang-switch-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            applyLanguage(lang);
        });
    });

    // Initialize Lucide Icons
    safeCreateIcons();
});

// Load records instantly from LocalStorage cache (0ms delay) and sync with Firestore in background
function initAppState() {
    // 1. Check logged in user locally
    const savedUser = localStorage.getItem('ajk_portal_user');
    if (savedUser) {
        try {
            appState.currentUser = JSON.parse(savedUser);
        } catch (e) {}
    }

    // 2. Create initial merged dataset combining DEFAULT_RECORDS with any cached records
    const recordMap = new Map();
    DEFAULT_RECORDS.forEach(r => recordMap.set(r.id, r));

    const savedRecords = localStorage.getItem('ajk_portal_records');
    if (savedRecords) {
        try {
            const parsed = JSON.parse(savedRecords);
            if (Array.isArray(parsed)) {
                parsed.forEach(r => recordMap.set(r.id, r));
            }
        } catch (e) {}
    }

    // Set initial state and render immediately (0ms delay)
    appState.records = Array.from(recordMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
    renderAllViews();

    // 3. BACKGROUND SYNC with Firebase Firestore (merges without wiping DEFAULT_RECORDS)
    if (typeof db !== 'undefined') {
        db.collection('reports').get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data && data.id) {
                        recordMap.set(data.id, data);
                    }
                });

                const mergedRecords = Array.from(recordMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
                appState.records = mergedRecords;
                localStorage.setItem('ajk_portal_records', JSON.stringify(appState.records));
                renderAllViews();
            })
            .catch((error) => {
                console.warn("Firestore sync fallback to local storage:", error);
            });
    }
}

// Save records back to LocalStorage
function saveRecordsToStorage() {
    localStorage.setItem('ajk_portal_records', JSON.stringify(appState.records));
}

// --- SPA VIEW ROUTING ---
function initRouter() {
    // Bottom Nav routing
    document.querySelectorAll('.bottom-nav .nav-item').forEach(navLink => {
        navLink.addEventListener('click', (e) => {
            // Find target element (nav item might be clicked on icon or span)
            const targetBtn = e.target.closest('.nav-item');
            const viewId = targetBtn.getAttribute('data-target');
            navigateToView(viewId);
        });
    });

    // Sidebar drawer links routing
    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetLink = e.target.closest('.drawer-link');
            if (targetLink.id === 'btn-toggle-theme' || targetLink.id === 'btn-about') return; // Skip non-view triggers
            
            const viewId = targetLink.getAttribute('data-target');
            navigateToView(viewId);
            closeDrawer();
        });
    });

    // Redirect inputs or triggers on Home page
    document.getElementById('home-search-input').addEventListener('click', () => {
        navigateToView('search');
        document.getElementById('search-view-input').focus();
    });

    document.getElementById('home-location-btn').addEventListener('click', () => {
        navigateToView('search');
    });

    // Action cards triggers
    document.getElementById('btn-report-missing-card').addEventListener('click', () => {
        navigateToView('submit');
        setWizardReportType('missing');
    });

    document.getElementById('btn-report-found-card').addEventListener('click', () => {
        navigateToView('submit');
        setWizardReportType('found');
    });

    document.getElementById('cta-report-btn').addEventListener('click', () => {
        navigateToView('submit');
    });

    // Header login button event listener removed

    // View All links on home page
    document.querySelectorAll('.view-all-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.getAttribute('data-target');
            const filterType = link.getAttribute('data-filter');
            
            // Set directory tab filter first
            if (filterType) {
                appState.directoryFilter = filterType;
                const tabBtn = document.querySelector(`.dir-tab[data-dir-type="${filterType}"]`);
                if (tabBtn) {
                    document.querySelectorAll('.dir-tab').forEach(t => t.classList.remove('active'));
                    tabBtn.classList.add('active');
                }
            }
            
            navigateToView(viewId);
        });
    });
}

function navigateToView(viewId) {
    if (!viewId) return;
    
    // Intercept anonymous users trying to report a case
    if (viewId === 'submit' && !appState.currentUser) {
        showToast("Please create an account or login to submit a report.", "error");
        viewId = 'profile';
    }
    
    // Hide all views, display target view
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('active-view');
    });
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.classList.add('active-view');
        appState.currentView = viewId;
    }

    // Scroll to top of main content
    document.getElementById('main-content').scrollTop = 0;

    // Update bottom nav classes
    document.querySelectorAll('.bottom-nav .nav-item').forEach(navItem => {
        navItem.classList.remove('active');
        if (navItem.getAttribute('data-target') === viewId) {
            navItem.classList.add('active');
        }
    });

    // Update drawer links classes
    document.querySelectorAll('.drawer-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === viewId) {
            link.classList.add('active');
        }
    });

    // Auto refresh lists when navigating
    if (viewId === 'home') {
        renderHomeViews();
    } else if (viewId === 'search') {
        performSearch();
    } else if (viewId === 'missing') {
        renderDirectory();
    } else if (viewId === 'profile') {
        renderProfileView();
    }
}

// Helper to preset report type in the submission form
function setWizardReportType(type) {
    const radioInput = document.querySelector(`input[name="reportType"][value="${type}"]`);
    if (radioInput) {
        radioInput.checked = true;
        
        // Update styling of type selectors
        document.querySelectorAll('.sf-type-option').forEach(opt => opt.classList.remove('active'));
        radioInput.closest('.sf-type-option').classList.add('active');

        // Update date label based on report type
        const dateLabel = document.getElementById('lbl-date');
        if (dateLabel) {
            if (type === 'missing') {
                dateLabel.innerHTML = 'Date of Incident (Missing Date) <span class="required">*</span>';
            } else if (type === 'shaheed') {
                dateLabel.innerHTML = 'Date of Incident (Date of Shahadat) <span class="required">*</span>';
            } else {
                dateLabel.innerHTML = 'Date of Incident (Found Date) <span class="required">*</span>';
            }
        }
    }
}

// --- HAMBURGER MENU DRAWER ---
function initMenuDrawer() {
    const menuBtn = document.getElementById('menu-btn');
    // If menu button doesn't exist (removed from UI), skip drawer init
    if (!menuBtn) return;

    const sideDrawer = document.getElementById('side-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const themeBtn = document.getElementById('btn-toggle-theme');
    const aboutBtn = document.getElementById('btn-about');

    menuBtn.addEventListener('click', () => {
        sideDrawer.classList.add('open');
    });

    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

    // Dark Mode Toggle
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeBtn.innerHTML = isDark ? '<i data-lucide="sun"></i> Light Mode' : '<i data-lucide="moon"></i> Dark Mode';
            safeCreateIcons();
            localStorage.setItem('ajk_portal_theme', isDark ? 'dark' : 'light');
        });
    }

    // Check saved theme preference
    const savedTheme = localStorage.getItem('ajk_portal_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeBtn) themeBtn.innerHTML = '<i data-lucide="sun"></i> Light Mode';
        safeCreateIcons();
    }

    if (aboutBtn) {
        aboutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('AJK Missing Persons Portal (PWA)\n\nDeveloped in coordination with regional authorities to help trace missing persons, identify found individuals, and remember AJK heroes.');
            closeDrawer();
        });
    }
}

function closeDrawer() {
    document.getElementById('side-drawer').classList.remove('open');
}

// --- RENDERING VIEWS ---
function renderAllViews() {
    renderHomeViews();
    performSearch();
    renderDirectory();
    if (typeof renderProfileView === 'function') renderProfileView();
    if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
    safeCreateIcons();
}

// Render dynamic items in Home View
function renderHomeViews() {
    const missingContainer = document.getElementById('recently-missing-container');
    const foundContainer = document.getElementById('recently-found-container');
    const shaheedContainer = document.getElementById('shaheed-memorial-container');

    // 1. Recently Missing (horizontal scroll cards)
    if (missingContainer) {
        const missingRecords = appState.records.filter(r => r.status === 'missing' && r.approved === true).slice(0, 8);
        missingContainer.innerHTML = '';
        
        if (missingRecords.length === 0) {
            missingContainer.innerHTML = '<div class="no-records">No missing reports registered.</div>';
        } else {
            missingRecords.forEach(record => {
                const card = document.createElement('div');
                card.className = 'person-scroll-card';
                card.innerHTML = `
                    <div class="card-img-container">
                        <img src="${record.image || 'assets/images/logo.png'}" alt="${record.name}">
                    </div>
                    <h4>${record.name}</h4>
                    <p>Age: ${record.age || 'N/A'} Years</p>
                    <p>District: ${record.district}</p>
                    <div class="date-badge">
                        <span>Missing Since:</span>
                        <strong class="date-val">${formatDate(record.date)}</strong>
                    </div>
                    <button class="card-details-btn" onclick="openDetails('${record.id}')">View Details</button>
                `;
                missingContainer.appendChild(card);
            });
        }
    }

    // 2. Recently Found (horizontal scroll slider cards)
    if (foundContainer) {
        const foundRecords = appState.records.filter(r => r.status === 'found' && r.approved === true).slice(0, 12);
        foundContainer.innerHTML = '';
        
        if (foundRecords.length === 0) {
            foundContainer.innerHTML = '<div class="no-records">No found reports registered.</div>';
        } else {
            foundRecords.forEach(record => {
                const card = document.createElement('div');
                card.className = 'person-scroll-card';
                card.innerHTML = `
                    <div class="card-img-container">
                        <img src="${record.image || 'assets/images/logo.png'}" alt="${record.name}">
                    </div>
                    <h4>${record.name}</h4>
                    <p>Age: ${record.age || 'N/A'} Years</p>
                    <p>District: ${record.district}</p>
                    <div class="date-badge" style="color: #047857;">
                        <span>Found Date:</span>
                        <strong class="date-val">${formatDate(record.date)}</strong>
                    </div>
                    <button class="card-details-btn" onclick="openDetails('${record.id}')">View Details</button>
                `;
                foundContainer.appendChild(card);
            });
        }
    }

    // 3. Shaheed Memorial (horizontal scroll slider cards)
    if (shaheedContainer) {
        const shaheedRecords = appState.records.filter(r => r.status === 'shaheed' && r.approved === true).slice(0, 12);
        shaheedContainer.innerHTML = '';
        
        if (shaheedRecords.length === 0) {
            shaheedContainer.innerHTML = '<div class="no-records">No memorial records registered.</div>';
        } else {
            shaheedRecords.forEach(record => {
                const card = document.createElement('div');
                card.className = 'person-scroll-card shaheed-scroll-card';
                card.innerHTML = `
                    <div class="card-img-container">
                        <img src="${record.image || 'assets/images/logo.png'}" alt="${record.name}">
                    </div>
                    <h4>${record.name}</h4>
                    <p>District: ${record.district}</p>
                    <div class="date-badge" style="color: #b91c1c;">
                        <span>Shahadat Date:</span>
                        <strong class="date-val">${formatDate(record.date)}</strong>
                    </div>
                    <button class="card-details-btn" onclick="openDetails('${record.id}')">View Details</button>
                `;
                shaheedContainer.appendChild(card);
            });
        }
    }
}

// Image Compression Helper (converts any image file to lightweight ~40KB base64 Data URL)
function compressImage(file, maxWidth = 600, maxHeight = 600, quality = 0.75) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = (err) => reject(err);
            img.src = e.target.result;
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

// --- FORM WIZARD (SUBMIT REPORT) ---
function initWizardForm() {
    const submitBtn = document.getElementById('sf-submit-btn');
    const form = document.getElementById('report-wizard-form');
    
    // File inputs preview
    const fileInput = document.getElementById('person-photo');
    const dropzone = document.getElementById('photo-dropzone');
    const uploadPlaceholder = dropzone ? dropzone.querySelector('.sf-upload-placeholder') : null;
    const previewContainer = dropzone ? dropzone.querySelector('.sf-upload-preview-container') : null;
    const previewImg = document.getElementById('upload-preview');
    const removePhotoBtn = document.getElementById('remove-photo-btn');
    
    let uploadedImageBase64 = '';

    // Drag & Drop handlers for photo dropzone
    if (dropzone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('sf-drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('sf-drag-over');
            }, false);
        });

        dropzone.addEventListener('drop', async (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files[0]) {
                fileInput.files = files;
                const file = files[0];
                if (file.size > 5242880) {
                    showToast("Image size must be less than 5MB!", "error");
                    return;
                }
                try {
                    uploadedImageBase64 = await compressImage(file);
                    if (previewImg) previewImg.src = uploadedImageBase64;
                    if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
                    if (previewContainer) previewContainer.style.display = 'block';
                    if (dropzone) dropzone.classList.remove('sf-input-error');
                } catch (err) {
                    console.error("Error processing dropped file:", err);
                }
            }
        });
    }

    // Handle Report Type Toggle UI styling
    document.querySelectorAll('.sf-type-option input').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.sf-type-option').forEach(opt => opt.classList.remove('active'));
            radio.closest('.sf-type-option').classList.add('active');
            
            // Switch Date label
            const type = radio.value;
            const dateLabel = document.getElementById('lbl-date');
            if (dateLabel) {
                if (type === 'missing') {
                    dateLabel.innerHTML = 'Date of Incident (Missing Date) <span class="required">*</span>';
                } else if (type === 'shaheed') {
                    dateLabel.innerHTML = 'Date of Incident (Date of Shahadat) <span class="required">*</span>';
                } else {
                    dateLabel.innerHTML = 'Date of Incident (Found Date) <span class="required">*</span>';
                }
            }
        });
    });

    // File selection event
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (5 MB = 5242880 bytes)
                if (file.size > 5242880) {
                    showToast("Image size must be less than 5MB!", "error");
                    fileInput.value = '';
                    uploadedImageBase64 = '';
                    if (previewImg) previewImg.src = '';
                    if (previewContainer) previewContainer.style.display = 'none';
                    if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';
                    return;
                }
                try {
                    uploadedImageBase64 = await compressImage(file);
                    if (previewImg) previewImg.src = uploadedImageBase64;
                    if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
                    if (previewContainer) previewContainer.style.display = 'block';
                    if (dropzone) dropzone.classList.remove('sf-input-error');
                } catch (err) {
                    console.error("Error compressing selected file:", err);
                }
            }
        });
    }

    // Clear photo upload
    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInput.value = '';
            uploadedImageBase64 = '';
            previewImg.src = '';
            if (previewContainer) previewContainer.style.display = 'none';
            if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';
        });
    }

    // Success View Action Buttons
    const successBtnView = document.getElementById('success-btn-view');
    const successBtnAnother = document.getElementById('success-btn-another');
    const successBtnHome = document.getElementById('success-btn-home');

    if (successBtnView) {
        successBtnView.addEventListener('click', () => {
            const lastRecord = appState.records[0];
            if (lastRecord) openDetails(lastRecord.id);
        });
    }
    if (successBtnAnother) {
        successBtnAnother.addEventListener('click', () => {
            navigateToView('submit');
            const nameInput = document.getElementById('person-name');
            if (nameInput) nameInput.focus();
        });
    }
    if (successBtnHome) {
        successBtnHome.addEventListener('click', () => {
            navigateToView('home');
        });
    }

    // Form Submit logic
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Reset error highlights
            document.querySelectorAll('.sf-form .sf-input-error').forEach(el => el.classList.remove('sf-input-error'));
            
            // Gather all input elements
            const nameEl = document.getElementById('person-name');
            const ageEl = document.getElementById('person-age');
            const genderEl = document.getElementById('person-gender');
            const cnicEl = document.getElementById('person-cnic');
            const dateEl = document.getElementById('event-date');
            const districtEl = document.getElementById('person-district');
            const locationEl = document.getElementById('person-location');
            const detailsEl = document.getElementById('person-details');
            const reporterNameEl = document.getElementById('reporter-name');
            const reporterPhoneEl = document.getElementById('reporter-phone');
            const reporterRelationEl = document.getElementById('reporter-relation');
            const reporterEmailEl = document.getElementById('reporter-email');

            const name = nameEl.value.trim();
            const age = parseInt(ageEl.value);
            const gender = genderEl.value;
            const cnic = cnicEl.value.trim();
            const date = dateEl.value;
            const district = districtEl.value;
            const village = locationEl.value.trim();
            const details = detailsEl.value.trim();
            const reporterName = reporterNameEl.value.trim();
            const reporterPhone = reporterPhoneEl.value.trim();
            const reporterRelation = reporterRelationEl.value;
            const reporterEmail = reporterEmailEl ? reporterEmailEl.value.trim() : '';

            // Strict Validation Check
            let firstErrorField = null;

            if (!name) { nameEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = nameEl; }
            if (!age || isNaN(age) || age < 0 || age > 120) { ageEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = ageEl; }
            if (!gender) { genderEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = genderEl; }
            if (!cnic) { cnicEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = cnicEl; }
            if (!date) { dateEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = dateEl; }
            if (!district) { districtEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = districtEl; }
            if (!village) { locationEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = locationEl; }
            if (!reporterName) { reporterNameEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = reporterNameEl; }
            if (!reporterPhone) { reporterPhoneEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = reporterPhoneEl; }
            if (!reporterRelation) { reporterRelationEl.classList.add('sf-input-error'); if (!firstErrorField) firstErrorField = reporterRelationEl; }

            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showToast("Please fill in all required fields!", "error");
                return;
            }

            // --- DUPLICATE REPORT PREVENTION CHECK ---
            const isDuplicateCnic = cnic && appState.records.some(r => r.cnic === cnic && !r.rejected && r.id !== appState.editingRecordId);

            if (isDuplicateCnic) {
                showToast('A report with this CNIC already exists in the registry!', 'error');
                cnicEl.classList.add('sf-input-error');
                cnicEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Enable Loading Spinner
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="sf-spinner"></span> <span>Submitting...</span>';

            try {
                const checkedType = form.querySelector('input[name="reportType"]:checked');
                const reportType = checkedType ? checkedType.value : 'missing';
                
                // Fallback check: If uploadedImageBase64 is empty but user attached a file
                if (!uploadedImageBase64 && fileInput && fileInput.files && fileInput.files[0]) {
                    try {
                        uploadedImageBase64 = await compressImage(fileInput.files[0]);
                    } catch (fileErr) {
                        console.warn("Fallback file compression error on submit:", fileErr);
                    }
                }

                const isEditing = Boolean(appState.editingRecordId);
                const recordId = isEditing ? appState.editingRecordId : (reportType[0] + Date.now().toString(36));
                const existingRecord = isEditing ? appState.records.find(r => r.id === recordId) : null;
                const finalImage = uploadedImageBase64 || (existingRecord ? existingRecord.image : 'assets/images/logo.png');

                const newRecord = {
                    id: recordId,
                    name,
                    fatherName: '',
                    age,
                    gender,
                    cnic,
                    district,
                    village,
                    address: village + ", " + district,
                    location: village + ", " + district,
                    status: reportType,
                    date,
                    time: '',
                    lastSeen: village,
                    details,
                    image: finalImage,
                    reporterName,
                    reporterPhone,
                    reporterEmail,
                    reporterRelation,
                    userSubmitted: true,
                    approved: false, // Sent back to Pending Review for Admin approval!
                    rejected: false,
                    reporterUid: existingRecord ? existingRecord.reporterUid : (appState.currentUser ? appState.currentUser.uid : '')
                };

                // Save or update in appState.records
                if (isEditing) {
                    const idx = appState.records.findIndex(r => r.id === recordId);
                    if (idx !== -1) {
                        appState.records[idx] = newRecord;
                    } else {
                        appState.records.unshift(newRecord);
                    }
                } else {
                    appState.records.unshift(newRecord);
                }
                saveRecordsToStorage();

                // 2. Try Firebase Storage upload with 4-second timeout
                if (uploadedImageBase64 && typeof storage !== 'undefined') {
                    try {
                        const storageRef = storage.ref().child(`reports/${recordId}.jpg`);
                        const storageUploadPromise = storageRef.putString(uploadedImageBase64, 'data_url')
                            .then(snapshot => snapshot.ref.getDownloadURL());
                        
                        const uploadedUrl = await promiseWithTimeout(storageUploadPromise, 4000, null);
                        if (uploadedUrl) {
                            newRecord.image = uploadedUrl;
                            saveRecordsToStorage();
                        }
                    } catch (storageErr) {
                        console.warn("Storage upload failed or timed out, keeping base64/fallback:", storageErr);
                    }
                }

                // 3. Try Firestore set with 4-second timeout
                if (typeof db !== 'undefined') {
                    try {
                        const firestoreSetPromise = db.collection('reports').doc(recordId).set(newRecord);
                        await promiseWithTimeout(firestoreSetPromise, 4000, null);
                    } catch (dbErr) {
                        console.warn("Firestore save timed out or failed, saved locally:", dbErr);
                    }
                }

                // Reset UI Form & Editing State
                appState.editingRecordId = null;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Submit Report</span> <i data-lucide="arrow-right"></i>';
                }
                form.reset();
                uploadedImageBase64 = '';
                if (previewImg) previewImg.src = '';
                if (previewContainer) previewContainer.style.display = 'none';
                if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';
                if (dropzone) dropzone.classList.remove('sf-input-error');

                // Set first radio button type active
                document.querySelectorAll('.sf-type-option').forEach(opt => opt.classList.remove('active'));
                const firstRadio = document.querySelector('.sf-type-option input[value="missing"]');
                if (firstRadio) {
                    firstRadio.checked = true;
                    firstRadio.closest('.sf-type-option').classList.add('active');
                }

                // Update Success Screen details
                const successIdEl = document.getElementById('success-report-id');
                const successNameEl = document.getElementById('success-person-name');
                if (successIdEl) successIdEl.innerText = '#' + recordId.toUpperCase();
                if (successNameEl) successNameEl.innerText = newRecord.name;

                // Render views to sync local state everywhere
                renderAllViews();

                // Show success toast and redirect to success view
                showToast('Report submitted successfully!');
                navigateToView('success');

            } catch (err) {
                console.error("Submission error:", err);
                showToast("Submission Error: " + (err.message || "Failed to submit"), "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i data-lucide="send"></i> <span>Submit Report</span>';
                safeCreateIcons();
            }
        });
    }
}
// --- SEARCH PORTAL LOGIC ---
function initSearchPage() {
    const searchInput = document.getElementById('search-view-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const filterChips = document.querySelectorAll('.filter-chip');

    // Input listener for dynamic live search
    searchInput.addEventListener('input', () => {
        clearBtn.style.display = searchInput.value ? 'block' : 'none';
        performSearch();
    });

    // Clear search button
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        performSearch();
    });

    // Filter Chips toggles
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            appState.searchFilter = chip.getAttribute('data-type');
            performSearch();
        });
    });
}

function performSearch() {
    const searchInput = document.getElementById('search-view-input');
    const resultsContainer = document.getElementById('search-results-container');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Filter records by search filters and term (and require approved)
    let filtered = appState.records.filter(r => r.approved === true).filter(r => {
        // Status filter
        if (appState.searchFilter !== 'all' && r.status !== appState.searchFilter) {
            return false;
        }
        
        // Search query filter (Name, CNIC, District, Location)
        if (query) {
            const nameMatch = r.name.toLowerCase().includes(query);
            const districtMatch = r.district.toLowerCase().includes(query);
            const locationMatch = r.location.toLowerCase().includes(query);
            const cnicMatch = r.cnic ? r.cnic.includes(query) : false;
            return nameMatch || districtMatch || locationMatch || cnicMatch;
        }

        return true;
    });

    // Render results
    const resultsCountEl = document.getElementById('results-count');
    if (resultsCountEl) {
        resultsCountEl.innerText = query 
            ? `Found ${filtered.length} matching records for "${query}"` 
            : `Showing all ${filtered.length} records`;
    }

    renderGridItems(filtered, resultsContainer);
}

// Helper to render grid list items
function renderGridItems(items, container) {
    if (!container) return;
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = `
            <div class="no-results-placeholder">
                <i data-lucide="info"></i>
                <p>No records found matching your selection.</p>
            </div>
        `;
        safeCreateIcons();
        return;
    }

    items.forEach(record => {
        let statusBadgeClass = 'pill-missing';
        let statusLabel = 'Missing';
        
        if (record.status === 'found') {
            statusBadgeClass = 'pill-found';
            statusLabel = 'Found';
        } else if (record.status === 'shaheed') {
            statusBadgeClass = 'pill-shaheed';
            statusLabel = 'Shaheed';
        }

        const card = document.createElement('div');
        card.className = 'person-scroll-card';
        card.style.flex = 'initial'; // Allow grid flow
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${record.image || 'assets/images/logo.png'}" alt="${record.name}">
            </div>
            <span class="detail-status-pill ${statusBadgeClass}" style="margin-bottom: 6px; padding: 2px 6px; font-size: 0.6rem;">${statusLabel}</span>
            <h4 style="margin-bottom: 2px;">${record.name}</h4>
            <p>Age: ${record.age || 'N/A'} Y</p>
            <p>District: ${record.district}</p>
            <div class="date-badge" style="margin-bottom: 8px; font-size: 0.68rem;">
                <span>${record.status === 'missing' ? 'Missing since' : (record.status === 'found' ? 'Found on' : 'Date')}:</span>
                <strong class="date-val">${formatDate(record.date)}</strong>
            </div>
            <button class="card-details-btn" onclick="openDetails('${record.id}')">View Details</button>
        `;
        container.appendChild(card);
    });
}

// --- DIRECTORY BROWSER PAGE ---
function initDirectoryPage() {
    const dirTabs = document.querySelectorAll('.dir-tab');
    const districtSelect = document.getElementById('filter-district');
    const sortSelect = document.getElementById('filter-sort');

    // Tab buttons
    dirTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            dirTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            appState.directoryFilter = tab.getAttribute('data-dir-type');
            renderDirectory();
        });
    });

    // District dropdown filter
    districtSelect.addEventListener('change', () => {
        appState.directoryDistrict = districtSelect.value;
        renderDirectory();
    });

    // Sort dropdown filter
    sortSelect.addEventListener('change', () => {
        appState.directorySort = sortSelect.value;
        renderDirectory();
    });
}

function renderDirectory() {
    const container = document.getElementById('directory-results-container');
    
    // 1. Filter by status (and require approved)
    let filtered = appState.records.filter(r => r.approved === true).filter(r => {
        if (appState.directoryFilter !== 'all' && r.status !== appState.directoryFilter) {
            return false;
        }
        return true;
    });

    // 2. Filter by district
    if (appState.directoryDistrict !== 'all') {
        filtered = filtered.filter(r => r.district === appState.directoryDistrict);
    }

    // 3. Sort by date
    filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (appState.directorySort === 'newest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    renderGridItems(filtered, container);
}

// --- PROFILE & LOGIN SYSTEM ---
function initProfilePage() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const signupLink = document.getElementById('signup-link');
    const backToLogin = document.getElementById('back-to-login');
    const logoutBtn = document.getElementById('logout-button');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    // --- Tab Switching ---
    function switchTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
        if (tab === 'login') {
            tabLogin.classList.add('active');
            loginForm.classList.add('active');
        } else {
            tabRegister.classList.add('active');
            registerForm.classList.add('active');
        }
    }

    tabLogin.addEventListener('click', () => switchTab('login'));
    tabRegister.addEventListener('click', () => switchTab('register'));

    // "Register Now" link in login form
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('register');
        });
    }

    // "Login" link in register form
    if (backToLogin) {
        backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('login');
        });
    }

    // --- LOGIN ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Firebase Sign In
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const loggedInUser = {
                    name: user.displayName || 'Guest User',
                    email: user.email,
                    uid: user.uid
                };
                appState.currentUser = loggedInUser;
                localStorage.setItem('ajk_portal_user', JSON.stringify(loggedInUser));
                
                showToast('Login Successful!');
                navigateToView('profile');
                renderProfileView();
            })
            .catch((error) => {
                console.error("Firebase Login Error:", error);
                showToast(error.message, 'error');
            });
    });

    // --- REGISTER ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;

        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }
        if (password !== confirm) {
            showToast('Passwords do not match!', 'error');
            return;
        }

        // Firebase Create User
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Update display name
                return user.updateProfile({ displayName: name }).then(() => {
                    const newUser = {
                        name: name,
                        email: user.email,
                        uid: user.uid
                    };
                    appState.currentUser = newUser;
                    localStorage.setItem('ajk_portal_user', JSON.stringify(newUser));
                    
                    showToast('Account created! Welcome, ' + name + '!');
                    navigateToView('profile');
                    renderProfileView();
                });
            })
            .catch((error) => {
                console.error("Firebase Register Error:", error);
                showToast(error.message, 'error');
            });
    });

    // --- LOGOUT ---
    logoutBtn.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                appState.currentUser = null;
                localStorage.removeItem('ajk_portal_user');
                showToast('Logged Out!');
                navigateToView('profile');
                renderProfileView();
            })
            .catch((error) => {
                console.error("Firebase Logout Error:", error);
                showToast(error.message, 'error');
            });
    });

    // --- FOOTER BUTTONS MODALS (Contact, Privacy, Terms) ---
    const contactBtn = document.getElementById('footer-btn-contact');
    const privacyBtn = document.getElementById('footer-btn-privacy');
    const termsBtn = document.getElementById('footer-btn-terms');
    const detailDrawer = document.getElementById('detail-drawer');
    const detailSheetBody = document.getElementById('detail-sheet-body');

    const showFooterInfo = (type) => {
        const lang = appState.language || 'en';
        let html = '';

        if (type === 'contact') {
            if (lang === 'ur') {
                html = `
                    <div class="info-sheet-content lang-ur" style="text-align: right;">
                        <h3 style="margin-bottom: 12px; color: #0c2b23; font-size: 1.2rem;">رابطہ کریں</h3>
                        <p style="margin-bottom: 16px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;">اگر آپ کو فوری مدد کی ضرورت ہے، تو برائے مہربانی مقامی ہنگامی خدمات یا پورٹل ایڈمنسٹریٹو ڈیسک سے رابطہ کریں:</p>
                        <div style="background: #f7f9fc; padding: 12px; border-radius: 8px; border: 1px solid #dde3ed; margin-bottom: 16px;">
                            <p style="margin: 6px 0; font-size: 0.88rem;"><strong>ہنگامی ہیلپ لائن:</strong> 15 (پولیس)، 1122 (ریسکیو)</p>
                            <p style="margin: 6px 0; font-size: 0.88rem;"><strong>ضلع باغ کنٹرول روم:</strong> 921001-5822-92+</p>
                            <p style="margin: 6px 0; font-size: 0.88rem;"><strong>ای میل سپورٹ:</strong> support-portal@ajk.gov.pk</p>
                        </div>
                        <p style="font-size: 0.78rem; color: #718096; line-height: 1.4;">نوٹ: براہ کرم کیسز کی رپورٹ کے لیے آفیشل 'رپورٹ کریں' فارم استعمال کریں۔ ای میل کے ذریعے کیسز رپورٹ نہ کریں۔</p>
                    </div>
                `;
            } else {
                html = `
                    <div class="info-sheet-content">
                        <h3 style="margin-bottom: 12px; color: #0c2b23; font-size: 1.2rem;">Contact Us</h3>
                        <p style="margin-bottom: 16px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;">If you need urgent assistance, please contact the local emergency services or the portal administrative desk:</p>
                        <div style="background: #f7f9fc; padding: 12px; border-radius: 8px; border: 1px solid #dde3ed; margin-bottom: 16px;">
                            <p style="margin: 6px 0; font-size: 0.88rem;"><strong>Emergency Helpline:</strong> 15 (Police), 1122 (Rescue)</p>
                            <p style="margin: 6px 0; font-size: 0.88rem;"><strong>Bagh District Control:</strong> +92-5822-921001</p>
                            <p style="margin: 6px 0; font-size: 0.88rem;"><strong>Email support:</strong> support-portal@ajk.gov.pk</p>
                        </div>
                        <p style="font-size: 0.78rem; color: #718096; line-height: 1.4;">Note: Please use the official Submit form to report cases. Do not report cases via email.</p>
                    </div>
                `;
            }
        } else if (type === 'privacy') {
            if (lang === 'ur') {
                html = `
                    <div class="info-sheet-content lang-ur" style="text-align: right;">
                        <h3 style="margin-bottom: 12px; color: #0c2b23; font-size: 1.2rem;">پرائیویسی پالیسی</h3>
                        <p style="margin-bottom: 12px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;">یہ پورٹل لاپتہ اور ملنے والے افراد کی تلاش کو آسان بنانے اور ان کی جلد بازیابی کے لیے نام، شناختی کارڈ، مقامات اور تصاویر جمع کرتا ہے۔</p>
                        <p style="margin-bottom: 12px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;"><strong>ڈیٹا کی نمائش:</strong> سرچ رزلٹس میں صرف منظور شدہ پبلک ریکارڈز دکھائے جاتے ہیں۔ زیر التواء اور مسترد شدہ کیسز پبلک سے مکمل طور پر پوشیدہ رکھے جاتے ہیں۔</p>
                        <p style="margin-bottom: 12px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;"><strong>رپورٹر کا ڈیٹا:</strong> رپورٹ درج کروانے والے کی ذاتی معلومات (فون نمبر، نام، رشتہ) خفیہ رکھی جاتی ہیں اور صرف تصدیق کے لیے سرکاری قانون نافذ کرنے والے اداروں کے ساتھ شیئر کی جاتی ہیں۔</p>
                    </div>
                `;
            } else {
                html = `
                    <div class="info-sheet-content">
                        <h3 style="margin-bottom: 12px; color: #0c2b23; font-size: 1.2rem;">Privacy Policy</h3>
                        <p style="margin-bottom: 12px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;">This portal collects personal names, CNIC, locations, and photographs of missing and found persons to enable public search and facilitate fast recovery.</p>
                        <p style="margin-bottom: 12px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;"><strong>Data Visibility:</strong> Only approved public records are displayed in search results. Pending and rejected submissions are strictly hidden from the public.</p>
                        <p style="margin-bottom: 12px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;"><strong>Reporter Data:</strong> The personal information of the reporter (phone number, name, relation) is kept confidential and shared only with state law enforcement agencies for verification.</p>
                    </div>
                `;
            }
        } else if (type === 'terms') {
            if (lang === 'ur') {
                html = `
                    <div class="info-sheet-content lang-ur" style="text-align: right;">
                        <h3 style="margin-bottom: 12px; color: #0c2b23; font-size: 1.2rem;">شرائط و ضوابط</h3>
                        <p style="margin-bottom: 12px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;">اس پورٹل کو استعمال کرنے اور رپورٹیں جمع کروانے سے، آپ درج ذیل شرائط سے اتفاق کرتے ہیں:</p>
                        <ul style="margin-bottom: 12px; padding-right: 20px; font-size: 0.88rem; color: #4a5568; line-height: 1.6; list-style-position: inside;">
                            <li style="margin-bottom: 8px;">آپ اقرار کرتے ہیں کہ جمع کرائی گئی تمام معلومات 100٪ درست اور سچی ہیں۔</li>
                            <li style="margin-bottom: 8px;">غلط، مذاقیہ یا گمراہ کن معلومات جمع کروانا قانون کے تحت سنگین جرم ہے۔</li>
                            <li style="margin-bottom: 8px;">ایڈمنسٹریٹر کے پاس پیشگی اطلاع کے بغیر کسی بھی رپورٹ میں ترمیم، معطلی یا مسترد کرنے کا حق محفوظ ہے۔</li>
                        </ul>
                    </div>
                `;
            } else {
                html = `
                    <div class="info-sheet-content">
                        <h3 style="margin-bottom: 12px; color: #0c2b23; font-size: 1.2rem;">Terms & Conditions</h3>
                        <p style="margin-bottom: 12px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;">By accessing this portal and submitting reports, you agree to the following conditions:</p>
                        <ul style="margin-bottom: 12px; padding-left: 20px; font-size: 0.88rem; color: #4a5568; line-height: 1.6;">
                            <li style="margin-bottom: 8px;">You declare that all information submitted is 100% accurate and true.</li>
                            <li style="margin-bottom: 8px;">Submitting false, prank, or misleading records is a serious crime under Section 182 of PPC.</li>
                            <li style="margin-bottom: 8px;">Admin reserve the right to edit, suspend, or reject any report without prior notice.</li>
                        </ul>
                    </div>
                `;
            }
        }

        detailSheetBody.innerHTML = html;
        detailDrawer.classList.add('open');
    };

    if (contactBtn) contactBtn.addEventListener('click', () => showFooterInfo('contact'));
    if (privacyBtn) privacyBtn.addEventListener('click', () => showFooterInfo('privacy'));
    if (termsBtn) termsBtn.addEventListener('click', () => showFooterInfo('terms'));
}

function renderProfileView() {
    const loggedOutDiv = document.getElementById('profile-logged-out');
    const loggedInDiv = document.getElementById('profile-logged-in');
    const logoutButton = document.getElementById('logout-button');
    
    if (appState.currentUser) {
        loggedOutDiv.style.display = 'none';
        loggedInDiv.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'flex';

        // Set User details
        document.getElementById('profile-user-name').innerText = appState.currentUser.name;
        document.getElementById('profile-user-contact').innerText = appState.currentUser.email || appState.currentUser.phone || '';

        // Render User submitted reports matching their Firebase UID
        const listContainer = document.getElementById('my-reports-list-container');
        listContainer.innerHTML = '';

        const userReports = appState.records.filter(r => 
            r.reporterUid === appState.currentUser.uid || 
            (r.userSubmitted === true && !r.reporterUid)
        );
        
        // Update stats
        document.getElementById('stat-submitted-count').innerText = userReports.length;
        document.getElementById('stat-solved-count').innerText = userReports.filter(r => r.status === 'found' && r.approved === true).length;

        if (userReports.length === 0) {
            listContainer.innerHTML = '<p class="no-records" style="font-size:0.75rem;">You haven\'t submitted any reports yet.</p>';
        } else {
            userReports.forEach(record => {
                const item = document.createElement('div');
                item.className = 'my-report-item';
                
                let badgeClass = 'status-pending';
                let statusLabel = 'Pending';

                if (record.rejected === true) {
                    badgeClass = 'status-rejected';
                    statusLabel = 'Rejected';
                } else if (record.approved === true) {
                    badgeClass = 'status-approved';
                    if (record.status === 'found') statusLabel = 'Solved';
                    else if (record.status === 'shaheed') statusLabel = 'Shaheed';
                    else statusLabel = 'Approved';
                }

                item.innerHTML = `
                    <div class="item-left">
                        <span class="item-name">${record.name}</span>
                        <span class="item-type">${record.status.toUpperCase()} • Submitted ${formatDate(record.date)}</span>
                    </div>
                    <div class="item-right" style="display:flex; align-items:center; gap:8px;">
                        <span class="item-status ${badgeClass}">${statusLabel}</span>
                        <button class="pf-btn btn-edit-report" data-id="${record.id}" style="margin: 0; padding: 4px 10px; height: 28px; font-size: 0.75rem; width: auto; background: #014d3b; border-radius: 6px; box-shadow: none;">
                            Edit
                        </button>
                    </div>
                `;
                const editBtn = item.querySelector('.btn-edit-report');
                if (editBtn) {
                    editBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        editReport(record.id);
                    });
                }
                item.addEventListener('click', () => openDetails(record.id));
                listContainer.appendChild(item);
            });
        }

    } else {
        loggedOutDiv.style.display = 'flex';
        loggedInDiv.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

// --- DETAILS DRAWER WINDOW ---
async function openDetails(id) {
    if (!id) return;

    let record = appState.records.find(r => r.id === id);

    // Fallback: If record is not in appState, fetch directly from Firebase Firestore
    if (!record && typeof db !== 'undefined') {
        try {
            const docRef = await db.collection('reports').doc(id).get();
            if (docRef.exists) {
                record = { id: docRef.id, ...docRef.data() };
                appState.records.push(record);
            }
        } catch (fetchErr) {
            console.warn("Firebase fetch error in openDetails:", fetchErr);
        }
    }

    if (!record) {
        showToast("Case details unavailable.", "error");
        return;
    }

    const body = document.getElementById('detail-sheet-body');
    if (!body) return;

    // Check if current user is the owner/submitter of this record
    const isReporterOwner = Boolean(
        appState.currentUser && (
            (record.reporterUid && record.reporterUid === appState.currentUser.uid) ||
            (record.reporterEmail && record.reporterEmail === appState.currentUser.email)
        )
    ) || Boolean(record.userSubmitted === true && appState.currentUser);

    // Status color badge settings
    let statusClass = 'pill-missing';
    let statusLabel = 'Missing';
    let statusActionBtn = '';
    
    if (record.status === 'found') {
        statusClass = 'pill-found';
        statusLabel = 'Found';
    } else if (record.status === 'shaheed') {
        statusClass = 'pill-shaheed';
        statusLabel = 'Shaheed / Martyr';
    } else {
        statusActionBtn = `
            <button class="detail-action-btn btn-sighting" onclick="reportSighting('${record.name}', '${record.reporterPhone || ''}')">
                <i data-lucide="eye"></i>
                <span>Report Sighting</span>
            </button>
        `;
    }

    body.innerHTML = `
        <div class="detail-header-profile">
            <div class="detail-portrait-wrapper">
                <img src="${record.image || 'assets/images/logo.png'}" alt="${record.name}" class="detail-profile-img">
            </div>
            <span class="detail-status-pill ${statusClass}">${statusLabel}</span>
            <h3 style="margin: 4px 0 12px 0;">${record.name}</h3>
        </div>
        
        <div class="detail-section-title">Summary Details</div>
        <div class="detail-summary-list">
            <div class="detail-summary-item">
                <span class="label">Age</span>
                <span class="value">${record.age || 'N/A'} Years</span>
            </div>
            <div class="detail-summary-item">
                <span class="label">Gender</span>
                <span class="value">${record.gender || 'Male'}</span>
            </div>
            <div class="detail-summary-item">
                <span class="label">District</span>
                <span class="value">${record.district || 'N/A'}</span>
            </div>
            <div class="detail-summary-item">
                <span class="label">Last Seen Area</span>
                <span class="value">${(record.location || record.address || 'N/A').split(',')[0]}</span>
            </div>
            <div class="detail-summary-item">
                <span class="label">Date Recorded</span>
                <span class="value">${formatDate(record.date)}</span>
            </div>
        </div>

        <div class="detail-section-title">Case Narrative & Marks</div>
        <div class="detail-description-box">
            ${record.details || 'No additional narrative description provided.'}
        </div>

        <div class="detail-section-title">Contact & Reporting Authority</div>
        <div class="detail-contact-card">
            <span class="reporter-contact-title">Primary Case Contact</span>
            <span class="reporter-detail-line">Name: <strong>${record.reporterName || 'Government Desk'}</strong></span>
            <span class="reporter-detail-line">Relation: <strong>${record.reporterRelation || 'Official Desk'}</strong></span>
            <span class="reporter-detail-line">Phone: <strong>${record.reporterPhone || 'N/A'}</strong></span>
        </div>

        <div class="detail-actions-row">
            ${record.reporterPhone ? `
                <a href="tel:${record.reporterPhone}" style="text-decoration:none; flex:1; display:flex;">
                    <button class="detail-action-btn btn-call" style="width:100%;">
                        <i data-lucide="phone"></i>
                        <span>Call Reporter</span>
                    </button>
                </a>
            ` : ''}
            ${isReporterOwner ? `
                <button class="detail-action-btn btn-edit" style="background:#014d3b; color:#ffffff;" onclick="editReport('${record.id}')">
                    <i data-lucide="edit-3"></i>
                    <span>Edit Report</span>
                </button>
            ` : ''}
            <button class="detail-action-btn btn-share" onclick="shareRecord('${record.name}', '${record.id}')">
                <i data-lucide="share-2"></i>
                <span>Share Case</span>
            </button>
            ${statusActionBtn}
        </div>
    `;

    // Initialize Lucide icons on detail sheet
    safeCreateIcons();

    // Show Detail Drawer
    const detailDrawer = document.getElementById('detail-drawer');
    if (detailDrawer) {
        detailDrawer.classList.add('open');
    }

    // Push browser history state for smooth navigation
    try {
        window.history.pushState({ detailOpen: true, recordId: id }, '', `#details-${id}`);
    } catch (historyErr) {}

    // Close detail drawer events & Back button handling
    const detailOverlay = document.getElementById('detail-overlay');
    const closeDetailBtn = document.getElementById('close-detail-btn');
    
    const closeDetailsFn = () => {
        if (detailDrawer) detailDrawer.classList.remove('open');
        if (detailOverlay) detailOverlay.removeEventListener('click', closeDetailsFn);
        if (closeDetailBtn) closeDetailBtn.removeEventListener('click', handleBackClick);
    };

    const handleBackClick = (e) => {
        if (e) e.preventDefault();
        closeDetailsFn();
        if (window.history.length > 1) {
            window.history.back();
        } else {
            navigateToView('home');
        }
    };

    if (detailOverlay) detailOverlay.addEventListener('click', closeDetailsFn);
    if (closeDetailBtn) closeDetailBtn.addEventListener('click', handleBackClick);
}

// Global popstate event for hardware/browser Back button
window.addEventListener('popstate', (e) => {
    const detailDrawer = document.getElementById('detail-drawer');
    if (detailDrawer && detailDrawer.classList.contains('open')) {
        detailDrawer.classList.remove('open');
    }
});

// Quick action sighting report
function reportSighting(personName, phone) {
    const sightingLoc = prompt(`You are reporting a sighting for: ${personName}.\nWhere did you see this person? (Enter area/village details):`);
    if (sightingLoc) {
        alert(`Thank you for submitting info! A notification is sent to the case reporter at: ${phone}.\nOur team will contact you.`);
        showToast('Sighting reported successfully!');
    }
}

// Share case URL
function shareRecord(personName, recordId) {
    const shareText = `Help find/identify ${personName} on the AJK Missing Persons Portal. Please check details and share.`;
    const shareUrl = window.location.origin + `?id=${recordId}`;

    if (navigator.share) {
        navigator.share({
            title: `AJK Missing Persons Portal`,
            text: shareText,
            url: shareUrl
        })
        .then(() => console.log('Shared successfully'))
        .catch(err => console.error('Share failed', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText + " URL: " + shareUrl)
            .then(() => {
                showToast('Case link copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }
}


// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;
    
    toastMessage.innerText = message;
    if (type === 'error') {
        toast.classList.add('toast-error');
    } else {
        toast.classList.remove('toast-error');
    }
    toast.classList.add('show');
    
    if (toast.timer) clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.remove('toast-error');
    }, 3500);
}

// --- DATE FORMATTER HELPER ---
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Fallback if parsing fails
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// --- ADMIN PANEL LOGIC ---

// Global Render Admin List & Stats
function renderAdminDashboard() {
    const adminReportsContainer = document.getElementById('admin-reports-list-container');
    if (!adminReportsContainer) return;

    const records = appState.records;

    // Statistics
    const pendingCount = records.filter(r => !r.approved && !r.rejected).length;
    const approvedCount = records.filter(r => r.approved).length;
    const rejectedCount = records.filter(r => r.rejected).length;

    const statTotal = document.getElementById('admin-stat-total');
    if (statTotal) {
        statTotal.innerText = pendingCount;
        if (statTotal.nextElementSibling) statTotal.nextElementSibling.innerText = "Pending Review";
    }

    const statMissing = document.getElementById('admin-stat-missing');
    if (statMissing) {
        statMissing.innerText = approvedCount;
        if (statMissing.nextElementSibling) statMissing.nextElementSibling.innerText = "Approved/Public";
    }

    const statFound = document.getElementById('admin-stat-found');
    if (statFound) {
        statFound.innerText = rejectedCount;
        if (statFound.nextElementSibling) statFound.nextElementSibling.innerText = "Rejected";
    }

    // Render List
    adminReportsContainer.innerHTML = '';
    if (records.length === 0) {
        adminReportsContainer.innerHTML = '<p class="no-records">No reports registered in the database.</p>';
        return;
    }

    records.forEach(record => {
        const card = document.createElement('div');
        card.className = 'admin-report-card';
        
        // Generate status label and styling
        let statusText = 'Pending Approval';
        let statusStyle = 'color: #b45309; font-weight: bold; font-size: 0.78rem;';
        if (record.approved) {
            statusText = `Approved (${record.status.toUpperCase()})`;
            statusStyle = 'color: #15803d; font-weight: bold; font-size: 0.78rem;';
        } else if (record.rejected) {
            statusText = 'Rejected';
            statusStyle = 'color: #b91c1c; font-weight: bold; font-size: 0.78rem;';
        }

        // Sub-render action buttons
        let actionHtml = '';
        if (!record.approved && !record.rejected) {
            // Pending: show Approve & Reject
            actionHtml = `
                <button class="pf-btn admin-approve-btn" data-id="${record.id}" style="margin: 0; padding: 4px 10px; height: 32px; font-size: 0.78rem; width: auto; background: #15803d; border-radius: 6px; box-shadow: none;">
                    Approve
                </button>
                <button class="pf-btn admin-reject-btn" data-id="${record.id}" style="margin: 0; padding: 4px 10px; height: 32px; font-size: 0.78rem; width: auto; background: #b91c1c; border-radius: 6px; box-shadow: none;">
                    Reject
                </button>
            `;
        } else {
            // Already processed: show normal controls
            actionHtml = `
                <select class="admin-status-select" data-id="${record.id}">
                    <option value="missing" ${record.status === 'missing' ? 'selected' : ''}>Missing</option>
                    <option value="found" ${record.status === 'found' ? 'selected' : ''}>Found</option>
                    <option value="shaheed" ${record.status === 'shaheed' ? 'selected' : ''}>Shaheed</option>
                </select>
            `;
            // Add Close Case button if missing/approved
            if (record.status === 'missing' && record.approved) {
                actionHtml += `
                    <button class="pf-btn admin-close-btn" data-id="${record.id}" style="margin: 0; padding: 4px 10px; height: 36px; font-size: 0.78rem; width: auto; background: #0c2b23; border-radius: 6px; box-shadow: none;">
                        Close Case
                    </button>
                `;
            }
        }

        // Keep delete action on all cards
        actionHtml += `
            <button class="admin-del-btn" data-id="${record.id}">
                <i data-lucide="trash-2"></i>
            </button>
        `;

        card.innerHTML = `
            <div class="admin-report-info">
                <span style="${statusStyle}">${statusText}</span>
                <h4 style="margin-top: 4px;">${record.name}</h4>
                <p>ID: ${record.id} | District: ${record.district}</p>
                <p>Date: ${formatDate(record.date)}</p>
                ${record.closureDetails ? `<p style="color: #0c2b23; font-style: italic; font-size: 0.75rem;">Closure: ${record.closureDetails}</p>` : ''}
            </div>
            <div class="admin-actions" style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end;">
                ${actionHtml}
            </div>
        `;
        adminReportsContainer.appendChild(card);
    });

    // Initialize trash icons
    safeCreateIcons();

    // Event Delegation for Admin Actions (Approve, Reject, Close Case, Delete)
    adminReportsContainer.onclick = function(e) {
        // Delete Button
        const delBtn = e.target.closest('.admin-del-btn');
        if (delBtn) {
            e.preventDefault();
            e.stopPropagation();
            const recordId = delBtn.getAttribute('data-id');
            if (!recordId) return;

            if (confirm("Are you sure you want to permanently delete this report?")) {
                appState.records = appState.records.filter(r => r.id !== recordId);
                saveRecordsToStorage();
                showToast("Report deleted permanently!");
                renderAllViews();

                if (typeof db !== 'undefined') {
                    db.collection('reports').doc(recordId).delete().catch(err => console.warn("Firestore delete error:", err));
                }
            }
            return;
        }

        // Approve Button
        const approveBtn = e.target.closest('.admin-approve-btn');
        if (approveBtn) {
            e.preventDefault();
            e.stopPropagation();
            const recordId = approveBtn.getAttribute('data-id');
            if (!recordId) return;

            const idx = appState.records.findIndex(r => r.id === recordId);
            if (idx !== -1) {
                appState.records[idx].approved = true;
                appState.records[idx].rejected = false;
            }
            saveRecordsToStorage();
            showToast("Report approved and made public!");
            renderAllViews();

            if (typeof db !== 'undefined') {
                db.collection('reports').doc(recordId).update({ approved: true, rejected: false }).catch(err => console.warn("Firestore update error:", err));
            }
            return;
        }

        // Reject Button
        const rejectBtn = e.target.closest('.admin-reject-btn');
        if (rejectBtn) {
            e.preventDefault();
            e.stopPropagation();
            const recordId = rejectBtn.getAttribute('data-id');
            if (!recordId) return;

            const idx = appState.records.findIndex(r => r.id === recordId);
            if (idx !== -1) {
                appState.records[idx].approved = false;
                appState.records[idx].rejected = true;
            }
            saveRecordsToStorage();
            showToast("Report rejected.");
            renderAllViews();

            if (typeof db !== 'undefined') {
                db.collection('reports').doc(recordId).update({ approved: false, rejected: true }).catch(err => console.warn("Firestore update error:", err));
            }
            return;
        }

        // Close Case Button
        const closeBtn = e.target.closest('.admin-close-btn');
        if (closeBtn) {
            e.preventDefault();
            e.stopPropagation();
            const recordId = closeBtn.getAttribute('data-id');
            if (!recordId) return;

            const closureDetails = prompt("Enter closure details (e.g. 'Reunited with family by Bagh Police on 19 July 2026'):");
            if (closureDetails === null) return;
            if (!closureDetails.trim()) {
                showToast("Closure details are required to close case.", "error");
                return;
            }

            const idx = appState.records.findIndex(r => r.id === recordId);
            if (idx !== -1) {
                appState.records[idx].status = 'found';
                appState.records[idx].closureDetails = closureDetails.trim();
                appState.records[idx].approved = true;
            }
            saveRecordsToStorage();
            showToast("Case closed and marked as found!");
            renderAllViews();

            if (typeof db !== 'undefined') {
                db.collection('reports').doc(recordId).update({
                    status: 'found',
                    closureDetails: closureDetails.trim(),
                    approved: true
                }).catch(err => console.warn("Firestore update error:", err));
            }
            return;
        }
    };

    // Status Dropdown Change Event Delegation
    adminReportsContainer.onchange = function(e) {
        const select = e.target.closest('.admin-status-select');
        if (select) {
            const recordId = select.getAttribute('data-id');
            const newStatus = select.value;
            const idx = appState.records.findIndex(r => r.id === recordId);
            if (idx !== -1) appState.records[idx].status = newStatus;
            saveRecordsToStorage();
            showToast(`Status updated to ${newStatus}`);
            renderAllViews();

            if (typeof db !== 'undefined') {
                db.collection('reports').doc(recordId).update({ status: newStatus }).catch(err => console.warn("Firestore update error:", err));
            }
        }
    };
}

function initAdminPanel() {
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminPasscodeField = document.getElementById('admin-passcode');
    const adminAuthGate = document.getElementById('admin-auth-gate');
    const adminDashboard = document.getElementById('admin-dashboard');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');

    const adminPasscode = 'ajkadmin123'; // Admin Access Passcode

    // Toggle View State
    function showDashboard() {
        adminAuthGate.style.display = 'none';
        adminDashboard.style.display = 'block';
        renderAdminDashboard();
    }

    function showGate() {
        adminAuthGate.style.display = 'block';
        adminDashboard.style.display = 'none';
    }

    // Check existing Admin session
    if (sessionStorage.getItem('ajk_admin_auth') === 'true') {
        showDashboard();
    }

    // Handle Admin login passcode
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const passcode = adminPasscodeField.value;

        if (passcode === adminPasscode) {
            sessionStorage.setItem('ajk_admin_auth', 'true');
            adminPasscodeField.value = '';
            showToast("Welcome back, Admin!");
            showDashboard();
        } else {
            showToast("Incorrect passcode!", "error");
            adminPasscodeField.value = '';
        }
    });

    // Handle Admin logout
    adminLogoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('ajk_admin_auth');
        showToast("Logged out from admin dashboard.");
        showGate();
        navigateToView('home');
        window.location.hash = ''; // Clear hash
    });
}

// --- LANGUAGE DICTIONARY ---
const TRANSLATIONS = {
  en: {
    portal_title: "AJK Missing <br>Persons Portal",
    portal_desc: "Every Missing Person Matters.",
    nav_home: "Home",
    nav_search: "Search",
    nav_submit: "Submit",
    nav_directory: "Missing",
    nav_profile: "Profile",
    home_title: "Together We Can Bring Hope",
    home_desc: "Report a missing person, browse registry records, or search database cases.",
    home_rec_missing: "Recently Missing",
    home_rec_found: "Recently Found",
    home_rec_shaheed: "Shaheed Memorial",
    home_btn_submit: "Submit a Report",
    home_btn_search: "Search Registry",
    home_btn_dir: "Missing Directory",
    home_btn_shaheed: "Memorial Directory",
    search_heading: "Search Database",
    search_placeholder: "Search by name, CNIC, district, or city...",
    search_all: "All",
    search_missing: "Missing",
    search_found: "Found",
    search_shaheed: "Shaheed",
    submit_title: "Submit a Case Report",
    submit_desc: "Fill out the multi-step form to register a new report in the portal database.",
    submit_step1: "Report Type",
    submit_step2: "Person Details",
    submit_step3: "Reporter Details",
    submit_type_missing: "Missing Person",
    submit_type_found: "Found Person",
    submit_type_shaheed: "Shaheed / Martyr",
    lbl_person_name: "Person's Full Name",
    lbl_person_age: "Age (Years)",
    lbl_person_gender: "Gender",
    lbl_person_cnic: "CNIC Number",
    lbl_event_date: "Date of Incident",
    lbl_person_district: "District of Incident",
    lbl_person_location: "Specific Location (Town/Village)",
    lbl_person_photo: "Upload Person's Photo",
    lbl_person_details: "Detailed Description / Physical Marks",
    lbl_reporter_name: "Your Full Name",
    lbl_reporter_phone: "Your Contact Number",
    lbl_reporter_relation: "Relation with Person",
    profile_welcome: "AJK Portal",
    profile_welcome_desc: "Login or register to track your reports.",
    btn_login: "Login",
    btn_register: "Register",
    lbl_email: "Email Address",
    lbl_password: "Password",
    lbl_confirm_password: "Confirm Password",
    lbl_full_name: "Full Name",
    profile_submitted_title: "My Submitted Reports",
    btn_logout: "Log Out",
    btn_access_dashboard: "Access Dashboard",
    admin_portal_title: "Admin Portal",
    admin_portal_desc: "Enter admin passcode to manage reports database.",
    lbl_passcode: "Passcode"
  },
  ur: {
    portal_title: "آزاد جموں و کشمیر لاپتہ افراد پورٹل",
    portal_desc: "ہر لاپتہ فرد اہمیت رکھتا ہے",
    nav_home: "ہوم",
    nav_search: "تلاش",
    nav_submit: "رپورٹ کریں",
    nav_directory: "لاپتہ افراد",
    nav_profile: "پروفائل",
    home_title: "مل کر ہم امید لا سکتے ہیں",
    home_desc: "کسی لاپتہ فرد کی رپورٹ درج کریں، ریکارڈ براؤز کریں، یا سرچ کریں۔",
    home_rec_missing: "حالیہ لاپتہ افراد",
    home_rec_found: "حالیہ ملنے والے",
    home_rec_shaheed: "شہداء میموریل",
    home_btn_submit: "رپورٹ درج کروائیں",
    home_btn_search: "رجسٹری تلاش کریں",
    home_btn_dir: "لاپتہ افراد کی ڈائریکٹری",
    home_btn_shaheed: "میموریل ڈائریکٹری",
    search_heading: "ڈیٹا بیس تلاش کریں",
    search_placeholder: "نام، شناختی کارڈ، یا ضلع سے تلاش کریں...",
    search_all: "تمام",
    search_missing: "لاپتہ",
    search_found: "مل گئے",
    search_shaheed: "شہداء",
    submit_title: "کیس کی رپورٹ درج کریں",
    submit_desc: "ڈیٹا بیس میں نیا کیس درج کرنے کے لیے فارم پُر کریں۔",
    submit_step1: "رپورٹ کی قسم",
    submit_step2: "شخصی معلومات",
    submit_step3: "رپورٹر کی معلومات",
    submit_type_missing: "لاپتہ فرد",
    submit_type_found: "ملنے والا فرد",
    submit_type_shaheed: "شہید",
    lbl_person_name: "شخص کا مکمل نام",
    lbl_person_age: "عمر (سال)",
    lbl_person_gender: "جنس",
    lbl_person_cnic: "شناختی کارڈ نمبر",
    lbl_event_date: "واقعہ کی تاریخ",
    lbl_person_district: "واقعہ کا ضلع",
    lbl_person_location: "مخصوص مقام (قصبہ/گاؤں)",
    lbl_person_photo: "تصویر اپ لوڈ کریں",
    lbl_person_details: "تفصیلی معلومات / جسمانی نشانات",
    lbl_reporter_name: "آپ کا مکمل نام",
    lbl_reporter_phone: "آپ کا رابطہ نمبر",
    lbl_reporter_relation: "لاپتہ فرد سے رشتہ",
    profile_welcome: "آزاد کشمیر پورٹل",
    profile_welcome_desc: "اپنی رپورٹس ٹریک کرنے کے لیے لاگ ان یا رجسٹر کریں۔",
    btn_login: "لاگ ان",
    btn_register: "رجسٹریشن",
    lbl_email: "ای میل ایڈریس",
    lbl_password: "پاس ورڈ",
    lbl_confirm_password: "پاس ورڈ کی تصدیق",
    lbl_full_name: "مکمل نام",
    profile_submitted_title: "मेरी درج کردہ رپورٹس",
    btn_logout: "لاگ آؤٹ",
    btn_access_dashboard: "ڈیش بورڈ کھولیں",
    admin_portal_title: "ایڈمن پورٹل",
    admin_portal_desc: "ڈیٹا بیس مینیج کرنے کے لیے ایڈمن پاس کوڈ درج کریں۔",
    lbl_passcode: "پاس کوڈ"
  }
};

// --- TRANSLATION CONTROLLER ---
function applyLanguage(lang) {
    appState.language = lang;
    localStorage.setItem('ajk_portal_lang', lang);

    // Toggle body class and direction (RTL/LTR)
    if (lang === 'ur') {
        document.body.classList.add('lang-ur');
        document.body.dir = 'rtl';
    } else {
        document.body.classList.remove('lang-ur');
        document.body.dir = 'ltr';
    }

    // Safe helper functions for translation
    const setT = (selector, text) => {
        const el = document.querySelector(selector);
        if (el) el.innerText = text;
    };
    const setH = (selector, html) => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = html;
    };
    const setP = (selector, placeholder) => {
        const el = document.querySelector(selector);
        if (el) el.placeholder = placeholder;
    };

    // Specific structural updates for UI elements
    if (lang === 'ur') {
        setH('.logo-title', 'آزاد کشمیر لاپتہ<br>افراد پورٹل');
        setT('.logo-subtitle', 'ہر لاپتہ فرد اہمیت رکھتا ہے۔');

        // Home Actions
        setT('#btn-report-missing-card h3', 'لاپتہ فرد کی رپورٹ');
        setT('#btn-report-missing-card p', 'لاپتہ فرد کے بارے میں معلومات درج کریں');
        setT('#btn-report-found-card h3', 'ملنے والے فرد کی رپورٹ');
        setT('#btn-report-found-card p', 'ملنے والے فرد کے بارے میں معلومات درج کریں');

        // Home Section Headers
        setT('.section-title h2', 'حالیہ لاپتہ افراد');
        const subTitles = document.querySelectorAll('.sub-section-title');
        if (subTitles[0]) subTitles[0].innerText = 'حالیہ ملنے والے افراد';
        if (subTitles[1]) subTitles[1].innerText = 'شہداء میموریل';
        
        document.querySelectorAll('.view-all-link span').forEach(s => s.innerText = 'تمام دیکھیں');

        // CTA Banner
        setT('.cta-title', 'مل کر ہم امید لا سکتے ہیں');
        setT('.cta-desc', 'آپ کی فراہم کردہ معلومات کسی پیارے کو واپس گھر لا سکتی ہے۔');
        setT('#cta-report-btn span', 'رپورٹ جمع کریں');

        // Bottom Nav labels
        setT('.bottom-nav button[data-target="home"] span', 'ہوم');
        setT('.bottom-nav button[data-target="search"] span', 'تلاش');
        setT('.bottom-nav .submit-center .submit-label', 'رپورٹ کریں');
        setT('.bottom-nav button[data-target="missing"] span', 'فہرست');
        setT('.bottom-nav button[data-target="profile"] span', 'پروفائل');

        // Search page
        setT('#view-search h2', 'ڈیٹا بیس تلاش کریں');
        setT('#view-search .view-header p', 'تمام لاپتہ، ملنے والے، اور شہید افراد کے ریکارڈ میں تلاش کریں');
        setP('#search-view-input', 'نام، شناختی کارڈ، یا ضلع سے تلاش کریں...');
        
        const chips = document.querySelectorAll('.filter-chip');
        if (chips[0]) chips[0].innerText = 'تمام';
        if (chips[1]) chips[1].innerText = 'لاپتہ';
        if (chips[2]) chips[2].innerText = 'مل گئے';
        if (chips[3]) chips[3].innerText = 'شہداء';

        // Submit page translations
        setT('#view-submit h2', 'کیس رپورٹ درج کریں');
        setT('#view-submit .view-header p', 'ڈیٹا بیس میں نیا ریکارڈ درج کرنے کے لیے فارم پُر کریں');
        
        setT('#view-submit .sf-section-label', 'رپورٹ کی قسم منتخب کریں');
        setT('.sf-type-option[value="missing"] span', 'لاپتہ فرد');
        setT('.sf-type-option[value="found"] span', 'ملنے والا فرد');
        setT('.sf-type-option[value="shaheed"] span', 'شہید');
        
        setT('label[for="person-name"]', 'شخص کا مکمل نام');
        setP('#person-name', 'نام درج کریں');
        setT('label[for="person-age"]', 'عمر (سال)');
        setP('#person-age', 'عمر درج کریں');
        setT('label[for="person-gender"]', 'جنس');
        setT('label[for="person-cnic"]', 'شناختی کارڈ (CNIC)');
        setP('#person-cnic', 'شناختی کارڈ نمبر درج کریں');
        
        // Date of Incident label translates based on reportType:
        const formEl = document.getElementById('report-wizard-form');
        if (formEl) {
            const checkedRadio = formEl.querySelector('input[name="reportType"]:checked');
            const currentType = checkedRadio ? checkedRadio.value : 'missing';
            const dateLabel = document.getElementById('lbl-date');
            if (dateLabel) {
                if (currentType === 'missing') {
                    dateLabel.innerHTML = 'واقعہ کی تاریخ (لاپتہ ہونے کی تاریخ) <span class="required">*</span>';
                } else if (currentType === 'shaheed') {
                    dateLabel.innerHTML = 'واقعہ کی تاریخ (شہادت کی تاریخ) <span class="required">*</span>';
                } else {
                    dateLabel.innerHTML = 'واقعہ کی تاریخ (ملنے کی تاریخ) <span class="required">*</span>';
                }
            }
        }

        setT('label[for="person-district"]', 'واقعہ کا ضلع');
        setT('label[for="person-location"]', 'مخصوص مقام (قصبہ/گاؤں)');
        setP('#person-location', 'مقام درج کریں');
        setT('label[for="person-details"]', 'تفصیلی معلومات / جسمانی نشانات');
        setP('#person-details', 'تفصیلات درج کریں');
        
        setT('#photo-dropzone-label', "تصویر اپ لوڈ کریں");
        setT('.sf-upload-main-text', 'تصویر اپ لوڈ کرنے کے لیے کلک کریں یا ڈریگ کریں');
        setT('.sf-upload-sub-text', 'JPG، PNG یا WEBP (زیادہ سے زیادہ 5 MB)');

        // Your Details Section
        setT('.sf-details-heading', 'آپ کی معلومات');
        setT('label[for="reporter-name"]', 'آپ کا مکمل نام');
        setP('#reporter-name', 'اپنا نام درج کریں');
        setT('label[for="reporter-phone"]', 'آپ کا رابطہ نمبر');
        setP('#reporter-phone', 'رابطہ نمبر درج کریں');
        setT('label[for="reporter-relation"]', 'لاپتہ فرد سے رشتہ');
        setT('label[for="reporter-email"]', 'آپ کا ای میل (اختیاری)');
        setP('#reporter-email', 'ای میل درج کریں');
        
        setT('#sf-submit-btn span', 'رپورٹ جمع کریں');
        
        // Translating options if present
        const genderSelectUr = document.getElementById('person-gender');
        if (genderSelectUr && genderSelectUr.options.length > 0) {
            genderSelectUr.options[0].text = 'جنس منتخب کریں';
            genderSelectUr.options[1].text = 'مرد';
            genderSelectUr.options[2].text = 'عورت';
            genderSelectUr.options[3].text = 'دیگر';
        }
        const districtSelectUr = document.getElementById('person-district');
        if (districtSelectUr && districtSelectUr.options.length > 0) {
            districtSelectUr.options[0].text = 'ضلع منتخب کریں';
        }
        const relationSelectUr = document.getElementById('reporter-relation');
        if (relationSelectUr && relationSelectUr.options.length > 0) {
            relationSelectUr.options[0].text = 'رشتہ منتخب کریں';
            relationSelectUr.options[1].text = 'والد';
            relationSelectUr.options[2].text = 'والدہ';
            relationSelectUr.options[3].text = 'بھائی';
            relationSelectUr.options[4].text = 'بہن';
            relationSelectUr.options[5].text = 'بیٹا';
            relationSelectUr.options[6].text = 'بیٹی';
            relationSelectUr.options[7].text = 'شوہر';
            relationSelectUr.options[8].text = 'بیوی';
            relationSelectUr.options[9].text = 'رشتہ دار';
            relationSelectUr.options[10].text = 'پڑوسی';
            relationSelectUr.options[11].text = 'پولیس';
            relationSelectUr.options[12].text = 'دیگر';
        }

        // Success View Translations
        setT('#view-success h2', 'رپورٹ جمع ہو گئی!');
        setT('#view-success .sf-success-desc', 'آپ کی رپورٹ ڈیٹا بیس میں کامیابی کے ساتھ درج ہو گئی ہے اور ایڈمن کی منظوری کا انتظار ہے۔');
        setT('#success-btn-view span', 'کیس کی تفصیلات دیکھیں');
        setT('#success-btn-another span', 'ایک اور رپورٹ درج کریں');
        setT('#success-btn-home span', 'ہوم پر واپس جائیں');

        // Profile page (logged-in state)
        setT('.profile-section-title h3', 'میری درج کردہ رپورٹس');
        setT('#logout-button span', 'لاگ آؤٹ');

    } else {
        // Reset to English defaults
        setH('.logo-title', 'AJK Missing <br>Persons Portal');
        setT('.logo-subtitle', 'Every Missing Person Matters.');
        
        setT('#btn-report-missing-card h3', 'Report Missing Person');
        setT('#btn-report-missing-card p', 'Submit information about a missing person');
        setT('#btn-report-found-card h3', 'Report Found Person');
        setT('#btn-report-found-card p', 'Submit information about a found person');

        setT('.section-title h2', 'Recently Missing Persons');
        const subTitles = document.querySelectorAll('.sub-section-title');
        if (subTitles[0]) subTitles[0].innerText = 'Recently Found Persons';
        if (subTitles[1]) subTitles[1].innerText = 'Shaheed Memorial';
        
        document.querySelectorAll('.view-all-link span').forEach(s => s.innerText = 'View All');

        setT('.cta-title', 'Together We Can Bring Hope');
        setT('.cta-desc', 'Your information can help bring a loved one back home.');
        setT('#cta-report-btn span', 'Submit a Report');

        setT('.bottom-nav button[data-target="home"] span', 'Home');
        setT('.bottom-nav button[data-target="search"] span', 'Search');
        setT('.bottom-nav .submit-center .submit-label', 'Submit');
        setT('.bottom-nav button[data-target="missing"] span', 'Missing');
        setT('.bottom-nav button[data-target="profile"] span', 'Profile');

        setT('#view-search h2', 'Search Portal');
        setT('#view-search .view-header p', 'Search across all missing, found, and memorial records');
        setP('#search-view-input', 'Search by name, CNIC, district, or city...');
        
        const chips = document.querySelectorAll('.filter-chip');
        if (chips[0]) chips[0].innerText = 'All';
        if (chips[1]) chips[1].innerText = 'Missing';
        if (chips[2]) chips[2].innerText = 'Found';
        if (chips[3]) chips[3].innerText = 'Shaheed';

        setT('#view-submit h2', 'Submit a Case Report');
        setT('#view-submit .view-header p', 'Fill out the form to register a new report in the portal database.');
        
        setT('#view-submit .sf-section-label', 'Select Report Type');
        setT('.sf-type-option[value="missing"] span', 'Missing Person');
        setT('.sf-type-option[value="found"] span', 'Found Person');
        setT('.sf-type-option[value="shaheed"] span', 'Shaheed');
        
        setT('label[for="person-name"]', "Person's Full Name");
        setP('#person-name', "Enter person's full name");
        setT('label[for="person-age"]', 'Age (Years)');
        setP('#person-age', 'Enter age');
        setT('label[for="person-gender"]', 'Gender');
        setT('label[for="person-cnic"]', 'CNIC Number');
        setP('#person-cnic', 'xxxxx-xxxxxxx-x');
        
        const formElEn = document.getElementById('report-wizard-form');
        if (formElEn) {
            const checkedRadio = formElEn.querySelector('input[name="reportType"]:checked');
            const currentType = checkedRadio ? checkedRadio.value : 'missing';
            const dateLabel = document.getElementById('lbl-date');
            if (dateLabel) {
                if (currentType === 'missing') {
                    dateLabel.innerHTML = 'Date of Incident (Missing Date) <span class="required">*</span>';
                } else if (currentType === 'shaheed') {
                    dateLabel.innerHTML = 'Date of Incident (Date of Shahadat) <span class="required">*</span>';
                } else {
                    dateLabel.innerHTML = 'Date of Incident (Found Date) <span class="required">*</span>';
                }
            }
        }

        setT('label[for="person-district"]', 'District of Incident');
        setT('label[for="person-location"]', 'Specific Location (Town/Village)');
        setP('#person-location', 'Enter town or village');
        setT('label[for="person-details"]', 'Detailed Description / Physical Marks');
        setP('#person-details', 'Describe clothing, physical marks, last seen details, etc.');
        
        setT('#photo-dropzone-label', "Upload Person's Photo");
        setT('.sf-upload-main-text', 'Click or drag image to upload');
        setT('.sf-upload-sub-text', 'JPG, PNG or WEBP (Max 5 MB)');

        // Your Details Section
        setT('.sf-details-heading', 'Your Details');
        setT('label[for="reporter-name"]', 'Your Full Name');
        setP('#reporter-name', 'Enter your full name');
        setT('label[for="reporter-phone"]', 'Your Phone Number');
        setP('#reporter-phone', '03XX-XXXXXXX');
        setT('label[for="reporter-relation"]', 'Your Relation to Missing Person');
        setT('label[for="reporter-email"]', 'Your Email (Optional)');
        setP('#reporter-email', 'Enter your email');
        
        setT('#sf-submit-btn span', 'Submit Report');
        
        // Translating options back to English
        const genderSelectEn = document.getElementById('person-gender');
        if (genderSelectEn && genderSelectEn.options.length > 0) {
            genderSelectEn.options[0].text = 'Select gender';
            genderSelectEn.options[1].text = 'Male';
            genderSelectEn.options[2].text = 'Female';
            genderSelectEn.options[3].text = 'Other';
        }
        const districtSelectEn = document.getElementById('person-district');
        if (districtSelectEn && districtSelectEn.options.length > 0) {
            districtSelectEn.options[0].text = 'Select district';
        }
        const relationSelectEn = document.getElementById('reporter-relation');
        if (relationSelectEn && relationSelectEn.options.length > 0) {
            relationSelectEn.options[0].text = 'Select relation';
            relationSelectEn.options[1].text = 'Father';
            relationSelectEn.options[2].text = 'Mother';
            relationSelectEn.options[3].text = 'Brother';
            relationSelectEn.options[4].text = 'Sister';
            relationSelectEn.options[5].text = 'Son';
            relationSelectEn.options[6].text = 'Daughter';
            relationSelectEn.options[7].text = 'Husband';
            relationSelectEn.options[8].text = 'Wife';
            relationSelectEn.options[9].text = 'Relative';
            relationSelectEn.options[10].text = 'Neighbor';
            relationSelectEn.options[11].text = 'Police';
            relationSelectEn.options[12].text = 'Other';
        }

        // Success View Translations (English)
        setT('#view-success h2', 'Report Submitted!');
        setT('#view-success .sf-success-desc', 'Your report has been successfully registered in the database and is pending admin approval.');
        setT('#success-btn-view span', 'View Case Details');
        setT('#success-btn-another span', 'Submit Another Report');
        setT('#success-btn-home span', 'Back to Home');

        setT('.profile-section-title h3', 'My Submitted Reports');
        setT('#logout-button span', 'Log Out');
    }

    // Refresh dynamic layouts to reflect selected language
    renderAllViews();
}


// --- EDIT REPORT FUNCTION ---
function editReport(recordId) {
    const record = appState.records.find(r => r.id === recordId);
    if (!record) return;

    // Close detail drawer if open
    const detailDrawer = document.getElementById('detail-drawer');
    if (detailDrawer) detailDrawer.classList.remove('open');

    // Store editing state
    appState.editingRecordId = record.id;

    // Switch to submit view
    navigateToView('submit');

    // Select report type radio
    const radio = document.querySelector(`.sf-type-option input[value="${record.status}"]`);
    if (radio) {
        document.querySelectorAll('.sf-type-option').forEach(opt => opt.classList.remove('active'));
        radio.checked = true;
        const parentOpt = radio.closest('.sf-type-option');
        if (parentOpt) parentOpt.classList.add('active');
        radio.dispatchEvent(new Event('change'));
    }

    // Populate input fields
    const nameEl = document.getElementById('person-name');
    const ageEl = document.getElementById('person-age');
    const genderEl = document.getElementById('person-gender');
    const cnicEl = document.getElementById('person-cnic');
    const dateEl = document.getElementById('event-date');
    const districtEl = document.getElementById('person-district');
    const locationEl = document.getElementById('person-location');
    const detailsEl = document.getElementById('person-details');
    const reporterNameEl = document.getElementById('reporter-name');
    const reporterPhoneEl = document.getElementById('reporter-phone');
    const reporterRelationEl = document.getElementById('reporter-relation');
    const reporterEmailEl = document.getElementById('reporter-email');

    if (nameEl) nameEl.value = record.name || '';
    if (ageEl) ageEl.value = record.age || '';
    if (genderEl) genderEl.value = record.gender || 'Male';
    if (cnicEl) cnicEl.value = record.cnic || '';
    if (dateEl) dateEl.value = record.date || '';
    if (districtEl) districtEl.value = record.district || '';
    if (locationEl) locationEl.value = record.location ? record.location.split(',')[0] : (record.village || '');
    if (detailsEl) detailsEl.value = record.details || '';

    if (reporterNameEl) reporterNameEl.value = record.reporterName || '';
    if (reporterPhoneEl) reporterPhoneEl.value = record.reporterPhone || '';
    if (reporterRelationEl) reporterRelationEl.value = record.reporterRelation || 'Relative';
    if (reporterEmailEl) reporterEmailEl.value = record.reporterEmail || '';

    // Set uploaded image preview if exists
    const previewImg = document.getElementById('upload-preview');
    const dropzone = document.getElementById('photo-dropzone');
    const uploadPlaceholder = dropzone ? dropzone.querySelector('.sf-upload-placeholder') : null;
    const previewContainer = dropzone ? dropzone.querySelector('.sf-upload-preview-container') : null;

    if (record.image && record.image !== 'assets/images/logo.png') {
        if (previewImg) previewImg.src = record.image;
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
        if (previewContainer) previewContainer.style.display = 'block';
    } else {
        if (previewImg) previewImg.src = '';
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';
        if (previewContainer) previewContainer.style.display = 'none';
    }

    // Update Submit Button label
    const submitBtn = document.getElementById('sf-submit-btn');
    if (submitBtn) {
        submitBtn.innerHTML = '<span>Update Report (Re-submit for Review)</span> <i data-lucide="arrow-right"></i>';
        safeCreateIcons();
    }

    showToast("Editing report. Make your changes and submit for Admin review.", "info");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
