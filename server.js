require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize Supabase Client (optional if offline/unconfigured)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const LOCAL_DB_PATH = path.join(__dirname, 'local_db.json');

const DEFAULT_SEED = {
    students: [
        {
            matric: 'UI/2022/CS/101',
            name: 'Chinedu Azubuike',
            dept: 'Computer Science',
            level: '400L',
            company: 'TechCorp Solutions Ltd',
            officeAddress: '45 Marine Road, Victoria Island, Lagos',
            officeLat: 6.428056,
            officeLon: 3.421944,
            geofenceRadius: 200,
            industrySupervisor: 'Engr. Sarah Jenkins',
            schoolSupervisor: 'Dr. Festus Alao',
            email: 'chinedu@example.com',
            password: 'password123',
            academicGrade: 'A',
            academicFeedback: 'Consistent attendance and strong technical depth.',
            evaluationGrade: 88,
            evaluationRemarks: 'Outstanding technical skill and self-starter.'
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
        { id: 1, date: "2026-06-25", matric: "UI/2022/CS/101", description: "Onboarded with the dev team. Setup local development environments, configured Git, and cloned the backend microservice repositories. Attended the daily standup meeting.", tools: "Git, Docker, VS Code", hours: 8, status: "Approved", feedback: "Great start Chinedu! Make sure you get familiar with our Docker compose setup.", signedBy: "Engr. Sarah Jenkins" },
        { id: 2, date: "2026-06-26", matric: "UI/2022/CS/101", description: "Resolved issue #412: Fixed bug in user authentication validator that caused server crashes on malformed request bodies. Wrote unit tests in Jest.", tools: "Node.js, Jest, Express", hours: 8, status: "Approved", feedback: "Solid bugfix. Clean unit tests.", signedBy: "Engr. Sarah Jenkins" },
        { id: 3, date: "2026-06-29", matric: "UI/2022/CS/101", description: "Collaborated on designing the database schema for the new client billing module. Wrote migration files using Knex.js and tested locally.", tools: "PostgreSQL, Knex.js", hours: 8, status: "Approved", feedback: "Good schema layout, verified.", signedBy: "Engr. Sarah Jenkins" },
        { id: 4, date: "2026-06-30", matric: "UI/2022/CS/101", description: "Developed UI components for the billing dashboard using React and Tailwind CSS. Implemented search and filter filters for transactions list.", tools: "React, CSS, Tailwind", hours: 8, status: "Approved", feedback: "UI looks matching with mockups.", signedBy: "Engr. Sarah Jenkins" },
        { id: 5, date: "2026-07-01", matric: "UI/2022/CS/101", description: "Created API endpoints for invoice generation and integrated PDF creation library. Refactored the dispatch service to run asynchronously.", tools: "Express, PDFKit, Redis", hours: 8, status: "Pending", feedback: "", signedBy: "" }
    ],
    weeklyReports: [
        {
            id: 1,
            week: 1,
            matric: 'UI/2022/CS/101',
            summary: 'During my first week, I successfully onboarded and integrated into the engineering workflow. I resolved a critical authentication validation bug, drafted schemas for the billing database module, and developed frontend elements.',
            rating: 5,
            status: 'Approved',
            feedback: 'Excellent progress in week 1. Proactive approach to solving problems.'
        }
    ],
    supervisors: [
        { id: 'IS_01', name: 'Engr. Sarah Jenkins', company: 'TechCorp Solutions Ltd', email: 's.jenkins@techcorp.com', password: 'password123' }
    ],
    schoolSupervisors: [
        { id: 'SS_01', name: 'Dr. Festus Alao', dept: 'Computer Science', email: 'f.alao@university.edu.ng', password: 'password123' }
    ],
    notifications: [
        { id: 1, matric: 'UI/2022/CS/101', userId: 'ADMIN', role: 'admin', message: 'Intern Registered: Chinedu Azubuike (UI/2022/CS/101) placed at TechCorp Solutions Ltd.', type: 'registration', read: false, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: 2, matric: 'UI/2022/CS/101', userId: 'ADMIN', role: 'admin', message: 'Chinedu Azubuike clocked in Late at 08:52:00 (Out of Range (Flagged), Dist: 2340m).', type: 'clock_in', read: false, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
        { id: 3, matric: 'UI/2022/CS/101', userId: 'ADMIN', role: 'admin', message: 'Chinedu Azubuike submitted daily logbook details for 2026-07-01 (8h, Tools: Express, PDFKit, Redis).', type: 'log_submission', read: false, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() }
    ]
};

function loadLocalDB() {
    try {
        if (fs.existsSync(LOCAL_DB_PATH)) {
            const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
            const parsed = JSON.parse(raw);
            return {
                students: parsed.students || DEFAULT_SEED.students,
                attendance: parsed.attendance || DEFAULT_SEED.attendance,
                logbook: parsed.logbook || DEFAULT_SEED.logbook,
                weeklyReports: parsed.weeklyReports || DEFAULT_SEED.weeklyReports,
                supervisors: parsed.supervisors || DEFAULT_SEED.supervisors,
                schoolSupervisors: parsed.schoolSupervisors || DEFAULT_SEED.schoolSupervisors,
                notifications: parsed.notifications || DEFAULT_SEED.notifications
            };
        }
    } catch (e) {
        console.warn("Error reading local_db.json, initializing fresh seed:", e.message);
    }
    saveLocalDB(DEFAULT_SEED);
    return JSON.parse(JSON.stringify(DEFAULT_SEED));
}

function saveLocalDB(db) {
    try {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    } catch (e) {
        console.error("Failed to write local_db.json:", e.message);
    }
}

let supabaseReady = false;

async function checkAndSeedSupabase() {
    if (!supabase) return false;
    try {
        const { count, error } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true });
        if (error) {
            console.warn("Supabase tables not configured or unreachable, running with Local + Cloud Hybrid store:", error.message);
            supabaseReady = false;
            return false;
        }
        supabaseReady = true;
        if (count === 0) {
            console.log("Seeding empty Supabase tables...");
            const local = loadLocalDB();
            await supabase.from('supervisors').insert(local.supervisors);
            await supabase.from('school_supervisors').insert(local.schoolSupervisors);
            await supabase.from('students').insert(local.students);
            await supabase.from('attendance').insert(local.attendance.map(({ id, ...rest }) => rest));
            await supabase.from('logbook').insert(local.logbook.map(({ id, ...rest }) => rest));
            await supabase.from('weekly_reports').insert(local.weeklyReports.map(({ id, ...rest }) => rest));
            await supabase.from('notifications').insert(local.notifications.map(({ id, ...rest }) => rest));
        }
        return true;
    } catch (e) {
        console.warn("Supabase connection unavailable, using local database store:", e.message);
        supabaseReady = false;
        return false;
    }
}

