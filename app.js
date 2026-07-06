// IT Internship Attendance & Logbook Portal - Application Logic

// --- DATA SCHEMA & INITIAL SEEDING ---
const SEED_DATA = {
    students: [
        {
            matric: "UI/2022/CS/101",
            name: "Chinedu Azubuike",
            dept: "Computer Science",
            level: "400L",
            company: "TechCorp Solutions Ltd",
            officeAddress: "45 Marine Road, Victoria Island, Lagos",
            // Let's set the office coordinates near Victoria Island, Lagos
            officeLat: 6.428056,
            officeLon: 3.421944,
            geofenceRadius: 200, // in meters
            industrySupervisor: "Engr. Sarah Jenkins",
            schoolSupervisor: "Dr. Festus Alao",
            academicGrade: null,
            academicFeedback: "",
            evaluationGrade: 88, // out of 100, graded by industry supervisor
            evaluationRemarks: "Outstanding technical skill and self-starter."
        }
    ],
    attendance: [
        // Past records to make the dashboard look active
        { date: "2026-06-25", matric: "UI/2022/CS/101", clockIn: "08:02:15", clockOut: "17:10:30", lat: 6.428010, lon: 3.421910, distance: 7, status: "On-Time", geofence: "Within Range" },
        { date: "2026-06-26", matric: "UI/2022/CS/101", clockIn: "08:14:40", clockOut: "17:05:00", lat: 6.427950, lon: 3.421880, distance: 13, status: "On-Time", geofence: "Within Range" },
        { date: "2026-06-29", matric: "UI/2022/CS/101", clockIn: "08:45:10", clockOut: "17:00:20", lat: 6.428120, lon: 3.422000, distance: 9, status: "Late", geofence: "Within Range" },
        { date: "2026-06-30", matric: "UI/2022/CS/101", clockIn: "08:08:22", clockOut: "17:15:40", lat: 6.428080, lon: 3.421950, distance: 3, status: "On-Time", geofence: "Within Range" },
        { date: "2026-07-01", matric: "UI/2022/CS/101", clockIn: "08:52:00", clockOut: "17:01:00", lat: 6.435000, lon: 3.442000, distance: 2340, status: "Late", geofence: "Out of Range (Flagged)" } // Out of range!
    ],
    logbook: [
        {
            date: "2026-06-25",
            matric: "UI/2022/CS/101",
            description: "Onboarded with the dev team. Setup local development environments, configured Git, and cloned the backend microservice repositories. Attended the daily standup meeting.",
            tools: "Git, Docker, VS Code",
            hours: 8,
            status: "Approved",
            feedback: "Great start Chinedu! Make sure you get familiar with our Docker compose setup.",
            signedBy: "Engr. Sarah Jenkins"
        },
        {
            date: "2026-06-26",
            matric: "UI/2022/CS/101",
            description: "Resolved issue #412: Fixed bug in user authentication validator that caused server crashes on malformed request bodies. Wrote unit tests in Jest.",
            tools: "Node.js, Jest, Express",
            hours: 8,
            status: "Approved",
            feedback: "Solid bugfix. Clean unit tests.",
            signedBy: "Engr. Sarah Jenkins"
        },
        {
            date: "2026-06-29",
            matric: "UI/2022/CS/101",
            description: "Collaborated on designing the database schema for the new client billing module. Wrote migration files using Knex.js and tested locally.",
            tools: "PostgreSQL, Knex.js",
            hours: 8,
            status: "Approved",
            feedback: "Good schema layout, verified.",
            signedBy: "Engr. Sarah Jenkins"
        },
        {
            date: "2026-06-30",
            matric: "UI/2022/CS/101",
            description: "Developed UI components for the billing dashboard using React and Tailwind CSS. Implemented search and filter filters for transactions list.",
            tools: "React, CSS, Tailwind",
            hours: 8,
            status: "Approved",
            feedback: "UI looks matching with mockups.",
            signedBy: "Engr. Sarah Jenkins"
        },
        {
            date: "2026-07-01",
            matric: "UI/2022/CS/101",
            description: "Created API endpoints for invoice generation and integrated PDF creation library. Refactored the email dispatch service to run asynchronously.",
            tools: "Express, PDFKit, Redis",
            hours: 8,
            status: "Pending",
            feedback: "",
            signedBy: ""
        }
    ],
    weeklyReports: [
        {
            week: 1,
            matric: "UI/2022/CS/101",
            summary: "During my first week, I successfully onboarded and integrated into the engineering workflow. I resolved a critical authentication validation bug, drafted schemas for the billing database module, and developed frontend elements. Key learnings include asynchronous worker processes using Redis queue system.",
            rating: 5,
            status: "Approved",
            feedback: "Excellent progress in week 1. Proactive approach to solving problems."
        }
    ],
    supervisors: [
        { id: "IS_01", name: "Engr. Sarah Jenkins", company: "TechCorp Solutions Ltd", email: "s.jenkins@techcorp.com" }
    ],
    schoolSupervisors: [
        { id: "SS_01", name: "Dr. Festus Alao", dept: "Computer Science", email: "f.alao@university.edu.ng" }
    ]
};

// Initialize localStorage DB
function initDatabase() {
    if (!localStorage.getItem("intern_db_initialized_v2")) {
        localStorage.setItem("intern_db", JSON.stringify(SEED_DATA));
        localStorage.setItem("intern_db_initialized_v2", "true");
    }
}
initDatabase();

// Database Access Helper
function getDB() {
    return JSON.parse(localStorage.getItem("intern_db"));
}

function saveDB(data) {
    localStorage.setItem("intern_db", JSON.stringify(data));
}

const API_BASE = "http://localhost:3000/api";

// Sync local storage with backend SQL Database
async function syncFromBackend() {
    try {
        const response = await fetch(`${API_BASE}/data`);
        if (response.ok) {
            const backendData = await response.json();
            const mappedData = {
                students: backendData.students,
                attendance: backendData.attendance,
                logbook: backendData.logbook,
                weeklyReports: backendData.weeklyReports,
                supervisors: backendData.supervisors,
                schoolSupervisors: backendData.schoolSupervisors
            };
            saveDB(mappedData);
            console.log("Synced data from SQLite Server successfully.");
        }
    } catch (err) {
        console.warn("Error syncing from backend, using localStorage fallback:", err);
    }
}

async function checkBackendStatus() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
            state.isServerOnline = true;
            console.log("Backend server detected: Running in SQL Mode");
            await syncFromBackend();
            updateServerStatusUI(true);
        } else {
            throw new Error("Server not ok");
        }
    } catch (e) {
        state.isServerOnline = false;
        console.log("Backend server offline: Running in LocalStorage Fallback Mode");
        updateServerStatusUI(false);
    }
}

function updateServerStatusUI(isOnline) {
    const statusDot = document.querySelector(".user-status-dot");
    if (statusDot) {
        statusDot.style.backgroundColor = isOnline ? "#3b82f6" : "#10b981"; // blue if server, green if offline/local
        statusDot.title = isOnline ? "Active SQL Server Mode" : "Local Storage Fallback Mode";
    }
}

async function postToBackend(endpoint, payload) {
    if (!state.isServerOnline) return;
    try {
        await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log(`Backend sync POST to ${endpoint} successful.`);
    } catch (e) {
        console.error(`Backend sync POST to ${endpoint} failed:`, e);
    }
}

// --- STATE MANAGEMENT ---
const state = {
    activeRole: localStorage.getItem("current_session_role") || "student", // student, industry_supervisor, school_supervisor, coordinator
    activeTab: "overview", // changes based on role
    currentMatric: localStorage.getItem("current_session_matric") || "UI/2022/CS/101", 
    selectedStudentMatric: localStorage.getItem("current_session_matric") || "UI/2022/CS/101", // supervisor views
    isLoggedIn: localStorage.getItem("current_session_role") ? true : false,
    isServerOnline: false,
    // Simulated Location: default to At Office coordinates
    simulatedLocation: {
        mode: "office", // office, home, actual
        lat: 6.428056,
        lon: 3.421944
    }
};

