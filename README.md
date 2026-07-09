# SIWES Internship Attendance & Logbook Portal

An advanced, cloud-enabled web portal designed to monitor and automate the **Student Industrial Work Experience Scheme (SIWES)**. This portal enforces geolocation-based geofencing check-ins, provides daily logbook and weekly report tracking, automates supervisor appraisal signatures, generates printable A4 assessment reports, and sends real-time email alerts upon key internship events.

---

## 🚀 Key Features

* **📍 GPS Geofencing (200m Radius):** Student clock-ins utilize browser geolocation APIs to compute deviation distances from their assigned office coordinates via the Haversine formula. Out-of-bounds check-ins are flagged automatically.
* **📱 Full Mobile Responsiveness:** Featuring a modern slide-out navigation drawer, dynamic grids, and responsive views optimized for smartphones, tablets, and desktops.
* **📧 Real-time Gmail Alerts:** Leverages Nodemailer to dispatch formatted HTML emails notifying supervisors of clock-ins, logbook submissions, and evaluation approvals.
* **📊 Interactive Charts (Chart.js):** Rich animated dashboards display daily attendance trends, punctuality breakdowns, and weekly geofence deviation progression.
* **🖨️ PDF Report Generator:** One-click compiling of student assessments into standard, print-ready A4 PDF files using jsPDF and html2canvas.
* **☁️ Supabase Cloud Backend:** Fully transitioned from a local database to a remote cloud-hosted Supabase (PostgreSQL) database.

---

## 🛠️ Technology Stack

* **Frontend:** HTML5, Vanilla CSS3 (Glassmorphism theme), JavaScript (ES6+), Chart.js, jsPDF, html2canvas.
* **Backend:** Node.js, Express.js, Nodemailer, Dotenv.
* **Database:** Supabase (PostgreSQL cloud storage).
* **Version Control:** Git, hosted on private GitHub repository.

---

## ⚙️ Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or later)
* Git

---

## 📥 Installation & Setup

### 1. Clone/Download the Codebase
Navigate to your project directory:
```bash
cd "C:\Users\HomePC\Desktop\tracking"
```

### 2. Install Project Dependencies
Run npm install to retrieve required backend modules:
```bash
npm install
```

### 3. Configure Environment Variables
Create a file named `.env` in the root of the project and define the following variables:
```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-16-character-app-password
SUPERVISOR_EMAIL=recipient-supervisor-email@gmail.com
PORT=3000

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

---

## ☁️ Supabase Database Migration

To set up the Postgres tables in your Supabase project:
1. Log in to your [Supabase Console](https://supabase.com/).
2. Open your project, click **SQL Editor** on the left menu, and click **New Query**.
3. Paste the following SQL script and click **Run**:

```sql
-- Create Students Table
CREATE TABLE students (
    "matric" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "officeAddress" TEXT NOT NULL,
    "officeLat" REAL NOT NULL,
    "officeLon" REAL NOT NULL,
    "geofenceRadius" REAL NOT NULL,
    "industrySupervisor" TEXT,
    "schoolSupervisor" TEXT,
    "academicGrade" TEXT,
    "academicFeedback" TEXT DEFAULT '',
    "evaluationGrade" INTEGER,
    "evaluationRemarks" TEXT DEFAULT ''
);

-- Create Attendance Table
CREATE TABLE attendance (
    "date" TEXT NOT NULL,
    "matric" TEXT NOT NULL REFERENCES students("matric") ON DELETE CASCADE,
    "clockIn" TEXT NOT NULL,
    "clockOut" TEXT,
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL,
    "distance" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "geofence" TEXT NOT NULL,
    PRIMARY KEY ("date", "matric")
);

-- Create Logbook Table
CREATE TABLE logbook (
    "date" TEXT NOT NULL,
    "matric" TEXT NOT NULL REFERENCES students("matric") ON DELETE CASCADE,
    "description" TEXT NOT NULL,
    "tools" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "status" TEXT DEFAULT 'Pending',
    "feedback" TEXT DEFAULT '',
    "signedBy" TEXT DEFAULT '',
    PRIMARY KEY ("date", "matric")
);

-- Create Weekly Reports Table
CREATE TABLE weekly_reports (
    "week" INTEGER NOT NULL,
    "matric" TEXT NOT NULL REFERENCES students("matric") ON DELETE CASCADE,
    "summary" TEXT NOT NULL,
    "rating" INTEGER,
    "status" TEXT DEFAULT 'Pending',
    "feedback" TEXT DEFAULT '',
    PRIMARY KEY ("week", "matric")
);

-- Create Supervisors Table
CREATE TABLE supervisors (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- Create School Supervisors Table
CREATE TABLE school_supervisors (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- Disable RLS on tables for demo environment simplicity
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE logbook DISABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE supervisors DISABLE ROW LEVEL SECURITY;
ALTER TABLE school_supervisors DISABLE ROW LEVEL SECURITY;
```

---

## 🏃 Running the Application

1. Fire up the local node server:
   ```bash
   node server.js
   ```
2. Once active, view the portal locally:
   **[http://localhost:3000](http://localhost:3000)**

*Note: On initial startup, if the database tables are empty, the Express server will automatically seed the database with mock records for demonstration purposes.*

---

## 🧑‍💻 Presentation Mock Controls
To easily demonstrate the system's geofence triggers to project evaluators, use the **Floating Demo Control Panel** (location icon in the bottom-right corner):
* **Select Role:** Toggle between Student, Industry Supervisor, Academic Supervisor, and Coordinator dashboards instantly.
* **Select Location:** Change simulated coordinates to **"At Internship Office"** (Successful clock-in) or **"At Home"** (Out of bounds flagged warning).
