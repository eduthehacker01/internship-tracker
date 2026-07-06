const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function sendEmail(to, subject, html) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };
    return transporter.sendMail(mailOptions);
}


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from this directory
app.use(express.static(__dirname));

// Connect to SQLite Database
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite Database at:", dbPath);
        createTables();
    }
});

// Create tables if they do not exist
function createTables() {
    db.serialize(() => {
        // Students Table
        db.run(`CREATE TABLE IF NOT EXISTS students (
            matric TEXT PRIMARY KEY,
            name TEXT,
            dept TEXT,
            level TEXT,
            company TEXT,
            officeAddress TEXT,
            officeLat REAL,
            officeLon REAL,
            geofenceRadius REAL,
            industrySupervisor TEXT,
            schoolSupervisor TEXT,
            academicGrade TEXT,
            academicFeedback TEXT,
            evaluationGrade INTEGER,
            evaluationRemarks TEXT
        )`);

        // Attendance Table
        db.run(`CREATE TABLE IF NOT EXISTS attendance (
            date TEXT,
            matric TEXT,
            clockIn TEXT,
            clockOut TEXT,
            lat REAL,
            lon REAL,
            distance REAL,
            status TEXT,
            geofence TEXT,
            PRIMARY KEY (date, matric)
        )`);

        // Logbook Table
        db.run(`CREATE TABLE IF NOT EXISTS logbook (
            date TEXT,
            matric TEXT,
            description TEXT,
            tools TEXT,
            hours INTEGER,
            status TEXT,
            feedback TEXT,
            signedBy TEXT,
            PRIMARY KEY (date, matric)
        )`);

        // Weekly Reports Table
        db.run(`CREATE TABLE IF NOT EXISTS weekly_reports (
            week INTEGER,
            matric TEXT,
            summary TEXT,
            rating INTEGER,
            status TEXT,
            feedback TEXT,
            PRIMARY KEY (week, matric)
        )`);

        // Supervisors Table
        db.run(`CREATE TABLE IF NOT EXISTS supervisors (
            id TEXT PRIMARY KEY,
            name TEXT,
            company TEXT,
            email TEXT
        )`);

        // School Supervisors Table
        db.run(`CREATE TABLE IF NOT EXISTS school_supervisors (
            id TEXT PRIMARY KEY,
            name TEXT,
            dept TEXT,
            email TEXT
        )`);

        // Seed initial data if students table is empty
        db.get("SELECT COUNT(*) AS count FROM students", (err, row) => {
            if (err) {
                console.error("Error reading students table count:", err.message);
                return;
            }
            if (row.count === 0) {
                seedDatabase();
            }
        });
    });
}

