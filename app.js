/* ==========================================================================
   AJK MISSING PERSONS PORTAL - APPLICATION LOGIC (Vanilla JS)
   ========================================================================== */

// --- INITIAL DATA SEED ---
const DEFAULT_RECORDS = [
    {
        id: "m1",
        name: "Muhammad Ali",
        age: 23,
        gender: "Male",
        district: "Muzaffarabad",
        location: "Chatter, Muzaffarabad",
        status: "missing",
        date: "2024-05-12",
        details: "Muhammad Ali went missing from Muzaffarabad Chatter bazaar on 12 May 2024. He is approximately 5 feet 9 inches tall, brown eyes, and was wearing a brown shalwar kameez. He has a birthmark on the right side of his neck. Any leads should be immediately reported to the family.",
        image: "assets/images/ali.png",
        reporterName: "Zahid Ali",
        reporterPhone: "0300-1234567",
        reporterRelation: "Brother"
    },
    {
        id: "m2",
        name: "Sajid Hussain",
        age: 19,
        gender: "Male",
        district: "Bagh",
        location: "Main Chowk, Bagh City",
        status: "missing",
        date: "2024-05-10",
        details: "Sajid went out for college admissions and did not return. He was wearing a blue shirt and black pants. Height is 5'7\", black hair, and fair complexion. He speaks local Pahari/Urdu. Family is extremely worried.",
        image: "assets/images/hussain.png",
        reporterName: "Farooq Hussain",
        reporterPhone: "0312-9876543",
        reporterRelation: "Father"
    },
    {
        id: "m3",
        name: "Irfan Ahmed",
        age: 27,
        gender: "Male",
        district: "Neelum",
        location: "Kutton, Neelum Valley",
        status: "missing",
        date: "2024-05-09",
        details: "Irfan Ahmed went missing during travel near Kutton, Neelum Valley. He is 27 years old, has a short beard, wearing a green polo shirt and jeans. He has a slight limp in his left leg. He was carrying a backpack.",
        image: "assets/images/irfan.png",
        reporterName: "Shakeel Ahmed",
        reporterPhone: "0345-5678901",
        reporterRelation: "Cousin"
    },
    {
        id: "m4",
        name: "Yaseen Khan",
        age: 22,
        gender: "Male",
        district: "Haveli",
        location: "Forward Kahuta, Haveli",
        status: "missing",
        date: "2024-05-08",
        details: "Yaseen was last seen near his shop in Forward Kahuta. He is 22, clean-shaven, wearing dark navy blue dress shirt and trousers. If anyone has seen him, please contact the family or local police immediately.",
        image: "assets/images/yaseen.png",
        reporterName: "Maryam Bibi",
        reporterPhone: "0333-1122334",
        reporterRelation: "Mother"
    },
    {
        id: "f1",
        name: "Bilal Ahmed",
        age: 20,
        gender: "Male",
        district: "Bhimber",
        location: "Samahni Road, Bhimber",
        status: "found",
        date: "2024-05-14",
        details: "Bilal was found safe and sound near Samahni Road, Bhimber by locals and reunited with his family through police assistance. Thanks to everyone who shared the information and helped.",
        image: "assets/images/bilal.png",
        reporterName: "Bhimber Police Authority",
        reporterPhone: "05828-920100",
        reporterRelation: "Authority"
    },
    {
        id: "s1",
        name: "Aamir Rashid",
        age: 25,
        gender: "Male",
        district: "Kotli",
        location: "Nakyal Sector, Kotli",
        status: "shaheed",
        date: "2024-05-16",
        details: "Aamir Rashid embraced martyrdom on 16 May 2024 while serving the community in Kotli district. He is remembered for his ultimate sacrifice, valor, and dedication to Azad Jammu and Kashmir. We will never forget their sacrifice.",
        image: "assets/images/aamir.png",
        reporterName: "District Welfare Board Kotli",
        reporterPhone: "05826-920202",
        reporterRelation: "Memorial Committee"
    }
];

// --- STATE MANAGEMENT ---
let appState = {
    records: [],
    currentView: 'home',
    currentUser: null,
    wizardStep: 1,
    searchFilter: 'all',
    directoryFilter: 'all',
    directoryDistrict: 'all',
    directorySort: 'newest'
};

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initAppState();
    initRouter();
    initWizardForm();
    initSearchPage();
    initDirectoryPage();
    initProfilePage();
    renderAllViews();
    
    // Initialize Lucide Icons
    lucide.createIcons();
});