// Office coordinates helper dynamically reading from active student
function getActiveOfficeCoordinates() {
    const db = getDB();
    const student = db.students.find(s => s.matric === state.currentMatric);
    if (student) {
        return {
            lat: student.officeLat || 6.428056,
            lon: student.officeLon || 3.421944,
            geofenceRadius: student.geofenceRadius || 200,
            label: `${student.company || 'TechCorp'} HQ`
        };
    }
    return {
        lat: 6.428056,
        lon: 3.421944,
        geofenceRadius: 200,
        label: "Default Office"
    };
}

const HOME_COORDINATES = {
    lat: 6.439500, // Roughly 2.2km away
    lon: 3.441200,
    label: "Student Residence (Ikoyi)"
};

// --- AUTHENTICATION & REGISTRATION LOGIC ---

function populateLoginOptions() {
    const loginUserSelect = document.getElementById("loginUser");
    if (!loginUserSelect) return;
    
    loginUserSelect.innerHTML = "";
    const db = getDB();
    
    // Add Dynamic Students
    db.students.forEach(s => {
        const opt = document.createElement("option");
        opt.value = `student:${s.matric}`;
        opt.textContent = `Intern: ${s.name} (${s.matric})`;
        loginUserSelect.appendChild(opt);
    });
    
    // Add Supervisors
    const optInd = document.createElement("option");
    optInd.value = "industry_supervisor:IS_01";
    optInd.textContent = "Industry Supervisor (Engr. Sarah Jenkins)";
    loginUserSelect.appendChild(optInd);
    
    const optSch = document.createElement("option");
    optSch.value = "school_supervisor:SS_01";
    optSch.textContent = "School Supervisor (Dr. Festus Alao)";
    loginUserSelect.appendChild(optSch);
    
    const optCoord = document.createElement("option");
    optCoord.value = "coordinator:CO_01";
    optCoord.textContent = "IT Coordinator (Prof. Ebuka Obi)";
    loginUserSelect.appendChild(optCoord);
}

function switchAuthTab(tab) {
    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const loginContainer = document.getElementById("loginFormContainer");
    const registerContainer = document.getElementById("registerFormContainer");
    
    if (tab === 'login') {
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        loginContainer.classList.add("active");
        registerContainer.classList.remove("active");
    } else {
        tabLogin.classList.remove("active");
        tabRegister.classList.add("active");
        loginContainer.classList.remove("active");
        registerContainer.classList.add("active");
    }
}

function handleLoginRoleChange() {
    // Optional dynamic action on dropdown change
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const val = document.getElementById("loginUser").value;
    const [role, matricOrId] = val.split(":");
    
    state.activeRole = role;
    state.isLoggedIn = true;
    
    localStorage.setItem("current_session_role", role);
    
    if (role === 'student') {
        state.currentMatric = matricOrId;
        state.selectedStudentMatric = matricOrId;
        localStorage.setItem("current_session_matric", matricOrId);
    }
    
    renderAuthOrShell();
}

function fetchOfficeCoordinates() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                document.getElementById("regLat").value = pos.coords.latitude.toFixed(6);
                document.getElementById("regLon").value = pos.coords.longitude.toFixed(6);
                alert("GPS Coordinates set successfully to your current location!");
            },
            (err) => {
                alert("Failed to get device location. Default coordinates kept.");
            }
        );
    } else {
        alert("Geolocation not supported by this browser.");
    }
}

async function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    const matric = document.getElementById("regMatric").value.trim();
    const name = document.getElementById("regName").value.trim();
    const dept = document.getElementById("regDept").value.trim();
    const level = document.getElementById("regLevel").value;
    const company = document.getElementById("regCompany").value.trim();
    const officeAddress = document.getElementById("regAddress").value.trim();
    const officeLat = parseFloat(document.getElementById("regLat").value);
    const officeLon = parseFloat(document.getElementById("regLon").value);
    const industrySupervisor = document.getElementById("regIndSupervisor").value.trim();
    const schoolSupervisor = document.getElementById("regSchSupervisor").value.trim();
    
    let db = getDB();
    
    // Check if matric exists
    if (db.students.find(s => s.matric === matric)) {
        alert("An intern with this Matric Number is already registered.");
        return;
    }
    
    const newStudent = {
        matric,
        name,
        dept,
        level,
        company,
        officeAddress,
        officeLat,
        officeLon,
        geofenceRadius: 200,
        industrySupervisor,
        schoolSupervisor,
        academicGrade: null,
        academicFeedback: "",
        evaluationGrade: null,
        evaluationRemarks: ""
    };
    
    // Write locally
    db.students.push(newStudent);
    saveDB(db);
    
    // Write to server
    await postToBackend('students', newStudent);
    
    // Login automatically
    state.activeRole = "student";
    state.currentMatric = matric;
    state.selectedStudentMatric = matric;
    state.isLoggedIn = true;
    
    localStorage.setItem("current_session_role", "student");
    localStorage.setItem("current_session_matric", matric);
    
    // Reset form
    document.getElementById("regMatric").value = "";
    document.getElementById("regName").value = "";
    document.getElementById("regCompany").value = "";
    document.getElementById("regAddress").value = "";
    
    alert(`Registration Successful! Welcome to SIWES Portal, ${name}.`);
    renderAuthOrShell();
}

function handleLogout() {
    state.isLoggedIn = false;
    state.activeRole = "student";
    state.currentMatric = "UI/2022/CS/101";
    
    localStorage.removeItem("current_session_role");
    localStorage.removeItem("current_session_matric");
    
    renderAuthOrShell();
}

function renderAuthOrShell() {
    const authScreen = document.getElementById("authScreen");
    const appShell = document.getElementById("appShell");
    
    if (state.isLoggedIn) {
        authScreen.style.display = "none";
        appShell.style.display = "flex";
        
        // Refresh sidebar roles active state in demo panel
        document.querySelectorAll(".btn-demo-role").forEach(btn => {
            if (btn.dataset.role === state.activeRole) btn.classList.add("active");
            else btn.classList.remove("active");
        });
        
        changeRole(state.activeRole);
    } else {
        authScreen.style.display = "flex";
        appShell.style.display = "none";
        
        populateLoginOptions();
    }
}

// --- GEOLOCATION MATHEMATICS ---
// Calculates distance in meters between two lat/lon pairs using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of Earth in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Get user current coordinates based on state configuration
function getCoordinates(callback) {
    const office = getActiveOfficeCoordinates();
    if (state.simulatedLocation.mode === "office") {
        callback({ lat: office.lat, lon: office.lon, isMocked: true });
    } else if (state.simulatedLocation.mode === "home") {
        callback({ lat: HOME_COORDINATES.lat, lon: HOME_COORDINATES.lon, isMocked: true });
    } else {
        // Use browser geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    callback({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        isMocked: false
                    });
                },
                (error) => {
                    console.warn("Browser GPS failed, falling back to simulated office range:", error.message);
                    callback({ lat: office.lat, lon: office.lon, isMocked: true });
                }
            );
        } else {
            callback({ lat: office.lat, lon: office.lon, isMocked: true });
        }
    }
}

// --- UTILITY FUNCTIONS ---
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function getTodayString() {
    return formatDate(new Date());
}

function getTodayAttendance(matric) {
    const db = getDB();
    const today = getTodayString();
    return db.attendance.find(a => a.date === today && a.matric === matric);
}

// --- RENDERING CORE ---
document.addEventListener("DOMContentLoaded", async () => {
    // Check if SQL backend is online
    await checkBackendStatus();

    // Start real-time digital clock
    startClock();
    
    // Wire up role Switcher trigger
    const demoTrigger = document.getElementById("demoTrigger");
    const demoPanel = document.getElementById("demoPanel");
    
    demoTrigger.addEventListener("click", () => {
        demoPanel.classList.toggle("show");
    });
    
    // Close demo panel on clicking outside
    document.addEventListener("click", (e) => {
        if (!demoTrigger.contains(e.target) && !demoPanel.contains(e.target)) {
            demoPanel.classList.remove("show");
        }
    });

    // Wire up Demo Panel Controls
    setupDemoPanel();
    
    // Initial Render Auth or Shell
    renderAuthOrShell();
});

