// backend/dataStore.js
const bcrypt = require('bcryptjs');
const { extractKeywords } = require('./services/nlpProcessor'); // Import the processor

const users = []; // Array to hold user objects
let userIdCounter = 0;

// --- Constants ---
const STARTING_TOKENS = 5; // Tokens new users start with
const TOKENS_PER_COMPLETION = 1; // Tokens awarded for completing a request




async function addUser(name, email, password, locationZip, offerText, needText) {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    userIdCounter++;

    // --- NEW: Process keywords ---
    const offerKeywords = extractKeywords(offerText);
    const needKeywords = extractKeywords(needText);
    // --- END NEW ---

    const newUser = {
        id: userIdCounter,
        name,
        email: email.toLowerCase(),
        passwordHash,
        locationZip,
        offerText, // Keep raw text
        needText,  // Keep raw text
        offerKeywords, // Store processed keywords
        needKeywords,  // Store processed keywords
        tokens: STARTING_TOKENS, // Starting tokens
        createdAt: new Date()
    };
    users.push(newUser);
    console.log(`User added: ${newUser.email}, OfferKeywords: ${newUser.offerKeywords.join(', ')}, NeedKeywords: ${newUser.needKeywords.join(', ')}`);
    return { id: newUser.id, email: newUser.email, name: newUser.name };
}

async function findUserByEmail(email) {
    return users.find(user => user.email === email.toLowerCase());
}

async function findUserById(id) {
    return users.find(user => user.id === id);
}


/**
 * Gets the token balance for a user.
 * @param {number} userId
 * @returns {Promise<number>} Current token balance.
 */
async function getUserTokenBalance(userId) {
    const user = await findUserById(userId);
    if (!user) throw new Error("User not found for balance check.");
    return user.tokens || 0; // Return 0 if tokens field somehow missing
}

/**
 * Updates a user's token balance directly (Use with caution - prefer transfer).
 * @param {number} userId
 * @param {number} amountChange - Positive to add, negative to subtract.
 * @returns {Promise<number>} The new token balance.
 */
async function updateUserTokenBalance(userId, amountChange) {
    const user = await findUserById(userId);
    if (!user) throw new Error("User not found for token update.");

    // Ensure tokens is a number
    if (typeof user.tokens !== 'number') {
        user.tokens = 0;
    }

    // Basic check for sufficient funds if subtracting
    if (amountChange < 0 && user.tokens < Math.abs(amountChange)) {
        throw new Error("Insufficient tokens for transaction.");
    }

    user.tokens += amountChange;
    console.log(`User ${userId} token balance updated by ${amountChange}. New balance: ${user.tokens}`);
    return user.tokens;
}

/**
 * Transfers tokens between two users (simulates atomicity).
 * @param {number} fromUserId - User spending/losing tokens.
 * @param {number} toUserId - User receiving tokens.
 * @param {number} amount - The positive amount to transfer.
 * @returns {Promise<boolean>} True if transfer was successful.
 */
async function transferTokens(fromUserId, toUserId, amount) {
    if (amount <= 0) throw new Error("Transfer amount must be positive.");
    if (fromUserId === toUserId) throw new Error("Cannot transfer tokens to yourself.");

    const fromUser = await findUserById(fromUserId);
    const toUser = await findUserById(toUserId);

    if (!fromUser || !toUser) throw new Error("One or both users not found for transfer.");

     // Ensure tokens are numbers
     if (typeof fromUser.tokens !== 'number') fromUser.tokens = 0;
     if (typeof toUser.tokens !== 'number') toUser.tokens = 0;


    // Check sufficient funds *before* attempting any change
    if (fromUser.tokens < amount) {
        console.error(`Transfer failed: User ${fromUserId} has insufficient tokens (${fromUser.tokens} < ${amount})`);
        throw new Error("Insufficient tokens for transfer.");
    }

    // --- Simulate Transaction ---
    try {
        // Decrement sender
        fromUser.tokens -= amount;
        // Increment receiver
        toUser.tokens += amount;
        console.log(`Tokens transferred: ${amount} from User ${fromUserId} (${fromUser.tokens}) to User ${toUserId} (${toUser.tokens})`);
        return true;
    } catch (error) {
        // In a real DB, you'd rollback here. In memory, we might have partial state change if error occurs mid-way.
        // For simplicity, we assume the +/- operations themselves won't fail here.
        // If they did, we'd need to revert the first change.
        console.error("Error during token transfer logic:", error);
         // Attempt to revert (basic example) - may not always work depending on where error happened
         // if(/* check if decrement happened */) fromUser.tokens += amount;
         // if(/* check if increment happened */) toUser.tokens -= amount;
        throw new Error("Token transfer failed internally."); // Re-throw
    }
    // --- End Simulation ---
}