// Seed Initial Data
function seedDatabase() {
    console.log("Seeding SQLite database with default records...");

    db.serialize(() => {
        // Seed Student Chinedu Azubuike
        db.run(`INSERT INTO students (matric, name, dept, level, company, officeAddress, officeLat, officeLon, geofenceRadius, industrySupervisor, schoolSupervisor, academicGrade, academicFeedback, evaluationGrade, evaluationRemarks) 
        VALUES (
            'UI/2022/CS/101', 
            'Chinedu Azubuike', 
            'Computer Science', 
            '400L', 
            'TechCorp Solutions Ltd', 
            '45 Marine Road, Victoria Island, Lagos', 
            6.428056, 
            3.421944, 
            200, 
            'Engr. Sarah Jenkins', 
            'Dr. Festus Alao', 
            NULL, 
            '', 
            88, 
            'Outstanding technical skill and self-starter.'
        )`);

        // Seed Attendance History
        const attRecords = [
            ["2026-06-25", "UI/2022/CS/101", "08:02:15", "17:10:30", 6.428010, 3.421910, 7, "On-Time", "Within Range"],
            ["2026-06-26", "UI/2022/CS/101", "08:14:40", "17:05:00", 6.427950, 3.421880, 13, "On-Time", "Within Range"],
            ["2026-06-29", "UI/2022/CS/101", "08:45:10", "17:00:20", 6.428120, 3.422000, 9, "Late", "Within Range"],
            ["2026-06-30", "UI/2022/CS/101", "08:08:22", "17:15:40", 6.428080, 3.421950, 3, "On-Time", "Within Range"],
            ["2026-07-01", "UI/2022/CS/101", "08:52:00", "17:01:00", 6.435000, 3.442000, 2340, "Late", "Out of Range (Flagged)"]
        ];
        const stmtAtt = db.prepare("INSERT INTO attendance (date, matric, clockIn, clockOut, lat, lon, distance, status, geofence) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        attRecords.forEach(r => stmtAtt.run(r));
        stmtAtt.finalize();

        // Seed Logbook Entries
        const logRecords = [
            ["2026-06-25", "UI/2022/CS/101", "Onboarded with the dev team. Setup local development environments, configured Git, and cloned the backend microservice repositories. Attended the daily standup meeting.", "Git, Docker, VS Code", 8, "Approved", "Great start Chinedu! Make sure you get familiar with our Docker compose setup.", "Engr. Sarah Jenkins"],
            ["2026-06-26", "UI/2022/CS/101", "Resolved issue #412: Fixed bug in user authentication validator that caused server crashes on malformed request bodies. Wrote unit tests in Jest.", "Node.js, Jest, Express", 8, "Approved", "Solid bugfix. Clean unit tests.", "Engr. Sarah Jenkins"],
            ["2026-06-29", "UI/2022/CS/101", "Collaborated on designing the database schema for the new client billing module. Wrote migration files using Knex.js and tested locally.", "PostgreSQL, Knex.js", 8, "Approved", "Good schema layout, verified.", "Engr. Sarah Jenkins"],
            ["2026-06-30", "UI/2022/CS/101", "Developed UI components for the billing dashboard using React and Tailwind CSS. Implemented search and filter filters for transactions list.", "React, CSS, Tailwind", 8, "Approved", "UI looks matching with mockups.", "Engr. Sarah Jenkins"],
            ["2026-07-01", "UI/2022/CS/101", "Created API endpoints for invoice generation and integrated PDF creation library. Refactored the email dispatch service to run asynchronously.", "Express, PDFKit, Redis", 8, "Pending", "", ""]
        ];
        const stmtLog = db.prepare("INSERT INTO logbook (date, matric, description, tools, hours, status, feedback, signedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        logRecords.forEach(r => stmtLog.run(r));
        stmtLog.finalize();

        // Seed Weekly Reports
        db.run(`INSERT INTO weekly_reports (week, matric, summary, rating, status, feedback) 
        VALUES (
            1, 
            'UI/2022/CS/101', 
            'During my first week, I successfully onboarded and integrated into the engineering workflow. I resolved a critical authentication validation bug, drafted schemas for the billing database module, and developed frontend elements. Key learnings include asynchronous worker processes using Redis queue system.', 
            5, 
            'Approved', 
            'Excellent progress in week 1. Proactive approach to solving problems.'
        )`);

        // Seed Supervisors
        db.run(`INSERT INTO supervisors (id, name, company, email) 
        VALUES ('IS_01', 'Engr. Sarah Jenkins', 'TechCorp Solutions Ltd', 's.jenkins@techcorp.com')`);

        // Seed School Supervisors
        db.run(`INSERT INTO school_supervisors (id, name, dept, email) 
        VALUES ('SS_01', 'Dr. Festus Alao', 'Computer Science', 'f.alao@university.edu.ng')`);

        console.log("Database seeded successfully.");
    });
}

// --- REST API ENDPOINTS ---

// 1. Health check
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", message: "SQL Server is active" });
});

// 2. Fetch all consolidated database states
app.get('/api/data', (req, res) => {
    const payload = {};
    
    db.serialize(() => {
        db.all("SELECT * FROM students", [], (err, students) => {
            if (err) return res.status(500).json({ error: err.message });
            payload.students = students;
            
            db.all("SELECT * FROM attendance", [], (err, attendance) => {
                if (err) return res.status(500).json({ error: err.message });
                payload.attendance = attendance;

                db.all("SELECT * FROM logbook", [], (err, logbook) => {
                    if (err) return res.status(500).json({ error: err.message });
                    payload.logbook = logbook;

                    db.all("SELECT * FROM weekly_reports", [], (err, weekly) => {
                        if (err) return res.status(500).json({ error: err.message });
                        payload.weeklyReports = weekly;

                        db.all("SELECT * FROM supervisors", [], (err, supervisors) => {
                            if (err) return res.status(500).json({ error: err.message });
                            payload.supervisors = supervisors;

                            db.all("SELECT * FROM school_supervisors", [], (err, schoolSupervisors) => {
                                if (err) return res.status(500).json({ error: err.message });
                                payload.schoolSupervisors = schoolSupervisors;
                                res.json(payload);
                            });
                        });
                    });
                });
            });
        });
    });
});

