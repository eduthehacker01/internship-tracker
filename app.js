// IT Internship Attendance & Logbook Portal - Application Logic (Unified Admin + Intern Portal)

const SEED_DATA = {
    students: [
        {
            matric: "UI/2022/CS/101",
            name: "Chinedu Azubuike",
            dept: "Computer Science",
            level: "400L",
            company: "TechCorp Solutions Ltd",
            officeAddress: "45 Marine Road, Victoria Island, Lagos",
            officeLat: 6.428056,
            officeLon: 3.421944,
            geofenceRadius: 200,
            industrySupervisor: "Engr. Sarah Jenkins",
            schoolSupervisor: "Dr. Festus Alao",
            email: "chinedu@example.com",
            password: "password123",
            academicGrade: "A",
            academicFeedback: "Consistent attendance and strong technical depth.",
            evaluationGrade: 88,
            evaluationRemarks: "Outstanding technical skill and self-starter."
        }
    ],
    attendance: [
        { id: 1, date: "2026-06-25", matric: "UI/2022/CS/101", clockIn: "08:02:15", clockOut: "17:10:30", lat: 6.428010, lon: 3.421910, distance: 7, status: "On-Time", geofence: "Within Range" },
        { id: 2, date: "2026-06-26", matric: "UI/2022/CS/101", clockIn: "08:14:40", clockOut: "17:05:00", lat: 6.427950, lon: 3.421880, distance: 13, status: "On-Time", geofence: "Within Range" },
        { id: 3, date: "2026-06-29", matric: "UI/2022/CS/101", clockIn: "08:45:10", clockOut: "17:00:20", lat: 6.428120, lon: 3.422000, distance: 9, status: "Late", geofence: "Within Range" },
        { id: 4, date: "2026-06-30", matric: "UI/2022/CS/101", clockIn: "08:08:22", clockOut: "17:15:40", lat: 6.428080, lon: 3.421950, distance: 3, status: "On-Time", geofence: "Within Range" },
        { id: 5, date: "2026-07-01", matric: "UI/2022/CS/101", clockIn: "08:52:00", clockOut: "17:01:00", lat: 6.435000, lon: 3.442000, distance: 2340, status: "Late", geofence: "Out of Range (Flagged)" }
    ],
    logbook: [
        {
            id: 1,
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
            id: 2,
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
            id: 3,
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
            id: 4,
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
            id: 5,
            date: "2026-07-01",
            matric: "UI/2022/CS/101",
            description: "Created API endpoints for invoice generation and integrated PDF creation library. Refactored the dispatch service to run asynchronously.",
            tools: "Express, PDFKit, Redis",
            hours: 8,
            status: "Pending",
            feedback: "",
            signedBy: ""
        }
    ],
    weeklyReports: [
        {
            id: 1,
            week: 1,
            matric: "UI/2022/CS/101",
            summary: "During my first week, I successfully onboarded and integrated into the engineering workflow. I resolved a critical authentication validation bug, drafted schemas for the billing database module, and developed frontend elements.",
            rating: 5,
            status: "Approved",
            feedback: "Excellent progress in week 1. Proactive approach to solving problems."
        }
    ],
    supervisors: [
        { id: "IS_01", name: "Engr. Sarah Jenkins", company: "TechCorp Solutions Ltd", email: "s.jenkins@techcorp.com", password: "password123" }
    ],
    schoolSupervisors: [
        { id: "SS_01", name: "Dr. Festus Alao", dept: "Computer Science", email: "f.alao@university.edu.ng", password: "password123" },
        { id: "SS_02", name: "Prof. Ebuka Obi", dept: "Computer Science", email: "coordinator@university.edu.ng", password: "password123" }
    ],
    notifications: [
        { id: 1, matric: "UI/2022/CS/101", userId: "ADMIN", role: "admin", message: "Intern Registered: Chinedu Azubuike (UI/2022/CS/101) placed at TechCorp Solutions Ltd.", type: "registration", read: false, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 2, matric: "UI/2022/CS/101", userId: "ADMIN", role: "admin", message: "Chinedu Azubuike clocked in Late at 08:52:00 (Out of Range (Flagged), Dist: 2340m).", type: "clock_in", read: false, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
        { id: 3, matric: "UI/2022/CS/101", userId: "ADMIN", role: "admin", message: "Chinedu Azubuike submitted daily logbook details for 2026-07-01 (8h, Tools: Express, PDFKit, Redis).", type: "log_submission", read: false, createdAt: new Date(Date.now() - 3600000 * 4).toISOString() }
    ]
};

function initDatabase() {
    if (!localStorage.getItem("intern_db_initialized_v3")) {
        localStorage.setItem("intern_db", JSON.stringify(SEED_DATA));
        localStorage.setItem("intern_db_initialized_v3", "true");
    }
}
initDatabase();

function getDB() {
    const raw = localStorage.getItem("intern_db");
    if (!raw) return JSON.parse(JSON.stringify(SEED_DATA));
    const parsed = JSON.parse(raw);
    if (!parsed.notifications) parsed.notifications = SEED_DATA.notifications;
    if (!parsed.schoolSupervisors) parsed.schoolSupervisors = SEED_DATA.schoolSupervisors;
    return parsed;
}

function saveDB(data) {
    localStorage.setItem("intern_db", JSON.stringify(data));
}

function pushLocalNotification({ matric, userId, role, message, type }) {
    const db = getDB();
    if (!db.notifications) db.notifications = [];
    const nextId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id || 0)) + 1 : 1;
    db.notifications.unshift({
        id: nextId,
        matric: matric || null,
        userId: userId || "ADMIN",
        role: role || "admin",
        message,
        type,
        read: false,
        createdAt: new Date().toISOString()
    });
    saveDB(db);
    renderNotifications();
}

const API_BASE = window.location.origin.startsWith("http")
    ? `${window.location.origin}/api`
    : "http://localhost:3000/api";

async function syncFromBackend() {
    try {
        const response = await fetch(`${API_BASE}/data`);
        if (response.ok) {
            const backendData = await response.json();
            const currentLocal = getDB();
            const mappedData = {
                students: (backendData.students && backendData.students.length > 0) ? backendData.students : currentLocal.students,
                attendance: backendData.attendance || currentLocal.attendance,
                logbook: backendData.logbook || currentLocal.logbook,
                weeklyReports: backendData.weeklyReports || currentLocal.weeklyReports,
                supervisors: (backendData.supervisors && backendData.supervisors.length > 0) ? backendData.supervisors : currentLocal.supervisors,
                schoolSupervisors: (backendData.schoolSupervisors && backendData.schoolSupervisors.length > 0) ? backendData.schoolSupervisors : currentLocal.schoolSupervisors,
                notifications: backendData.notifications || currentLocal.notifications || []
            };
            saveDB(mappedData);
            renderNotifications();
        }
    } catch (err) {
        console.warn("Using local persistence cache:", err.message);
        renderNotifications();
    }
}

async function checkBackendStatus() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
            state.isServerOnline = true;
            await syncFromBackend();
            updateServerStatusUI(true);
        } else {
            throw new Error("Server not ok");
        }
    } catch (e) {
        state.isServerOnline = false;
        updateServerStatusUI(false);
    }
}

function updateServerStatusUI(isOnline) {
    const statusDot = document.querySelector(".user-status-dot");
    if (statusDot) {
        statusDot.style.backgroundColor = isOnline ? "#3b82f6" : "#10b981";
        statusDot.title = isOnline ? "Connected to Server & Supabase Sync" : "Local Offline Mode Active";
    }
}

async function postToBackend(endpoint, payload) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            await syncFromBackend();
        }
    } catch (e) {
        console.warn(`Local mode active for ${endpoint}:`, e.message);
    }
}

// Normalize legacy role values into unified 'admin' or 'student'
function normalizeRole(role) {
    if (!role) return "student";
    if (role === "student") return "student";
    return "admin";
}