function startClock() {
    const clockTimer = document.getElementById("clockTimer");
    const clockDate = document.getElementById("clockDate");
    const headerDateText = document.getElementById("headerDateText");
    
    function update() {
        const now = new Date();
        if (clockTimer) {
            clockTimer.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        }
        
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        if (clockDate) {
            clockDate.textContent = now.toLocaleDateString('en-US', dateOptions);
        }
        if (headerDateText) {
            headerDateText.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    }
    update();
    setInterval(update, 1000);
}

function setupDemoPanel() {
    const roleButtons = document.querySelectorAll(".btn-demo-role");
    roleButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            roleButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            changeRole(btn.dataset.role);
        });
    });

    const gpsOptions = document.querySelectorAll(".gps-option");
    gpsOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            gpsOptions.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            state.simulatedLocation.mode = opt.dataset.mode;
            
            // Re-render student overview location status if currently active
            if (state.activeRole === "student" && state.activeTab === "overview") {
                updateStudentLocationStatus();
            }
        });
    });
}

function changeRole(role) {
    state.activeRole = role;
    
    // Set default tab for the role
    if (role === "student") state.activeTab = "overview";
    else if (role === "industry_supervisor") state.activeTab = "overview";
    else if (role === "school_supervisor") state.activeTab = "students";
    else if (role === "coordinator") state.activeTab = "dashboard";
    
    // Update User Profile Details UI in Sidebar
    updateSidebarProfile();
    
    // Update Sidebar Navigation Items dynamically based on Role
    buildSidebarNav();
    
    // Render Content Area
    renderCurrentTab();
    
    // Close demo panel
    document.getElementById("demoPanel").classList.remove("show");
}

function updateSidebarProfile() {
    const avatar = document.getElementById("sidebarAvatar");
    const nameEl = document.getElementById("sidebarUserName");
    const roleEl = document.getElementById("sidebarUserRole");
    
    const db = getDB();
    
    if (state.activeRole === "student") {
        const student = db.students.find(s => s.matric === state.currentMatric);
        nameEl.textContent = student.name;
        roleEl.textContent = `${student.level} CS Intern`;
    } else if (state.activeRole === "industry_supervisor") {
        nameEl.textContent = db.supervisors[0].name;
        roleEl.textContent = "Industry Supervisor";
    } else if (state.activeRole === "school_supervisor") {
        nameEl.textContent = db.schoolSupervisors[0].name;
        roleEl.textContent = "School Supervisor";
    } else if (state.activeRole === "coordinator") {
        nameEl.textContent = "Prof. Ebuka Obi";
        roleEl.textContent = "IT Coordinator";
    }
}