// Load records from LocalStorage or seed with default records
function initAppState() {
    const savedRecords = localStorage.getItem('ajk_portal_records');
    if (savedRecords) {
        appState.records = JSON.parse(savedRecords);
    } else {
        appState.records = [...DEFAULT_RECORDS];
        localStorage.setItem('ajk_portal_records', JSON.stringify(appState.records));
    }

    // Check logged in user
    const savedUser = localStorage.getItem('ajk_portal_user');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
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
        document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('active'));
        radioInput.closest('.type-option').classList.add('active');

        // Update step 2 label based on report type
        const dateLabel = document.getElementById('lbl-date');
        if (type === 'missing') {
            dateLabel.innerHTML = 'Date Missing <span class="required">*</span>';
        } else {
            dateLabel.innerHTML = 'Date Found <span class="required">*</span>';
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
            lucide.createIcons();
            localStorage.setItem('ajk_portal_theme', isDark ? 'dark' : 'light');
        });
    }

    // Check saved theme preference
    const savedTheme = localStorage.getItem('ajk_portal_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeBtn) themeBtn.innerHTML = '<i data-lucide="sun"></i> Light Mode';
        lucide.createIcons();
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
}

// Render dynamic items in Home View
function renderHomeViews() {
    const missingContainer = document.getElementById('recently-missing-container');
    const foundContainer = document.getElementById('recently-found-container');
    const shaheedContainer = document.getElementById('shaheed-memorial-container');

    // 1. Recently Missing (horizontal scroll cards)
    const missingRecords = appState.records.filter(r => r.status === 'missing').slice(0, 5);
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
                <p>Age: ${record.age} Years</p>
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

    // 2. Recently Found (horizontal list layout)
    const foundRecords = appState.records.filter(r => r.status === 'found').slice(0, 1);
    foundContainer.innerHTML = '';
    
    if (foundRecords.length === 0) {
        foundContainer.innerHTML = '<div class="no-records">No found reports registered.</div>';
    } else {
        foundRecords.forEach(record => {
            const card = document.createElement('div');
            card.className = 'horizontal-list-card';
            card.innerHTML = `
                <div class="h-card-content">
                    <div class="h-card-img-container">
                        <img src="${record.image || 'assets/images/logo.png'}" alt="${record.name}">
                    </div>
                    <div class="h-card-info">
                        <h4>${record.name}</h4>
                        <p>Age: ${record.age} Years</p>
                        <p>District: ${record.district}</p>
                        <p>Found on: <strong class="found-date">${formatDate(record.date)}</strong></p>
                    </div>
                </div>
                <button class="h-card-btn" onclick="openDetails('${record.id}')">View Details</button>
            `;
            foundContainer.appendChild(card);
        });
    }

    // 3. Shaheed Memorial
    const shaheedRecords = appState.records.filter(r => r.status === 'shaheed').slice(0, 1);
    shaheedContainer.innerHTML = '';
    
    if (shaheedRecords.length === 0) {
        shaheedContainer.innerHTML = '<div class="no-records">No memorial records registered.</div>';
    } else {
        shaheedRecords.forEach(record => {
            const card = document.createElement('div');
            card.className = 'horizontal-list-card';
            card.innerHTML = `
                <div class="h-card-content">
                    <div class="h-card-img-container">
                        <img src="${record.image || 'assets/images/logo.png'}" alt="${record.name}">
                    </div>
                    <div class="h-card-info">
                        <h4>${record.name}</h4>
                        <p>District: ${record.district}</p>
                        <p>Date: ${formatDate(record.date)}</p>
                        <p class="shaheed-quote">"We will never forget their sacrifice."</p>
                    </div>
                </div>
                <button class="h-card-btn" onclick="openDetails('${record.id}')">View Details</button>
            `;
            shaheedContainer.appendChild(card);
        });
    }
}