// --- STATE MANAGEMENT ---
const state = {
    activeRole: normalizeRole(localStorage.getItem("current_session_role")),
    activeTab: "overview",
    currentMatric: localStorage.getItem("current_session_matric") || "UI/2022/CS/101",
    selectedStudentMatric: localStorage.getItem("current_session_matric") || "UI/2022/CS/101",
    currentUserName: localStorage.getItem("current_session_name") || "Chinedu Azubuike",
    currentUserTitle: localStorage.getItem("current_session_title") || "400L CS Intern",
    currentUserEmail: localStorage.getItem("current_session_email") || "chinedu@example.com",
    currentSupervisorId: localStorage.getItem("current_session_supervisor_id") || "ADMIN_01",
    isLoggedIn: localStorage.getItem("current_session_role") ? true : false,
    isServerOnline: false,
    simulatedLocation: {
        mode: "office",
        lat: 6.428056,
        lon: 3.421944
    }
};

function getActiveOfficeCoordinates() {
    const db = getDB();
    const student = db.students.find(s => s.matric === state.currentMatric);
    if (student) {
        return {
            lat: parseFloat(student.officeLat) || 6.428056,
            lon: parseFloat(student.officeLon) || 3.421944,
            geofenceRadius: parseInt(student.geofenceRadius) || 200,
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
    lat: 6.439500,
    lon: 3.441200,
    label: "Student Residence (Ikoyi)"
};

// --- AUTHENTICATION & REGISTRATION LOGIC ---

function fillDemoLogin(type) {
    const emailInput = document.getElementById("loginEmail");
    const passInput = document.getElementById("loginPassword");
    if (!emailInput || !passInput) return;

    if (type === 'admin') {
        emailInput.value = "admin@siwes.com";
        passInput.value = "password123";
    } else {
        emailInput.value = "chinedu@example.com";
        passInput.value = "password123";
    }
}

function switchAuthTab(tab) {
    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const loginContainer = document.getElementById("loginFormContainer");
    const registerContainer = document.getElementById("registerFormContainer");

    if (tab === 'register') {
        tabLogin.classList.remove("active");
        tabRegister.classList.add("active");
        loginContainer.classList.remove("active");
        registerContainer.classList.add("active");
    } else {
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        loginContainer.classList.add("active");
        registerContainer.classList.remove("active");
    }
}

function localAuthenticate(emailInput, passwordInput) {
    const email = (emailInput || '').trim().toLowerCase();
    const password = (passwordInput || '').trim();
    const db = getDB();

    const adminAccounts = [
        { email: 'admin@siwes.com', password: 'password123', id: 'ADMIN_01', name: 'Prof. Ebuka Obi (SIWES Admin)', title: 'SIWES Admin & Coordinator' },
        { email: 'coordinator@university.edu.ng', password: 'password123', id: 'CO_01', name: 'Prof. Ebuka Obi', title: 'IT Coordinator' },
        { email: 's.jenkins@techcorp.com', password: 'password123', id: 'IS_01', name: 'Engr. Sarah Jenkins', title: 'Industry Supervisor' },
        { email: 'f.alao@university.edu.ng', password: 'password123', id: 'SS_01', name: 'Dr. Festus Alao', title: 'Academic Supervisor' }
    ];

    const matchedAdmin = adminAccounts.find(a => a.email === email);
    if (matchedAdmin) {
        if (matchedAdmin.password === password) {
            return {
                success: true,
                role: 'admin',
                id: matchedAdmin.id,
                name: matchedAdmin.name,
                title: matchedAdmin.title,
                email: matchedAdmin.email
            };
        }
        return { success: false, error: "Incorrect password for Admin account." };
    }

    const student = db.students.find(
        s => (s.email && s.email.toLowerCase() === email) ||
             (s.matric && s.matric.toLowerCase() === email) ||
             (email === 'student@siwes.com' && s.matric === 'UI/2022/CS/101')
    );

    if (student) {
        if ((student.password || 'password123') === password) {
            return {
                success: true,
                role: 'student',
                id: student.matric,
                matric: student.matric,
                name: student.name,
                title: `${student.level || '400L'} ${student.dept || 'CS'} Intern`,
                email: student.email || email
            };
        }
        return { success: false, error: "Incorrect password for this Intern account." };
    }

    return {
        success: false,
        error: "User account not found. Use 'admin@siwes.com' / 'password123' for Admin, 'chinedu@example.com' / 'password123' for Demo Intern, or register a new Intern."
    };
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    let authResult = null;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok && data.success) {
            authResult = data;
        } else {
            // Try local DB fallback in case user registered in localStorage
            const fallback = localAuthenticate(email, password);
            if (fallback.success) {
                authResult = fallback;
            } else {
                alert(data.error || fallback.error);
                return;
            }
        }
    } catch (err) {
        // Offline / local fallback
        const fallback = localAuthenticate(email, password);
        if (!fallback.success) {
            alert(fallback.error);
            return;
        }
        authResult = fallback;
        if (authResult.role === 'student') {
            pushLocalNotification({
                matric: authResult.matric,
                userId: 'ADMIN',
                role: 'admin',
                message: `Intern Signed In: ${authResult.name} (${authResult.matric}) logged into the Intern Portal.`,
                type: 'login'
            });
        }
    }

    const normalizedRole = normalizeRole(authResult.role);
    state.activeRole = normalizedRole;
    state.isLoggedIn = true;
    state.currentUserName = authResult.name;
    state.currentUserTitle = authResult.title || (normalizedRole === 'admin' ? 'SIWES Admin & Supervisor' : 'CS Intern');
    state.currentUserEmail = authResult.email;

    localStorage.setItem("current_session_role", normalizedRole);
    localStorage.setItem("current_session_name", state.currentUserName);
    localStorage.setItem("current_session_title", state.currentUserTitle);
    localStorage.setItem("current_session_email", state.currentUserEmail);

    if (normalizedRole === 'student') {
        state.currentMatric = authResult.matric;
        state.selectedStudentMatric = authResult.matric;
        localStorage.setItem("current_session_matric", authResult.matric);
    } else {
        state.currentSupervisorId = authResult.id || "ADMIN_01";
        localStorage.setItem("current_session_supervisor_id", state.currentSupervisorId);
    }

    closeAuthModal();
    await renderAuthOrShell();
}

function fetchOfficeCoordinates() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                document.getElementById("regLat").value = pos.coords.latitude.toFixed(6);
                document.getElementById("regLon").value = pos.coords.longitude.toFixed(6);
                alert("GPS Coordinates set to your current location!");
            },
            () => {
                alert("Could not read browser GPS. Using default office coordinates.");
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
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const company = document.getElementById("regCompany").value.trim();
    const officeAddress = document.getElementById("regAddress").value.trim();
    const officeLat = parseFloat(document.getElementById("regLat").value) || 6.428056;
    const officeLon = parseFloat(document.getElementById("regLon").value) || 3.421944;
    const industrySupervisor = document.getElementById("regIndSupervisor").value.trim();
    const schoolSupervisor = document.getElementById("regSchSupervisor").value.trim();

    let db = getDB();

    if (db.students.find(s => s.matric.toLowerCase() === matric.toLowerCase() || (s.email && s.email.toLowerCase() === email.toLowerCase()))) {
        alert("An intern with this Matric Number or Email is already registered.");
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
        email,
        password,
        academicGrade: null,
        academicFeedback: "",
        evaluationGrade: null,
        evaluationRemarks: ""
    };

    // Save locally and create instant Admin Portal notification
    db.students.push(newStudent);
    saveDB(db);

    pushLocalNotification({
        matric,
        userId: 'ADMIN',
        role: 'admin',
        message: `New Intern Registered: ${name} (${matric}) placed at ${company}.`,
        type: 'registration'
    });

    // Also sync to backend & Supabase
    await postToBackend('students', newStudent);

    // Clear form
    document.getElementById("regMatric").value = "";
    document.getElementById("regName").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regCompany").value = "";
    document.getElementById("regAddress").value = "";

    closeAuthModal();

    // If an admin registered the intern from inside the Admin Portal, keep them in the Admin Portal and refresh
    if (state.isLoggedIn && state.activeRole === "admin") {
        state.selectedStudentMatric = matric;
        alert(`Intern ${name} (${matric}) registered! Notification sent to Admin Portal.`);
        renderCurrentTab();
        renderNotifications();
        return;
    }

    // Otherwise log in the newly registered student
    state.activeRole = "student";
    state.currentMatric = matric;
    state.selectedStudentMatric = matric;
    state.currentUserName = name;
    state.currentUserTitle = `${level} ${dept} Intern`;
    state.currentUserEmail = email;
    state.isLoggedIn = true;

    localStorage.setItem("current_session_role", "student");
    localStorage.setItem("current_session_matric", matric);
    localStorage.setItem("current_session_name", name);
    localStorage.setItem("current_session_title", state.currentUserTitle);
    localStorage.setItem("current_session_email", email);

    alert(`Registration Successful! Welcome ${name}. Your registration notification has been sent to the Admin Portal.`);
    await renderAuthOrShell();
}

