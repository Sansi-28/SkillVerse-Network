// backend/dataStore.js
const bcrypt = require('bcryptjs');
const { extractKeywords } = require('./services/nlpProcessor');
const { initializeDatabase } = require('./db_init'); // Import initializer

// --- Database Connection ---
// Initialize DB connection when this module is loaded
const db = initializeDatabase();

// --- Constants ---
const STARTING_TOKENS = 5; // Default value is now set in SQL table definition
const TOKENS_PER_COMPLETION = 1;

// --- Promise Wrappers for SQLite Methods ---
// Helper function to run db.run as a promise
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) { // Use function() to access 'this'
            if (err) {
                console.error('DB Run Error:', sql, params, err.message);
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}

// Helper function to run db.get as a promise
function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                 console.error('DB Get Error:', sql, params, err.message);
                reject(err);
            } else {
                resolve(row); // Resolves with undefined if no row found
            }
        });
    });
}

// Helper function to run db.all as a promise
function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                 console.error('DB All Error:', sql, params, err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// --- Helper to Parse Keywords ---
// Safely parse JSON string into array, return empty array on failure/null
function parseKeywords(jsonString) {
    if (!jsonString) return [];
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn("Failed to parse keywords JSON:", jsonString, e);
        return [];
    }
}

// --- User Functions (Rewritten for SQLite) ---