function buildSidebarNav() {
    const navContainer = document.getElementById("navLinksContainer");
    navContainer.innerHTML = "";
    
    let links = [];
    
    if (state.activeRole === "student") {
        links = [
            { id: "overview", label: "Dashboard", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
            { id: "logbook", label: "Daily Logbook", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` },
            { id: "weekly", label: "Weekly Reports", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
            { id: "profile", label: "My Profile", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` }
        ];
    } else if (state.activeRole === "industry_supervisor") {
        links = [
            { id: "overview", label: "Dashboard", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
            { id: "signoff", label: "Verify Logs", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` },
            { id: "history", label: "Intern History", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` }
        ];
    } else if (state.activeRole === "school_supervisor") {
        links = [
            { id: "students", label: "Supervised Students", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
            { id: "grading", label: "Academic Grading", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` }
        ];
    } else if (state.activeRole === "coordinator") {
        links = [
            { id: "dashboard", label: "Stats Dashboard", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` },
            { id: "mapping", label: "Supervisor Pairs", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>` },
            { id: "reports", label: "Data Exports", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>` }
        ];
    }
    
    links.forEach(link => {
        const li = document.createElement("li");
        li.className = "nav-item";
        
        const a = document.createElement("a");
        a.className = `nav-link ${state.activeTab === link.id ? 'active' : ''}`;
        a.innerHTML = `${link.icon} <span>${link.label}</span>`;
        a.addEventListener("click", () => {
            // Remove active from all links
            document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
            a.classList.add("active");
            state.activeTab = link.id;
            renderCurrentTab();
        });
        
        li.appendChild(a);
        navContainer.appendChild(li);
    });

    // Mirror to mobile navigation drawer if present
    buildMobileNav(links);
}

function buildMobileNav(links) {
    const mobileNav = document.getElementById("mobileNavContainer");
    if (!mobileNav) return;
    
    mobileNav.innerHTML = "";
    links.forEach(link => {
        const item = document.createElement("div");
        item.className = `mobile-nav-item ${state.activeTab === link.id ? 'active' : ''}`;
        item.innerHTML = `${link.icon} <span>${link.label}</span>`;
        item.addEventListener("click", () => {
            document.querySelectorAll(".mobile-nav-item").forEach(el => el.classList.remove("active"));
            item.classList.add("active");
            state.activeTab = link.id;
            renderCurrentTab();
        });
        mobileNav.appendChild(item);
    });
}

function renderCurrentTab() {
    const pageTitle = document.getElementById("pageTitle");
    pageTitle.textContent = state.activeTab.charAt(0).toUpperCase() + state.activeTab.slice(1) + " Portal";
    
    // Close sidebar on mobile after selecting a tab
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
    }
    if (backdrop && backdrop.classList.contains("show")) {
        backdrop.classList.remove("show");
    }
    
    // Hide all panels
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    
    const panelId = `${state.activeRole}_${state.activeTab}_view`;
    const targetPanel = document.getElementById(panelId);
    
    if (targetPanel) {
        targetPanel.classList.add("active");
        
        // Custom views initialization
        if (state.activeRole === "student") {
            if (state.activeTab === "overview") renderStudentOverview();
            else if (state.activeTab === "logbook") renderStudentLogbook();
            else if (state.activeTab === "weekly") renderStudentWeekly();
            else if (state.activeTab === "profile") renderStudentProfile();
        } else if (state.activeRole === "industry_supervisor") {
            if (state.activeTab === "overview") renderIndustryOverview();
            else if (state.activeTab === "signoff") renderIndustrySignoff();
            else if (state.activeTab === "history") renderIndustryHistory();
        } else if (state.activeRole === "school_supervisor") {
            if (state.activeTab === "students") renderSchoolStudents();
            else if (state.activeTab === "grading") renderSchoolGrading();
        } else if (state.activeRole === "coordinator") {
            if (state.activeTab === "dashboard") renderCoordinatorDashboard();
            else if (state.activeTab === "mapping") renderCoordinatorMapping();
            else if (state.activeTab === "reports") renderCoordinatorReports();
        }
    }
}

// ==========================================
// --- STUDENT VIEWS RENDERING ---
// ==========================================

function renderStudentOverview() {
    const db = getDB();
    const attList = db.attendance.filter(a => a.matric === state.currentMatric);
    
    // Calculate Analytics
    const totalDays = 120; // Required SIWES days
    const activeDays = attList.length;
    const rate = activeDays > 0 
        ? Math.round((attList.filter(a => a.status === "On-Time").length / activeDays) * 100) 
        : 0;
    
    document.getElementById("student_att_rate").textContent = `${rate}%`;
    document.getElementById("student_days_completed").textContent = `${activeDays}/${totalDays}`;
    
    const pendingLogs = db.logbook.filter(l => l.matric === state.currentMatric && l.status === "Pending").length;
    document.getElementById("student_pending_logs").textContent = pendingLogs;

    // Render Calendar
    renderCalendarWidget();

    // Setup Clock-In Button Status
    updateClockButtonUI();
    
    // Setup Location range detector UI
    updateStudentLocationStatus();

    // Render Recent Attendance log rows
    const recentTable = document.getElementById("student_recent_attendance_table");
    recentTable.innerHTML = "";
    
    // Sort latest first
    const sortedAtt = [...attList].reverse().slice(0, 3);
    
    if (sortedAtt.length === 0) {
        recentTable.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary)">No attendance recorded yet.</td></tr>`;
    } else {
        sortedAtt.forEach(a => {
            const tr = document.createElement("tr");
            const badgeClass = a.geofence === "Within Range" ? "badge-success" : "badge-danger";
            const statusBadge = a.status === "On-Time" ? "badge-success" : "badge-warning";
            
            tr.innerHTML = `
                <td>${a.date}</td>
                <td>${a.clockIn}</td>
                <td>${a.clockOut || '--:--:--'}</td>
                <td><span class="badge ${statusBadge}">${a.status}</span></td>
                <td><span class="badge ${badgeClass}">${a.geofence} (${Math.round(a.distance)}m)</span></td>
            `;
            recentTable.appendChild(tr);
        });
    }
    
    // Render personal attendance chart
    setTimeout(renderStudentChart, 50);
}

function updateStudentLocationStatus() {
    const statusBox = document.getElementById("student_location_status");
    const labelEl = document.getElementById("student_location_label");
    const descEl = document.getElementById("student_location_desc");
    
    getCoordinates((coords) => {
        const office = getActiveOfficeCoordinates();
        const distance = getDistance(coords.lat, coords.lon, office.lat, office.lon);
        const withinRadius = distance <= office.geofenceRadius;
        
        statusBox.className = `location-status ${withinRadius ? 'success' : 'danger'}`;
        labelEl.textContent = withinRadius ? "Within Range of Office" : "Outside Allowed Geofence";
        
        const locLabel = coords.isMocked 
            ? (state.simulatedLocation.mode === "office" ? office.label : HOME_COORDINATES.label) 
            : "Actual GPS Location";
            
        descEl.textContent = `Your coordinates: ${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}. Distance: ${Math.round(distance)}m from Office (${locLabel})`;
    });
}

function updateClockButtonUI() {
    const clockBtn = document.getElementById("clockBtn");
    const indicator = document.getElementById("clockIndicator");
    const statusText = document.getElementById("clockStatusText");
    
    const todayRecord = getTodayAttendance(state.currentMatric);
    
    if (!todayRecord) {
        clockBtn.className = "btn-clock clock-in";
        clockBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><polyline points="12 6 12 12 16 14"/></svg><span>Clock In</span>`;
        clockBtn.disabled = false;
        indicator.className = "pulse-dot inactive";
        statusText.textContent = "Not clocked in today";
    } else if (!todayRecord.clockOut) {
        clockBtn.className = "btn-clock clock-out";
        clockBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="2"/></svg><span>Clock Out</span>`;
        clockBtn.disabled = false;
        indicator.className = "pulse-dot";
        statusText.textContent = `Clocked in at ${todayRecord.clockIn}`;
    } else {
        clockBtn.className = "btn-clock";
        clockBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Shift Done</span>`;
        clockBtn.disabled = true;
        indicator.className = "pulse-dot inactive";
        statusText.textContent = `Completed: ${todayRecord.clockIn} to ${todayRecord.clockOut}`;
    }
}

function triggerClockAction() {
    const todayRecord = getTodayAttendance(state.currentMatric);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    
    getCoordinates((coords) => {
        const office = getActiveOfficeCoordinates();
        const distance = getDistance(coords.lat, coords.lon, office.lat, office.lon);
        const withinRadius = distance <= office.geofenceRadius;
        
        let db = getDB();
        const student = db.students.find(s => s.matric === state.currentMatric);
        const companyName = student ? student.company : "the Office";
        
        if (!todayRecord) {
            // Clocking in
            const newRecord = {
                date: getTodayString(),
                matric: state.currentMatric,
                clockIn: timeStr,
                clockOut: null,
                lat: coords.lat,
                lon: coords.lon,
                distance: distance,
                status: now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() === 0) ? "On-Time" : "Late",
                geofence: withinRadius ? "Within Range" : "Out of Range (Flagged)"
            };
            
            db.attendance.push(newRecord);
            saveDB(db);
            postToBackend('attendance/clock-in', newRecord);
            
            alert(withinRadius 
                ? `Clock-in successful! Welcome to ${companyName}.` 
                : `Warning: Clocked in OUTSIDE authorized office range (${Math.round(distance)}m away). Record flagged for supervisor review.`);
        } else {
            // Clocking out validation
            if (now.getHours() < 16) {
                alert("Clock-out restricted: You must complete your shift and clock out after 4:00 PM.");
                return;
            }
            
            // Clocking out
            const index = db.attendance.findIndex(a => a.date === todayRecord.date && a.matric === state.currentMatric);
            db.attendance[index].clockOut = timeStr;
            saveDB(db);
            postToBackend('attendance/clock-out', { date: todayRecord.date, matric: state.currentMatric, clockOut: timeStr });
            
            alert("Clock-out successful! Drive safe.");
        }
        
        // Re-render
        renderStudentOverview();
    });
}

function renderCalendarWidget() {
    const db = getDB();
    const calendarDays = document.getElementById("calendarDays");
    if (!calendarDays) return;
    
    calendarDays.innerHTML = "";
    
    // Add day labels
    const labels = ["S", "M", "T", "W", "T", "F", "S"];
    labels.forEach(l => {
        const div = document.createElement("div");
        div.className = "calendar-day-label";
        div.textContent = l;
        calendarDays.appendChild(div);
    });
    
    // We will render days for June/July 2026.
    // Let's render June 22 to July 5 (14 days)
    const dates = [
        "2026-06-22", "2026-06-23", "2026-06-24", "2026-06-25", "2026-06-26", "2026-06-27", "2026-06-28",
        "2026-06-29", "2026-06-30", "2026-07-01", "2026-07-02", "2026-07-03", "2026-07-04", "2026-07-05"
    ];
    
    dates.forEach(d => {
        const record = db.attendance.find(a => a.date === d && a.matric === state.currentMatric);
        const dateObj = new Date(d);
        const dayNum = dateObj.getDate();
        
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day filled";
        dayDiv.textContent = dayNum;
        
        if (record) {
            if (record.geofence === "Within Range") {
                dayDiv.classList.add("checked-in");
            } else {
                dayDiv.classList.add("checked-in-flagged");
            }
        } else {
            // Weekend or absent
            const dayOfWeek = dateObj.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6 && d < getTodayString()) {
                dayDiv.classList.add("absent");
            }
        }
        
        calendarDays.appendChild(dayDiv);
    });
}

function renderStudentLogbook() {
    const db = getDB();
    const logs = db.logbook.filter(l => l.matric === state.currentMatric);
    
    // Check if clocked in today. If not, alert user they should clock in before writing logs
    const todayAtt = getTodayAttendance(state.currentMatric);
    const logBtn = document.getElementById("studentNewLogBtn");
    const warningLabel = document.getElementById("studentLogbookWarning");
    
    if (!todayAtt) {
        warningLabel.style.display = "block";
        logBtn.disabled = true;
    } else {
        warningLabel.style.display = "none";
        logBtn.disabled = false;
    }
    
    const logsTable = document.getElementById("student_logs_table");
    logsTable.innerHTML = "";
    
    // Sort reverse chronological
    const sortedLogs = [...logs].reverse();
    
    if (sortedLogs.length === 0) {
        logsTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary)">No logbook entries submitted yet.</td></tr>`;
    } else {
        sortedLogs.forEach((l, idx) => {
            const tr = document.createElement("tr");
            let badgeClass = "badge-warning";
            if (l.status === "Approved") badgeClass = "badge-success";
            else if (l.status === "Changes Requested") badgeClass = "badge-danger";
            
            tr.innerHTML = `
                <td>${l.date}</td>
                <td style="max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${l.description}</td>
                <td><code>${l.tools}</code></td>
                <td><span class="badge ${badgeClass}">${l.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="viewLogDetail(${logs.length - 1 - idx})">View Details</button>
                </td>
            `;
            logsTable.appendChild(tr);
        });
    }
}

function viewLogDetail(index) {
    const db = getDB();
    const studentLogs = db.logbook.filter(l => l.matric === state.currentMatric);
    const log = studentLogs[index];
    
    document.getElementById("modalDetailDate").textContent = log.date;
    document.getElementById("modalDetailDesc").textContent = log.description;
    document.getElementById("modalDetailTools").textContent = log.tools;
    document.getElementById("modalDetailHours").textContent = `${log.hours} Hours`;
    
    const statusEl = document.getElementById("modalDetailStatus");
    statusEl.textContent = log.status;
    statusEl.className = `badge ${log.status === 'Approved' ? 'badge-success' : (log.status === 'Pending' ? 'badge-warning' : 'badge-danger')}`;
    
    const feedbackRow = document.getElementById("modalDetailFeedbackRow");
    if (log.feedback) {
        feedbackRow.style.display = "block";
        document.getElementById("modalDetailFeedback").textContent = log.feedback;
        document.getElementById("modalDetailSupervisor").textContent = log.signedBy || "Supervisor";
    } else {
        feedbackRow.style.display = "none";
    }
    
    openModal("logDetailModal");
}

function openModal(id) {
    const m = document.getElementById(id);
    m.classList.add("show");
}

function closeModal(id) {
    const m = document.getElementById(id);
    m.classList.remove("show");
}

function openAddLogModal() {
    const todayStr = getTodayString();
    document.getElementById("logDate").value = todayStr;
    
    // Auto populate tasks if details exist in attendance (e.g. checkin time)
    openModal("addLogModal");
}

function submitNewLog(event) {
    event.preventDefault();
    
    const date = document.getElementById("logDate").value;
    const description = document.getElementById("logDescription").value;
    const tools = document.getElementById("logTools").value;
    const hours = parseInt(document.getElementById("logHours").value);
    
    let db = getDB();
    
    // Check if log for this date already exists
    const existingLog = db.logbook.find(l => l.date === date && l.matric === state.currentMatric);
    if (existingLog) {
        alert("A log entry already exists for this date. You cannot submit multiple entries.");
        return;
    }
    
    const newLog = {
        date,
        matric: state.currentMatric,
        description,
        tools,
        hours,
        status: "Pending",
        feedback: "",
        signedBy: ""
    };
    
    db.logbook.push(newLog);
    saveDB(db);
    postToBackend('logbook', newLog);
    
    closeModal("addLogModal");
    // Clear form
    document.getElementById("logDescription").value = "";
    document.getElementById("logTools").value = "";
    
    renderStudentLogbook();
    alert("Daily logbook entry submitted successfully!");
}

function renderStudentWeekly() {
    const db = getDB();
    const reports = db.weeklyReports.filter(r => r.matric === state.currentMatric);
    
    const weeklyTable = document.getElementById("student_weekly_table");
    weeklyTable.innerHTML = "";
    
    if (reports.length === 0) {
        weeklyTable.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary)">No weekly reports submitted yet.</td></tr>`;
    } else {
        reports.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Week ${r.week}</td>
                <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${r.summary}</td>
                <td><span class="badge ${r.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="viewWeeklyDetail(${r.week})">View</button>
                </td>
            `;
            weeklyTable.appendChild(tr);
        });
    }
}

function viewWeeklyDetail(weekNo) {
    const db = getDB();
    const report = db.weeklyReports.find(r => r.week === weekNo && r.matric === state.currentMatric);
    
    document.getElementById("modalWeeklyTitle").textContent = `Week ${report.week} Report Details`;
    document.getElementById("modalWeeklySummary").textContent = report.summary;
    
    const scoreRow = document.getElementById("modalWeeklyScoreRow");
    if (report.rating) {
        scoreRow.style.display = "block";
        document.getElementById("modalWeeklyRating").textContent = `${report.rating} / 5 Stars`;
        document.getElementById("modalWeeklyFeedback").textContent = report.feedback || "Approved";
    } else {
        scoreRow.style.display = "none";
    }
    
    openModal("weeklyDetailModal");
}

function openAddWeeklyModal() {
    const db = getDB();
    const reports = db.weeklyReports.filter(r => r.matric === state.currentMatric);
    const nextWeek = reports.length + 1;
    
    document.getElementById("weeklyWeekNo").value = nextWeek;
    openModal("addWeeklyModal");
}

function submitNewWeekly(event) {
    event.preventDefault();
    
    const week = parseInt(document.getElementById("weeklyWeekNo").value);
    const summary = document.getElementById("weeklySummary").value;
    
    let db = getDB();
    const newReport = {
        week,
        matric: state.currentMatric,
        summary,
        rating: null,
        status: "Pending",
        feedback: ""
    };
    
    db.weeklyReports.push(newReport);
    saveDB(db);
    postToBackend('weekly', newReport);
    
    closeModal("addWeeklyModal");
    document.getElementById("weeklySummary").value = "";
    
    renderStudentWeekly();
    alert(`Week ${week} report submitted for review.`);
}

function renderStudentProfile() {
    const db = getDB();
    const s = db.students.find(student => student.matric === state.currentMatric);
    
    document.getElementById("profile_name").textContent = s.name;
    document.getElementById("profile_matric").textContent = s.matric;
    document.getElementById("profile_dept").textContent = s.dept;
    document.getElementById("profile_level").textContent = s.level;
    document.getElementById("profile_company").textContent = s.company;
    document.getElementById("profile_address").textContent = s.officeAddress;
    document.getElementById("profile_gps").textContent = `${s.officeLat}, ${s.officeLon} (200m Geofence)`;
    document.getElementById("profile_ind_sup").textContent = s.industrySupervisor;
    document.getElementById("profile_sch_sup").textContent = s.schoolSupervisor;
    
    // Academic Grade
    const gradeBox = document.getElementById("profile_grade_box");
    if (s.academicGrade) {
        gradeBox.innerHTML = `
            <div class="badge badge-success" style="font-size:1.1rem; padding:0.5rem 1rem;">Grade: ${s.academicGrade}</div>
            <p style="margin-top: 1rem; color: var(--text-secondary)"><strong>Faculty Review:</strong> "${s.academicFeedback || 'Approved'}"</p>
        `;
    } else {
        gradeBox.innerHTML = `<span class="badge badge-warning">Grading Pending School Inspection</span>`;
    }
}

// ==========================================
// --- INDUSTRY SUPERVISOR VIEWS RENDERING ---
// ==========================================

function renderIndustryOverview() {
    const db = getDB();
    const matric = state.selectedStudentMatric;
    const s = db.students.find(student => student.matric === matric);
    const logs = db.logbook.filter(l => l.matric === matric);
    const att = db.attendance.filter(a => a.matric === matric);
    
    document.getElementById("ind_student_name").textContent = s.name;
    document.getElementById("ind_student_matric").textContent = s.matric;
    
    // Metrics
    const verified = logs.filter(l => l.status === "Approved").length;
    document.getElementById("ind_logs_verified").textContent = `${verified}/${logs.length}`;
    
    const geofenceFlags = att.filter(a => a.geofence !== "Within Range").length;
    const flagsEl = document.getElementById("ind_geofence_flags");
    flagsEl.textContent = geofenceFlags;
    if (geofenceFlags > 0) {
        flagsEl.style.color = "var(--danger)";
    } else {
        flagsEl.style.color = "var(--success)";
    }
    
    // Render ratings slider
    const ratingFill = document.getElementById("ind_eval_rating_fill");
    const ratingLabel = document.getElementById("ind_eval_rating_label");
    if (s.evaluationGrade) {
        ratingFill.style.width = `${s.evaluationGrade}%`;
        ratingLabel.textContent = `${s.evaluationGrade}/100`;
    } else {
        ratingFill.style.width = `0%`;
        ratingLabel.textContent = "Not Evaluated";
    }
}

function renderIndustrySignoff() {
    const db = getDB();
    const matric = state.selectedStudentMatric;
    const pendingLogs = db.logbook.filter(l => l.matric === matric && l.status === "Pending");
    
    const container = document.getElementById("ind_pending_logs_container");
    container.innerHTML = "";
    
    if (pendingLogs.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-secondary)">No logbook entries pending approval.</div>`;
    } else {
        pendingLogs.forEach((l, index) => {
            const card = document.createElement("div");
            card.className = "glass-card";
            card.style.marginBottom = "1.5rem";
            
            // Check if there was attendance on this date to verify location compliance
            const attDay = db.attendance.find(a => a.date === l.date && a.matric === matric);
            let locText = "No Clock-in Found";
            let locClass = "badge-danger";
            if (attDay) {
                locText = `${attDay.geofence} (Check-in: ${attDay.clockIn})`;
                locClass = attDay.geofence === "Within Range" ? "badge-success" : "badge-danger";
            }
            
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <h4 style="color:var(--primary); font-size:1.1rem">${l.date}</h4>
                        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">Hours worked: ${l.hours}h</div>
                    </div>
                    <span class="badge ${locClass}">${locText}</span>
                </div>
                <p style="font-size:0.9rem; line-height:1.5; margin-bottom:1rem; color:var(--text-primary)">${l.description}</p>
                <div style="margin-bottom:1.25rem;"><strong>Tools:</strong> <code>${l.tools}</code></div>
                
                <div class="form-group" style="margin-bottom:1rem;">
                    <input type="text" id="feedback_${l.date}" class="form-control" placeholder="Add supervisor comment (optional)">
                </div>
                
                <div style="display:flex; gap:1rem;">
                    <button class="btn btn-success btn-sm" onclick="approveLog('${l.date}')">Approve & Sign</button>
                    <button class="btn btn-danger btn-sm" onclick="rejectLog('${l.date}')">Request Changes</button>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

function approveLog(date) {
    const feedbackVal = document.getElementById(`feedback_${date}`).value;
    let db = getDB();
    
    const index = db.logbook.findIndex(l => l.date === date && l.matric === state.selectedStudentMatric);
    if (index !== -1) {
        db.logbook[index].status = "Approved";
        db.logbook[index].feedback = feedbackVal || "Verified and approved.";
        db.logbook[index].signedBy = db.supervisors[0].name;
        
        saveDB(db);
        postToBackend('logbook/verify', {
            date,
            matric: state.selectedStudentMatric,
            status: "Approved",
            feedback: db.logbook[index].feedback,
            signedBy: db.logbook[index].signedBy
        });
        
        alert(`Signed off log for ${date}.`);
        renderIndustrySignoff();
        renderIndustryOverview();
    }
}

function rejectLog(date) {
    const feedbackVal = document.getElementById(`feedback_${date}`).value;
    if (!feedbackVal) {
        alert("Please provide feedback explaining what changes are requested.");
        return;
    }
    
    let db = getDB();
    const index = db.logbook.findIndex(l => l.date === date && l.matric === state.selectedStudentMatric);
    if (index !== -1) {
        db.logbook[index].status = "Changes Requested";
        db.logbook[index].feedback = feedbackVal;
        
        saveDB(db);
        postToBackend('logbook/verify', {
            date,
            matric: state.selectedStudentMatric,
            status: "Changes Requested",
            feedback: feedbackVal,
            signedBy: ""
        });
        
        alert(`Requested changes on log for ${date}.`);
        renderIndustrySignoff();
        renderIndustryOverview();
    }
}

function renderIndustryHistory() {
    const db = getDB();
    const matric = state.selectedStudentMatric;
    const historyLogs = db.logbook.filter(l => l.matric === matric && l.status !== "Pending");
    
    const tableBody = document.getElementById("ind_history_table");
    tableBody.innerHTML = "";
    
    if (historyLogs.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary)">No signed history logs.</td></tr>`;
    } else {
        historyLogs.forEach(l => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${l.date}</td>
                <td style="max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${l.description}</td>
                <td><span class="badge ${l.status === 'Approved' ? 'badge-success' : 'badge-danger'}">${l.status}</span></td>
                <td><small style="color:var(--text-secondary)">${l.feedback}</small></td>
            `;
            tableBody.appendChild(tr);
        });
    }
}

function openEvaluationModal() {
    const db = getDB();
    const s = db.students.find(student => student.matric === state.selectedStudentMatric);
    
    document.getElementById("evalGrade").value = s.evaluationGrade || 80;
    document.getElementById("evalRemarks").value = s.evaluationRemarks || "";
    openModal("indEvaluationModal");
}

function submitEvaluation(event) {
    event.preventDefault();
    
    const grade = parseInt(document.getElementById("evalGrade").value);
    const remarks = document.getElementById("evalRemarks").value;
    
    let db = getDB();
    const sIdx = db.students.findIndex(student => student.matric === state.selectedStudentMatric);
    
    if (sIdx !== -1) {
        db.students[sIdx].evaluationGrade = grade;
        db.students[sIdx].evaluationRemarks = remarks;
        saveDB(db);
        postToBackend('student/evaluation', {
            matric: state.selectedStudentMatric,
            evaluationGrade: grade,
            evaluationRemarks: remarks
        });
        
        closeModal("indEvaluationModal");
        renderIndustryOverview();
        alert("Intern final performance evaluation updated.");
    }
}

// ==========================================
// --- SCHOOL SUPERVISOR VIEWS RENDERING ---
// ==========================================

function renderSchoolStudents() {
    const db = getDB();
    const listBody = document.getElementById("sch_students_list");
    listBody.innerHTML = "";
    
    db.students.forEach(s => {
        const studentLogs = db.logbook.filter(l => l.matric === s.matric);
        const att = db.attendance.filter(a => a.matric === s.matric);
        
        const attendanceRate = att.length > 0 
            ? Math.round((att.filter(a => a.status === "On-Time").length / att.length) * 100) 
            : 0;
            
        const approvedCount = studentLogs.filter(l => l.status === "Approved").length;
        const totalLogs = studentLogs.length;
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong>${s.name}</strong>
                <div style="font-size:0.75rem; color:var(--text-secondary)">Matric: ${s.matric}</div>
            </td>
            <td>${s.company}</td>
            <td>
                <strong>${attendanceRate}%</strong>
                <div style="font-size:0.75rem; color:var(--text-secondary)">Checked in: ${att.length} days</div>
            </td>
            <td>${approvedCount} / ${totalLogs} Approved</td>
            <td>
                <span class="badge ${s.academicGrade ? 'badge-success' : 'badge-warning'}">
                    ${s.academicGrade ? `Graded: ${s.academicGrade}` : 'Pending Grading'}
                </span>
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="selectStudentForGrading('${s.matric}')">Assess Student</button>
            </td>
        `;
        listBody.appendChild(tr);
    });
}

function selectStudentForGrading(matric) {
    state.selectedStudentMatric = matric;
    state.activeTab = "grading";
    
    // Switch active tab indicator
    document.querySelectorAll(".nav-link").forEach(el => {
        if (el.innerHTML.includes("Grading")) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });
    
    renderCurrentTab();
}

function renderSchoolGrading() {
    const db = getDB();
    const matric = state.selectedStudentMatric;
    const s = db.students.find(student => student.matric === matric);
    const logs = db.logbook.filter(l => l.matric === matric);
    const att = db.attendance.filter(a => a.matric === matric);
    
    document.getElementById("sch_grad_name").textContent = s.name;
    document.getElementById("sch_grad_matric").textContent = s.matric;
    document.getElementById("sch_grad_company").textContent = s.company;
    
    // Performance metrics
    const attRate = att.length > 0 ? Math.round((att.filter(a => a.status === "On-Time").length / att.length) * 100) : 0;
    document.getElementById("sch_metric_attendance").textContent = `${attRate}% (${att.length} days)`;
    
    const rangeFlags = att.filter(a => a.geofence !== "Within Range").length;
    const flagsEl = document.getElementById("sch_metric_flags");
    flagsEl.textContent = `${rangeFlags} Flagged`;
    if (rangeFlags > 0) flagsEl.style.color = "var(--danger)";
    else flagsEl.style.color = "var(--success)";
    
    document.getElementById("sch_metric_industry").textContent = s.evaluationGrade ? `${s.evaluationGrade}/100` : "Pending Rating";
    
    // Fill grading details
    document.getElementById("sch_eval_grade_val").textContent = s.academicGrade || "Not Graded";
    document.getElementById("sch_eval_feedback").textContent = s.academicFeedback || "No academic feedback provided yet.";

    // Render Student daily logs in accordion list
    const logAccordion = document.getElementById("sch_logs_accordion");
    logAccordion.innerHTML = "";
    
    logs.forEach(l => {
        const item = document.createElement("div");
        item.style.background = "rgba(255,255,255,0.01)";
        item.style.border = "1px solid var(--border-color)";
        item.style.borderRadius = "12px";
        item.style.padding = "1rem";
        item.style.marginBottom = "0.75rem";
        
        let flagText = "";
        const attItem = db.attendance.find(a => a.date === l.date && a.matric === matric);
        if (attItem && attItem.geofence !== "Within Range") {
            flagText = `<span class="badge badge-danger" style="margin-left:0.5rem">Out-of-Range Clock-in</span>`;
        }
        
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem">
                <strong>Date: ${l.date}</strong>
                <div>
                    <span class="badge ${l.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${l.status}</span>
                    ${flagText}
                </div>
            </div>
            <p style="font-size:0.85rem; line-height:1.4; color:var(--text-secondary)">${l.description}</p>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.5rem">Tools: <code>${l.tools}</code> | Feedback: "${l.feedback || 'None'}"</div>
        `;
        logAccordion.appendChild(item);
    });
}

function openAcademicGradeModal() {
    const db = getDB();
    const s = db.students.find(student => student.matric === state.selectedStudentMatric);
    
    document.getElementById("gradeSelect").value = s.academicGrade || "A";
    document.getElementById("academicFeedback").value = s.academicFeedback || "";
    openModal("schGradingModal");
}

function submitAcademicGrade(event) {
    event.preventDefault();
    
    const grade = document.getElementById("gradeSelect").value;
    const feedback = document.getElementById("academicFeedback").value;
    
    let db = getDB();
    const sIdx = db.students.findIndex(student => student.matric === state.selectedStudentMatric);
    
    if (sIdx !== -1) {
        db.students[sIdx].academicGrade = grade;
        db.students[sIdx].academicFeedback = feedback;
        saveDB(db);
        postToBackend('student/grade', {
            matric: state.selectedStudentMatric,
            academicGrade: grade,
            academicFeedback: feedback
        });
        
        closeModal("schGradingModal");
        renderSchoolGrading();
        alert("Student grade and feedback finalized!");
    }
}

// ==========================================
// --- COORDINATOR VIEWS RENDERING ---
// ==========================================

function renderCoordinatorDashboard() {
    const db = getDB();
    const totalStudents = db.students.length;
    
    // Average attendance rate of all students
    let overallRate = 0;
    let clockInTotal = 0;
    db.students.forEach(s => {
        const att = db.attendance.filter(a => a.matric === s.matric);
        if (att.length > 0) {
            overallRate += (att.filter(a => a.status === "On-Time").length / att.length);
        }
        clockInTotal += att.length;
    });
    const avgRate = totalStudents > 0 ? Math.round((overallRate / totalStudents) * 100) : 0;
    
    document.getElementById("co_total_students").textContent = totalStudents;
    document.getElementById("co_avg_attendance").textContent = `${avgRate}%`;
    document.getElementById("co_active_companies").textContent = [...new Set(db.students.map(s => s.company))].length;
    
    // Alert flags (total out of range check-ins)
    const totalFlags = db.attendance.filter(a => a.geofence !== "Within Range").length;
    document.getElementById("co_alert_flags").textContent = totalFlags;
    
    // Render list of active students
    const tableBody = document.getElementById("co_students_stats_table");
    tableBody.innerHTML = "";
    
    db.students.forEach(s => {
        const att = db.attendance.filter(a => a.matric === s.matric);
        const sLogs = db.logbook.filter(l => l.matric === s.matric);
        const tr = document.createElement("tr");
        
        const lateCount = att.filter(a => a.status === "Late").length;
        const oRangeCount = att.filter(a => a.geofence !== "Within Range").length;
        
        tr.innerHTML = `
            <td>
                <strong>${s.name}</strong>
                <div style="font-size:0.75rem; color:var(--text-secondary)">${s.matric}</div>
            </td>
            <td>${s.company}</td>
            <td>${att.length} days</td>
            <td><span style="color:var(--warning)">${lateCount}</span> / <span style="color:var(--danger)">${oRangeCount}</span></td>
            <td>${sLogs.filter(l => l.status === 'Approved').length} / ${sLogs.length}</td>
            <td>${s.schoolSupervisor}</td>
            <td><span class="badge ${s.academicGrade ? 'badge-success' : 'badge-warning'}">${s.academicGrade || 'Ungraded'}</span></td>
        `;
        tableBody.appendChild(tr);
    });

    // Render dashboard charts
    setTimeout(renderCoordinatorCharts, 50);
}

function renderCoordinatorMapping() {
    const db = getDB();
    const selectStudent = document.getElementById("pairStudentSelect");
    const selectSupervisor = document.getElementById("pairSupervisorSelect");
    
    selectStudent.innerHTML = "";
    selectSupervisor.innerHTML = "";
    
    db.students.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.matric;
        opt.textContent = `${s.name} (${s.matric}) - Current: ${s.schoolSupervisor || 'None'}`;
        selectStudent.appendChild(opt);
    });
    
    db.schoolSupervisors.forEach(sp => {
        const opt = document.createElement("option");
        opt.value = sp.name;
        opt.textContent = `${sp.name} (${sp.dept})`;
        selectSupervisor.appendChild(opt);
    });
}

function assignSupervisorPair(event) {
    event.preventDefault();
    
    const matric = document.getElementById("pairStudentSelect").value;
    const supervisorName = document.getElementById("pairSupervisorSelect").value;
    
    let db = getDB();
    const index = db.students.findIndex(s => s.matric === matric);
    
    if (index !== -1) {
        db.students[index].schoolSupervisor = supervisorName;
        saveDB(db);
        postToBackend('student/assign', {
            matric,
            schoolSupervisor: supervisorName
        });
        
        alert(`Successfully assigned ${supervisorName} to student.`);
        renderCoordinatorMapping();
        renderCoordinatorDashboard();
    }
}

function renderCoordinatorReports() {
    // Simply render export summaries
    const db = getDB();
    document.getElementById("export_total_students").textContent = db.students.length;
    document.getElementById("export_total_attendance").textContent = db.attendance.length;
    document.getElementById("export_total_logs").textContent = db.logbook.length;
}

// Export Database tables to CSV
function exportData(type) {
    const db = getDB();
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = "";
    
    if (type === 'attendance') {
        filename = "IT_Internship_Attendance_Report.csv";
        csvContent += "Date,Matric Number,Clock In,Clock Out,Latitude,Longitude,Distance (m),Status,Geofence Status\n";
        db.attendance.forEach(a => {
            csvContent += `${a.date},${a.matric},${a.clockIn},${a.clockOut || 'N/A'},${a.lat},${a.lon},${Math.round(a.distance)},${a.status},${a.geofence}\n`;
        });
    } else if (type === 'logbook') {
        filename = "IT_Internship_Daily_Logbook.csv";
        csvContent += "Date,Matric Number,Hours,Description,Tools Used,Status,Signed By,Feedback\n";
        db.logbook.forEach(l => {
            // Clean description of quotes and commas for clean CSV structure
            const cleanedDesc = l.description.replace(/"/g, '""').replace(/\n/g, ' ');
            const cleanedFeedback = (l.feedback || "").replace(/"/g, '""').replace(/\n/g, ' ');
            csvContent += `${l.date},${l.matric},${l.hours},"${cleanedDesc}","${l.tools}",${l.status},"${l.signedBy || ''}","${cleanedFeedback}"\n`;
        });
    } else {
        filename = "IT_Internship_Student_List.csv";
        csvContent += "Matric Number,Name,Department,Level,Company,Industry Supervisor,School Supervisor,Industry Score,Academic Grade,Academic Feedback\n";
        db.students.forEach(s => {
            csvContent += `${s.matric},"${s.name}",${s.dept},${s.level},"${s.company}","${s.industrySupervisor}","${s.schoolSupervisor}",${s.evaluationGrade || ''},${s.academicGrade || ''},"${s.academicFeedback || ''}"\n`;
        });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================
// --- NEW FEATURES & UPGRADES CODE ---
// ==========================================

// Chart instance cache
let attendanceTrendChartInstance = null;
let punctualityChartInstance = null;
let logbookChartInstance = null;
let studentAttendancePerformanceChartInstance = null;

function renderCoordinatorCharts() {
    const db = getDB();
    
    // 1. Daily Attendance Trend Chart
    const attendanceDates = {};
    db.attendance.forEach(a => {
        attendanceDates[a.date] = (attendanceDates[a.date] || 0) + 1;
    });
    // Sort dates
    const sortedDates = Object.keys(attendanceDates).sort().slice(-7); // Last 7 dates
    const attendanceCounts = sortedDates.map(d => attendanceDates[d]);
    
    const ctxTrend = document.getElementById('attendanceTrendChart');
    if (ctxTrend) {
        if (attendanceTrendChartInstance) attendanceTrendChartInstance.destroy();
        attendanceTrendChartInstance = new Chart(ctxTrend, {
            type: 'bar',
            data: {
                labels: sortedDates,
                datasets: [{
                    label: 'Interns Clocked In',
                    data: attendanceCounts,
                    backgroundColor: 'rgba(0, 242, 254, 0.4)',
                    borderColor: '#00f2fe',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#9ca3af' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#9ca3af' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 2. Punctuality Donut Chart
    let onTime = 0, late = 0, flagged = 0;
    db.attendance.forEach(a => {
        if (a.geofence !== "Within Range") {
            flagged++;
        } else if (a.status === "Late") {
            late++;
        } else {
            onTime++;
        }
    });

    const ctxPunctuality = document.getElementById('punctualityChart');
    if (ctxPunctuality) {
        if (punctualityChartInstance) punctualityChartInstance.destroy();
        punctualityChartInstance = new Chart(ctxPunctuality, {
            type: 'doughnut',
            data: {
                labels: ['On-Time', 'Late', 'Geo-Flagged'],
                datasets: [{
                    data: [onTime, late, flagged],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.6)', // success green
                        'rgba(245, 158, 11, 0.6)', // warning yellow
                        'rgba(239, 68, 68, 0.6)'   // danger red
                    ],
                    borderColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#9ca3af', boxWidth: 12 }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // 3. Logbook Completion Bar Chart
    const studentNames = [];
    const approvedLogs = [];
    const pendingLogs = [];

    db.students.forEach(s => {
        studentNames.push(s.name.split(' ')[0]); // Use first name
        const sLogs = db.logbook.filter(l => l.matric === s.matric);
        approvedLogs.push(sLogs.filter(l => l.status === 'Approved').length);
        pendingLogs.push(sLogs.filter(l => l.status === 'Pending').length);
    });

    const ctxLogbook = document.getElementById('logbookChart');
    if (ctxLogbook) {
        if (logbookChartInstance) logbookChartInstance.destroy();
        logbookChartInstance = new Chart(ctxLogbook, {
            type: 'bar',
            data: {
                labels: studentNames,
                datasets: [
                    {
                        label: 'Approved Logs',
                        data: approvedLogs,
                        backgroundColor: 'rgba(16, 185, 129, 0.5)',
                        borderColor: '#10b981',
                        borderWidth: 1
                    },
                    {
                        label: 'Pending Logs',
                        data: pendingLogs,
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: '#3b82f6',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#9ca3af', boxWidth: 12 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#9ca3af' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#9ca3af' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

function renderStudentChart() {
    const db = getDB();
    const studentAtt = db.attendance.filter(a => a.matric === state.currentMatric);
    
    // Sort by date
    studentAtt.sort((a, b) => a.date.localeCompare(b.date));
    
    const dates = studentAtt.map(a => a.date);
    const distances = studentAtt.map(a => Math.round(a.distance));

    const ctxStudent = document.getElementById('studentAttendancePerformanceChart');
    if (ctxStudent) {
        if (studentAttendancePerformanceChartInstance) studentAttendancePerformanceChartInstance.destroy();
        studentAttendancePerformanceChartInstance = new Chart(ctxStudent, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Distance from Office (m)',
                    data: distances,
                    backgroundColor: 'rgba(79, 172, 254, 0.2)',
                    borderColor: '#4facfe',
                    borderWidth: 3,
                    pointBackgroundColor: '#00f2fe',
                    pointBorderColor: '#ffffff',
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Geofence Deviation (meters)',
                            color: '#9ca3af'
                        },
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#9ca3af' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

async function generatePDFReport() {
    const db = getDB();
    const btn = document.getElementById("downloadPdfBtn");
    const originalText = btn.innerHTML;
    btn.innerHTML = `
        <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        <span>Generating PDF...</span>
    `;
    btn.disabled = true;

    // Create a temporary container styled nicely for PDF report
    const pdfContainer = document.createElement("div");
    pdfContainer.style.position = "absolute";
    pdfContainer.style.left = "-9999px";
    pdfContainer.style.width = "800px";
    pdfContainer.style.padding = "40px";
    pdfContainer.style.backgroundColor = "#ffffff";
    pdfContainer.style.color = "#000000";
    pdfContainer.style.fontFamily = "Arial, sans-serif";

    let studentsRows = "";
    db.students.forEach(s => {
        const att = db.attendance.filter(a => a.matric === s.matric);
        const logs = db.logbook.filter(l => l.matric === s.matric);
        const approvedCount = logs.filter(l => l.status === 'Approved').length;
        const totalHours = logs.reduce((acc, curr) => acc + curr.hours, 0);

        studentsRows += `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: bold;">${s.name}<br><span style="font-size:0.75rem; color:#64748b;">${s.matric}</span></td>
                <td style="padding: 12px;">${s.company}</td>
                <td style="padding: 12px; text-align: center;">${att.length} days</td>
                <td style="padding: 12px; text-align: center;">${approvedCount} / ${logs.length}</td>
                <td style="padding: 12px; text-align: center;">${totalHours} hrs</td>
                <td style="padding: 12px; text-align: center;">${s.evaluationGrade || 'Ungraded'}%</td>
                <td style="padding: 12px; text-align: center; font-weight: bold;">${s.academicGrade || 'Pending'}</td>
            </tr>
        `;
    });

    pdfContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
            <div>
                <h1 style="margin: 0; font-size: 24px; color: #1e3a8a;">SIWES Internship Assessment Report</h1>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">University SIWES Portal Database</p>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0; font-weight: bold; font-size: 14px;">Date: ${new Date().toLocaleDateString()}</p>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">Report ID: SR-${Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
        </div>

        <h3 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Executive Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
            <tr>
                <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; width: 33%;">Total Registered Interns</td>
                <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; width: 33%;">Total Attendance Days</td>
                <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; width: 33%;">Total Logbook Submissions</td>
            </tr>
            <tr>
                <td style="padding: 15px; border: 1px solid #e2e8f0; font-size: 18px; text-align: center; color: #3b82f6; font-weight: bold;">${db.students.length}</td>
                <td style="padding: 15px; border: 1px solid #e2e8f0; font-size: 18px; text-align: center; color: #10b981; font-weight: bold;">${db.attendance.length}</td>
                <td style="padding: 15px; border: 1px solid #e2e8f0; font-size: 18px; text-align: center; color: #f59e0b; font-weight: bold;">${db.logbook.length}</td>
            </tr>
        </table>

        <h3 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Student Performance & Placement Directory</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 40px;">
            <thead>
                <tr style="background-color: #1e3a8a; color: #ffffff; text-align: left;">
                    <th style="padding: 12px;">Student</th>
                    <th style="padding: 12px;">Company / Center</th>
                    <th style="padding: 12px; text-align: center;">Attendance</th>
                    <th style="padding: 12px; text-align: center;">Logs (Appr/Total)</th>
                    <th style="padding: 12px; text-align: center;">Work Hours</th>
                    <th style="padding: 12px; text-align: center;">Industry Appr.</th>
                    <th style="padding: 12px; text-align: center;">Letter Grade</th>
                </tr>
            </thead>
            <tbody>
                ${studentsRows}
            </tbody>
        </table>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b;">
            <span>Generated via Computer Science SIWES Automated Audit System</span>
            <span>Page 1 of 1</span>
        </div>
    `;

    document.body.appendChild(pdfContainer);

    try {
        const canvas = await html2canvas(pdfContainer, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        const imgWidth = 595.28; // A4 size width in pt
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`SIWES_Executive_Report_${getTodayString()}.pdf`);
    } catch (e) {
        console.error("PDF generation failed:", e);
        alert("Failed to generate PDF. Please ensure all libraries are fully loaded.");
    } finally {
        document.body.removeChild(pdfContainer);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar) {
        sidebar.classList.toggle("open");
    }
    if (backdrop) {
        backdrop.classList.toggle("show");
    }
}