function handleLogout() {
    state.isLoggedIn = false;
    localStorage.removeItem("current_session_role");
    localStorage.removeItem("current_session_matric");
    localStorage.removeItem("current_session_name");
    localStorage.removeItem("current_session_title");
    localStorage.removeItem("current_session_email");
    renderAuthOrShell();
}

async function renderAuthOrShell() {
    const authScreen = document.getElementById("authScreen");
    const appShell = document.getElementById("appShell");
    const landingPage = document.getElementById("landingPage");

    if (state.isLoggedIn) {
        await syncFromBackend();

        if (landingPage) landingPage.style.display = "none";
        authScreen.style.display = "none";
        appShell.style.display = "flex";

        const normalized = normalizeRole(state.activeRole);
        document.querySelectorAll(".btn-demo-role").forEach(btn => {
            if (btn.dataset.role === normalized) btn.classList.add("active");
            else btn.classList.remove("active");
        });

        changeRole(normalized, true);
    } else {
        if (landingPage) landingPage.style.display = "flex";
        authScreen.style.display = "none";
        appShell.style.display = "none";
    }
}

// --- GEOLOCATION MATHEMATICS (HAVERSINE FORMULA) ---
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function getCoordinates(callback) {
    const office = getActiveOfficeCoordinates();
    if (state.simulatedLocation.mode === "office") {
        callback({ lat: office.lat, lon: office.lon, isMocked: true });
    } else if (state.simulatedLocation.mode === "home") {
        callback({ lat: HOME_COORDINATES.lat, lon: HOME_COORDINATES.lon, isMocked: true });
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    callback({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        isMocked: false
                    });
                },
                () => {
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

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", async () => {
    await checkBackendStatus();
    startClock();

    const demoTrigger = document.getElementById("demoTrigger");
    const demoPanel = document.getElementById("demoPanel");

    if (demoTrigger && demoPanel) {
        demoTrigger.addEventListener("click", () => {
            demoPanel.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
            if (!demoTrigger.contains(e.target) && !demoPanel.contains(e.target)) {
                demoPanel.classList.remove("show");
            }
        });
    }

    setupDemoPanel();
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
            state.isLoggedIn = true;
            const landingPage = document.getElementById("landingPage");
            const appShell = document.getElementById("appShell");
            if (landingPage) landingPage.style.display = "none";
            if (appShell) appShell.style.display = "flex";
            changeRole(btn.dataset.role, false);
        });
    });

    const gpsOptions = document.querySelectorAll(".gps-option");
    gpsOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            gpsOptions.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            state.simulatedLocation.mode = opt.dataset.mode;

            if (state.activeRole === "student" && state.activeTab === "overview") {
                updateStudentLocationStatus();
            }
        });
    });
}

function changeRole(role, preserveSessionUser) {
    const normalized = normalizeRole(role);
    state.activeRole = normalized;
    localStorage.setItem("current_session_role", normalized);

    const db = getDB();
    const firstMatric = db.students.length > 0 ? db.students[0].matric : "UI/2022/CS/101";

    if (normalized === "student") {
        state.activeTab = "overview";
        if (!preserveSessionUser) {
            const st = db.students.find(s => s.matric === state.currentMatric) || db.students[0];
            state.currentMatric = st ? st.matric : firstMatric;
            state.currentUserName = st ? st.name : "Chinedu Azubuike";
            state.currentUserTitle = st ? `${st.level} ${st.dept} Intern` : "400L CS Intern";
            state.currentUserEmail = st ? st.email : "chinedu@example.com";
        }
    } else {
        state.activeTab = "overview";
        if (!state.selectedStudentMatric || !db.students.some(s => s.matric === state.selectedStudentMatric)) {
            state.selectedStudentMatric = firstMatric;
        }
        if (!preserveSessionUser) {
            state.currentUserName = "Prof. Ebuka Obi";
            state.currentUserTitle = "SIWES Admin & Supervisor";
            state.currentUserEmail = "admin@siwes.com";
        }
    }

    updateSidebarProfile();
    buildSidebarNav();
    renderCurrentTab();
    renderNotifications();

    const demoPanel = document.getElementById("demoPanel");
    if (demoPanel) demoPanel.classList.remove("show");
}

function updateSidebarProfile() {
    const nameEl = document.getElementById("sidebarUserName");
    const roleEl = document.getElementById("sidebarUserRole");
    const badgeEl = document.getElementById("sidebarPortalBadge");

    if (state.activeRole === "student") {
        nameEl.textContent = state.currentUserName || "Student Intern";
        roleEl.textContent = state.currentUserTitle || "400L CS Intern";
        if (badgeEl) badgeEl.textContent = "Intern Portal";
    } else {
        nameEl.textContent = state.currentUserName || "SIWES Admin";
        roleEl.textContent = state.currentUserTitle || "Admin & Supervisor Portal";
        if (badgeEl) badgeEl.textContent = "Admin Portal";
    }
}