function addLocalNotification(local, { matric, userId, role, message, type }) {
    const nextId = local.notifications.length > 0
        ? Math.max(...local.notifications.map(n => n.id || 0)) + 1
        : 1;
    const notif = {
        id: nextId,
        matric: matric || null,
        userId: userId || 'ADMIN',
        role: role || 'admin',
        message,
        type,
        read: false,
        createdAt: new Date().toISOString()
    };
    local.notifications.unshift(notif);
    return notif;
}

// --- REST API ENDPOINTS ---

app.get('/api/health', (req, res) => {
    res.json({
        status: "ok",
        supabaseConnected: supabaseReady,
        message: supabaseReady ? "Supabase Cloud + Local Sync Active" : "Local Persistent Database Active"
    });
});

// Unified Authentication Endpoint (Supports Admin Portal + Student Interns)
app.post('/api/auth/login', async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();
    const local = loadLocalDB();

    try {
        // 1. Check built-in Admin / Supervisor accounts
        const adminAccounts = [
            { email: 'admin@siwes.com', password: 'password123', id: 'ADMIN_01', name: 'Prof. Ebuka Obi (SIWES Admin)', title: 'SIWES Admin & Coordinator' },
            { email: 'coordinator@university.edu.ng', password: 'password123', id: 'CO_01', name: 'Prof. Ebuka Obi', title: 'IT Coordinator' },
            { email: 's.jenkins@techcorp.com', password: 'password123', id: 'IS_01', name: 'Engr. Sarah Jenkins', title: 'Industry Supervisor' },
            { email: 'f.alao@university.edu.ng', password: 'password123', id: 'SS_01', name: 'Dr. Festus Alao', title: 'Academic Supervisor' }
        ];

        const matchedAdmin = adminAccounts.find(a => a.email.toLowerCase() === email);
        if (matchedAdmin) {
            if (matchedAdmin.password === password) {
                return res.json({
                    success: true,
                    role: 'admin',
                    id: matchedAdmin.id,
                    name: matchedAdmin.name,
                    title: matchedAdmin.title,
                    email: matchedAdmin.email
                });
            } else {
                return res.status(401).json({ success: false, error: "Invalid password for admin/supervisor account." });
            }
        }

        // 2. Check custom supervisors in local DB or Supabase
        const customSup = local.supervisors.find(s => (s.email || '').toLowerCase() === email) ||
                          local.schoolSupervisors.find(s => (s.email || '').toLowerCase() === email);
        if (customSup) {
            if ((customSup.password || 'password123') === password) {
                return res.json({
                    success: true,
                    role: 'admin',
                    id: customSup.id,
                    name: customSup.name,
                    title: customSup.company ? `Supervisor (${customSup.company})` : `Academic Supervisor (${customSup.dept})`,
                    email: customSup.email
                });
            } else {
                return res.status(401).json({ success: false, error: "Invalid password." });
            }
        }

        // 3. Check Student accounts in Supabase if online
        let student = null;
        if (supabaseReady) {
            const { data } = await supabase
                .from('students')
                .select('*')
                .ilike('email', email)
                .maybeSingle();
            if (data) student = data;
        }

        // Fallback to local DB students (match by email or matric number)
        if (!student) {
            student = local.students.find(
                s => (s.email && s.email.toLowerCase() === email) ||
                     (s.matric && s.matric.toLowerCase() === email) ||
                     (email === 'student@siwes.com' && s.matric === 'UI/2022/CS/101')
            );
        }

        if (student) {
            if ((student.password || 'password123') === password) {
                // Record a login notification for the Admin Portal
                const loginMsg = `Intern Signed In: ${student.name} (${student.matric}) logged into the Intern Portal.`;
                addLocalNotification(local, {
                    matric: student.matric,
                    userId: 'ADMIN',
                    role: 'admin',
                    message: loginMsg,
                    type: 'login'
                });
                saveLocalDB(local);

                if (supabaseReady) {
                    await supabase.from('notifications').insert([{
                        matric: student.matric,
                        userId: 'ADMIN',
                        role: 'admin',
                        message: loginMsg,
                        type: 'login'
                    }]);
                }

                return res.json({
                    success: true,
                    role: 'student',
                    id: student.matric,
                    name: student.name,
                    email: student.email,
                    matric: student.matric
                });
            } else {
                return res.status(401).json({ success: false, error: "Incorrect password for this intern account." });
            }
        }

        return res.status(401).json({
            success: false,
            error: "Account not found. Use an Admin demo login (admin@siwes.com) or Register as a new Intern first."
        });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Fetch all consolidated data
app.get('/api/data', async (req, res) => {
    const local = loadLocalDB();

    if (supabaseReady) {
        try {
            const [st, att, log, wk, sup, ssup, notif] = await Promise.all([
                supabase.from('students').select('*'),
                supabase.from('attendance').select('*'),
                supabase.from('logbook').select('*'),
                supabase.from('weekly_reports').select('*'),
                supabase.from('supervisors').select('*'),
                supabase.from('school_supervisors').select('*'),
                supabase.from('notifications').select('*').order('createdAt', { ascending: false })
            ]);

            if (!st.error && st.data && st.data.length > 0) {
                const merged = {
                    students: st.data,
                    attendance: att.data || local.attendance,
                    logbook: log.data || local.logbook,
                    weeklyReports: wk.data || local.weeklyReports,
                    supervisors: sup.data || local.supervisors,
                    schoolSupervisors: ssup.data || local.schoolSupervisors,
                    notifications: notif.data || local.notifications
                };
                saveLocalDB(merged);
                return res.json(merged);
            }
        } catch (e) {
            console.warn("Supabase fetch fallback to local DB:", e.message);
        }
    }

    res.json(local);
});

// Register a new student intern -> sends notification directly to Admin Portal
app.post('/api/students', async (req, res) => {
    const { matric, name, dept, level, company, officeAddress, officeLat, officeLon, geofenceRadius, industrySupervisor, schoolSupervisor, email, password } = req.body;
    const local = loadLocalDB();

    const cleanMatric = (matric || '').trim();
    const cleanEmail = (email || `${cleanMatric.toLowerCase().replace(/[^a-z0-9]/g, '')}@siwes.com`).trim();

    if (local.students.some(s => s.matric.toLowerCase() === cleanMatric.toLowerCase() || (s.email && s.email.toLowerCase() === cleanEmail.toLowerCase()))) {
        return res.status(400).json({ success: false, error: "An intern with this Matric Number or Email is already registered." });
    }

    const newStudent = {
        matric: cleanMatric,
        name: (name || '').trim(),
        dept: dept || 'Computer Science',
        level: level || '400L',
        company: company || 'TechCorp Solutions Ltd',
        officeAddress: officeAddress || 'Victoria Island, Lagos',
        officeLat: parseFloat(officeLat) || 6.428056,
        officeLon: parseFloat(officeLon) || 3.421944,
        geofenceRadius: parseInt(geofenceRadius) || 200,
        industrySupervisor: industrySupervisor || 'Engr. Sarah Jenkins',
        schoolSupervisor: schoolSupervisor || 'Dr. Festus Alao',
        email: cleanEmail,
        password: password || 'password123',
        academicGrade: null,
        academicFeedback: '',
        evaluationGrade: null,
        evaluationRemarks: ''
    };

    local.students.push(newStudent);

    const notifMsg = `New Intern Registered: ${newStudent.name} (${newStudent.matric}) placed at ${newStudent.company}.`;
    addLocalNotification(local, {
        matric: newStudent.matric,
        userId: 'ADMIN',
        role: 'admin',
        message: notifMsg,
        type: 'registration'
    });
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            await supabase.from('students').insert([newStudent]);
            await supabase.from('notifications').insert([{
                matric: newStudent.matric,
                userId: 'ADMIN',
                role: 'admin',
                message: notifMsg,
                type: 'registration'
            }]);
        } catch (e) {
            console.warn("Supabase insert student warning (saved locally):", e.message);
        }
    }

    res.json({ success: true, student: newStudent, message: "Student registered and Admin Portal notified." });
});

