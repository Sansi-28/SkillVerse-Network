// backend/db_init.js
const sqlite3 = require('sqlite3').verbose(); // Use verbose for better error messages
const DB_PATH = './skill_exchange.db'; // Database file will be created in backend folder

// Define the SQL query to create the users table
// Using TEXT for keywords (store as JSON string) and createdAt (ISO string)
// Added UNIQUE constraint for email
// Added DEFAULT value for tokens
const CREATE_USERS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL,
        locationZip TEXT,
        offerText TEXT,
        needText TEXT,
        offerKeywords TEXT,
        needKeywords TEXT,
        tokens INTEGER DEFAULT 5,
        createdAt TEXT NOT NULL
    );
`;

// Define SQL to create requests table (might as well do it now)
const CREATE_REQUESTS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requesterId INTEGER NOT NULL,
        providerId INTEGER NOT NULL,
        skill TEXT NOT NULL,
        message TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (requesterId) REFERENCES users(id),
        FOREIGN KEY (providerId) REFERENCES users(id)
    );
`;
 // Optional: Add indexes for faster lookups later
const CREATE_EMAIL_INDEX_SQL = `CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);`;
const CREATE_REQUEST_USER_INDEX_SQL = `CREATE INDEX IF NOT EXISTS idx_requests_users ON requests (requesterId, providerId);`;


// Function to initialize the database
function initializeDatabase() {
    // Open the database connection (creates the file if it doesn't exist)
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error("Error opening database:", err.message);
            throw err; // Throw error to prevent server start on failure
        }
        console.log(`Connected to the SQLite database at ${DB_PATH}`);
    });

    // Use serialize to ensure statements run in order
    db.serialize(() => {
        console.log("Running database initialization SQL...");
        db.run(CREATE_USERS_TABLE_SQL, (err) => {
            if (err) console.error("Error creating users table:", err.message);
            else console.log("Users table checked/created successfully.");
        });

        db.run(CREATE_REQUESTS_TABLE_SQL, (err) => {
            if (err) console.error("Error creating requests table:", err.message);
            else console.log("Requests table checked/created successfully.");
        });

        db.run(CREATE_EMAIL_INDEX_SQL, (err) => {
             if (err) console.error("Error creating email index:", err.message);
             else console.log("Email index checked/created.");
         });

         db.run(CREATE_REQUEST_USER_INDEX_SQL, (err) => {
             if (err) console.error("Error creating request user index:", err.message);
             else console.log("Request user index checked/created.");
         });
    });

    return db; // Return the database connection object
}

module.exports = { initializeDatabase, DB_PATH };