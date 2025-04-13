// backend/server.js

// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import local modules
const dataStore = require('./dataStore'); // Manages user data (in-memory)
const authMiddleware = require('./authMiddleware'); // Middleware to verify JWT tokens

// --- Configuration ---
const app = express(); // app must be created before use
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL; // Get frontend URL from env

// --- Crucial Security Check ---
// ... (JWT check) ...
if (!FRONTEND_URL) {
    console.warn("WARN: FRONTEND_URL is not defined in environment variables. CORS might be too open or block requests.");
}

// --- Core Middleware --- <<<< THIS MUST COME BEFORE YOUR ROUTES (app.post, app.get, etc.)

// Configure CORS
const corsOptions = {
    origin: FRONTEND_URL, // Allow only your frontend origin
    optionsSuccessStatus: 200 // For legacy browser compatibility
};
// IMPORTANT: Apply CORS middleware *before* routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle OPTIONS requests for all routes

// Enable Express to parse JSON request bodies (also before routes)
app.use(express.json());

// --- API Routes ---

// Simple GET route to check if the API is running
app.get('/api', (req, res) => {
    res.json({ message: "Skill Exchange API is running!" });
});

// --- Authentication Routes ---

/**
 * POST /api/auth/signup
 * Registers a new user.
 * Hashes the password and processes skill keywords before storing.
 */
app.post('/api/auth/signup', async (req, res) => {
    // Destructure required and optional fields from request body
    const { name, email, password, locationZip, offerText, needText } = req.body;

    // Basic validation for required fields
    if (!name || !email || !password || !locationZip) {
        return res.status(400).json({ message: 'Name, email, password, and location (Zip) are required.' });
    }
    // Basic password length validation
    if (password.length < 6) {
         return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        // Attempt to add the user using the dataStore module
        // dataStore's addUser handles hashing and keyword extraction
        const newUser = await dataStore.addUser(
            name,
            email,
            password,
            locationZip,
            offerText || '', // Provide default empty string if not present
            needText || ''   // Provide default empty string if not present
        );
        // Respond with success status and message
        res.status(201).json({ message: 'User created successfully', userId: newUser.id });
    } catch (error) {
        // Handle specific error for duplicate email
        if (error.message === 'Email already exists') {
            return res.status(409).json({ message: error.message }); // 409 Conflict status
        }
        // Handle generic server errors
        console.error("Signup Error:", error);
        res.status(500).json({ message: 'Internal server error during signup' });
    }
});

/**
 * POST /api/auth/login
 * Authenticates a user based on email and password.
 * Returns a JWT token upon successful authentication.
 */
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate presence of email and password
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find the user by email
        const user = await dataStore.findUserByEmail(email);
        // If user not found, return 401 Unauthorized
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        // If passwords don't match, return 401 Unauthorized
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // --- Login Successful: Create JWT ---
        const payload = {
            userId: user.id,
            email: user.email // Include email in payload for potential use (optional)
        };

        // Sign the token with the secret key and set an expiration time
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' } // Token valid for 1 hour (adjust as needed)
        );

        console.log(`User logged in: ${user.email}, Token issued.`);
        // Respond with success message, token, and basic user info
        res.json({
            message: 'Login successful',
            token: token,
            userId: user.id, // Send userId for frontend use
            name: user.name   // Send name for frontend use (e.g., display welcome message)
        });

    } catch (error) {
        // Handle generic server errors during login
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Internal server error during login' });
    }
});

// --- User Profile Routes ---

/**
 * GET /api/users/me
 * Retrieves the profile information for the currently authenticated user.
 * This route is protected by the authMiddleware.
 */