// Delete a student intern (Admin control)
app.delete('/api/students/:matric', async (req, res) => {
    const targetMatric = decodeURIComponent(req.params.matric);
    const local = loadLocalDB();
    local.students = local.students.filter(s => s.matric !== targetMatric);
    local.attendance = local.attendance.filter(a => a.matric !== targetMatric);
    local.logbook = local.logbook.filter(l => l.matric !== targetMatric);
    local.weeklyReports = local.weeklyReports.filter(w => w.matric !== targetMatric);
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            await supabase.from('students').delete().eq('matric', targetMatric);
        } catch (e) {
            console.warn("Supabase delete student warning:", e.message);
        }
    }
    res.json({ success: true, message: "Intern deleted." });
});

// Attendance: Clock In -> sends notification directly to Admin Portal
app.post('/api/attendance/clock-in', async (req, res) => {
    const { date, matric, clockIn, lat, lon, distance, status, geofence } = req.body;
    const local = loadLocalDB();

    const record = {
        id: local.attendance.length + 1,
        date,
        matric,
        clockIn,
        clockOut: null,
        lat,
        lon,
        distance,
        status,
        geofence
    };

    local.attendance.push(record);

    const student = local.students.find(s => s.matric === matric);
    const studentName = student ? student.name : matric;
    const notifMsg = `${studentName} (${matric}) clocked in ${status} at ${clockIn} — ${geofence} (${Math.round(distance)}m from office).`;

    addLocalNotification(local, {
        matric,
        userId: 'ADMIN',
        role: 'admin',
        message: notifMsg,
        type: 'clock_in'
    });
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            const { id, ...dbRec } = record;
            await supabase.from('attendance').insert([dbRec]);
            await supabase.from('notifications').insert([{
                matric,
                userId: 'ADMIN',
                role: 'admin',
                message: notifMsg,
                type: 'clock_in'
            }]);
        } catch (e) {
            console.warn("Supabase clock-in sync warning:", e.message);
        }
    }

    res.json({ success: true, message: "Clock-in recorded and Admin Portal notified." });
});

