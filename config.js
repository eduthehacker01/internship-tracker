// ============================================================================
// MICHAEL OKPARA UNIVERSITY OF AGRICULTURE, UMUDIKE (MOUAU)
// DEPARTMENT OF COMPUTER SCIENCE
// GEOFENCED SIWES ATTENDANCE & DIGITAL LOGBOOK MANAGEMENT SYSTEM
// CONFIGURATION, SUPABASE CLIENT & HAVERSINE FORMULA ENGINE (config.js)
// ============================================================================

const MOUAU_CONFIG = {
    SUPABASE_URL: "https://selsfxndfrfxzoktndxv.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbHNmeG5kZnJmeHpva3RuZHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMzAxNTMsImV4cCI6MjA5ODkwNjE1M30.pRjsq_o6Nyrf6KNhZgnoR-VoYFEWGkCdVTDDf96Fek0",
    STORAGE_BUCKET: "selfies",
    DEFAULT_GEOFENCE_METERS: 100,
    PUNCTUALITY_CUTOFF: { hour: 8, minute: 30 }, // 08:30 AM
    MATRIC_REGEX: /^MOUAU\/CMP\/\d{2}\/\d{6}$/,
    // Pre-configured Admin / HOD Credentials (No public sign-up allowed for Admin)
    ADMIN_CREDENTIALS: {
        email: "admin.cmp@mouau.edu.ng",
        password: "MOUAU_ADMIN_2026",
        altEmail: "hod.cmp@mouau.edu.ng",
        altPassword: "password123",
        name: "Departmental SIWES Administrator / HOD (Computer Science)"
    }
};

// Initialize Supabase v2 Client if @supabase/supabase-js CDN is loaded
let supabaseClient = null;
if (typeof window !== "undefined" && window.supabase && typeof window.supabase.createClient === "function") {
    try {
        supabaseClient = window.supabase.createClient(
            MOUAU_CONFIG.SUPABASE_URL,
            MOUAU_CONFIG.SUPABASE_ANON_KEY
        );
    } catch (err) {
        console.warn("Supabase client init warning:", err.message);
    }
}

/**
 * Haversine Formula: Calculates exact great-circle distance in meters
 * between two GPS coordinates (lat1, lon1) and (lat2, lon2).
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's mean radius in meters
    const toRadians = (deg) => (deg * Math.PI) / 180;

    const phi1 = toRadians(Number(lat1));
    const phi2 = toRadians(Number(lat2));
    const deltaPhi = toRadians(Number(lat2) - Number(lat1));
    const deltaLambda = toRadians(Number(lon2) - Number(lon1));

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
}

/**
 * Evaluates punctuality based on 08:30 AM cutoff.
 * At or before 08:30 AM -> 'On-Time', after 08:30 AM -> 'Late'.
 */
function evaluatePunctuality(dateObj = new Date()) {
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const cutoffHour = MOUAU_CONFIG.PUNCTUALITY_CUTOFF.hour;
    const cutoffMinute = MOUAU_CONFIG.PUNCTUALITY_CUTOFF.minute;

    if (hours < cutoffHour || (hours === cutoffHour && minutes <= cutoffMinute)) {
        return "On-Time";
    }
    return "Late";
}

// ============================================================================
// HYBRID SUPABASE + LOCAL STORAGE PERSISTENCE LAYER
// ============================================================================

const LOCAL_STORAGE_KEY = "mouau_siwes_portal_db_v2";