// --- NEW: Function to update skills (for later use) ---
// We won't implement the route for this yet, but the dataStore function is useful
async function updateUserSkills(userId, offerText, needText) {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    user.offerText = offerText;
    user.needText = needText;
    user.offerKeywords = extractKeywords(offerText);
    user.needKeywords = extractKeywords(needText);

    console.log(`Updated skills for user ${userId}: OfferKeywords: ${user.offerKeywords.join(', ')}, NeedKeywords: ${user.needKeywords.join(', ')}`);
    // Return relevant updated info if needed
    return {
        offerKeywords: user.offerKeywords,
        needKeywords: user.needKeywords
    };
}

// --- NEW: Function to get publicly viewable user data ---
async function getAllPublicUsers() {
    // Map over the users array to create a new array with only public fields
    return users.map(user => ({
        id: user.id,
        name: user.name,
        locationZip: user.locationZip,
        // Optionally include offerKeywords as a preview (or omit if preferred)
        offerKeywords: user.offerKeywords || [],
        // DO NOT INCLUDE: email, passwordHash, needKeywords, raw text, etc.
        createdAt: user.createdAt // Member since date might be okay
    }));
}

// Function to get single public profile by ID ---
async function getPublicProfileById(userId) {
    const user = await findUserById(userId); // Use existing finder
    if (!user) {
        return null; // Indicate user not found
    }

    // Construct and return only the public fields
    return {
        id: user.id,
        name: user.name,
        locationZip: user.locationZip,
        offerText: user.offerText, // Include raw offer text
        offerKeywords: user.offerKeywords || [], // Include offer keywords
        // Explicitly OMIT email, passwordHash, needText, needKeywords
        createdAt: user.createdAt // Member since date
    };
}


// Simple placeholder for zip code proximity (move or improve later if needed)
const NEARBY_ZIPS = {
    "90210": ["90211", "90212"], "90211": ["90210"], "90212": ["90210"],
    "10001": ["10002", "10011"], "10002": ["10001"], "10011": ["10001"],
    // Add more dummy relationships as needed for testing
};

/**
 * Checks if two zip codes are considered "nearby".
 * @param {string} zip1
 * @param {string} zip2
 * @returns {boolean} True if nearby, false otherwise.
 */
function isNearby(zip1, zip2) {
    if (!zip1 || !zip2) return false; // Cannot compare if one is missing
    if (zip1 === zip2) return true; // Same zip code is always nearby
    // Check relationships in both directions
    return (NEARBY_ZIPS[zip1] && NEARBY_ZIPS[zip1].includes(zip2)) ||
           (NEARBY_ZIPS[zip2] && NEARBY_ZIPS[zip2].includes(zip1));
}

// --- NEW: Search Function ---
/**
 * Searches for users offering a specific skill keyword nearby.
 * @param {string} query The search term (skill keyword).
 * @param {number} requestingUserId The ID of the user performing the search.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of public user objects matching the criteria.
 */