// Attendance: Clock Out
app.post('/api/attendance/clock-out', async (req, res) => {
    const { date, matric, clockOut } = req.body;
    const local = loadLocalDB();

    const idx = local.attendance.findIndex(a => a.date === date && a.matric === matric);
    if (idx !== -1) {
        local.attendance[idx].clockOut = clockOut;
    }

    const student = local.students.find(s => s.matric === matric);
    const studentName = student ? student.name : matric;
    const notifMsg = `${studentName} (${matric}) clocked out for the day at ${clockOut}.`;
    addLocalNotification(local, {
        matric,
        userId: 'ADMIN',
        role: 'admin',
        message: notifMsg,
        type: 'clock_in'
    });
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            await supabase.from('attendance').update({ clockOut }).match({ date, matric });
            await supabase.from('notifications').insert([{
                matric,
                userId: 'ADMIN',
                role: 'admin',
                message: notifMsg,
                type: 'clock_in'
            }]);
        } catch (e) {
            console.warn("Supabase clock-out sync warning:", e.message);
        }
    }

    res.json({ success: true, message: "Clock-out updated." });
});

// Logbook: Add Daily Log Entry -> sends notification directly to Admin Portal
app.post('/api/logbook', async (req, res) => {
    const { date, matric, description, tools, hours } = req.body;
    const local = loadLocalDB();

    const newLog = {
        id: local.logbook.length + 1,
        date,
        matric,
        description,
        tools,
        hours,
        status: 'Pending',
        feedback: '',
        signedBy: ''
    };
    local.logbook.push(newLog);

    const student = local.students.find(s => s.matric === matric);
    const studentName = student ? student.name : matric;
    const notifMsg = `${studentName} (${matric}) submitted a daily logbook entry for ${date} (${hours} hrs, Tools: ${tools}).`;

    addLocalNotification(local, {
        matric,
        userId: 'ADMIN',
        role: 'admin',
        message: notifMsg,
        type: 'log_submission'
    });
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            const { id, ...dbLog } = newLog;
            await supabase.from('logbook').insert([dbLog]);
            await supabase.from('notifications').insert([{
                matric,
                userId: 'ADMIN',
                role: 'admin',
                message: notifMsg,
                type: 'log_submission'
            }]);
        } catch (e) {
            console.warn("Supabase logbook sync warning:", e.message);
        }
    }

    res.json({ success: true, message: "Daily log entry submitted to Admin Portal." });
});