// 2.5 Student: Register a new student intern
app.post('/api/students', (req, res) => {
    const { matric, name, dept, level, company, officeAddress, officeLat, officeLon, geofenceRadius, industrySupervisor, schoolSupervisor } = req.body;
    const query = `INSERT INTO students (matric, name, dept, level, company, officeAddress, officeLat, officeLon, geofenceRadius, industrySupervisor, schoolSupervisor, academicGrade, academicFeedback, evaluationGrade, evaluationRemarks) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, '', NULL, '')`;
    db.run(query, [matric, name, dept, level, company, officeAddress, officeLat, officeLon, geofenceRadius, industrySupervisor, schoolSupervisor], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Email coordinator
        const mailSubject = `SIWES Portal: New Intern Registered - ${name}`;
        const mailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
                <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">New Intern Registered</h2>
                <p>Hello Coordinator,</p>
                <p>A new student has registered on the SIWES Internship Portal:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${name}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Matric No</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${matric}</td></tr>
                    <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Department</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${dept} (${level})</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Company</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${company}</td></tr>
                    <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Office GPS</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${officeLat}, ${officeLon} (Radius: ${geofenceRadius}m)</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Industry Supervisor</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${industrySupervisor}</td></tr>
                </table>
                <p style="margin-top: 20px; font-size: 0.9em; color: #64748b;">This notification is sent automatically by the SIWES Portal.</p>
            </div>
        `;
        sendEmail(process.env.SUPERVISOR_EMAIL, mailSubject, mailHtml)
            .then(() => console.log(`New registration email sent for ${name}`))
            .catch(e => console.error("Email send failed:", e.message));

        res.json({ success: true, message: "Student registered successfully in SQL database" });
    });
});

// 3. Attendance: Clock In
app.post('/api/attendance/clock-in', (req, res) => {
    const { date, matric, clockIn, lat, lon, distance, status, geofence } = req.body;
    const query = `INSERT INTO attendance (date, matric, clockIn, clockOut, lat, lon, distance, status, geofence) 
                   VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?)`;
    db.run(query, [date, matric, clockIn, lat, lon, distance, status, geofence], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Fetch student details
        db.get("SELECT name, industrySupervisor FROM students WHERE matric = ?", [matric], (err, student) => {
            if (!err && student) {
                const mailSubject = `SIWES Attendance Alert: ${student.name} Clocks In`;
                const mailHtml = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
                        <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">SIWES Daily Attendance Notification</h2>
                        <p>Hello <strong>${student.industrySupervisor || 'Supervisor'}</strong>,</p>
                        <p>This is to inform you that your intern has clocked in for the day.</p>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Intern Name</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${student.name}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Matric No</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${matric}</td></tr>
                            <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Clock-in Time</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${clockIn}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Status</td><td style="padding: 8px; border: 1px solid #e2e8f0;"><span style="color: ${status === 'On-Time' ? '#10b981' : '#f59e0b'}; font-weight: bold;">${status}</span></td></tr>
                            <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Geofence</td><td style="padding: 8px; border: 1px solid #e2e8f0;"><span style="color: ${geofence.includes('Within') ? '#10b981' : '#ef4444'}; font-weight: bold;">${geofence}</span> (Dist: ${Math.round(distance)}m)</td></tr>
                        </table>
                        <p style="margin-top: 20px; font-size: 0.9em; color: #64748b;">This notification is sent automatically by the SIWES Portal.</p>
                    </div>
                `;
                sendEmail(process.env.SUPERVISOR_EMAIL, mailSubject, mailHtml)
                    .then(() => console.log(`Clock-in notification email sent for ${student.name}`))
                    .catch(e => console.error("Email send failed:", e.message));
            }
        });

        res.json({ success: true, message: "Clock-in recorded in SQL database" });
    });
});

// 4. Attendance: Clock Out
app.post('/api/attendance/clock-out', (req, res) => {
    const { date, matric, clockOut } = req.body;
    const query = `UPDATE attendance SET clockOut = ? WHERE date = ? AND matric = ?`;
    db.run(query, [clockOut, date, matric], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "Clock-out updated in SQL database" });
    });
});