async function searchUsersBySkill(query, requestingUserId) {
    const requestingUser = await findUserById(requestingUserId);
    if (!requestingUser) {
        console.error(`Search failed: Requesting user ID ${requestingUserId} not found.`);
        return []; // Cannot perform search without knowing requester's location
    }
    const requestingUserZip = requestingUser.locationZip;
    const searchQuery = query ? query.trim().toLowerCase() : ''; // Normalize search query

    if (!searchQuery) {
        return []; // Return empty if search query is empty
    }

    console.log(`Searching for skill "${searchQuery}" near zip ${requestingUserZip} (excluding user ${requestingUserId})`);

    const matches = [];
    const allUsers = await getAllPublicUsers(); // Use the function returning public data

    allUsers.forEach(user => {
        // 1. Exclude self
        if (user.id === requestingUserId) {
            return; // Skip the requesting user
        }

        // 2. Check location proximity
        if (!isNearby(requestingUserZip, user.locationZip)) {
            return; // Skip user if not nearby
        }

        // 3. Check if offered keywords contain the search query (case-insensitive)
        const offerKeywordsLower = (user.offerKeywords || []).map(k => k.toLowerCase());
        if (offerKeywordsLower.includes(searchQuery)) {
            matches.push(user); // Add user (already public data) to matches
        }
    });

    console.log(`Found ${matches.length} matches for "${searchQuery}" near ${requestingUserZip}.`);
    return matches;
}


// --- NEW: Requests Data Store ---
const requests = []; // Array to hold skill request objects
let requestIdCounter = 0;

/**
 * Creates a new skill exchange request.
 * @param {number} requesterId - ID of the user making the request.
 * @param {number} providerId - ID of the user who offers the skill.
 * @param {string} skill - The specific skill being requested (e.g., a keyword).
 * @param {string} message - A short message from the requester.
 * @returns {Promise<object>} The newly created request object.
 */
async function addRequest(requesterId, providerId, skill, message) {
    // Basic validation (could add more checks, e.g., if provider actually offers skill)
    if (!requesterId || !providerId || !skill) {
        throw new Error("Requester ID, Provider ID, and Skill are required.");
    }
    // Prevent requesting from self
    if (requesterId === providerId) {
        throw new Error("Cannot request a skill from yourself.");
    }
    // Ensure users exist (optional but good)
    const requester = await findUserById(requesterId);
    const provider = await findUserById(providerId);
    if (!requester || !provider) {
        throw new Error("Requester or Provider not found.");
    }

    requestIdCounter++;
    const newRequest = {
        id: requestIdCounter,
        requesterId,
        providerId,
        skill: skill.trim(), // Clean up skill string
        message: message || "", // Default to empty message
        status: 'pending', // Initial status
        createdAt: new Date(),
        updatedAt: new Date()
    };
    requests.push(newRequest);
    console.log(`New request created: ID ${newRequest.id}, ${requester.name} -> ${provider.name} for "${newRequest.skill}"`);
    return newRequest;
}

/**
 * Finds a request by its ID.
 * @param {number} requestId
 * @returns {Promise<object|null>} The request object or null if not found.
 */
async function findRequestById(requestId) {
    return requests.find(req => req.id === requestId);
}

/**
 * Updates the status of a request.
 * @param {number} requestId - The ID of the request to update.
 * @param {string} newStatus - The new status ('accepted', 'declined', 'completed').
 * @param {number} userIdPerformingUpdate - The ID of the user attempting the update (should be provider or involved party).
 * @returns {Promise<object>} The updated request object.
 */