// --- FORM WIZARD (SUBMIT REPORT) ---
function initWizardForm() {
    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const submitBtn = document.getElementById('wizard-submit-btn');
    const form = document.getElementById('report-wizard-form');
    
    // File inputs preview
    const fileInput = document.getElementById('person-photo');
    const dropzone = document.getElementById('photo-dropzone');
    const uploadPlaceholder = dropzone.querySelector('.upload-placeholder');
    const previewContainer = dropzone.querySelector('.upload-preview-container');
    const previewImg = document.getElementById('upload-preview');
    const removePhotoBtn = document.getElementById('remove-photo-btn');
    
    let uploadedImageBase64 = '';

    // Handle Report Type Toggle UI styling
    document.querySelectorAll('.type-option input').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('active'));
            radio.closest('.type-option').classList.add('active');
            
            // Switch Step 2 Date label
            const type = radio.value;
            const dateLabel = document.getElementById('lbl-date');
            if (type === 'missing') {
                dateLabel.innerHTML = 'Date Missing <span class="required">*</span>';
            } else {
                dateLabel.innerHTML = 'Date Found <span class="required">*</span>';
            }
        });
    });

    // File selection event
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImageBase64 = event.target.result;
                previewImg.src = uploadedImageBase64;
                uploadPlaceholder.style.display = 'none';
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Clear photo upload
    removePhotoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.value = '';
        uploadedImageBase64 = '';
        previewImg.src = '';
        previewContainer.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
    });

    // Wizard Next navigation button click
    nextBtn.addEventListener('click', () => {
        if (validateStep(appState.wizardStep)) {
            goToStep(appState.wizardStep + 1);
        }
    });

    // Wizard Back navigation button click
    prevBtn.addEventListener('click', () => {
        goToStep(appState.wizardStep - 1);
    });

    // Wizard step control
    function goToStep(step) {
        // Remove active class from all step contents and numbers
        document.querySelectorAll('.wizard-step-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.progress-step').forEach(el => {
            el.classList.remove('active');
            if (parseInt(el.getAttribute('data-step')) < step) {
                el.classList.add('completed');
            } else {
                el.classList.remove('completed');
            }
        });
        
        // Show current step content
        const targetContent = document.querySelector(`.wizard-step-content[data-step="${step}"]`);
        const targetStepProgress = document.querySelector(`.progress-step[data-step="${step}"]`);
        
        if (targetContent) targetContent.classList.add('active');
        if (targetStepProgress) targetStepProgress.classList.add('active');
        
        appState.wizardStep = step;
        
        // Button navigation controls
        prevBtn.disabled = (step === 1);
        
        if (step === 3) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
    }

    // Step field validation
    function validateStep(step) {
        const stepContainer = document.querySelector(`.wizard-step-content[data-step="${step}"]`);
        const inputs = stepContainer.querySelectorAll('[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Form Submit logic
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateStep(appState.wizardStep)) return;

        // Gather all variables
        const reportType = form.querySelector('input[name="reportType"]:checked').value;
        const name = document.getElementById('person-name').value;
        const age = parseInt(document.getElementById('person-age').value);
        const gender = document.getElementById('person-gender').value;
        const cnic = document.getElementById('person-cnic').value;
        const date = document.getElementById('event-date').value;
        const district = document.getElementById('person-district').value;
        const location = document.getElementById('person-location').value;
        const details = document.getElementById('person-details').value;
        const reporterName = document.getElementById('reporter-name').value;
        const reporterPhone = document.getElementById('reporter-phone').value;
        const reporterRelation = document.getElementById('reporter-relation').value;

        // Create new record
        const newRecord = {
            id: reportType[0] + Date.now().toString(36), // e.g. m_lhg12345
            name,
            age,
            gender,
            district,
            location: location + ", " + district,
            status: reportType,
            date,
            details,
            image: uploadedImageBase64 || 'assets/images/logo.png', // Fallback to logo
            reporterName,
            reporterPhone,
            reporterRelation,
            userSubmitted: true // Flag to identify user reports
        };

        // Insert at start of array
        appState.records.unshift(newRecord);
        saveRecordsToStorage();

        // Reset Form
        form.reset();
        uploadedImageBase64 = '';
        previewImg.src = '';
        previewContainer.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        
        // Go back to Step 1
        goToStep(1);
        
        // Trigger Toast Success
        showToast('Report submitted successfully! Re-indexing...');

        // Update views and redirect to Missing directory
        renderAllViews();
        setTimeout(() => {
            navigateToView('missing');
        }, 1000);
    });
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
    
    // Filter records by search filters and term
    let filtered = appState.records.filter(r => {
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
        lucide.createIcons();
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
    
    // 1. Filter by status
    let filtered = appState.records.filter(r => {
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
    const signupLink = document.getElementById('signup-link');
    const logoutBtn = document.getElementById('logout-button');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const contact = document.getElementById('login-email').value;
        
        // Mock Login success
        const mockUser = {
            name: "Zahid Ali Butt",
            email: contact.includes('@') ? contact : 'zahid.ali@example.com',
            phone: !contact.includes('@') ? contact : '0300-1234567'
        };

        appState.currentUser = mockUser;
        localStorage.setItem('ajk_portal_user', JSON.stringify(mockUser));
        
        showToast('Login Successful!');
        navigateToView('profile');
    });

    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Registration Desk is currently linked to the AJK Identity Portal. Please contact your nearest facilitation center.');
    });

    logoutBtn.addEventListener('click', () => {
        appState.currentUser = null;
        localStorage.removeItem('ajk_portal_user');
        showToast('Logged Out!');
        navigateToView('profile');
    });
}

