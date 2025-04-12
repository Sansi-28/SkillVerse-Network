// backend/services/nlpProcessor.js
const natural = require('natural');

// --- Corrected Stopwords Import ---
// Get the default English stopwords array directly from the 'natural' module
const stopwords = natural.stopwords;
// --- End Correction ---

// Use a standard word tokenizer
const tokenizer = new natural.WordTokenizer();

/**
 * Extracts meaningful keywords from text.
 * - Converts to lowercase
 * - Tokenizes
 * - Removes common English stopwords
 * - Filters for potentially meaningful words (basic alpha check, min length)
 * @param {string} text The input text (offer or need)
 * @returns {string[]} An array of unique keyword strings
 */
function extractKeywords(text) {
    // Robust check for valid input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return []; // Return empty array for null, undefined, non-string, or empty/whitespace-only strings
    }

    const tokens = tokenizer.tokenize(text.toLowerCase());
    const keywords = new Set(); // Use a Set for automatic uniqueness

    // Check if the stopwords array loaded correctly (basic safeguard)
    if (!stopwords || !Array.isArray(stopwords)) {
        console.error("Error: Stopwords array not loaded correctly from 'natural' library.");
        // Decide how to handle: either return raw tokens or empty array
        // Returning empty might be safer to avoid partial processing
        return [];
    }

    // Iterate through each token
    tokens.forEach(token => {
        // THE problematic line was here (line 27 in the original error trace)
        // Ensure 'stopwords' is defined before calling 'includes'
        // Filter out stopwords and apply basic filtering rules
        if (!stopwords.includes(token) && /^[a-z]{3,}$/.test(token)) {
            // Basic filter: letters only, minimum 3 characters. Adjust regex if needed.
            // Optional: Stemming could be added here using natural.PorterStemmer.stem(token) etc.
            keywords.add(token); // Add the valid keyword (original form, not stemmed)
        }
    });

    return Array.from(keywords); // Convert the Set of unique keywords back to an Array
}

module.exports = { extractKeywords };

// --- Example Usage (for testing this file directly) ---
/*
if (require.main === module) { // Only run if executed directly
    console.log("Testing extractKeywords...");
    console.log("Input: 'I offer help with basic gardening tasks like weeding and planting pots.'");
    console.log("Output:", extractKeywords("I offer help with basic gardening tasks like weeding and planting pots."));
    // Expected approx: [ 'offer', 'help', 'basic', 'gardening', 'tasks', 'weeding', 'planting', 'pots' ]

    console.log("\nInput: 'Need someone to help me set up my new printer and computer'");
    console.log("Output:", extractKeywords("Need someone to help me set up my new printer and computer"));
    // Expected approx: [ 'need', 'someone', 'help', 'set', 'new', 'printer', 'computer' ]

    console.log("\nInput: 'Looking for math tutoring, specifically algebra.'");
    console.log("Output:", extractKeywords("Looking for math tutoring, specifically algebra."));
     // Expected approx: [ 'looking', 'math', 'tutoring', 'specifically', 'algebra' ]

     console.log("\nInput: null");
     console.log("Output:", extractKeywords(null)); // Expected: []

     console.log("\nInput: ''");
     console.log("Output:", extractKeywords('')); // Expected: []

     console.log("\nInput: '  '");
     console.log("Output:", extractKeywords('  ')); // Expected: []
}
*/