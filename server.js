require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from this directory
app.use(express.static(__dirname));

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL ERROR: Supabase URL and Key must be defined in the .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

// Auto Seed Supabase DB with default records if empty
async function seedSupabaseIfNeeded() {
    try {
        console.log("Checking if Supabase database contains records...");
        const { count, error } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true });
        
        if (error) {
            console.warn("Could not check student count (check if SQL migration was run in Supabase SQL editor):", error.message);
            return;
        }

        if (count === 0) {
            console.log("Supabase database is empty. Seeding default presentation records...");
            
            // 1. Seed Student Chinedu Azubuike
            const { error: studentErr } = await supabase.from('students').insert([
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
                    academicGrade: null, 
                    academicFeedback: '', 
                    evaluationGrade: 88, 
                    evaluationRemarks: 'Outstanding technical skill and self-starter.'
                }
            ]);

            if (studentErr) {
                console.error("Error seeding student:", studentErr.message);
                return;
            }

            // 2. Seed Attendance History
            const attRecords = [
                { date: "2026-06-25", matric: "UI/2022/CS/101", clockIn: "08:02:15", clockOut: "17:10:30", lat: 6.428010, lon: 3.421910, distance: 7, status: "On-Time", geofence: "Within Range" },
                { date: "2026-06-26", matric: "UI/2022/CS/101", clockIn: "08:14:40", clockOut: "17:05:00", lat: 6.427950, lon: 3.421880, distance: 13, status: "On-Time", geofence: "Within Range" },
                { date: "2026-06-29", matric: "UI/2022/CS/101", clockIn: "08:45:10", clockOut: "17:00:20", lat: 6.428120, lon: 3.422000, distance: 9, status: "Late", geofence: "Within Range" },
                { date: "2026-06-30", matric: "UI/2022/CS/101", clockIn: "08:08:22", clockOut: "17:15:40", lat: 6.428080, lon: 3.421950, distance: 3, status: "On-Time", geofence: "Within Range" },
                { date: "2026-07-01", matric: "UI/2022/CS/101", clockIn: "08:52:00", clockOut: "17:01:00", lat: 6.435000, lon: 3.442000, distance: 2340, status: "Late", geofence: "Out of Range (Flagged)" }
            ];
            await supabase.from('attendance').insert(attRecords);

            // 3. Seed Logbook Entries
            const logRecords = [
                { date: "2026-06-25", matric: "UI/2022/CS/101", description: "Onboarded with the dev team. Setup local development environments, configured Git, and cloned the backend microservice repositories. Attended the daily standup meeting.", tools: "Git, Docker, VS Code", hours: 8, status: "Approved", feedback: "Great start Chinedu! Make sure you get familiar with our Docker compose setup.", signedBy: "Engr. Sarah Jenkins" },
                { date: "2026-06-26", matric: "UI/2022/CS/101", description: "Resolved issue #412: Fixed bug in user authentication validator that caused server crashes on malformed request bodies. Wrote unit tests in Jest.", tools: "Node.js, Jest, Express", hours: 8, status: "Approved", feedback: "Solid bugfix. Clean unit tests.", signedBy: "Engr. Sarah Jenkins" },
                { date: "2026-06-29", matric: "UI/2022/CS/101", description: "Collaborated on designing the database schema for the new client billing module. Wrote migration files using Knex.js and tested locally.", tools: "PostgreSQL, Knex.js", hours: 8, status: "Approved", feedback: "Good schema layout, verified.", signedBy: "Engr. Sarah Jenkins" },
                { date: "2026-06-30", matric: "UI/2022/CS/101", description: "Developed UI components for the billing dashboard using React and Tailwind CSS. Implemented search and filter filters for transactions list.", tools: "React, CSS, Tailwind", hours: 8, status: "Approved", feedback: "UI looks matching with mockups.", signedBy: "Engr. Sarah Jenkins" },
                { date: "2026-07-01", matric: "UI/2022/CS/101", description: "Created API endpoints for invoice generation and integrated PDF creation library. Refactored the email dispatch service to run asynchronously.", tools: "Express, PDFKit, Redis", hours: 8, status: "Pending", feedback: "", signedBy: "" }
            ];
            await supabase.from('logbook').insert(logRecords);

            // 4. Seed Weekly Reports
            await supabase.from('weekly_reports').insert([
                {
                    week: 1, 
                    matric: 'UI/2022/CS/101', 
                    summary: 'During my first week, I successfully onboarded and integrated into the engineering workflow. I resolved a critical authentication validation bug, drafted schemas for the billing database module, and developed frontend elements. Key learnings include asynchronous worker processes using Redis queue system.', 
                    rating: 5, 
                    status: 'Approved', 
                    feedback: 'Excellent progress in week 1. Proactive approach to solving problems.'
                }
            ]);

            // 5. Seed Supervisors
            await supabase.from('supervisors').insert([
                { id: 'IS_01', name: 'Engr. Sarah Jenkins', company: 'TechCorp Solutions Ltd', email: 's.jenkins@techcorp.com' }
            ]);

            // 6. Seed School Supervisors
            await supabase.from('school_supervisors').insert([
                { id: 'SS_01', name: 'Dr. Festus Alao', dept: 'Computer Science', email: 'f.alao@university.edu.ng' }
            ]);

            console.log("Supabase database successfully seeded with initial parameters.");
        } else {
            console.log(`Supabase online with ${count} registered students.`);
        }
    } catch (err) {
        console.error("Supabase auto-seed warning:", err.message);
    }
}

// --- REST API ENDPOINTS ---