function buildSidebarNav() {
    const navContainer = document.getElementById("navLinksContainer");
    navContainer.innerHTML = "";

    let links = [];

    if (state.activeRole === "student") {
        links = [
            { id: "overview", label: "Dashboard & Clock-In", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
            { id: "logbook", label: "Daily Logbook", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
            { id: "weekly", label: "Weekly Reports", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
            { id: "profile", label: "My Placement Profile", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` }
        ];
    } else {
        links = [
            { id: "overview", label: "Command Center", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
            { id: "interns", label: "Registered Interns", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
            { id: "verify", label: "Verify Logs & GPS", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` },
            { id: "grading", label: "Grading & Appraisal", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
            { id: "reports", label: "Reports & Exports", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>` }
        ];
    }

    links.forEach(link => {
        const li = document.createElement("li");
        li.className = "nav-item";

        const a = document.createElement("a");
        a.className = `nav-link ${state.activeTab === link.id ? 'active' : ''}`;
        a.innerHTML = `${link.icon} <span>${link.label}</span>`;
        a.addEventListener("click", () => {
            document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
            a.classList.add("active");
            state.activeTab = link.id;
            renderCurrentTab();
        });

        li.appendChild(a);
        navContainer.appendChild(li);
    });

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
    const titles = {
        overview: state.activeRole === "admin" ? "Admin Command Center" : "Intern Dashboard",
        logbook: "Daily Technical Logbook",
        weekly: "Weekly Progress Reports",
        profile: "Intern Placement Profile",
        interns: "Registered Interns Directory",
        verify: "Verify Logbooks & GPS Attendance",
        grading: "Performance Appraisal & Academic Grading",
        reports: "Official Reports & CSV/PDF Exports"
    };
    pageTitle.textContent = titles[state.activeTab] || "SIWES Portal";

    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar && sidebar.classList.contains("open")) sidebar.classList.remove("open");
    if (backdrop && backdrop.classList.contains("show")) backdrop.classList.remove("show");

    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));

    const rolePrefix = state.activeRole === "student" ? "student" : "admin";
    const panelId = `${rolePrefix}_${state.activeTab}_view`;
    const targetPanel = document.getElementById(panelId);

    if (targetPanel) {
        targetPanel.classList.add("active");

        if (state.activeRole === "student") {
            if (state.activeTab === "overview") renderStudentOverview();
            else if (state.activeTab === "logbook") renderStudentLogbook();
            else if (state.activeTab === "weekly") renderStudentWeekly();
            else if (state.activeTab === "profile") renderStudentProfile();
        } else {
            if (state.activeTab === "overview") renderAdminOverview();
            else if (state.activeTab === "interns") renderAdminInterns();
            else if (state.activeTab === "verify") renderAdminVerify();
            else if (state.activeTab === "grading") renderAdminGrading();
            else if (state.activeTab === "reports") renderAdminReports();
        }
    }
}

// ==========================================
// --- STUDENT INTERN VIEWS RENDERING ---
// ==========================================

function renderStudentOverview() {
    const db = getDB();
    const attList = db.attendance.filter(a => a.matric === state.currentMatric);

    const totalDays = 120;
    const activeDays = attList.length;
    const rate = activeDays > 0
        ? Math.round((attList.filter(a => a.status === "On-Time").length / activeDays) * 100)
        : 100;

    document.getElementById("student_att_rate").textContent = `${rate}%`;
    document.getElementById("student_days_completed").textContent = `${activeDays}/${totalDays}`;

    const pendingLogs = db.logbook.filter(l => l.matric === state.currentMatric && l.status === "Pending").length;
    document.getElementById("student_pending_logs").textContent = pendingLogs;

    renderCalendarWidget();
    updateClockButtonUI();
    updateStudentLocationStatus();

    const recentTable = document.getElementById("student_recent_attendance_table");
    recentTable.innerHTML = "";

    const sortedAtt = [...attList].reverse().slice(0, 5);

    if (sortedAtt.length === 0) {
        recentTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary)">No attendance recorded yet. Click "Clock In" above!</td></tr>`;
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

    setTimeout(renderStudentChart, 50);
}

function updateStudentLocationStatus() {
    const statusBox = document.getElementById("student_location_status");
    const labelEl = document.getElementById("student_location_label");
    const descEl = document.getElementById("student_location_desc");
    if (!statusBox) return;

    getCoordinates((coords) => {
        const office = getActiveOfficeCoordinates();
        const distance = getDistance(coords.lat, coords.lon, office.lat, office.lon);
        const withinRadius = distance <= office.geofenceRadius;

        statusBox.className = `location-status ${withinRadius ? 'success' : 'danger'}`;
        labelEl.textContent = withinRadius ? "Within Range of Office" : "Outside Allowed Geofence";

        const locLabel = coords.isMocked
            ? (state.simulatedLocation.mode === "office" ? office.label : HOME_COORDINATES.label)
            : "Actual GPS Location";

        descEl.textContent = `GPS: ${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)} • Distance: ${Math.round(distance)}m from ${locLabel}`;
    });
}

function updateClockButtonUI() {
    const clockBtn = document.getElementById("clockBtn");
    const indicator = document.getElementById("clockIndicator");
    const statusText = document.getElementById("clockStatusText");
    if (!clockBtn) return;

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

    getCoordinates(async (coords) => {
        const office = getActiveOfficeCoordinates();
        const distance = getDistance(coords.lat, coords.lon, office.lat, office.lon);
        const withinRadius = distance <= office.geofenceRadius;

        let db = getDB();
        const student = db.students.find(s => s.matric === state.currentMatric);
        const studentName = student ? student.name : state.currentMatric;
        const companyName = student ? student.company : "the Office";

        if (!todayRecord) {
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

            pushLocalNotification({
                matric: state.currentMatric,
                userId: 'ADMIN',
                role: 'admin',
                message: `${studentName} (${state.currentMatric}) clocked in ${newRecord.status} at ${timeStr} — ${newRecord.geofence} (${Math.round(distance)}m from office).`,
                type: 'clock_in'
            });

            await postToBackend('attendance/clock-in', newRecord);

            alert(withinRadius
                ? `Clock-in successful! Welcome to ${companyName}. Notification sent to Admin Portal.`
                : `Warning: Clocked in OUTSIDE office geofence (${Math.round(distance)}m away). Flagged in Admin Portal.`);
        } else {
            const index = db.attendance.findIndex(a => a.date === todayRecord.date && a.matric === state.currentMatric);
            if (index !== -1) {
                db.attendance[index].clockOut = timeStr;
                saveDB(db);
            }

            pushLocalNotification({
                matric: state.currentMatric,
                userId: 'ADMIN',
                role: 'admin',
                message: `${studentName} (${state.currentMatric}) clocked out at ${timeStr}.`,
                type: 'clock_in'
            });

            await postToBackend('attendance/clock-out', { date: todayRecord.date, matric: state.currentMatric, clockOut: timeStr });
            alert("Clock-out recorded and sent to Admin Portal!");
        }

        renderStudentOverview();
    });
}

function renderCalendarWidget() {
    const db = getDB();
    const calendarDays = document.getElementById("calendarDays");
    if (!calendarDays) return;

    calendarDays.innerHTML = "";
    const labels = ["S", "M", "T", "W", "T", "F", "S"];
    labels.forEach(l => {
        const div = document.createElement("div");
        div.className = "calendar-day-label";
        div.textContent = l;
        calendarDays.appendChild(div);
    });

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

    const todayAtt = getTodayAttendance(state.currentMatric);
    const warningLabel = document.getElementById("studentLogbookWarning");
    if (warningLabel) {
        warningLabel.style.display = todayAtt ? "none" : "flex";
    }

    const logsTable = document.getElementById("student_logs_table");
    logsTable.innerHTML = "";

    const sortedLogs = [...logs].reverse();

    if (sortedLogs.length === 0) {
        logsTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary)">No logbook entries submitted yet. Click "Add Daily Entry" to submit one!</td></tr>`;
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
    if (!log) return;

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
    if (m) m.classList.add("show");
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove("show");
}

function openAddLogModal() {
    document.getElementById("logDate").value = getTodayString();
    openModal("addLogModal");
}

async function submitNewLog(event) {
    event.preventDefault();

    const date = document.getElementById("logDate").value;
    const description = document.getElementById("logDescription").value;
    const tools = document.getElementById("logTools").value;
    const hours = parseInt(document.getElementById("logHours").value);

    let db = getDB();
    const student = db.students.find(s => s.matric === state.currentMatric);
    const studentName = student ? student.name : state.currentMatric;

    const existingLog = db.logbook.find(l => l.date === date && l.matric === state.currentMatric);
    if (existingLog) {
        alert("A log entry already exists for this date. Choose another date or view your existing entry.");
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

    pushLocalNotification({
        matric: state.currentMatric,
        userId: 'ADMIN',
        role: 'admin',
        message: `${studentName} (${state.currentMatric}) submitted daily logbook entry for ${date} (${hours}h, Tools: ${tools}).`,
        type: 'log_submission'
    });

    await postToBackend('logbook', newLog);

    closeModal("addLogModal");
    document.getElementById("logDescription").value = "";
    document.getElementById("logTools").value = "";

    renderStudentLogbook();
    alert("Daily logbook entry submitted to the Admin Portal for verification!");
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
    if (!report) return;

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
    document.getElementById("weeklyWeekNo").value = reports.length + 1;
    openModal("addWeeklyModal");
}

async function submitNewWeekly(event) {
    event.preventDefault();

    const week = parseInt(document.getElementById("weeklyWeekNo").value);
    const summary = document.getElementById("weeklySummary").value;

    let db = getDB();
    const student = db.students.find(s => s.matric === state.currentMatric);
    const studentName = student ? student.name : state.currentMatric;

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

    pushLocalNotification({
        matric: state.currentMatric,
        userId: 'ADMIN',
        role: 'admin',
        message: `${studentName} (${state.currentMatric}) submitted Week ${week} Progress Summary.`,
        type: 'log_submission'
    });

    await postToBackend('weekly', newReport);

    closeModal("addWeeklyModal");
    document.getElementById("weeklySummary").value = "";

    renderStudentWeekly();
    alert(`Week ${week} report submitted to Admin Portal!`);
}

function renderStudentProfile() {
    const db = getDB();
    const s = db.students.find(student => student.matric === state.currentMatric) || db.students[0];
    if (!s) return;

    document.getElementById("profile_name").textContent = s.name;
    document.getElementById("profile_matric").textContent = s.matric;
    document.getElementById("profile_dept").textContent = s.dept;
    document.getElementById("profile_level").textContent = s.level;
    document.getElementById("profile_company").textContent = s.company;
    document.getElementById("profile_address").textContent = s.officeAddress;
    document.getElementById("profile_gps").textContent = `${s.officeLat}, ${s.officeLon} (200m Geofence)`;
    document.getElementById("profile_ind_sup").textContent = s.industrySupervisor;
    document.getElementById("profile_sch_sup").textContent = s.schoolSupervisor;
    document.getElementById("profile_ind_score").textContent = s.evaluationGrade ? `${s.evaluationGrade}/100 (${s.evaluationRemarks || 'Good'})` : "Pending Evaluation";

    const gradeBox = document.getElementById("profile_grade_box");
    if (s.academicGrade) {
        gradeBox.innerHTML = `
            <div class="badge badge-success" style="font-size:1.1rem; padding:0.5rem 1rem;">Final Grade: ${s.academicGrade}</div>
            <p style="margin-top: 0.75rem; font-size:0.85rem; color: var(--text-secondary)"><strong>Academic Review:</strong> "${s.academicFeedback || 'Approved'}"</p>
        `;
    } else {
        gradeBox.innerHTML = `<span class="badge badge-warning">Academic Grading Pending Inspection</span>`;
    }
}

// ====================================================
// --- UNIFIED ADMIN & SUPERVISOR PORTAL RENDERING ---
// ====================================================

function populateSupervisorStudentSelector(includeAllOption = false) {
    const selectors = [
        document.getElementById("ind_student_selector"),
        document.getElementById("admin_grade_student_selector")
    ];
    const db = getDB();
    const allStudents = db.students || [];

    if (allStudents.length > 0 && (!state.selectedStudentMatric || (!allStudents.some(s => s.matric === state.selectedStudentMatric) && state.selectedStudentMatric !== "ALL"))) {
        state.selectedStudentMatric = allStudents[0].matric;
    }

    selectors.forEach(selectEl => {
        if (!selectEl) return;
        const isVerifySelector = selectEl.id === "ind_student_selector";
        selectEl.innerHTML = "";

        if (isVerifySelector && includeAllOption) {
            const allOpt = document.createElement("option");
            allOpt.value = "ALL";
            allOpt.textContent = `All Registered Interns (${allStudents.length})`;
            selectEl.appendChild(allOpt);
        }

        if (allStudents.length === 0) {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "No interns registered yet";
            selectEl.appendChild(opt);
        } else {
            allStudents.forEach(s => {
                const opt = document.createElement("option");
                opt.value = s.matric;
                opt.textContent = `${s.name} (${s.matric}) — ${s.company}`;
                selectEl.appendChild(opt);
            });
        }

        if (selectEl.id === "admin_grade_student_selector" && state.selectedStudentMatric === "ALL" && allStudents.length > 0) {
            selectEl.value = allStudents[0].matric;
        } else {
            selectEl.value = state.selectedStudentMatric;
        }
    });
}

function handleSupervisorStudentChange(matric) {
    if (!matric) return;
    state.selectedStudentMatric = matric;
    if (matric !== "ALL") {
        localStorage.setItem("current_session_matric", matric);
    }
    if (state.activeTab === "verify") renderAdminVerify();
    if (state.activeTab === "grading") renderAdminGrading();
}

// 1. Admin Tab: Command Center (Stats + Live In-App Activity Feed + Charts)
function renderAdminOverview() {
    const db = getDB();
    const totalStudents = db.students.length;

    let overallRate = 0;
    db.students.forEach(s => {
        const att = db.attendance.filter(a => a.matric === s.matric);
        if (att.length > 0) {
            overallRate += (att.filter(a => a.status === "On-Time").length / att.length);
        } else {
            overallRate += 1;
        }
    });
    const avgRate = totalStudents > 0 ? Math.round((overallRate / totalStudents) * 100) : 100;
    const pendingLogsCount = db.logbook.filter(l => l.status === "Pending").length;
    const totalFlags = db.attendance.filter(a => a.geofence !== "Within Range").length;

    document.getElementById("co_total_students").textContent = totalStudents;
    document.getElementById("admin_pending_logs_count").textContent = pendingLogsCount;
    document.getElementById("co_avg_attendance").textContent = `${avgRate}%`;
    document.getElementById("co_alert_flags").textContent = totalFlags;

    // Render Live Admin Activity Feed
    const feedContainer = document.getElementById("admin_live_feed_list");
    if (feedContainer) {
        feedContainer.innerHTML = "";
        const adminNotifs = (db.notifications || []).filter(n => n.role !== 'student');

        if (adminNotifs.length === 0) {
            feedContainer.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-secondary);">No activity notifications yet. Register or sign in as an intern to see live alerts here!</div>`;
        } else {
            adminNotifs.slice(0, 15).forEach(n => {
                const row = document.createElement("div");
                row.style.display = "flex";
                row.style.justifyContent = "space-between";
                row.style.alignItems = "center";
                row.style.gap = "1rem";
                row.style.padding = "0.75rem 1rem";
                row.style.borderRadius = "12px";
                row.style.background = n.read ? "rgba(255,255,255,0.02)" : "rgba(0, 242, 254, 0.08)";
                row.style.border = n.read ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0, 242, 254, 0.25)";

                let badgeHtml = `<span class="badge badge-success">Activity</span>`;
                if (n.type === 'registration') badgeHtml = `<span class="badge badge-success" style="background:rgba(0,242,254,0.15); color:var(--primary);">New Registration</span>`;
                else if (n.type === 'login') badgeHtml = `<span class="badge badge-success">Intern Login</span>`;
                else if (n.type === 'clock_in') badgeHtml = n.message.includes("Out of Range")
                    ? `<span class="badge badge-danger">GPS Violation</span>`
                    : `<span class="badge badge-success">GPS Clock-In</span>`;
                else if (n.type === 'log_submission') badgeHtml = `<span class="badge badge-warning">Logbook Submitted</span>`;

                const dateObj = new Date(n.createdAt || Date.now());
                const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                row.innerHTML = `
                    <div style="display:flex; align-items:center; gap:0.85rem; flex-wrap:wrap;">
                        ${badgeHtml}
                        <span style="font-size:0.86rem; color:var(--text-primary);">${n.message}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.6rem; flex-shrink:0;">
                        <span style="font-size:0.72rem; color:var(--text-muted);">${dateStr}, ${timeStr}</span>
                        ${n.matric ? `<button class="btn btn-secondary btn-sm" style="padding:0.25rem 0.6rem; font-size:0.72rem;" onclick="inspectInternFromAdmin('${n.matric}', 'verify')">Inspect</button>` : ''}
                    </div>
                `;
                feedContainer.appendChild(row);
            });
        }
    }

    setTimeout(renderCoordinatorCharts, 50);
}

// 2. Admin Tab: Registered Interns Directory
function renderAdminInterns() {
    const db = getDB();
    const tableBody = document.getElementById("co_students_stats_table");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (db.students.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-secondary);">No interns registered yet. Click "Register New Intern" above!</td></tr>`;
        return;
    }

    db.students.forEach(s => {
        const att = db.attendance.filter(a => a.matric === s.matric);
        const sLogs = db.logbook.filter(l => l.matric === s.matric);
        const lateCount = att.filter(a => a.status === "Late").length;
        const oRangeCount = att.filter(a => a.geofence !== "Within Range").length;
        const approvedLogs = sLogs.filter(l => l.status === 'Approved').length;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong>${s.name}</strong>
                <div style="font-size:0.75rem; color:var(--primary)">${s.matric} (${s.level || '400L'})</div>
            </td>
            <td>
                <div style="font-size:0.82rem;">${s.email || 'student@siwes.com'}</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">Dept: ${s.dept}</div>
            </td>
            <td>
                <strong>${s.company}</strong>
                <div style="font-size:0.72rem; color:var(--text-secondary);">${s.officeAddress || ''}</div>
            </td>
            <td>
                <strong>${att.length} days</strong>
                <div style="font-size:0.72rem;"><span style="color:var(--warning)">${lateCount} Late</span> • <span style="color:var(--danger)">${oRangeCount} Geo-Flags</span></div>
            </td>
            <td>
                <span class="badge ${approvedLogs === sLogs.length && sLogs.length > 0 ? 'badge-success' : 'badge-warning'}">${approvedLogs} / ${sLogs.length} Verified</span>
            </td>
            <td>
                <div style="font-size:0.82rem;">Ind: <strong>${s.evaluationGrade ? s.evaluationGrade + '%' : '--'}</strong></div>
                <div style="font-size:0.82rem;">Acad: <strong style="color:var(--success)">${s.academicGrade || 'Ungraded'}</strong></div>
            </td>
            <td>
                <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                    <button class="btn btn-primary btn-sm" style="padding:0.3rem 0.6rem; font-size:0.73rem;" onclick="inspectInternFromAdmin('${s.matric}', 'verify')">Verify Logs</button>
                    <button class="btn btn-secondary btn-sm" style="padding:0.3rem 0.6rem; font-size:0.73rem;" onclick="inspectInternFromAdmin('${s.matric}', 'grading')">Grade</button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function inspectInternFromAdmin(matric, targetTab) {
    state.selectedStudentMatric = matric;
    state.activeTab = targetTab || "verify";
    buildSidebarNav();
    renderCurrentTab();
}

// 3. Admin Tab: Verify Logs & GPS Attendance Audit
function renderAdminVerify() {
    const db = getDB();
    populateSupervisorStudentSelector(true);

    const filterMatric = state.selectedStudentMatric || "ALL";
    const pendingLogs = db.logbook.filter(l => (filterMatric === "ALL" || l.matric === filterMatric) && l.status === "Pending");

    const container = document.getElementById("ind_pending_logs_container");
    container.innerHTML = "";

    if (pendingLogs.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 1.5rem; color: var(--text-secondary);">No pending daily logbook entries awaiting sign-off for this selection.</div>`;
    } else {
        pendingLogs.forEach(l => {
            const student = db.students.find(s => s.matric === l.matric);
            const studentName = student ? student.name : l.matric;

            const card = document.createElement("div");
            card.className = "glass-card";
            card.style.marginBottom = "1rem";
            card.style.background = "rgba(255,255,255,0.02)";

            const attDay = db.attendance.find(a => a.date === l.date && a.matric === l.matric);
            let locText = "No GPS Clock-in Recorded";
            let locClass = "badge-warning";
            if (attDay) {
                locText = `${attDay.geofence} (${Math.round(attDay.distance)}m • In: ${attDay.clockIn})`;
                locClass = attDay.geofence === "Within Range" ? "badge-success" : "badge-danger";
            }

            const safeId = `${l.matric.replace(/[^a-zA-Z0-9]/g, '_')}_${l.date}`;

            card.innerHTML = `
                <div class="card-header" style="margin-bottom:0.75rem;">
                    <div>
                        <h4 style="color:var(--primary); font-size:1.05rem;">${studentName} <span style="font-size:0.8rem; color:var(--text-secondary);">(${l.matric})</span> — ${l.date}</h4>
                        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">Hours Logged: <strong>${l.hours}h</strong> • Tools: <code>${l.tools}</code></div>
                    </div>
                    <span class="badge ${locClass}">${locText}</span>
                </div>
                <p style="font-size:0.9rem; line-height:1.5; margin-bottom:1rem; color:var(--text-primary); padding:0.75rem; background:rgba(0,0,0,0.2); border-radius:10px;">${l.description}</p>

                <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
                    <input type="text" id="feedback_${safeId}" class="form-control" style="flex:1; min-width:220px;" placeholder="Add supervisor review comment / signature note...">
                    <button class="btn btn-success btn-sm" onclick="approveLog('${l.date}', '${l.matric}')">Approve &amp; Sign</button>
                    <button class="btn btn-danger btn-sm" onclick="rejectLog('${l.date}', '${l.matric}')">Request Changes</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Populate GPS Attendance Audit Trail
    const attAuditBody = document.getElementById("admin_attendance_audit_table");
    if (attAuditBody) {
        attAuditBody.innerHTML = "";
        const filteredAtt = [...db.attendance]
            .filter(a => filterMatric === "ALL" || a.matric === filterMatric)
            .reverse();

        if (filteredAtt.length === 0) {
            attAuditBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary);">No attendance records found.</td></tr>`;
        } else {
            filteredAtt.forEach(a => {
                const st = db.students.find(s => s.matric === a.matric);
                const tr = document.createElement("tr");
                const geoBadge = a.geofence === "Within Range" ? "badge-success" : "badge-danger";
                tr.innerHTML = `
                    <td>${a.date}</td>
                    <td><strong>${st ? st.name : a.matric}</strong><div style="font-size:0.7rem; color:var(--text-muted);">${a.matric}</div></td>
                    <td>${a.clockIn} / ${a.clockOut || '--'} <div style="font-size:0.7rem; color:var(--warning);">${a.status}</div></td>
                    <td><span class="badge ${geoBadge}">${a.geofence} (${Math.round(a.distance)}m)</span></td>
                `;
                attAuditBody.appendChild(tr);
            });
        }
    }

    // Populate Signed & Reviewed Logbooks
    const historyBody = document.getElementById("ind_history_table");
    if (historyBody) {
        historyBody.innerHTML = "";
        const historyLogs = [...db.logbook]
            .filter(l => (filterMatric === "ALL" || l.matric === filterMatric) && l.status !== "Pending")
            .reverse();

        if (historyLogs.length === 0) {
            historyBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary);">No reviewed logbooks yet.</td></tr>`;
        } else {
            historyLogs.forEach(l => {
                const st = db.students.find(s => s.matric === l.matric);
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${l.date}</td>
                    <td><strong>${st ? st.name : l.matric}</strong><div style="font-size:0.7rem; color:var(--text-muted);">${l.tools}</div></td>
                    <td><span class="badge ${l.status === 'Approved' ? 'badge-success' : 'badge-danger'}">${l.status}</span></td>
                    <td><small style="color:var(--text-secondary)">"${l.feedback || 'Verified'}" — <strong>${l.signedBy || 'Admin'}</strong></small></td>
                `;
                historyBody.appendChild(tr);
            });
        }
    }
}

async function approveLog(date, targetMatric) {
    const matric = targetMatric || state.selectedStudentMatric;
    const safeId = `${matric.replace(/[^a-zA-Z0-9]/g, '_')}_${date}`;
    const inputEl = document.getElementById(`feedback_${safeId}`);
    const feedbackVal = inputEl ? inputEl.value.trim() : "";

    let db = getDB();
    const index = db.logbook.findIndex(l => l.date === date && l.matric === matric);
    if (index !== -1) {
        const signer = state.currentUserName || "SIWES Supervisor";
        db.logbook[index].status = "Approved";
        db.logbook[index].feedback = feedbackVal || "Verified and approved.";
        db.logbook[index].signedBy = signer;

        saveDB(db);

        pushLocalNotification({
            matric,
            userId: matric,
            role: 'student',
            message: `Your daily log entry for ${date} was Approved by ${signer}. Feedback: "${db.logbook[index].feedback}"`,
            type: 'log_verification'
        });

        await postToBackend('logbook/verify', {
            date,
            matric,
            status: "Approved",
            feedback: db.logbook[index].feedback,
            signedBy: signer
        });

        renderAdminVerify();
    }
}

async function rejectLog(date, targetMatric) {
    const matric = targetMatric || state.selectedStudentMatric;
    const safeId = `${matric.replace(/[^a-zA-Z0-9]/g, '_')}_${date}`;
    const inputEl = document.getElementById(`feedback_${safeId}`);
    const feedbackVal = inputEl ? inputEl.value.trim() : "";

    if (!feedbackVal) {
        alert("Please enter a comment explaining what changes the intern should make.");
        return;
    }

    let db = getDB();
    const index = db.logbook.findIndex(l => l.date === date && l.matric === matric);
    if (index !== -1) {
        const signer = state.currentUserName || "SIWES Supervisor";
        db.logbook[index].status = "Changes Requested";
        db.logbook[index].feedback = feedbackVal;
        db.logbook[index].signedBy = signer;

        saveDB(db);

        pushLocalNotification({
            matric,
            userId: matric,
            role: 'student',
            message: `Changes Requested on your log entry for ${date} by ${signer}: "${feedbackVal}"`,
            type: 'log_verification'
        });

        await postToBackend('logbook/verify', {
            date,
            matric,
            status: "Changes Requested",
            feedback: feedbackVal,
            signedBy: signer
        });

        renderAdminVerify();
    }
}

// 4. Admin Tab: Grading, Appraisal & Supervisor Pairing
function renderAdminGrading() {
    const db = getDB();
    if (state.selectedStudentMatric === "ALL" && db.students.length > 0) {
        state.selectedStudentMatric = db.students[0].matric;
    }
    populateSupervisorStudentSelector(false);

    const matric = state.selectedStudentMatric;
    const s = db.students.find(student => student.matric === matric) || db.students[0];
    if (!s) return;

    state.selectedStudentMatric = s.matric;
    const logs = db.logbook.filter(l => l.matric === s.matric);
    const att = db.attendance.filter(a => a.matric === s.matric);

    document.getElementById("ind_student_name").textContent = s.name;
    document.getElementById("ind_student_matric").textContent = s.matric;
    document.getElementById("sch_grad_company").textContent = s.company;

    const verified = logs.filter(l => l.status === "Approved").length;
    document.getElementById("ind_logs_verified").textContent = `${verified} / ${logs.length} Verified`;

    const geofenceFlags = att.filter(a => a.geofence !== "Within Range").length;
    const flagsEl = document.getElementById("ind_geofence_flags");
    flagsEl.textContent = `${geofenceFlags} Flagged`;
    flagsEl.style.color = geofenceFlags > 0 ? "var(--danger)" : "var(--success)";

    const ratingFill = document.getElementById("ind_eval_rating_fill");
    const ratingLabel = document.getElementById("ind_eval_rating_label");
    const remarksDisplay = document.getElementById("ind_eval_remarks_display");

    if (s.evaluationGrade) {
        ratingFill.style.width = `${s.evaluationGrade}%`;
        ratingLabel.textContent = `${s.evaluationGrade}/100`;
        if (remarksDisplay) remarksDisplay.textContent = `"${s.evaluationRemarks || 'Good performance.'}"`;
    } else {
        ratingFill.style.width = `0%`;
        ratingLabel.textContent = "Not Evaluated";
        if (remarksDisplay) remarksDisplay.textContent = "No industry appraisal submitted yet.";
    }

    const attRate = att.length > 0 ? Math.round((att.filter(a => a.status === "On-Time").length / att.length) * 100) : 100;
    document.getElementById("sch_metric_attendance").textContent = `${attRate}% (${att.length} days clocked in)`;
    document.getElementById("admin_curr_ind_sup").textContent = s.industrySupervisor || "Engr. Sarah Jenkins";
    document.getElementById("admin_curr_sch_sup").textContent = s.schoolSupervisor || "Dr. Festus Alao";
    document.getElementById("sch_eval_grade_val").textContent = s.academicGrade || "Not Graded";
    document.getElementById("sch_eval_feedback").textContent = s.academicFeedback || "No academic remarks submitted yet.";

    // Populate supervisor dropdown
    const selectSupervisor = document.getElementById("pairSupervisorSelect");
    if (selectSupervisor) {
        selectSupervisor.innerHTML = "";
        (db.schoolSupervisors || []).forEach(sp => {
            const opt = document.createElement("option");
            opt.value = sp.name;
            opt.textContent = `${sp.name} (${sp.dept})`;
            if (sp.name === s.schoolSupervisor) opt.selected = true;
            selectSupervisor.appendChild(opt);
        });
    }
}

function openEvaluationModal() {
    const db = getDB();
    const s = db.students.find(student => student.matric === state.selectedStudentMatric) || db.students[0];
    if (!s) return;

    document.getElementById("evalGrade").value = s.evaluationGrade || 85;
    document.getElementById("evalRemarks").value = s.evaluationRemarks || "";
    openModal("indEvaluationModal");
}

async function submitEvaluation(event) {
    event.preventDefault();

    const grade = parseInt(document.getElementById("evalGrade").value);
    const remarks = document.getElementById("evalRemarks").value;

    let db = getDB();
    const sIdx = db.students.findIndex(student => student.matric === state.selectedStudentMatric);

    if (sIdx !== -1) {
        db.students[sIdx].evaluationGrade = grade;
        db.students[sIdx].evaluationRemarks = remarks;
        saveDB(db);

        await postToBackend('student/evaluation', {
            matric: state.selectedStudentMatric,
            evaluationGrade: grade,
            evaluationRemarks: remarks
        });

        closeModal("indEvaluationModal");
        renderAdminGrading();
        alert(`Industry Evaluation Score (${grade}/100) saved for ${db.students[sIdx].name}!`);
    }
}

function openAcademicGradeModal() {
    const db = getDB();
    const s = db.students.find(student => student.matric === state.selectedStudentMatric) || db.students[0];
    if (!s) return;

    document.getElementById("gradeSelect").value = s.academicGrade || "A";
    document.getElementById("academicFeedback").value = s.academicFeedback || "";
    openModal("schGradingModal");
}

async function submitAcademicGrade(event) {
    event.preventDefault();

    const grade = document.getElementById("gradeSelect").value;
    const feedback = document.getElementById("academicFeedback").value;

    let db = getDB();
    const sIdx = db.students.findIndex(student => student.matric === state.selectedStudentMatric);

    if (sIdx !== -1) {
        db.students[sIdx].academicGrade = grade;
        db.students[sIdx].academicFeedback = feedback;
        saveDB(db);

        await postToBackend('student/grade', {
            matric: state.selectedStudentMatric,
            academicGrade: grade,
            academicFeedback: feedback
        });

        closeModal("schGradingModal");
        renderAdminGrading();
        alert(`Final Academic Grade (${grade}) saved for ${db.students[sIdx].name}!`);
    }
}

async function assignSupervisorPair(event) {
    event.preventDefault();

    const matric = state.selectedStudentMatric;
    const supervisorName = document.getElementById("pairSupervisorSelect").value;

    let db = getDB();
    const index = db.students.findIndex(s => s.matric === matric);

    if (index !== -1) {
        db.students[index].schoolSupervisor = supervisorName;
        saveDB(db);

        await postToBackend('student/assign', {
            matric,
            schoolSupervisor: supervisorName
        });

        renderAdminGrading();
        alert(`Assigned ${supervisorName} to ${db.students[index].name}.`);
    }
}

// 5. Admin Tab: Reports & Exports
function renderAdminReports() {
    const db = getDB();
    document.getElementById("export_total_students").textContent = db.students.length;
    document.getElementById("export_total_attendance").textContent = db.attendance.length;
    document.getElementById("export_total_logs").textContent = db.logbook.length;
}

function exportData(type) {
    const db = getDB();
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = "";

    if (type === 'attendance') {
        filename = "SIWES_GPS_Attendance_Report.csv";
        csvContent += "Date,Matric Number,Clock In,Clock Out,Latitude,Longitude,Distance (m),Status,Geofence Status\n";
        db.attendance.forEach(a => {
            csvContent += `${a.date},${a.matric},${a.clockIn},${a.clockOut || 'N/A'},${a.lat},${a.lon},${Math.round(a.distance)},${a.status},${a.geofence}\n`;
        });
    } else if (type === 'logbook') {
        filename = "SIWES_Daily_Logbook_Entries.csv";
        csvContent += "Date,Matric Number,Hours,Description,Tools Used,Status,Signed By,Feedback\n";
        db.logbook.forEach(l => {
            const cleanedDesc = (l.description || "").replace(/"/g, '""').replace(/\n/g, ' ');
            const cleanedFeedback = (l.feedback || "").replace(/"/g, '""').replace(/\n/g, ' ');
            csvContent += `${l.date},${l.matric},${l.hours},"${cleanedDesc}","${l.tools}",${l.status},"${l.signedBy || ''}","${cleanedFeedback}"\n`;
        });
    } else {
        filename = "SIWES_Registered_Interns_Master_List.csv";
        csvContent += "Matric Number,Name,Email,Department,Level,Company,Industry Supervisor,School Supervisor,Industry Score,Academic Grade,Academic Feedback\n";
        db.students.forEach(s => {
            csvContent += `${s.matric},"${s.name}","${s.email || ''}",${s.dept},${s.level},"${s.company}","${s.industrySupervisor}","${s.schoolSupervisor}",${s.evaluationGrade || ''},${s.academicGrade || ''},"${(s.academicFeedback || '').replace(/"/g, '""')}"\n`;
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
// --- CHARTS & PDF EXPORT ENGINE ---
// ==========================================

let attendanceTrendChartInstance = null;
let punctualityChartInstance = null;
let logbookChartInstance = null;
let studentAttendancePerformanceChartInstance = null;

function renderCoordinatorCharts() {
    const db = getDB();
    if (typeof Chart === "undefined") return;

    const attendanceDates = {};
    db.attendance.forEach(a => {
        attendanceDates[a.date] = (attendanceDates[a.date] || 0) + 1;
    });
    const sortedDates = Object.keys(attendanceDates).sort().slice(-7);
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
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1, color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#9ca3af' }, grid: { display: false } }
                }
            }
        });
    }

    let onTime = 0, late = 0, flagged = 0;
    db.attendance.forEach(a => {
        if (a.geofence !== "Within Range") flagged++;
        else if (a.status === "Late") late++;
        else onTime++;
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
                    backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.6)'],
                    borderColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', boxWidth: 12 } } },
                cutout: '70%'
            }
        });
    }

    const studentNames = [];
    const approvedLogs = [];
    const pendingLogs = [];

    db.students.forEach(s => {
        studentNames.push(s.name.split(' ')[0]);
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
                    { label: 'Approved Logs', data: approvedLogs, backgroundColor: 'rgba(16, 185, 129, 0.5)', borderColor: '#10b981', borderWidth: 1 },
                    { label: 'Pending Logs', data: pendingLogs, backgroundColor: 'rgba(59, 130, 246, 0.5)', borderColor: '#3b82f6', borderWidth: 1 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', boxWidth: 12 } } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1, color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#9ca3af' }, grid: { display: false } }
                }
            }
        });
    }
}