function renderProfileView() {
    const loggedOutDiv = document.getElementById('profile-logged-out');
    const loggedInDiv = document.getElementById('profile-logged-in');
    
    if (appState.currentUser) {
        loggedOutDiv.style.display = 'none';
        loggedInDiv.style.display = 'block';

        // Set User details
        document.getElementById('profile-user-name').innerText = appState.currentUser.name;
        document.getElementById('profile-user-contact').innerText = appState.currentUser.email || appState.currentUser.phone;

        // Render User submitted reports
        const listContainer = document.getElementById('my-reports-list-container');
        listContainer.innerHTML = '';

        const userReports = appState.records.filter(r => r.userSubmitted === true);
        
        // Update stats
        document.getElementById('stat-submitted-count').innerText = userReports.length;
        document.getElementById('stat-solved-count').innerText = userReports.filter(r => r.status === 'found').length;

        if (userReports.length === 0) {
            listContainer.innerHTML = '<p class="no-records" style="font-size:0.75rem;">You haven\'t submitted any reports yet.</p>';
        } else {
            userReports.forEach(record => {
                const item = document.createElement('div');
                item.className = 'my-report-item';
                
                let badgeClass = 'status-pending';
                let statusLabel = 'Pending Review';

                if (record.status === 'found') {
                    badgeClass = 'status-approved';
                    statusLabel = 'Solved';
                } else if (record.status === 'missing') {
                    // Let's say user reports show "Active search"
                    badgeClass = 'status-approved';
                    statusLabel = 'Active Search';
                }

                item.innerHTML = `
                    <div class="item-left">
                        <span class="item-name">${record.name}</span>
                        <span class="item-type">${record.status.toUpperCase()} • Submitted ${formatDate(record.date)}</span>
                    </div>
                    <span class="item-status ${badgeClass}">${statusLabel}</span>
                `;
                // Add click event to item to open details
                item.addEventListener('click', () => openDetails(record.id));
                listContainer.appendChild(item);
            });
        }

    } else {
        loggedOutDiv.style.display = 'flex';
        loggedInDiv.style.display = 'none';
    }
}

// --- DETAILS DRAWER WINDOW ---
function openDetails(id) {
    const record = appState.records.find(r => r.id === id);
    if (!record) return;

    const body = document.getElementById('detail-sheet-body');
    
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
        // Provide "Report a Sighting" button for active missing people
        statusActionBtn = `
            <button class="detail-action-btn btn-sighting" onclick="reportSighting('${record.name}', '${record.reporterPhone}')">
                <i data-lucide="eye"></i>
                <span>Report Sighting</span>
            </button>
        `;
    }

    body.innerHTML = `
        <img src="${record.image || 'assets/images/logo.png'}" alt="${record.name}" class="detail-profile-img">
        
        <span class="detail-status-pill ${statusClass}">${statusLabel}</span>
        
        <h3>${record.name}</h3>
        
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
                <span class="value">${record.district}</span>
            </div>
            <div class="detail-summary-item">
                <span class="label">Last Seen Area</span>
                <span class="value">${record.location.split(',')[0]}</span>
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
            <button class="detail-action-btn btn-share" onclick="shareRecord('${record.name}', '${record.id}')">
                <i data-lucide="share-2"></i>
                <span>Share Case</span>
            </button>
            ${statusActionBtn}
        </div>
    `;

    // Initialize Lucide icons on detail sheet
    lucide.createIcons();

    // Show Detail Drawer
    const detailDrawer = document.getElementById('detail-drawer');
    detailDrawer.classList.add('open');

    // Close detail drawer events
    const detailOverlay = document.getElementById('detail-overlay');
    const closeDetailBtn = document.getElementById('close-detail-btn');
    
    const closeDetailsFn = () => {
        detailDrawer.classList.remove('open');
        detailOverlay.removeEventListener('click', closeDetailsFn);
        closeDetailBtn.removeEventListener('click', closeDetailsFn);
    };

    detailOverlay.addEventListener('click', closeDetailsFn);
    closeDetailBtn.addEventListener('click', closeDetailsFn);
}

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
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- DATE FORMATTER HELPER ---
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Fallback if parsing fails
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
