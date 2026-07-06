const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
console.log("Connecting to:", dbPath);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("Failed to connect to SQLite DB:", err.message);
        process.exit(1);
    }
});

db.serialize(() => {
    db.get("SELECT name, matric, company FROM students WHERE matric = 'UI/2022/CS/101'", (err, row) => {
        if (err) {
            console.error("SQL query error:", err.message);
            process.exit(1);
        }
        if (!row) {
            console.error("No student records found.");
            process.exit(1);
        }
        console.log("-----------------------------------------");
        console.log("SQL Database Verification Success!");
        console.log("Student Name:", row.name);
        console.log("Matric Number:", row.matric);
        console.log("Company:", row.company);
        console.log("-----------------------------------------");
        db.close();
        process.exit(0);
    });
});