function renderStudentChart() {
    const db = getDB();
    if (typeof Chart === "undefined") return;
    const studentAtt = db.attendance.filter(a => a.matric === state.currentMatric);
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
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Geofence Deviation (meters)', color: '#9ca3af' },
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: { ticks: { color: '#9ca3af' }, grid: { display: false } }
                }
            }
        });
    }
}

async function generatePDFReport() {
    const db = getDB();
    const btn = document.getElementById("downloadPdfBtn");
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span>Generating PDF...</span>`;
    btn.disabled = true;

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
        <h3 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Student Performance &amp; Placement Directory</h3>
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
            <tbody>${studentsRows}</tbody>
        </table>
    `;

    document.body.appendChild(pdfContainer);

    try {
        const canvas = await html2canvas(pdfContainer, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        const imgWidth = 595.28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`SIWES_Executive_Report_${getTodayString()}.pdf`);
    } catch (e) {
        console.error("PDF generation failed:", e);
        alert("Failed to generate PDF. Please ensure you have internet access for jsPDF.");
    } finally {
        document.body.removeChild(pdfContainer);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar) sidebar.classList.toggle("open");
    if (backdrop) backdrop.classList.toggle("show");
}

// ==========================================
// --- IN-APP NOTIFICATIONS ENGINE ---
// ==========================================

