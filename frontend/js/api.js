// frontend/js/api.js
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust if your backend runs elsewhere

// Helper function to get the auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// --- Auth API Calls ---

async function signupUser(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return { ok: response.ok, status: response.status, data: await response.json() };
}

async function loginUser(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
     return { ok: response.ok, status: response.status, data: await response.json() };
}

// --- User API Calls ---

async function getUserProfile() {
    const token = getAuthToken();
    if (!token) {
        // Handle case where user tries to access profile without being logged in
        console.error("No auth token found for getUserProfile");
        return { ok: false, status: 401, data: { message: 'Not authenticated' } };
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send the token in the header
        },
    });
     return { ok: response.ok, status: response.status, data: await response.json() };
}

//new function to get all users

async function getAllUsers() {
    const token = getAuthToken();
    if (!token) {
        console.error("No auth token found for getAllUsers");
        return { ok: false, status: 401, data: { message: 'Not authenticated' } };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users`, { // Correct endpoint
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send token
            },
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data: data };
    } catch (error) {
        console.error("Fetch error in getAllUsers:", error);
        return { ok: false, status: 500, data: { message: 'Network error or server unreachable' } };
    }
}

// --- NEW: Function to search for users by skill ---
async function searchUsers(query) {
    const token = getAuthToken();
    if (!token) {
        console.error("No auth token found for searchUsers");
        return { ok: false, status: 401, data: { message: 'Not authenticated' } };
    }

    // Basic validation
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        console.error("Search query cannot be empty");
        // Return an empty array directly or indicate bad request
        return { ok: true, status: 200, data: [] }; // Return empty array for empty query
    }

    try {
        // Encode the query parameter correctly for the URL
        const encodedQuery = encodeURIComponent(query.trim());
        const response = await fetch(`${API_BASE_URL}/match/search?q=${encodedQuery}`, { // Use the new search endpoint
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send token
            },
        });
        const data = await response.json();
        // Assuming the backend returns an array on success, even if empty
        return { ok: response.ok, status: response.status, data: data };
    } catch (error) {
        console.error(`Fetch error in searchUsers (query: ${query}):`, error);
        return { ok: false, status: 500, data: { message: 'Network error or server unreachable' } };
    }
}

// --- NEW: Function to get a specific user's public profile ---
async function getUserPublicProfile(userId) {
    const token = getAuthToken();
    if (!token) {
        console.error(`No auth token found for getUserPublicProfile(${userId})`);
        return { ok: false, status: 401, data: { message: 'Not authenticated' } };
    }

    // Validate userId format briefly on frontend too (optional)
    if (!userId || isNaN(parseInt(userId, 10))) {
         console.error(`Invalid userId provided to getUserPublicProfile: ${userId}`);
         return { ok: false, status: 400, data: { message: 'Invalid user ID format' } };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, { // Use the new endpoint
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send token
            },
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data: data };
    } catch (error) {
        console.error(`Fetch error in getUserPublicProfile(${userId}):`, error);
        return { ok: false, status: 500, data: { message: 'Network error or server unreachable' } };
    }
}


// --- NEW: Interaction (Request) API Calls ---

/**
 * Creates a new skill request.
 * @param {object} requestData - { providerId: number, skill: string, message?: string }
 * @returns {Promise<object>} - The API response { ok, status, data }
 */
async function createSkillRequest(requestData) {
    const token = getAuthToken();
    if (!token) return { ok: false, status: 401, data: { message: 'Not authenticated' } };

    // Basic validation
    if (!requestData || !requestData.providerId || !requestData.skill) {
        return { ok: false, status: 400, data: { message: 'Provider ID and skill are required.' } };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/interactions/requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data: data };
    } catch (error) {
        console.error("Fetch error in createSkillRequest:", error);
        return { ok: false, status: 500, data: { message: 'Network error or server unreachable' } };
    }
}

/**
 * Fetches incoming skill requests for the logged-in user.
 * @returns {Promise<object>} - The API response { ok, status, data }
 */
async function getIncomingSkillRequests() {
    const token = getAuthToken();
    if (!token) return { ok: false, status: 401, data: { message: 'Not authenticated' } };

    try {
        const response = await fetch(`${API_BASE_URL}/interactions/requests/incoming`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data: data };
    } catch (error) {
        console.error("Fetch error in getIncomingSkillRequests:", error);
        return { ok: false, status: 500, data: { message: 'Network error or server unreachable' } };
    }
}

/**
 * Fetches outgoing skill requests made by the logged-in user.
 * @returns {Promise<object>} - The API response { ok, status, data }
 */
async function getOutgoingSkillRequests() {
    const token = getAuthToken();
    if (!token) return { ok: false, status: 401, data: { message: 'Not authenticated' } };

    try {
        const response = await fetch(`${API_BASE_URL}/interactions/requests/outgoing`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data: data };
    } catch (error) {
        console.error("Fetch error in getOutgoingSkillRequests:", error);
        return { ok: false, status: 500, data: { message: 'Network error or server unreachable' } };
    }
}

/**
 * Updates the status of a specific skill request.
 * @param {number} requestId - The ID of the request to update.
 * @param {string} newStatus - The desired new status ('accepted', 'declined', 'completed').
 * @returns {Promise<object>} - The API response { ok, status, data }
 */
async function updateSkillRequestStatus(requestId, newStatus) {
    const token = getAuthToken();
    if (!token) return { ok: false, status: 401, data: { message: 'Not authenticated' } };

     if (!requestId || !newStatus) {
        return { ok: false, status: 400, data: { message: 'Request ID and new status are required.' } };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/interactions/requests/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus.toLowerCase() }) // Send status in body
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data: data };
    } catch (error) {
        console.error(`Fetch error in updateSkillRequestStatus (ID: ${requestId}):`, error);
        return { ok: false, status: 500, data: { message: 'Network error or server unreachable' } };
    }
}