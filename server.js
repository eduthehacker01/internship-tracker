require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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
                    email: 'chinedu@example.com',
                    password: 'password123',
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
                { id: 'IS_01', name: 'Engr. Sarah Jenkins', company: 'TechCorp Solutions Ltd', email: 's.jenkins@techcorp.com', password: 'password123' }
            ]);

            // 6. Seed School Supervisors
            await supabase.from('school_supervisors').insert([
                { id: 'SS_01', name: 'Dr. Festus Alao', dept: 'Computer Science', email: 'f.alao@university.edu.ng', password: 'password123' }
            ]);

            // 7. Seed Initial Notifications
            await supabase.from('notifications').insert([
                { userId: 'IS_01', role: 'industry_supervisor', message: 'Welcome to the SIWES Portal! You can now track Chinedu Azubuike.', type: 'registration' }
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

// 1.5 Unified authentication endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check Coordinator
        if (email.toLowerCase() === 'coordinator@university.edu.ng' && password === 'password123') {
            return res.json({
                success: true,
                role: 'coordinator',
                id: 'CO_01',
                name: 'Prof. Ebuka Obi',
                email: 'coordinator@university.edu.ng'
            });
        }

        // Check Students
        const { data: student } = await supabase
            .from('students')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (student) {
            if (student.password === password) {
                return res.json({
                    success: true,
                    role: 'student',
                    id: student.matric,
                    name: student.name,
                    email: student.email,
                    matric: student.matric
                });
            } else {
                return res.status(401).json({ success: false, error: "Invalid credentials" });
            }
        }

        // Check Industry Supervisors
        const { data: supervisor } = await supabase
            .from('supervisors')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (supervisor) {
            if (supervisor.password === password) {
                return res.json({
                    success: true,
                    role: 'industry_supervisor',
                    id: supervisor.id,
                    name: supervisor.name,
                    company: supervisor.company,
                    email: supervisor.email
                });
            } else {
                return res.status(401).json({ success: false, error: "Invalid credentials" });
            }
        }

        // Check School Supervisors
        const { data: schoolSuper } = await supabase
            .from('school_supervisors')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (schoolSuper) {
            if (schoolSuper.password === password) {
                return res.json({
                    success: true,
                    role: 'school_supervisor',
                    id: schoolSuper.id,
                    name: schoolSuper.name,
                    dept: schoolSuper.dept,
                    email: schoolSuper.email
                });
            } else {
                return res.status(401).json({ success: false, error: "Invalid credentials" });
            }
        }

        return res.status(401).json({ success: false, error: "User profile not found" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
        const { data: notifications } = await supabase
            .from('notifications')
            .select('*')
            .order('createdAt', { ascending: false });

        res.json({
            students: students || [],
            attendance: attendance || [],
            logbook: logbook || [],
            weeklyReports: weekly || [],
            supervisors: supervisors || [],
            schoolSupervisors: schoolSupervisors || [],
            notifications: notifications || []
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2.5 Student: Register a new student intern
app.post('/api/students', async (req, res) => {
    const { matric, name, dept, level, company, officeAddress, officeLat, officeLon, geofenceRadius, industrySupervisor, schoolSupervisor, email, password } = req.body;
    
    try {
        const { error } = await supabase.from('students').insert([
            {
                matric, name, dept, level, company, officeAddress, officeLat, officeLon, geofenceRadius, industrySupervisor, schoolSupervisor,
                email: email || `${matric.toLowerCase().replace(/[^a-z0-9]/g, '')}@siwes.com`,
                password: password || 'password123',
                academicGrade: null, academicFeedback: '', evaluationGrade: null, evaluationRemarks: ''
            }
        ]);

        if (error) throw error;

        // In-App Notification for Coordinator
        await supabase.from('notifications').insert([
            {
                matric,
                userId: 'CO_01',
                role: 'coordinator',
                message: `New Intern Registered: ${name} (${matric}) placed at ${company}.`,
                type: 'registration'
            }
        ]);

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
            // Retrieve supervisor's ID to route the notification
            let supervisorId = 'CO_01'; // Default coordinator fallback
            if (student.industrySupervisor) {
                const { data: supervisor } = await supabase
                    .from('supervisors')
                    .select('id')
                    .eq('name', student.industrySupervisor)
                    .maybeSingle();
                if (supervisor) {
                    supervisorId = supervisor.id;
                }
            }

            // Create In-App Notification for Supervisor
            await supabase.from('notifications').insert([
                {
                    matric,
                    userId: supervisorId,
                    role: supervisorId === 'CO_01' ? 'coordinator' : 'industry_supervisor',
                    message: `${student.name} clocked in ${status} at ${clockIn} (${geofence}, Dist: ${Math.round(distance)}m).`,
                    type: 'clock_in'
                }
            ]);
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
            // Retrieve supervisor's ID to route the notification
            let supervisorId = 'CO_01'; // Default coordinator fallback
            if (student.industrySupervisor) {
                const { data: supervisor } = await supabase
                    .from('supervisors')
                    .select('id')
                    .eq('name', student.industrySupervisor)
                    .maybeSingle();
                if (supervisor) {
                    supervisorId = supervisor.id;
                }
            }

            // Create In-App Notification for Supervisor
            await supabase.from('notifications').insert([
                {
                    matric,
                    userId: supervisorId,
                    role: supervisorId === 'CO_01' ? 'coordinator' : 'industry_supervisor',
                    message: `${student.name} submitted daily logbook details for ${date} (${hours}h, Tools: ${tools}).`,
                    type: 'log_submission'
                }
            ]);
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
            // Create In-App Notification for the Student
            await supabase.from('notifications').insert([
                {
                    matric,
                    userId: matric,
                    role: 'student',
                    message: `Your daily log entry for ${date} was ${status}. Feedback: "${feedback || 'No feedback'}" (Signed by: ${signedBy}).`,
                    type: 'log_verification'
                }
            ]);
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

// 11. Notifications: Mark as Read
app.post('/api/notifications/read', async (req, res) => {
    const { ids } = req.body;
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .in('id', ids);

        if (error) throw error;
        res.json({ success: true, message: "Notifications marked as read" });
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