async function addUser(name, email, password, locationZip, offerText, needText) {
    const lcEmail = email.toLowerCase();
    // Check uniqueness via SQL constraint later, but can do preliminary check
    const existingUser = await findUserByEmail(lcEmail);
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const offerKeywords = extractKeywords(offerText);
    const needKeywords = extractKeywords(needText);
    const createdAt = new Date().toISOString();

    const sql = `INSERT INTO users (name, email, passwordHash, locationZip, offerText, needText, offerKeywords, needKeywords, createdAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    // NOTE: STARTING_TOKENS is handled by SQL DEFAULT
    const params = [
        name, lcEmail, passwordHash, locationZip,
        offerText || '', needText || '',
        JSON.stringify(offerKeywords), JSON.stringify(needKeywords),
        createdAt
    ];

    try {
        const result = await dbRun(sql, params);
        console.log(`User added with ID: ${result.lastID}, Email: ${lcEmail}`);
        // Return essential info, fetch full user if needed elsewhere
        return { id: result.lastID, email: lcEmail, name: name };
    } catch (error) {
        // Handle specific UNIQUE constraint error for email
        if (error.message.includes('UNIQUE constraint failed: users.email')) {
            throw new Error('Email already exists');
        }
        console.error("Error in addUser:", error);
        throw new Error('Failed to add user to database.'); // Generic error
    }
}

async function findUserByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const user = await dbGet(sql, [email.toLowerCase()]);
    if (user) {
        // Parse keywords before returning
        user.offerKeywords = parseKeywords(user.offerKeywords);
        user.needKeywords = parseKeywords(user.needKeywords);
    }
    return user; // Returns row object or undefined
}

async function findUserById(id) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const user = await dbGet(sql, [id]);
     if (user) {
        // Parse keywords
        user.offerKeywords = parseKeywords(user.offerKeywords);
        user.needKeywords = parseKeywords(user.needKeywords);
    }
    return user; // Returns row object or undefined
}

// --- Token Management Functions (Rewritten for SQLite) ---

async function getUserTokenBalance(userId) {
    const sql = `SELECT tokens FROM users WHERE id = ?`;
    const row = await dbGet(sql, [userId]);
    if (!row) throw new Error("User not found for balance check.");
    return row.tokens === null || row.tokens === undefined ? 0 : row.tokens; // Handle potential null
}

async function updateUserTokenBalance(userId, amountChange) {
    // Fetch current balance first to check validity
    const currentBalance = await getUserTokenBalance(userId); // This also checks if user exists

    if (amountChange < 0 && currentBalance < Math.abs(amountChange)) {
        throw new Error("Insufficient tokens for transaction.");
    }

    const newBalance = currentBalance + amountChange;
    const sql = `UPDATE users SET tokens = ? WHERE id = ?`;
    await dbRun(sql, [newBalance, userId]);
    console.log(`User ${userId} token balance updated by ${amountChange}. New balance: ${newBalance}`);
    return newBalance;
}

async function transferTokens(fromUserId, toUserId, amount) {
    if (amount <= 0) throw new Error("Transfer amount must be positive.");
    if (fromUserId === toUserId) throw new Error("Cannot transfer tokens to yourself.");

    // --- Using SQLite Transaction for Atomicity ---
    return new Promise(async (resolve, reject) => {
        db.serialize(async () => {
            try {
                await dbRun('BEGIN TRANSACTION;');

                // Fetch balances within transaction
                const fromUserSql = `SELECT tokens FROM users WHERE id = ?`;
                const fromUserRow = await dbGet(fromUserSql, [fromUserId]);
                if (!fromUserRow) throw new Error(`Sender user ${fromUserId} not found.`);
                if (fromUserRow.tokens === null || fromUserRow.tokens < amount) {
                     throw new Error(`Insufficient tokens for transfer (${fromUserRow.tokens || 0} < ${amount}).`);
                 }

                 const toUserSql = `SELECT tokens FROM users WHERE id = ?`;
                 const toUserRow = await dbGet(toUserSql, [toUserId]);
                 if (!toUserRow) throw new Error(`Receiver user ${toUserId} not found.`);

                 // Perform updates
                 const newFromBalance = (fromUserRow.tokens || 0) - amount;
                 const newToBalance = (toUserRow.tokens || 0) + amount;

                 const updateFromSql = `UPDATE users SET tokens = ? WHERE id = ?`;
                 await dbRun(updateFromSql, [newFromBalance, fromUserId]);

                 const updateToSql = `UPDATE users SET tokens = ? WHERE id = ?`;
                 await dbRun(updateToSql, [newToBalance, toUserId]);

                await dbRun('COMMIT;');
                console.log(`Tokens transferred: ${amount} from User ${fromUserId} (${newFromBalance}) to User ${toUserId} (${newToBalance})`);
                resolve(true);

            } catch (error) {
                 console.error("Token transfer transaction failed:", error);
                 try {
                     await dbRun('ROLLBACK;');
                     console.log("Transaction rolled back.");
                 } catch (rollbackError) {
                     console.error("Failed to rollback transaction:", rollbackError);
                 }
                 // Reject the promise with the original error
                 reject(error instanceof Error ? error : new Error(error));
            }
        });
    });
    // --- End Transaction ---
}

// --- Public User Data Functions (Rewritten for SQLite) ---

async function getAllPublicUsers() {
    const sql = `SELECT id, name, locationZip, offerKeywords, createdAt FROM users`;
    const users = await dbAll(sql);
    // Parse keywords for each user
    return users.map(user => ({
        ...user,
        offerKeywords: parseKeywords(user.offerKeywords)
    }));
}

async function getPublicProfileById(userId) {
    const sql = `SELECT id, name, locationZip, offerText, offerKeywords, createdAt FROM users WHERE id = ?`;
    const user = await dbGet(sql, [userId]);
    if (user) {
         user.offerKeywords = parseKeywords(user.offerKeywords);
    }
    return user; // Returns public data object or undefined
}

// --- Search Function (Adaptation for SQLite) ---
// More complex keyword search within JSON is hard in SQLite.
// Strategy: Fetch users potentially nearby, then filter keywords in JS.
async function searchUsersBySkill(query, requestingUserId) {
    const requestingUser = await findUserById(requestingUserId);
    if (!requestingUser) {
        console.error(`Search failed: Requesting user ID ${requestingUserId} not found.`);
        return [];
    }
    const requestingUserZip = requestingUser.locationZip;
    const searchQuery = query ? query.trim().toLowerCase() : '';
    if (!searchQuery) return [];

    console.log(`Searching (DB) for skill "${searchQuery}" near zip ${requestingUserZip} (excluding user ${requestingUserId})`);

    // 1. Fetch all public users (simpler for SQLite keyword search)
    // In a real DB, you'd filter more effectively here.
    const allPublicUsers = await getAllPublicUsers();

    const matches = [];
    allPublicUsers.forEach(user => {
        // Exclude self
        if (user.id === requestingUserId) return;

        // Check location
        if (!isNearby(requestingUserZip, user.locationZip)) return; // Use the existing isNearby function

        // Check keywords (case-insensitive) - Keywords are already parsed by getAllPublicUsers
        const offerKeywordsLower = (user.offerKeywords || []).map(k => k.toLowerCase());
        if (offerKeywordsLower.includes(searchQuery)) {
            matches.push(user);
        }
    });

    console.log(`Found ${matches.length} matches (in-memory filter) for "${searchQuery}" near ${requestingUserZip}.`);
    return matches;
}


// --- Request Functions (Rewritten for SQLite) ---

async function addRequest(requesterId, providerId, skill, message) {
     // Prevent requesting from self / check users exist (optional, but good)
    if (requesterId === providerId) throw new Error("Cannot request skill from yourself.");
    const requester = await findUserById(requesterId);
    const provider = await findUserById(providerId);
    if (!requester || !provider) throw new Error("Requester or Provider not found.");

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt; // Initially same as createdAt
    const status = 'pending'; // Default defined in table, but set explicitly here too

    const sql = `INSERT INTO requests (requesterId, providerId, skill, message, status, createdAt, updatedAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [requesterId, providerId, skill.trim(), message || '', status, createdAt, updatedAt];

    try {
        const result = await dbRun(sql, params);
        console.log(`New request created: ID ${result.lastID}, ${requester.name} -> ${provider.name} for "${skill.trim()}"`);
        // Return the full request object by fetching it again
        return findRequestById(result.lastID);
    } catch (error) {
        console.error("Error in addRequest:", error);
        throw new Error('Failed to add request to database.');
    }
}

async function findRequestById(requestId) {
    // Join with users table to get names directly
    const sql = `
        SELECT r.*, reqUser.name as requesterName, provUser.name as providerName
        FROM requests r
        LEFT JOIN users reqUser ON r.requesterId = reqUser.id
        LEFT JOIN users provUser ON r.providerId = provUser.id
        WHERE r.id = ?
    `;
    return await dbGet(sql, [requestId]); // Returns row or undefined
}

async function updateRequestStatus(requestId, newStatus, userIdPerformingUpdate) {
    const request = await findRequestById(requestId); // Fetch request with names
    if (!request) throw new Error("Request not found.");

    // Authorization & State Validation (as before)
    if (request.providerId !== userIdPerformingUpdate) throw new Error("Unauthorized: Only the provider can update status.");
    const allowedUpdates = ['accepted', 'declined', 'completed'];
    if (!allowedUpdates.includes(newStatus)) throw new Error(`Invalid status update: "${newStatus}"`);
    if (request.status === 'declined' || request.status === 'completed') throw new Error(`Cannot update status of already ${request.status} request.`);
    if (newStatus === 'completed' && request.status !== 'accepted') throw new Error("Request must be 'accepted' before marking 'completed'.");

    const updatedAt = new Date().toISOString();
    let sql = `UPDATE requests SET status = ?, updatedAt = ? WHERE id = ?`;
    let params = [newStatus, updatedAt, requestId];

    // --- Token Transfer Logic ---
    if (newStatus === 'completed') {
        try {
            // Attempt transfer *before* committing status update
            await transferTokens(request.requesterId, request.providerId, TOKENS_PER_COMPLETION);
             console.log(`Token transfer successful for completed request ${requestId}.`);
             // Now proceed with status update
             await dbRun(sql, params);
        } catch (tokenError) {
             console.error(`Token transfer failed for request ${requestId}:`, tokenError);
             // IMPORTANT: Do NOT update status if token transfer failed
             throw new Error(`Failed to complete request: ${tokenError.message}`); // Rethrow error
        }
    } else {
        // Update status directly for accept/decline
        await dbRun(sql, params);
    }
     // --- End Token Transfer Logic ---

    console.log(`Request ID ${requestId} status updated to ${newStatus} by user ${userIdPerformingUpdate}`);
    // Return the updated request object (fetch again to be sure)
    return findRequestById(requestId);
}


async function getIncomingRequests(providerId) {
     // Join with users table to get requester names
     const sql = `
        SELECT r.*, reqUser.name as requesterName
        FROM requests r
        JOIN users reqUser ON r.requesterId = reqUser.id
        WHERE r.providerId = ?
        ORDER BY r.createdAt DESC
    `;
    return await dbAll(sql, [providerId]);
}

async function getOutgoingRequests(requesterId) {
    // Join with users table to get provider names
    const sql = `
        SELECT r.*, provUser.name as providerName
        FROM requests r
        JOIN users provUser ON r.providerId = provUser.id
        WHERE r.requesterId = ?
        ORDER BY r.createdAt DESC
    `;
    return await dbAll(sql, [requesterId]);
}


// --- Export Functions ---
module.exports = {
    // Users
    addUser,
    findUserByEmail,
    findUserById,
    // updateUserSkills, // Add back if implemented
    getAllPublicUsers,
    getPublicProfileById,
    searchUsersBySkill,
    // Requests
    addRequest,
    findRequestById,
    updateRequestStatus,
    getIncomingRequests,
    getOutgoingRequests,
    // Tokens
    getUserTokenBalance,
    updateUserTokenBalance,
    transferTokens
};