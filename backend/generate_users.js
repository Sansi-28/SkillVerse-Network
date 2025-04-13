// backend/generate_users.js

const { faker } = require('@faker-js/faker');
// Ensure you are importing the correct dataStore module path
const dataStore = require('./dataStore'); // Assumes dataStore.js is in the same directory

// --- Configuration ---
const NUM_USERS_TO_CREATE = 100; // Number of users to generate
const DUMMY_PASSWORD = 'password123'; // Consistent password for all generated users

// Use a predefined list of valid Zip Codes relevant to your nearby logic
// Ensure these Zip Codes exist in your NEARBY_ZIPS map in dataStore.js for effective testing
const VALID_ZIP_CODES = [
    "90210", "90211", "90212", // Group 1 (Nearby)
    "10001", "10002", "10011", // Group 2 (Nearby)
    "60601", "60605",         // Group 3 (Nearby)
    "75001", "75201",         // Group 4 (Nearby)
    "94107", "94110",         // Group 5 (Nearby) - Added more variety
    "30303", "30305"          // Group 6 (Nearby) - Added more variety
];
if (VALID_ZIP_CODES.length === 0) {
    console.error("Error: VALID_ZIP_CODES array cannot be empty. Please add valid Zip Codes.");
    process.exit(1);
}

// Define a pool of potential skills for variety
const SKILLS_POOL = [
    // Tech
    "javascript", "python", "react", "nodejs", "html", "css", "sql", "database design",
    "data analysis", "machine learning basics", "git version control", "api integration",
    "debugging", "web development", "app development basics", "tech support", "printer setup",
    // Creative
    "graphic design", "logo design", "ui/ux basics", "video editing", "photo editing",
    "content writing", "blogging", "copywriting", "creative writing", "digital illustration",
    "watercolor painting", "acrylic painting", "drawing", "sketching", "music composition basics",
    // Practical / Home
    "gardening", "indoor plants care", "basic plumbing", "minor electrical repair", "furniture assembly",
    "ikea furniture assembly", "picture hanging", "home organization", "decluttering", "cooking", "baking",
    "meal prep", "sewing basics", "bike repair", "car washing", "budgeting",
    // Learning / Languages / Other
    "tutoring math", "tutoring physics", "tutoring chemistry", "language practice spanish",
    "language practice french", "language practice german", "public speaking", "presentation skills",
    "resume writing", "interview preparation", "yoga instruction", "meditation guidance",
    "dog walking", "cat sitting", "proofreading", "event planning basics"
];
if (SKILLS_POOL.length === 0) {
    console.warn("Warning: SKILLS_POOL is empty. Users will have no skills generated.");
}


// Helper function to get random items from an array, ensuring unique items
function getRandomUniqueItems(arr, count) {
    if (!arr || arr.length === 0) return [];
    const maxCount = Math.min(count, arr.length); // Cannot pick more items than available
    const shuffled = [...arr].sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, maxCount); // Get first 'count' items
}

// --- Main Generation Function ---
async function generateDummyUsers() {
    console.log(`--- Starting Dummy User Generation (${NUM_USERS_TO_CREATE} users) ---`);
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < NUM_USERS_TO_CREATE; i++) {
        // --- Generate User Data ---
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const name = `${firstName} ${lastName}`;
        // Create a unique email (important!)
        const email = `user${i}_${firstName.toLowerCase()}${faker.number.int({min: 100, max: 999})}@example.com`;
        const locationZip = faker.helpers.arrayElement(VALID_ZIP_CODES); // Guaranteed valid Zip

        // Generate skills - ensure diversity and handle zero skills case
        const numOfferSkills = faker.number.int({ min: 1, max: 5 }); // Ensure at least 1 offered skill
        const numNeedSkills = faker.number.int({ min: 0, max: 4 }); // Can need 0 skills

        // Get unique skills for offer and need (prevent offering/needing the exact same skill)
        const allChosenSkills = getRandomUniqueItems(SKILLS_POOL, numOfferSkills + numNeedSkills);
        const offerSkills = allChosenSkills.slice(0, numOfferSkills);
        const needSkills = allChosenSkills.slice(numOfferSkills);

        // Create descriptive text - ensuring they are always strings
        const offerText = offerSkills.length > 0
            ? `I have experience in and can offer help with: ${offerSkills.join(', ')}.`
            : "Currently building my skillset to offer!"; // Handle case of 0 offer skills (though unlikely with min:1)
        const needText = needSkills.length > 0
            ? `I'm looking to learn or get assistance with: ${needSkills.join(', ')}.`
            : "Open to discovering new skills to learn."; // Handle case of 0 needed skills

        // --- Data Validation Log (Optional) ---
        // console.log(`Generating User ${i + 1}: Name=${name}, Email=${email}, Zip=${locationZip}, Offers=[${offerSkills.join(', ')}], Needs=[${needSkills.join(', ')}]`);

        // --- Add User to Database ---
        try {
            // Pass plain password - addUser handles hashing
            await dataStore.addUser(
                name,
                email,
                DUMMY_PASSWORD,
                locationZip,
                offerText, // Guaranteed to be a string
                needText   // Guaranteed to be a string
            );
            successCount++;

            // Log progress periodically
             if ((i + 1) % 10 === 0 || i === NUM_USERS_TO_CREATE - 1) {
                 console.log(`--> Generated ${i + 1}/${NUM_USERS_TO_CREATE} users...`);
             }

        } catch (error) {
            failureCount++;
            // Log specific errors, especially email uniqueness constraints
            console.error(`--> FAILED to create user ${i + 1} (${email}): ${error.message}`);
            // Continue to the next user even if one fails
        }
    } // End for loop

    console.log(`--- Dummy User Generation Complete ---`);
    console.log(`  Successfully created: ${successCount} users.`);
    console.log(`  Failed to create:   ${failureCount} users.`);
     if (failureCount > 0) {
         console.warn("  Failures might be due to unforeseen database issues or edge cases.");
     }
}

// --- Execute the Generation Function ---
generateDummyUsers()
    .then(() => {
        console.log("Script finished successfully.");
        // Force exit if the script hangs due to open DB handles (common with sqlite3)
        process.exit(0);
    })
    .catch((err) => {
        console.error("An critical error occurred during script execution:", err);
        // Exit with an error code
        process.exit(1);
    });