function toggleNotifDrawer() {
    const drawer = document.getElementById("notifDrawer");
    const backdrop = document.getElementById("notifBackdrop");
    if (!drawer) return;

    if (drawer.style.right === "0px") {
        drawer.style.right = "-380px";
        backdrop.style.display = "none";
    } else {
        drawer.style.right = "0px";
        backdrop.style.display = "block";
    }
}

function renderNotifications() {
    const db = getDB();
    const badge = document.getElementById("notifBadge");
    const countText = document.getElementById("notifCountText");
    const container = document.getElementById("notifListContainer");
    if (!container) return;

    const notifications = db.notifications || [];

    const myNotifs = notifications.filter(n => {
        if (state.activeRole === "admin") {
            return n.role === "admin" || n.role === "coordinator" || n.role === "industry_supervisor" || n.role === "school_supervisor";
        }
        if (state.activeRole === "student") {
            return n.role === "student" && n.userId === state.currentMatric;
        }
        return false;
    });

    const unreadCount = myNotifs.filter(n => !n.read).length;

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = "flex";
        } else {
            badge.style.display = "none";
        }
    }

    if (countText) {
        countText.textContent = `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}`;
    }

    container.innerHTML = "";
    if (myNotifs.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-secondary); font-size:0.85rem;">No notifications yet.</div>`;
    } else {
        myNotifs.forEach(n => {
            const item = document.createElement("div");
            item.style.padding = "0.75rem";
            item.style.borderRadius = "10px";
            item.style.background = n.read ? "rgba(255,255,255,0.02)" : "rgba(0, 242, 254, 0.08)";
            item.style.border = n.read ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0, 242, 254, 0.2)";
            item.style.fontSize = "0.82rem";
            item.style.lineHeight = "1.4";

            let typeLabel = `<span style="color:var(--primary); font-weight:700; margin-right:4px;">🔔 Alert:</span>`;
            if (n.type === 'registration') typeLabel = `<span style="color:var(--primary); font-weight:700; margin-right:4px;">👤 New Intern:</span>`;
            else if (n.type === 'login') typeLabel = `<span style="color:#60a5fa; font-weight:700; margin-right:4px;">🔑 Sign-In:</span>`;
            else if (n.type === 'clock_in') typeLabel = `<span style="color:var(--success); font-weight:700; margin-right:4px;">⏰ GPS Clock-In:</span>`;
            else if (n.type === 'log_submission') typeLabel = `<span style="color:var(--warning); font-weight:700; margin-right:4px;">📝 Logbook:</span>`;
            else if (n.type === 'log_verification') typeLabel = `<span style="color:var(--success); font-weight:700; margin-right:4px;">✍️ Verified:</span>`;

            const dateObj = new Date(n.createdAt || Date.now());
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            item.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <div>${typeLabel}${n.message}</div>
                    <div style="font-size:0.7rem; color:var(--text-muted); text-align:right;">${dateStr}, ${timeStr}</div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    // Also refresh the inline live feed if Admin Command Center is open
    if (state.activeRole === "admin" && state.activeTab === "overview") {
        const feedContainer = document.getElementById("admin_live_feed_list");
        if (feedContainer && feedContainer.children.length === 0 && myNotifs.length > 0) {
            renderAdminOverview();
        }
    }
}

async function markAllNotificationsRead() {
    const db = getDB();
    const notifications = db.notifications || [];

    const myUnread = notifications.filter(n => {
        if (n.read) return false;
        if (state.activeRole === "admin") {
            return n.role === "admin" || n.role === "coordinator" || n.role === "industry_supervisor" || n.role === "school_supervisor";
        }
        if (state.activeRole === "student") {
            return n.role === "student" && n.userId === state.currentMatric;
        }
        return false;
    });

    if (myUnread.length === 0) return;

    const ids = myUnread.map(n => n.id);
    myUnread.forEach(n => n.read = true);
    saveDB(db);
    renderNotifications();
    if (state.activeRole === "admin" && state.activeTab === "overview") {
        renderAdminOverview();
    }

    try {
        await fetch(`${API_BASE}/notifications/read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, role: state.activeRole, userId: state.currentMatric })
        });
    } catch (e) {
        console.warn("Marked notifications read locally.");
    }
}

// --- MODAL CONTROLS ---
function openAuthModal(mode) {
    const authScreen = document.getElementById("authScreen");
    const subtitle = document.getElementById("authModalSubtitle");
    if (!authScreen) return;
    authScreen.style.display = "flex";

    if (mode === 'register') {
        if (subtitle) subtitle.textContent = "New Intern Placement Registration";
        switchAuthTab('register');
    } else if (mode === 'admin') {
        if (subtitle) subtitle.textContent = "Admin & Supervisor Portal Login";
        switchAuthTab('login');
        fillDemoLogin('admin');
    } else if (mode === 'student') {
        if (subtitle) subtitle.textContent = "Student Intern Portal Login";
        switchAuthTab('login');
        fillDemoLogin('student');
    } else {
        if (subtitle) subtitle.textContent = "Portal Access";
        switchAuthTab('login');
    }
}

function closeAuthModal() {
    const authScreen = document.getElementById("authScreen");
    if (!authScreen) return;
    authScreen.style.display = "none";
}