async function updateRequestStatus(requestId, newStatus, userIdPerformingUpdate) {
    const request = await findRequestById(requestId);
    if (!request) {
        throw new Error("Request not found.");
    }

    // --- Authorization Check ---
    // Typically, only the provider should accept/decline/complete.
    // Requester might cancel (could add 'cancelled' status later).
    if (request.providerId !== userIdPerformingUpdate) {
         // Allow requester to maybe mark as completed? Or only provider? Let's restrict for now.
         // if (newStatus === 'completed' && request.requesterId === userIdPerformingUpdate) { /* Allow */ } else
        throw new Error("Unauthorized: Only the skill provider can update the request status.");
    }

    // Validate new status
    const allowedStatusUpdates = ['accepted', 'declined', 'completed']; // 'pending' is initial
    if (!allowedStatusUpdates.includes(newStatus)) {
        throw new Error(`Invalid status update: "${newStatus}"`);
    }

    // Check state transitions (e.g., can't accept a completed request)
    if (request.status === 'declined' || request.status === 'completed') {
         throw new Error(`Cannot update status of a request that is already ${request.status}.`);

         if (newStatus === 'completed' && request.status !== 'accepted') {
            throw new Error("Request must be 'accepted' before it can be marked 'completed'.");
        }
    
    
        // --- Trigger Token Transfer on Completion ---
        if (newStatus === 'completed' && request.status === 'accepted') { // Check previous state too
            try {
                // Transfer from requester to provider
                await transferTokens(request.requesterId, request.providerId, TOKENS_PER_COMPLETION);
                console.log(`Token transfer successful for completed request ${requestId}.`);
                // Only update status if token transfer succeeds
                request.status = newStatus;
                request.updatedAt = new Date();
            } catch (tokenError) {
                console.error(`Token transfer failed for request ${requestId}:`, tokenError);
                // Do not update the request status if token transfer fails
                // Rethrow or handle specifically
                throw new Error(`Failed to complete request: ${tokenError.message}`);
            }

        } else {
            // Update status directly for non-completion updates (accept/decline)
            request.status = newStatus;
            request.updatedAt = new Date();
        }
    // If declining an accepted request? Allow for now, or add 'cancelled_by_provider' etc.

    request.status = newStatus;
    request.updatedAt = new Date();
}
    console.log(`Request ID ${requestId} status updated to ${newStatus} by user ${userIdPerformingUpdate}`);

    // --- TODO LATER: Trigger token transfer if status is 'completed' ---
    // if (newStatus === 'completed') {
    //     await tokenService.transferSkillToken(request.requesterId, request.providerId, 1); // Example: 1 token
    // }
    // ---

    return request;
}

/**
 * Gets all requests where the given userId is the provider (incoming requests).
 * @param {number} providerId
 * @returns {Promise<Array<object>>} Array of incoming request objects.
 */
async function getIncomingRequests(providerId) {
    // We need requester names, so let's add them
    const incoming = requests.filter(req => req.providerId === providerId);
    // Enhance with requester names (could be done more efficiently with joins in a real DB)
    const enhancedRequests = await Promise.all(incoming.map(async (req) => {
        const requester = await findUserById(req.requesterId);
        return { ...req, requesterName: requester ? requester.name : 'Unknown User' };
    }));
    return enhancedRequests;
}

/**
 * Gets all requests where the given userId is the requester (outgoing requests).
 * @param {number} requesterId
 * @returns {Promise<Array<object>>} Array of outgoing request objects.
 */
async function getOutgoingRequests(requesterId) {
    // Enhance with provider names
    const outgoing = requests.filter(req => req.requesterId === requesterId);
    const enhancedRequests = await Promise.all(outgoing.map(async (req) => {
        const provider = await findUserById(req.providerId);
        return { ...req, providerName: provider ? provider.name : 'Unknown User' };
    }));
    return enhancedRequests;
}


// --- END NEW ---


module.exports = {
    addUser,
    findUserByEmail,
    findUserById,
    updateUserSkills, // Export the new function
    getAllPublicUsers,
    getPublicProfileById,
    searchUsersBySkill,
    addRequest,
    findRequestById,
    updateRequestStatus,
    getIncomingRequests,
    getOutgoingRequests,
    getUserTokenBalance,
    updateUserTokenBalance,
    transferTokens
};