// 5. Logbook: Add Daily Log Entry
app.post('/api/logbook', (req, res) => {
    const { date, matric, description, tools, hours } = req.body;
    const query = `INSERT INTO logbook (date, matric, description, tools, hours, status, feedback, signedBy) 
                   VALUES (?, ?, ?, ?, ?, 'Pending', '', '')`;
    db.run(query, [date, matric, description, tools, hours], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Fetch student details
        db.get("SELECT name, industrySupervisor FROM students WHERE matric = ?", [matric], (err, student) => {
            if (!err && student) {
                const mailSubject = `SIWES Logbook: Daily Log Submitted by ${student.name}`;
                const mailHtml = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
                        <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Daily Logbook Submission</h2>
                        <p>Hello <strong>${student.industrySupervisor || 'Supervisor'}</strong>,</p>
                        <p>A new daily log entry has been submitted for review by <strong>${student.name}</strong>.</p>
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 15px 0;">
                            <p><strong>Date:</strong> ${date}</p>
                            <p><strong>Hours Worked:</strong> ${hours} hours</p>
                            <p><strong>Tools Used:</strong> ${tools}</p>
                            <p><strong>Description of Tasks:</strong></p>
                            <p style="white-space: pre-wrap; color: #334155;">${description}</p>
                        </div>
                        <p>Please log in to the SIWES Portal to verify and approve this entry.</p>
                        <p style="margin-top: 20px; font-size: 0.9em; color: #64748b;">This notification is sent automatically by the SIWES Portal.</p>
                    </div>
                `;
                sendEmail(process.env.SUPERVISOR_EMAIL, mailSubject, mailHtml)
                    .then(() => console.log(`Logbook submission email sent for ${student.name}`))
                    .catch(e => console.error("Email send failed:", e.message));
            }
        });

        res.json({ success: true, message: "Daily log entry added to SQL database" });
    });
});

// 6. Logbook: Verify/Approve Log Entry
app.post('/api/logbook/verify', (req, res) => {
    const { date, matric, status, feedback, signedBy } = req.body;
    const query = `UPDATE logbook SET status = ?, feedback = ?, signedBy = ? WHERE date = ? AND matric = ?`;
    db.run(query, [status, feedback, signedBy, date, matric], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Fetch student details
        db.get("SELECT name FROM students WHERE matric = ?", [matric], (err, student) => {
            if (!err && student) {
                const mailSubject = `SIWES Logbook: Log entry for ${date} has been ${status}`;
                const mailHtml = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
                        <h2 style="color: ${status === 'Approved' ? '#10b981' : '#ef4444'}; border-bottom: 2px solid ${status === 'Approved' ? '#10b981' : '#ef4444'}; padding-bottom: 10px;">Logbook Status Update</h2>
                        <p>Hello <strong>${student.name}</strong>,</p>
                        <p>Your daily logbook entry for <strong>${date}</strong> has been reviewed by your supervisor.</p>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Status</td><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; color: ${status === 'Approved' ? '#10b981' : '#ef4444'};">${status}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Feedback</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${feedback || 'No feedback provided'}</td></tr>
                            <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Signed By</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${signedBy}</td></tr>
                        </table>
                        <p style="margin-top: 20px; font-size: 0.9em; color: #64748b;">This notification is sent automatically by the SIWES Portal.</p>
                    </div>
                `;
                sendEmail(process.env.SUPERVISOR_EMAIL, mailSubject, mailHtml)
                    .then(() => console.log(`Logbook verification email sent for student ${student.name}`))
                    .catch(e => console.error("Email send failed:", e.message));
            }
        });

        res.json({ success: true, message: "Logbook entry status updated in SQL database" });
    });
});

// 7. Weekly Report: Submit
app.post('/api/weekly', (req, res) => {
    const { week, matric, summary } = req.body;
    const query = `INSERT INTO weekly_reports (week, matric, summary, rating, status, feedback) 
                   VALUES (?, ?, ?, NULL, 'Pending', '')`;
    db.run(query, [week, matric, summary], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "Weekly report submitted to SQL database" });
    });
});

// 8. Student: Industry Evaluation Update
app.post('/api/student/evaluation', (req, res) => {
    const { matric, evaluationGrade, evaluationRemarks } = req.body;
    const query = `UPDATE students SET evaluationGrade = ?, evaluationRemarks = ? WHERE matric = ?`;
    db.run(query, [evaluationGrade, evaluationRemarks, matric], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "Industry appraisal details saved to SQL database" });
    });
});

// 9. Student: School Grading Update
app.post('/api/student/grade', (req, res) => {
    const { matric, academicGrade, academicFeedback } = req.body;
    const query = `UPDATE students SET academicGrade = ?, academicFeedback = ? WHERE matric = ?`;
    db.run(query, [academicGrade, academicFeedback, matric], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "School academic grades saved to SQL database" });
    });
});

// 10. Student: Assign Academic Supervisor Mapping
app.post('/api/student/assign', (req, res) => {
    const { matric, schoolSupervisor } = req.body;
    const query = `UPDATE students SET schoolSupervisor = ? WHERE matric = ?`;
    db.run(query, [schoolSupervisor, matric], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "Academic supervisor mapping saved to SQL database" });
    });
});

// Run server
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`SIWES Portal Express server active on port ${PORT}`);
    console.log(`Access dashboard locally via http://localhost:${PORT}`);
    console.log(`==================================================`);
});