// Logbook: Verify/Approve Log Entry -> notifies Student
app.post('/api/logbook/verify', async (req, res) => {
    const { date, matric, status, feedback, signedBy } = req.body;
    const local = loadLocalDB();

    const idx = local.logbook.findIndex(l => l.date === date && l.matric === matric);
    if (idx !== -1) {
        local.logbook[idx].status = status;
        local.logbook[idx].feedback = feedback;
        local.logbook[idx].signedBy = signedBy;
    }

    const notifMsg = `Your daily log entry for ${date} was marked "${status}" by ${signedBy || 'Supervisor'}. Feedback: "${feedback || 'Verified'}"`;
    addLocalNotification(local, {
        matric,
        userId: matric,
        role: 'student',
        message: notifMsg,
        type: 'log_verification'
    });
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            await supabase.from('logbook').update({ status, feedback, signedBy }).match({ date, matric });
            await supabase.from('notifications').insert([{
                matric,
                userId: matric,
                role: 'student',
                message: notifMsg,
                type: 'log_verification'
            }]);
        } catch (e) {
            console.warn("Supabase verify sync warning:", e.message);
        }
    }

    res.json({ success: true, message: "Logbook verification saved." });
});

// Weekly Report: Submit
app.post('/api/weekly', async (req, res) => {
    const { week, matric, summary } = req.body;
    const local = loadLocalDB();

    const newWeekly = {
        id: local.weeklyReports.length + 1,
        week,
        matric,
        summary,
        rating: null,
        status: 'Pending',
        feedback: ''
    };
    local.weeklyReports.push(newWeekly);

    const student = local.students.find(s => s.matric === matric);
    const studentName = student ? student.name : matric;
    const notifMsg = `${studentName} (${matric}) submitted Week ${week} Progress Report for review.`;
    addLocalNotification(local, {
        matric,
        userId: 'ADMIN',
        role: 'admin',
        message: notifMsg,
        type: 'log_submission'
    });
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            const { id, ...dbWeekly } = newWeekly;
            await supabase.from('weekly_reports').insert([dbWeekly]);
            await supabase.from('notifications').insert([{
                matric,
                userId: 'ADMIN',
                role: 'admin',
                message: notifMsg,
                type: 'log_submission'
            }]);
        } catch (e) {
            console.warn("Supabase weekly sync warning:", e.message);
        }
    }

    res.json({ success: true, message: "Weekly report submitted." });
});