// 1. Health check
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", message: "Supabase PG Cloud server is active" });
});

// 2. Fetch all consolidated database states
app.get('/api/data', async (req, res) => {
    try {
        const { data: students } = await supabase.from('students').select('*');
        const { data: attendance } = await supabase.from('attendance').select('*');
        const { data: logbook } = await supabase.from('logbook').select('*');
        const { data: weekly } = await supabase.from('weekly_reports').select('*');
        const { data: supervisors } = await supabase.from('supervisors').select('*');
        const { data: schoolSupervisors } = await supabase.from('school_supervisors').select('*');

        res.json({
            students: students || [],
            attendance: attendance || [],
            logbook: logbook || [],
            weeklyReports: weekly || [],
            supervisors: supervisors || [],
            schoolSupervisors: schoolSupervisors || []
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2.5 Student: Register a new student intern
app.post('/api/students', async (req, res) => {
    const { matric, name, dept, level, company, officeAddress, officeLat, officeLon, geofenceRadius, industrySupervisor, schoolSupervisor } = req.body;
    
    try {
        const { error } = await supabase.from('students').insert([
            {
                matric, name, dept, level, company, officeAddress, officeLat, officeLon, geofenceRadius, industrySupervisor, schoolSupervisor,
                academicGrade: null, academicFeedback: '', evaluationGrade: null, evaluationRemarks: ''
            }
        ]);

        if (error) throw error;

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

        res.json({ success: true, message: "Student registered successfully in Supabase database" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Attendance: Clock In
app.post('/api/attendance/clock-in', async (req, res) => {
    const { date, matric, clockIn, lat, lon, distance, status, geofence } = req.body;
    
    try {
        const { error } = await supabase.from('attendance').insert([
            { date, matric, clockIn, clockOut: null, lat, lon, distance, status, geofence }
        ]);

        if (error) throw error;

        // Fetch student details
        const { data: student, error: studentErr } = await supabase
            .from('students')
            .select('name, industrySupervisor')
            .eq('matric', matric)
            .single();

        if (!studentErr && student) {
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

        res.json({ success: true, message: "Clock-in recorded in Supabase database" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Attendance: Clock Out
app.post('/api/attendance/clock-out', async (req, res) => {
    const { date, matric, clockOut } = req.body;
    
    try {
        const { error } = await supabase
            .from('attendance')
            .update({ clockOut })
            .match({ date, matric });

        if (error) throw error;
        res.json({ success: true, message: "Clock-out updated in Supabase database" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Logbook: Add Daily Log Entry
app.post('/api/logbook', async (req, res) => {
    const { date, matric, description, tools, hours } = req.body;
    
    try {
        const { error } = await supabase.from('logbook').insert([
            { date, matric, description, tools, hours, status: 'Pending', feedback: '', signedBy: '' }
        ]);

        if (error) throw error;

        // Fetch student details
        const { data: student, error: studentErr } = await supabase
            .from('students')
            .select('name, industrySupervisor')
            .eq('matric', matric)
            .single();

        if (!studentErr && student) {
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

        res.json({ success: true, message: "Daily log entry added to Supabase database" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Logbook: Verify/Approve Log Entry
app.post('/api/logbook/verify', async (req, res) => {
    const { date, matric, status, feedback, signedBy } = req.body;
    
    try {
        const { error } = await supabase
            .from('logbook')
            .update({ status, feedback, signedBy })
            .match({ date, matric });

        if (error) throw error;

        // Fetch student details
        const { data: student, error: studentErr } = await supabase
            .from('students')
            .select('name')
            .eq('matric', matric)
            .single();

        if (!studentErr && student) {
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

        res.json({ success: true, message: "Logbook entry status updated in Supabase database" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Weekly Report: Submit
app.post('/api/weekly', async (req, res) => {
    const { week, matric, summary } = req.body;
    
    try {
        const { error } = await supabase.from('weekly_reports').insert([
            { week, matric, summary, rating: null, status: 'Pending', feedback: '' }
        ]);

        if (error) throw error;
        res.json({ success: true, message: "Weekly report submitted to Supabase database" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Student: Industry Evaluation Update
app.post('/api/student/evaluation', async (req, res) => {
    const { matric, evaluationGrade, evaluationRemarks } = req.body;
    
    try {
        const { error } = await supabase
            .from('students')
            .update({ evaluationGrade, evaluationRemarks })
            .eq('matric', matric);

        if (error) throw error;
        res.json({ success: true, message: "Industry appraisal details saved to Supabase database" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. Student: School Grading Update
app.post('/api/student/grade', async (req, res) => {
    const { matric, academicGrade, academicFeedback } = req.body;
    
    try {
        const { error } = await supabase
            .from('students')
            .update({ academicGrade, academicFeedback })
            .eq('matric', matric);

        if (error) throw error;
        res.json({ success: true, message: "School academic grades saved to Supabase database" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. Student: Assign Academic Supervisor Mapping
app.post('/api/student/assign', async (req, res) => {
    const { matric, schoolSupervisor } = req.body;
    
    try {
        const { error } = await supabase
            .from('students')
            .update({ schoolSupervisor })
            .eq('matric', matric);

        if (error) throw error;
        res.json({ success: true, message: "Academic supervisor mapping saved to Supabase database" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Run server
app.listen(PORT, async () => {
    console.log(`==================================================`);
    console.log(`SIWES Portal Express server active on port ${PORT}`);
    console.log(`Access dashboard locally via http://localhost:${PORT}`);
    console.log(`==================================================`);
    
    // Seed default records if Supabase tables are currently empty
    await seedSupabaseIfNeeded();
});