app.get('/api/users/me', authMiddleware, async (req, res) => {
    // ... (existing implementation) ...
    try {
        const user = await dataStore.findUserById(req.user.userId);
        if (!user) {
             return res.status(404).json({ message: 'User associated with token not found' });
        }
        res.json({ /* ... existing user data response ... */
             id: user.id,
             name: user.name,
             email: user.email,
             locationZip: user.locationZip,
             offerText: user.offerText,
             needText: user.needText,
             offerKeywords: user.offerKeywords || [],
             needKeywords: user.needKeywords || [],
             tokens: user.tokens || STARTING_TOKENS, // Ensure tokens are returned (default if not set)
             createdAt: user.createdAt
         });
    } catch (error) {
        console.error("Get Profile Error (/api/users/me):", error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// --- NEW: User Listing Route ---
// GET /api/users - Retrieves a list of all public user profiles
// Requires authentication to view the community list
app.get('/api/users', authMiddleware, async (req, res) => {
    try {
        // Get the ID of the user making the request (from the verified token)
        const requestingUserId = req.user.userId;

        // Fetch the list of public user data
        const publicUsers = await dataStore.getAllPublicUsers();

        // Optional: Filter out the requesting user from the list they see
        const otherUsers = publicUsers.filter(user => user.id !== requestingUserId);

        res.json(otherUsers); // Send the list of other users
    } catch (error) {
        console.error("Error fetching user list (/api/users):", error);
        res.status(500).json({ message: 'Error fetching user list' });
    }
});

// Requires authentication (only logged-in users can view profiles)
app.get('/api/users/:userId', authMiddleware, async (req, res) => {
    try {
        const requestedUserId = parseInt(req.params.userId, 10); // Get ID from URL parameter

        // Validate the ID
        if (isNaN(requestedUserId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // --- Optional Check: Prevent requesting own profile via this public route? ---
        // const ownUserId = req.user.userId; // ID from the token
        // if (requestedUserId === ownUserId) {
        //     // Redirect or instruct to use /api/users/me? Depends on desired UX.
        //     // For simplicity now, we'll allow it, but return only public data via getPublicProfileById.
        // }
        // --- End Optional Check ---


        // Fetch the specific user's public profile data using the new dataStore function
        const publicProfile = await dataStore.getPublicProfileById(requestedUserId);

        if (!publicProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the public profile data
        res.json(publicProfile);

    } catch (error) {
        console.error(`Error fetching user profile (/api/users/${req.params.userId}):`, error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// --- NEW: Search Route ---
app.get('/api/match/search', authMiddleware, async (req, res) => {
    const searchQuery = req.query.q; // Get search query from query parameter 'q'
    const requestingUserId = req.user.userId; // Get ID from verified token

    // Basic validation for the query parameter
    if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim().length === 0) {
        return res.status(400).json({ message: 'Search query (q) is required.' });
    }

    try {
        // Perform the search using the dataStore function
        const matchingUsers = await dataStore.searchUsersBySkill(searchQuery, requestingUserId);

        // Return the array of matching users (public data)
        res.json(matchingUsers);

    } catch (error) {
        console.error(`Error during skill search (query: ${searchQuery}):`, error);
        res.status(500).json({ message: 'Internal server error during search' });
    }
});

// --- NEW: Interaction Routes (Requests) ---

// POST /api/interactions/requests - Create a new skill request
app.post('/api/interactions/requests', authMiddleware, async (req, res) => {
    const requesterId = req.user.userId; // ID of the logged-in user making the request
    const { providerId, skill, message } = req.body;

    // Basic validation
    if (!providerId || !skill) {
        return res.status(400).json({ message: 'Provider ID and Skill are required.' });
    }
    // Ensure providerId is a number if necessary (depending on how it comes from frontend)
    const providerIdNum = parseInt(providerId, 10);
     if (isNaN(providerIdNum)) {
        return res.status(400).json({ message: 'Invalid Provider ID format.' });
    }


    try {
        const newRequest = await dataStore.addRequest(requesterId, providerIdNum, skill, message);
        res.status(201).json(newRequest); // Return the created request object
    } catch (error) {
        console.error("Error creating skill request:", error);
        // Provide specific feedback if possible (e.g., from validation errors in addRequest)
        if (error.message.includes("required") || error.message.includes("yourself") || error.message.includes("not found")) {
             res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error creating request.' });
        }
    }
});

// GET /api/interactions/requests/incoming - Get requests received by the logged-in user
app.get('/api/interactions/requests/incoming', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    try {
        const incomingRequests = await dataStore.getIncomingRequests(userId);
        res.json(incomingRequests);
    } catch (error) {
        console.error("Error fetching incoming requests:", error);
        res.status(500).json({ message: 'Error fetching incoming requests.' });
    }
});

// GET /api/interactions/requests/outgoing - Get requests made by the logged-in user
app.get('/api/interactions/requests/outgoing', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    try {
        const outgoingRequests = await dataStore.getOutgoingRequests(userId);
        res.json(outgoingRequests);
    } catch (error) {
        console.error("Error fetching outgoing requests:", error);
        res.status(500).json({ message: 'Error fetching outgoing requests.' });
    }
});

// PUT /api/interactions/requests/:requestId - Update the status of a request
app.put('/api/interactions/requests/:requestId', authMiddleware, async (req, res) => {
    const userId = req.user.userId; // User performing the update
    const requestId = parseInt(req.params.requestId, 10);
    const { status } = req.body; // Expecting { "status": "accepted" | "declined" | "completed" }

    if (isNaN(requestId)) {
        return res.status(400).json({ message: 'Invalid Request ID format.' });
    }
    if (!status) {
        return res.status(400).json({ message: 'New status is required.' });
    }

    try {
        const updatedRequest = await dataStore.updateRequestStatus(requestId, status.toLowerCase(), userId);
        res.json(updatedRequest);
    } catch (error) {
        console.error(`Error updating request ${requestId} status:`, error);
         // Handle specific errors (not found, unauthorized, invalid status)
         if (error.message.includes("not found")) {
             res.status(404).json({ message: error.message });
         } else if (error.message.includes("Unauthorized") || error.message.includes("provider")) {
             res.status(403).json({ message: error.message }); // 403 Forbidden
         } else if (error.message.includes("Invalid status") || error.message.includes("already")) {
             res.status(400).json({ message: error.message }); // 400 Bad Request
         }
         else {
             res.status(500).json({ message: 'Internal server error updating request status.' });
         }
    }
});


// --- Placeholder for future routes ---
// app.put('/api/users/me/skills', authMiddleware, ...) // Example: Route to update skills
// app.get('/api/users/:id', ...) // Example: Route to get another user's public profile
// app.get('/api/match/search', authMiddleware, ...) // Example: Route for skill search

// --- Error Handling Middleware (Optional but Recommended) ---
// Example: A simple catch-all error handler (place *after* all routes)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: 'Something broke on the server!' });
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server successfully started and listening on http://localhost:${PORT}`);
    console.log("JWT Secret Loaded:", JWT_SECRET ? "Yes" : "NO (CRITICAL ERROR)"); // Confirm JWT secret loaded status
});