const INITIAL_MOUAU_SEED = {
    students: [
        {
            id: 1,
            matric_number: "MOUAU/CMP/23/121834",
            first_name: "Chinedu",
            last_name: "Azubuike",
            department: "Computer Science",
            level: "300 Level",
            email: "chinedu.azubuike@mouau.edu.ng",
            password: "password123",
            company_name: "TechCorp Solutions Ltd",
            office_address: "45 Aba Road, Umuahia, Abia State",
            office_lat: 5.524910,
            office_lon: 7.494610,
            geofence_radius: 100,
            industry_supervisor_name: "Engr. Sarah Jenkins",
            industry_supervisor_phone: "+2348035550192",
            created_at: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
            id: 2,
            matric_number: "MOUAU/CMP/23/121899",
            first_name: "Chioma",
            last_name: "Okafor",
            department: "Computer Science",
            level: "300 Level",
            email: "chioma.okafor@mouau.edu.ng",
            password: "password123",
            company_name: "Abia Tech Hub",
            office_address: "12 Ikot Ekpene Road, Umuahia, Abia State",
            office_lat: 5.532100,
            office_lon: 7.498200,
            geofence_radius: 100,
            industry_supervisor_name: "Engr. David Nwachukwu",
            industry_supervisor_phone: "+2348061234567",
            created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        }
    ],
    attendance: [
        {
            id: 1,
            matric_number: "MOUAU/CMP/23/121834",
            attendance_date: "2026-11-24",
            clock_in_time: "08:05:14 AM",
            clock_in_distance: 14.2,
            clock_in_status: "On-Time",
            clock_in_selfie_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
            clock_out_time: "04:35:20 PM",
            clock_out_distance: 18.4,
            clock_out_selfie_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            matric_number: "MOUAU/CMP/23/121834",
            attendance_date: "2026-11-25",
            clock_in_time: "08:48:10 AM",
            clock_in_distance: 31.6,
            clock_in_status: "Late",
            clock_in_selfie_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
            clock_out_time: "05:02:11 PM",
            clock_out_distance: 22.0,
            clock_out_selfie_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 3,
            matric_number: "MOUAU/CMP/23/121899",
            attendance_date: "2026-11-25",
            clock_in_time: "08:12:45 AM",
            clock_in_distance: 9.8,
            clock_in_status: "On-Time",
            clock_in_selfie_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            clock_out_time: "04:40:00 PM",
            clock_out_distance: 11.2,
            clock_out_selfie_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        }
    ],
    daily_logs: [
        {
            id: 1,
            matric_number: "MOUAU/CMP/23/121834",
            log_date: "2026-11-24",
            work_description: "Designed Supabase PostgreSQL tables and configured Haversine GPS distance validation for 100m radius.",
            tools_used: "Supabase, PostgreSQL, Vanilla JS",
            hours_worked: 8,
            status: "Verified",
            supervisor_feedback: "Verified by Admin."
        },
        {
            id: 2,
            matric_number: "MOUAU/CMP/23/121834",
            log_date: "2026-11-25",
            work_description: "Integrated live front-camera WebRTC stream and HTML5 canvas snapshot upload to Supabase Storage.",
            tools_used: "HTML5 Canvas, MediaDevices API, CSS3",
            hours_worked: 8,
            status: "Pending",
            supervisor_feedback: ""
        },
        {
            id: 3,
            matric_number: "MOUAU/CMP/23/121899",
            log_date: "2026-11-25",
            work_description: "Configured network routers, VLAN segmentation, and tested firewall rules for the enterprise subnet.",
            tools_used: "Cisco Packet Tracer, Wireshark, Linux",
            hours_worked: 8,
            status: "Verified",
            supervisor_feedback: "Verified by Admin."
        }
    ],
    weekly_reports: [
        {
            id: 1,
            matric_number: "MOUAU/CMP/23/121834",
            week_number: 1,
            summary: "Completed Week 1 orientation at TechCorp Solutions Ltd. Set up database architecture, tested 100m GPS geofencing, and built live selfie attendance capture.",
            status: "Verified"
        },
        {
            id: 2,
            matric_number: "MOUAU/CMP/23/121899",
            week_number: 1,
            summary: "Completed Week 1 network engineering orientation at Abia Tech Hub. Assisted with enterprise router configuration and IP subnet documentation.",
            status: "Pending"
        }
    ],
    notifications: [
        {
            id: 1,
            target_role: "admin",
            matric_number: "MOUAU/CMP/23/121834",
            message: "New SIWES Intern Registered: Chinedu Azubuike (MOUAU/CMP/23/121834) placed at TechCorp Solutions Ltd.",
            is_read: false,
            created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
            id: 2,
            target_role: "admin",
            matric_number: "MOUAU/CMP/23/121899",
            message: "New SIWES Intern Registered: Chioma Okafor (MOUAU/CMP/23/121899) placed at Abia Tech Hub.",
            is_read: false,
            created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        }
    ]
};

function getLocalStore() {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOUAU_SEED));
            return JSON.parse(JSON.stringify(INITIAL_MOUAU_SEED));
        }
        const parsed = JSON.parse(raw);
        return {
            students: parsed.students || INITIAL_MOUAU_SEED.students,
            attendance: parsed.attendance || INITIAL_MOUAU_SEED.attendance,
            daily_logs: parsed.daily_logs || INITIAL_MOUAU_SEED.daily_logs,
            weekly_reports: parsed.weekly_reports || INITIAL_MOUAU_SEED.weekly_reports,
            notifications: parsed.notifications || INITIAL_MOUAU_SEED.notifications
        };
    } catch (e) {
        return JSON.parse(JSON.stringify(INITIAL_MOUAU_SEED));
    }
}

function saveLocalStore(store) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
}

async function syncAllTablesFromSupabase() {
    const store = getLocalStore();
    if (!supabaseClient) return store;

    try {
        const [stRes, attRes, logRes, wkRes, notRes] = await Promise.all([
            supabaseClient.from("students").select("*").order("created_at", { ascending: false }),
            supabaseClient.from("attendance").select("*").order("attendance_date", { ascending: false }),
            supabaseClient.from("daily_logs").select("*").order("log_date", { ascending: false }),
            supabaseClient.from("weekly_reports").select("*").order("week_number", { ascending: true }),
            supabaseClient.from("notifications").select("*").order("created_at", { ascending: false })
        ]);

        if (!stRes.error && Array.isArray(stRes.data) && stRes.data.length > 0) store.students = stRes.data;
        if (!attRes.error && Array.isArray(attRes.data) && attRes.data.length > 0) store.attendance = attRes.data;
        if (!logRes.error && Array.isArray(logRes.data) && logRes.data.length > 0) store.daily_logs = logRes.data;
        if (!wkRes.error && Array.isArray(wkRes.data) && wkRes.data.length > 0) store.weekly_reports = wkRes.data;
        if (!notRes.error && Array.isArray(notRes.data) && notRes.data.length > 0) store.notifications = notRes.data;

        saveLocalStore(store);
    } catch (err) {
        console.warn("Supabase cloud sync unavailable (using local persistence):", err.message);
    }
    return store;
}

async function uploadSelfieToSupabase(dataUrl, matricNumber, type = "clock_in") {
    if (!supabaseClient) return dataUrl;

    try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const safeMatric = matricNumber.replace(/\//g, "_");
        const fileName = `${safeMatric}/${Date.now()}_${type}.png`;

        const { error: uploadError } = await supabaseClient.storage
            .from(MOUAU_CONFIG.STORAGE_BUCKET)
            .upload(fileName, blob, { contentType: "image/png", upsert: true });

        if (uploadError) return dataUrl;

        const { data: publicUrlData } = supabaseClient.storage
            .from(MOUAU_CONFIG.STORAGE_BUCKET)
            .getPublicUrl(fileName);

        return (publicUrlData && publicUrlData.publicUrl) ? publicUrlData.publicUrl : dataUrl;
    } catch (err) {
        return dataUrl;
    }
}