// Student: Industry Evaluation Update
app.post('/api/student/evaluation', async (req, res) => {
    const { matric, evaluationGrade, evaluationRemarks } = req.body;
    const local = loadLocalDB();

    const idx = local.students.findIndex(s => s.matric === matric);
    if (idx !== -1) {
        local.students[idx].evaluationGrade = evaluationGrade;
        local.students[idx].evaluationRemarks = evaluationRemarks;
    }

    addLocalNotification(local, {
        matric,
        userId: matric,
        role: 'student',
        message: `Your Industry Evaluation Score has been updated to ${evaluationGrade}/100. Remarks: "${evaluationRemarks}"`,
        type: 'log_verification'
    });
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            await supabase.from('students').update({ evaluationGrade, evaluationRemarks }).eq('matric', matric);
        } catch (e) {
            console.warn("Supabase evaluation sync warning:", e.message);
        }
    }

    res.json({ success: true, message: "Evaluation saved." });
});

// Student: School Academic Grading Update
app.post('/api/student/grade', async (req, res) => {
    const { matric, academicGrade, academicFeedback } = req.body;
    const local = loadLocalDB();

    const idx = local.students.findIndex(s => s.matric === matric);
    if (idx !== -1) {
        local.students[idx].academicGrade = academicGrade;
        local.students[idx].academicFeedback = academicFeedback;
    }

    addLocalNotification(local, {
        matric,
        userId: matric,
        role: 'student',
        message: `Your Final Academic SIWES Grade has been posted: Grade ${academicGrade}. Remarks: "${academicFeedback}"`,
        type: 'log_verification'
    });
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            await supabase.from('students').update({ academicGrade, academicFeedback }).eq('matric', matric);
        } catch (e) {
            console.warn("Supabase grade sync warning:", e.message);
        }
    }

    res.json({ success: true, message: "Academic grade saved." });
});

// Student: Assign Supervisors
app.post('/api/student/assign', async (req, res) => {
    const { matric, schoolSupervisor, industrySupervisor } = req.body;
    const local = loadLocalDB();

    const idx = local.students.findIndex(s => s.matric === matric);
    if (idx !== -1) {
        if (schoolSupervisor) local.students[idx].schoolSupervisor = schoolSupervisor;
        if (industrySupervisor) local.students[idx].industrySupervisor = industrySupervisor;
    }
    saveLocalDB(local);

    if (supabaseReady) {
        try {
            const updateObj = {};
            if (schoolSupervisor) updateObj.schoolSupervisor = schoolSupervisor;
            if (industrySupervisor) updateObj.industrySupervisor = industrySupervisor;
            await supabase.from('students').update(updateObj).eq('matric', matric);
        } catch (e) {
            console.warn("Supabase assign sync warning:", e.message);
        }
    }

    res.json({ success: true, message: "Supervisor mapping saved." });
});

// Notifications: Mark as Read
app.post('/api/notifications/read', async (req, res) => {
    const { ids, role, userId } = req.body;
    const local = loadLocalDB();

    local.notifications.forEach(n => {
        if (Array.isArray(ids) && ids.includes(n.id)) {
            n.read = true;
        } else if (role === 'admin' && (n.role === 'admin' || n.role === 'coordinator' || n.role === 'industry_supervisor' || n.role === 'school_supervisor')) {
            n.read = true;
        } else if (role === 'student' && n.userId === userId) {
            n.read = true;
        }
    });
    saveLocalDB(local);

    if (supabaseReady && Array.isArray(ids) && ids.length > 0) {
        try {
            await supabase.from('notifications').update({ read: true }).in('id', ids);
        } catch (e) {
            console.warn("Supabase notifications read sync warning:", e.message);
        }
    }

    res.json({ success: true, message: "Notifications marked as read." });
});

app.listen(PORT, async () => {
    console.log(`==================================================`);
    console.log(`SIWES Portal Express server active on port ${PORT}`);
    console.log(`Access dashboard locally via http://localhost:${PORT}`);
    console.log(`==================================================`);
    loadLocalDB();
    await checkAndSeedSupabase();
});
