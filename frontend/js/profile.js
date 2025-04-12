// frontend/js/profile.js

// --- Global Variables ---
// Stores the ID of the user whose profile is currently being displayed
let viewedUserId = null;
// Stores the ID of the user who is currently logged in
let loggedInUserId = null;

// --- Main Execution Logic ---
// Runs when the DOM is fully loaded and parsed
document.addEventListener('DOMContentLoaded', async () => {
    // Get authentication token from browser's local storage
    const token = localStorage.getItem('authToken');
    // Get the element used for displaying status or error messages
    const messageEl = document.getElementById('message');

    // 1. Check if user is logged in (token exists)
    if (!token) {
        // If no token, redirect to the login page immediately
        console.log("No token found, redirecting to login.");
        window.location.href = 'login.html';
        return; // Stop further execution in this script
    }

    // --- 2. Get Logged-in User's ID ---
    // Necessary to determine if the profile being viewed belongs to the logged-in user
    try {
        // Fetch minimal data for the logged-in user (/api/users/me)
        const meResult = await getUserProfile(); // Defined in api.js
        if (meResult.ok) {
            // Store the logged-in user's ID if fetch was successful
            loggedInUserId = meResult.data.id;
        } else {
            // Handle cases where fetching own profile fails (e.g., token expired)
            console.error("Could not verify logged-in user:", meResult.data.message);
            if (meResult.status === 401) { // Specifically handle unauthorized (likely expired token)
                handleLogout(); // Log the user out and redirect
                return; // Stop execution
            }
            // Display error for other issues fetching own profile
            displayMessage('message', 'Error verifying your session. Please try again.', true);
            return; // Stop execution
        }
    } catch (error) {
        // Handle network or unexpected errors during the fetch
        console.error("Network or unexpected error fetching logged-in user ID:", error);
        displayMessage('message', 'Network error verifying session. Please check connection.', true);
        return; // Stop execution
    }

    // --- 3. Determine Whose Profile to View ---
    // Check URL parameters for a 'userId'
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userId');
    let isViewingOtherUserProfile = false;

    // If a valid userId is found in the URL, attempt to view that user's profile
    if (userIdFromUrl && !isNaN(parseInt(userIdFromUrl, 10))) {
        viewedUserId = parseInt(userIdFromUrl, 10);
        // Check if the ID from URL is different from the logged-in user's ID
        if (viewedUserId !== loggedInUserId) {
            isViewingOtherUserProfile = true;
            console.log(`Attempting to view profile for other user ID: ${viewedUserId}`);
        } else {
            // User is trying to view their own profile via URL param (e.g., profile.html?userId=MY_ID)
            // Treat this the same as viewing own profile directly
            viewedUserId = loggedInUserId;
            console.log(`Viewing own profile (via URL param, user ID: ${viewedUserId})`);
        }
    } else {
        // No valid userId in URL, so view the logged-in user's own profile
        viewedUserId = loggedInUserId;
        console.log(`Viewing own profile directly (user ID: ${viewedUserId})`);
    }

    // --- 4. Fetch Appropriate Profile Data ---
    let profileDataResult;
    if (isViewingOtherUserProfile) {
        // Fetch public data for the other user
        profileDataResult = await getUserPublicProfile(viewedUserId); // Defined in api.js
    } else {
        // Fetch full data for the logged-in user's own profile
        profileDataResult = await getUserProfile(); // Defined in api.js
    }

    // --- 5. Process and Display Profile Data ---
    if (profileDataResult && profileDataResult.ok) {
        // If fetch was successful, display the data
        const user = profileDataResult.data;
        displayProfileData(user); // Populate HTML elements with user data
        updateUIForViewMode();    // Show/hide elements based on self vs. other view


        if (isViewingOtherUserProfile) {
            const requestButton = document.getElementById('request-skill-button');
            if (requestButton) {
                 // Store provider info needed for the request
                requestButton.dataset.providerId = viewedUserId; // Store ID on button
                requestButton.addEventListener('click', handleRequestSkillClick);
            } else {
                console.warn("Request skill button not found.");
            }
        }

    } else {
        // Handle errors during profile data fetch (self or other)
        const errorMessage = profileDataResult?.data?.message || 'Could not load profile data.';
        console.error('Failed to fetch profile data:', errorMessage);
        if (messageEl) {
            displayMessage('message', `Error loading profile: ${errorMessage}`, true);
        }

        // Specific handling for common errors
        if (profileDataResult?.status === 404) {
            document.getElementById('page-title').textContent = 'User Not Found';
            document.getElementById('profile-info').innerHTML = '<p>This user profile does not exist.</p>';
             // Hide elements that wouldn't make sense for a non-existent user
             updateUIForViewMode(); // This will hide self-only elements
        } else if (profileDataResult?.status === 401) {
             // If authentication failed (e.g., viewing other profile but token expired)
            handleLogout(); // Log out
        }
    }


    // --- 6. Setup Event Listeners and Fetch Initial Lists (If Viewing Self) ---
    if (!isViewingOtherUserProfile) { // Only if viewing own profile
        // Add Event Listener for Search Form
        const searchForm = document.getElementById('skill-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', handleSkillSearch);
        } else {
             console.warn("Search form not found.");
        }

        // Fetch Request Lists ---
        fetchAndDisplayIncomingRequests();
        fetchAndDisplayOutgoingRequests();  

        // Fetch Community List
        fetchAndDisplayUserList();
    }

     // Add Logout Button Event Listener (Logout button itself is controlled by updateUIForViewMode)
     const logoutButton = document.getElementById('logout-button');
     if (logoutButton) {
         logoutButton.addEventListener('click', handleLogout);
     }

}); // --- End of DOMContentLoaded ---

// ===========================================
// --- Request Handling Functions ---
// ===========================================

/**
 * Fetches incoming requests and triggers display.
 */
async function fetchAndDisplayIncomingRequests() {
    const container = document.getElementById('incoming-requests-container');
    if (!container) { console.warn("Incoming requests container not found."); return; }
    container.innerHTML = '<p>Loading incoming requests...</p>';

    try {
        const result = await getIncomingSkillRequests(); // API call
        if (result.ok) {
            displayRequests(result.data, 'incoming-requests-container', 'incoming');
        } else {
            console.error("Failed to fetch incoming requests:", result.data.message);
            container.innerHTML = `<p style="color: red;">Could not load incoming requests: ${result.data.message}</p>`;
        }
    } catch (error) {
        console.error("Error fetching incoming requests:", error);
        container.innerHTML = '<p style="color: red;">Network error loading incoming requests.</p>';
    }
}

/**
 * Fetches outgoing requests and triggers display.
 */
async function fetchAndDisplayOutgoingRequests() {
    const container = document.getElementById('outgoing-requests-container');
    if (!container) { console.warn("Outgoing requests container not found."); return; }
    container.innerHTML = '<p>Loading outgoing requests...</p>';

    try {
        const result = await getOutgoingSkillRequests(); // API call
        if (result.ok) {
            displayRequests(result.data, 'outgoing-requests-container', 'outgoing');
        } else {
            console.error("Failed to fetch outgoing requests:", result.data.message);
            container.innerHTML = `<p style="color: red;">Could not load outgoing requests: ${result.data.message}</p>`;
        }
    } catch (error) {
        console.error("Error fetching outgoing requests:", error);
        container.innerHTML = '<p style="color: red;">Network error loading outgoing requests.</p>';
    }
}

/**
 * Renders a list of requests (incoming or outgoing) into the specified container.
 * @param {Array<object>} requests - Array of request objects (enhanced with names).
 * @param {string} containerId - The ID of the HTML container element.
 * @param {'incoming' | 'outgoing'} type - The type of request list being displayed.
 */
function displayRequests(requests, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear loading/previous content

    if (!requests || requests.length === 0) {
        container.innerHTML = `<p>No ${type} requests found.</p>`;
        return;
    }

    // Sort requests - maybe newest first?
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    requests.forEach(req => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'request-item';
        itemDiv.dataset.requestId = req.id; // Store ID for potential updates

        const skillP = document.createElement('p');
        skillP.innerHTML = `Skill: <span class="skill">${req.skill || 'N/A'}</span>`;

        const userP = document.createElement('p');
        if (type === 'incoming') {
            userP.innerHTML = `From: <span class="user-name">${req.requesterName || 'Unknown'}</span>`;
        } else { // outgoing
            userP.innerHTML = `To: <span class="user-name">${req.providerName || 'Unknown'}</span>`;
        }

        const messageP = document.createElement('p');
        messageP.className = 'message';
        messageP.textContent = req.message || ''; // Display message if present

        const statusP = document.createElement('p');
        const statusSpan = document.createElement('span');
        statusSpan.className = `status ${req.status}`; // e.g., "status pending"
        statusSpan.textContent = req.status;
        statusP.appendChild(statusSpan);
         // Add timestamps
        statusP.innerHTML += `<br><small>Created: ${new Date(req.createdAt).toLocaleString()}</small>`;
        if (req.createdAt !== req.updatedAt) { // Show updated only if different
             statusP.innerHTML += `<br><small>Updated: ${new Date(req.updatedAt).toLocaleString()}</small>`;
        }


        itemDiv.appendChild(skillP);
        itemDiv.appendChild(userP);
        itemDiv.appendChild(messageP); // Add message paragraph
        itemDiv.appendChild(statusP);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';
        let addedActions = false;


        // --- Add Action Buttons (Only for Incoming Pending Requests) ---
        if (type === 'incoming' && req.status === 'pending') {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'actions';

            const acceptButton = document.createElement('button');
            acceptButton.textContent = 'Accept';
            acceptButton.className = 'accept-button';
            acceptButton.dataset.requestId = req.id; // Store ID on button
            acceptButton.addEventListener('click', handleUpdateRequestStatus); // Attach listener

            const declineButton = document.createElement('button');
            declineButton.textContent = 'Decline';
            declineButton.className = 'decline-button';
            declineButton.dataset.requestId = req.id; // Store ID on button
            declineButton.addEventListener('click', handleUpdateRequestStatus); // Attach listener

            actionsDiv.appendChild(acceptButton);
            actionsDiv.appendChild(declineButton);
            itemDiv.appendChild(actionsDiv);
            addedActions = true;
        }

        
        // --- NEW: Add Mark Completed for Incoming Accepted ---
        if (type === 'incoming' && req.status === 'accepted') {
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Mark Completed';
            completeButton.className = 'complete-button'; // Add styling for this? (Maybe blue/gray)
            completeButton.style.backgroundColor = '#17a2b8'; completeButton.style.color = 'white'; // Example inline style
            completeButton.dataset.requestId = req.id; completeButton.dataset.newStatus = 'completed'; // Add data attribute
            completeButton.addEventListener('click', handleUpdateRequestStatus);

            actionsDiv.appendChild(completeButton);
            addedActions = true;
        }
        // --- END NEW ---

        if (addedActions) {
            itemDiv.appendChild(actionsDiv);
        }

        container.appendChild(itemDiv);
    });
}


/**
 * Event handler for Accept/Decline button clicks.
 * Determines the desired status based on the button clicked and calls the update function.
 * @param {Event} event - The button click event.
 */
async function handleUpdateRequestStatus(event) {
    const button = event.target;
    const requestId = button.dataset.requestId;
    // Determine new status based on which button was clicked (could use class or text)
    const newStatus = button.textContent.toLowerCase(); // "accept" -> "accepted", "decline" -> "declined" (adjust if needed)
     const actualNewStatus = (newStatus === 'accept') ? 'accepted' : 'declined'; // Map button text to API status

    if (!requestId || !actualNewStatus) {
        console.error("Missing request ID or could not determine status from button.");
        return;
    }

    // Disable buttons in this request item to prevent multiple clicks
    const requestItem = button.closest('.request-item');
    const actionButtons = requestItem ? requestItem.querySelectorAll('.actions button') : [];
    actionButtons.forEach(btn => btn.disabled = true);

    console.log(`Attempting to update request ${requestId} to ${actualNewStatus}`);

    try {
        const result = await updateSkillRequestStatus(requestId, actualNewStatus); // API call

        if (result.ok) {
            console.log(`Request ${requestId} successfully updated to ${actualNewStatus}`);
            // Refresh the incoming requests list to show the change
            // Could also just update this specific item in the DOM for better UX
            fetchAndDisplayIncomingRequests(); // Simple refresh for hackathon
            // Maybe add a success message to the general message area?
            displayMessage('message', `Request successfully ${actualNewStatus}.`, false);

        } else {
            console.error(`Failed to update request ${requestId}:`, result.data.message);
             displayMessage('message', `Failed to update request: ${result.data.message}`, true);
             // Re-enable buttons on failure if the request wasn't actually updated
             actionButtons.forEach(btn => btn.disabled = false);
        }
    } catch (error) {
        console.error(`Error updating request ${requestId} status:`, error);
        displayMessage('message', 'A network error occurred while updating the request.', true);
        // Re-enable buttons on failure
        actionButtons.forEach(btn => btn.disabled = false);
    }
}

// ===========================================
// --- Helper Functions ---
// ===========================================

/**
 * Populates the profile page's HTML fields with user data.
 * @param {object} user - The user data object (either full or public).
 */
function displayProfileData(user) {
    if (!user) {
        console.error('No user data provided to displayProfileData');
        return;
    }

    const isViewingSelf = (viewedUserId === loggedInUserId);

    // Update page title
    document.getElementById('page-title').textContent = 
        isViewingSelf ? 'My Profile' : `${user.name || 'User'}'s Profile`;

    // Always visible fields (public information)
    const publicFields = {
        'profile-name': user.name || 'N/A',
        'profile-location': user.locationZip || 'N/A',
        'profile-created': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
        'profile-offer-text': user.offerText || 'No skills offered listed.',
        'profile-tokens': user.tokens || '5' // Default to 5 tokens for new users
    };

    // Update all public fields
    Object.entries(publicFields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });

    // Handle keywords display
    populateKeywords('profile-offer-keywords', user.offerKeywords);

    // Private fields (only visible when viewing own profile)
    if (isViewingSelf) {
        const privateFields = {
            'profile-email': user.email || 'N/A',
            'profile-need-text': user.needText || 'No skills needed listed.'
        };

        // Update private fields
        Object.entries(privateFields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Display needed skills keywords
        populateKeywords('profile-need-keywords', user.needKeywords);
    }
}
/**
 * Shows or hides specific page elements based on whether the user is viewing
 * their own profile or someone else's. Relies on the 'self-only' CSS class.
 */
function updateUIForViewMode() {
    const isViewingSelf = (viewedUserId === loggedInUserId);
    console.log(`Updating UI. Is viewing self: ${isViewingSelf}`);

    // Select all elements intended only for self-view
    const selfOnlyElements = document.querySelectorAll('.self-only');

    // Iterate and set display style based on whether viewing self or other profile
    selfOnlyElements.forEach(el => {
        el.style.display = isViewingSelf ? '' : 'none'; // Empty string defaults to element's default display (block, inline, etc.)
    });


    // --- NEW: Handle 'other-only' elements ---
    const otherOnlyElements = document.querySelectorAll('.other-only');
    otherOnlyElements.forEach(el => {
        el.style.display = isViewingSelf ? 'none' : ''; // Hide if self, show if other
    });

    //Adjust page title if viewing self
    if (isViewingSelf) {
          document.getElementById('page-title').textContent = 'My Profile';
    }    
}


// --- NEW: Event Handler for Request Skill Button Click ---
async function handleRequestSkillClick(event) {
    const button = event.target;
    const providerId = button.dataset.providerId; // Get provider ID from button's data attribute
    const requestMessageEl = document.getElementById('request-message'); // Feedback area
    if (!providerId) {
        console.error("Provider ID not found on request button.");
        return;
    }

    // --- Simple Prompt for Skill and Message (Improve with modal later) ---
    const skill = prompt("Which skill are you requesting? (e.g., 'gardening')");
    if (!skill || skill.trim().length === 0) {
        alert("Skill cannot be empty.");
        return;
    }
    const message = prompt("Optional: Add a short message for your request:", "");
    // --- End Simple Prompt ---

    // Disable button temporarily to prevent multiple clicks
    button.disabled = true;
    if(requestMessageEl) requestMessageEl.textContent = 'Sending request...';

    try {
        const requestData = {
            providerId: parseInt(providerId, 10),
            skill: skill.trim(),
            message: message || ""
        };
        const result = await createSkillRequest(requestData); // Call API function

        if (result.ok) {
             if(requestMessageEl) {
                requestMessageEl.textContent = 'Request sent successfully!';
                requestMessageEl.style.color = 'green';
             }
             // Optionally, hide the button after successful request or change text
             // button.textContent = 'Request Sent';
             // button.disabled = true; // Keep it disabled maybe?
        } else {
             if(requestMessageEl) {
                requestMessageEl.textContent = `Failed to send request: ${result.data.message}`;
                requestMessageEl.style.color = 'red';
             }
             button.disabled = false; // Re-enable button on failure
        }

    } catch (error) {
         console.error("Error sending skill request:", error);
         if(requestMessageEl) {
             requestMessageEl.textContent = 'An error occurred while sending the request.';
             requestMessageEl.style.color = 'red';
         }
         button.disabled = false; // Re-enable button on error
    }
}


/**
 * Fetches the list of community members from the API and initiates display.
 * Should only be called when viewing one's own profile.
 */
async function fetchAndDisplayUserList() {
    const listContainer = document.getElementById('user-list-container');
    if (!listContainer) {
        console.warn("User list container not found.");
        return; // Exit if the container element doesn't exist
    }
    listContainer.innerHTML = '<p>Loading community members...</p>'; // Show loading state

    try {
        // Call the API function (defined in api.js)
        const result = await getAllUsers();

        if (result.ok) {
            // Pass the user data array to the display function
            displayUserList(result.data);
        } else {
             // Handle API errors fetching the list
             console.error("Failed to fetch user list:", result.data.message);
             listContainer.innerHTML = `<p style="color: red;">Could not load community list: ${result.data.message}</p>`;
        }
    } catch (error) {
        // Handle network or unexpected errors
        console.error("Error fetching or displaying user list:", error);
        listContainer.innerHTML = '<p style="color: red;">Could not load community list due to a network or server error.</p>';
    }
}

/**
 * Renders the list of community users into the DOM.
 * @param {Array<object>} users - An array of public user data objects.
 */
function displayUserList(users) {
    const listContainer = document.getElementById('user-list-container');
    if (!listContainer) return; // Exit if container not found

    listContainer.innerHTML = ''; // Clear "Loading..." message or previous content

    // Check if the user array is empty or null
    if (!users || users.length === 0) {
        listContainer.innerHTML = '<p>No other users found in the community yet.</p>';
        return;
    }

    // Iterate through the users and create list items
    users.forEach(user => {
        // Backend should already filter out the current user, but double-check just in case
        if (user.id === loggedInUserId) return;

        const userDiv = document.createElement('div');
        userDiv.className = 'user-list-item'; // Apply CSS class for styling

        // Create paragraph for name (as link) and location
        const infoLine = document.createElement('p');

        // User Name (as a link to their profile)
        const nameLink = document.createElement('a');
        nameLink.href = `profile.html?userId=${user.id}`; // Correct link format
        nameLink.textContent = user.name || 'Unnamed User';
        infoLine.appendChild(nameLink);

        // Location (Zip Code)
        const locationSpan = document.createElement('span');
        locationSpan.className = 'location';
        locationSpan.textContent = ` (${user.locationZip || 'No Location'})`;
        infoLine.appendChild(locationSpan);

        userDiv.appendChild(infoLine);

        // Display a preview of Offered Skill Keywords
        if (user.offerKeywords && user.offerKeywords.length > 0) {
            const keywordsDiv = document.createElement('div');
            keywordsDiv.className = 'keywords-preview';
            const keywordsLabel = document.createElement('span'); // Add a label
            keywordsLabel.textContent = 'Offers: ';
            keywordsDiv.appendChild(keywordsLabel);

            // Show first few keywords as tags
            user.offerKeywords.slice(0, 5).forEach(keyword => { // Limit preview to 5 keywords
                const tag = document.createElement('span');
                tag.className = 'keyword-tag'; // Reuse keyword tag style
                tag.textContent = keyword;
                keywordsDiv.appendChild(tag);
            });
             if (user.offerKeywords.length > 5) { // Indicate if there are more keywords
                 const ellipsis = document.createElement('span');
                 ellipsis.textContent = ' ...';
                 keywordsDiv.appendChild(ellipsis);
             }
            userDiv.appendChild(keywordsDiv);
        } else {
            // Optional: Display message if no skills offered are listed
            const noKeywordsP = document.createElement('p');
            noKeywordsP.className = 'keywords-preview';
            noKeywordsP.style.fontStyle = 'italic'; // Style appropriately
            noKeywordsP.textContent = 'No specific skills offered listed.';
            userDiv.appendChild(noKeywordsP);
        }

        // Append the completed user item to the list container
        listContainer.appendChild(userDiv);
    });
}

/**
 * Handles the submission of the skill search form.
 * @param {Event} event - The form submission event.
 */
async function handleSkillSearch(event) {
    event.preventDefault(); // Prevent default form submission behavior (page reload)
    const searchInput = document.getElementById('search-query');
    const resultsContainer = document.getElementById('search-results-container');
    const messageEl = document.getElementById('message'); // General message area

    // Ensure required elements exist
    if (!searchInput || !resultsContainer) {
        console.error("Search input or results container element not found.");
        return;
    }

    const query = searchInput.value.trim(); // Get and clean the search query
    if (!query) {
        // Provide feedback if the search query is empty
        resultsContainer.innerHTML = '<p style="color: orange;">Please enter a skill to search for.</p>';
        return;
    }

    // Update UI to show loading state
    resultsContainer.innerHTML = `<p>Searching for users offering "${query}" nearby...</p>`;
    if (messageEl) messageEl.textContent = ''; // Clear any previous general messages

    try {
        // Call the API function to perform the search (defined in api.js)
        const result = await searchUsers(query);

        if (result.ok) {
            // If search successful, display the results
            displaySearchResults(result.data, query);
        } else {
            // Handle API errors returned from the backend
            console.error("Search failed:", result.data.message);
            resultsContainer.innerHTML = `<p style="color: red;">Search failed: ${result.data.message}</p>`;
        }
    } catch (error) {
        // Handle network errors or unexpected issues during the fetch
        console.error("Error during search:", error);
        resultsContainer.innerHTML = '<p style="color: red;">An error occurred while searching. Please check your connection and try again.</p>';
    }
}

/**
 * Renders the search results list into the DOM.
 * @param {Array<object>} users - An array of public user data objects matching the search.
 * @param {string} query - The original search query, used for context.
 */
function displaySearchResults(users, query) {
    const resultsContainer = document.getElementById('search-results-container');
    if (!resultsContainer) return; // Exit if container not found

    resultsContainer.innerHTML = ''; // Clear loading/previous results

    // Check if any users were found
    if (!users || users.length === 0) {
        resultsContainer.innerHTML = `<p>No users found offering "<strong>${query}</strong>" nearby.</p>`;
        return;
    }

    // Optional: Add a header indicating the search results
    const resultsHeader = document.createElement('h3');
    resultsHeader.innerHTML = `Users offering "<strong>${query}</strong>" nearby:`; // Use innerHTML to allow bold
    resultsContainer.appendChild(resultsHeader);

    // Iterate through the matching users and display them (reusing user-list-item structure)
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-list-item'; // Reuse the same class for styling

        // --- Create elements (name link, location, keywords) ---
        const infoLine = document.createElement('p');
        const nameLink = document.createElement('a');
        nameLink.href = `profile.html?userId=${user.id}`;
        nameLink.textContent = user.name || 'Unnamed User';
        infoLine.appendChild(nameLink);

        const locationSpan = document.createElement('span');
        locationSpan.className = 'location';
        locationSpan.textContent = ` (${user.locationZip || 'No Location'})`;
        infoLine.appendChild(locationSpan);
        userDiv.appendChild(infoLine);

        // Offer Keywords Preview (with potential highlighting)
        if (user.offerKeywords && user.offerKeywords.length > 0) {
            const keywordsDiv = document.createElement('div');
            keywordsDiv.className = 'keywords-preview';
            const keywordsLabel = document.createElement('span');
            keywordsLabel.textContent = 'Offers: ';
            keywordsDiv.appendChild(keywordsLabel);

            user.offerKeywords.slice(0, 5).forEach(keyword => {
                 const tag = document.createElement('span');
                 tag.className = 'keyword-tag';
                 // Highlight the matching keyword (case-insensitive check)
                 if (keyword.toLowerCase() === query.toLowerCase()) {
                     tag.style.fontWeight = 'bold';
                     tag.style.backgroundColor = '#ffffcc'; // Light yellow highlight
                 }
                 tag.textContent = keyword;
                 keywordsDiv.appendChild(tag);
            });
            if (user.offerKeywords.length > 5) {
                 const ellipsis = document.createElement('span');
                 ellipsis.textContent = ' ...';
                 keywordsDiv.appendChild(ellipsis);
             }
            userDiv.appendChild(keywordsDiv);
        }
        // --- End element creation ---

        resultsContainer.appendChild(userDiv); // Add the item to the results container
    });
}


/**
 * Populates an HTML element with styled keyword tags.
 * @param {string} elementId - The ID of the container element for the keywords.
 * @param {Array<string>} keywords - An array of keyword strings.
 */
function populateKeywords(elementId, keywords) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.warn(`Keyword container not found: ${elementId}`);
        return; // Exit if element doesn't exist
    }

    container.innerHTML = ''; // Clear previous content (like "Loading...")

    // Check if keywords array exists and has items
    if (keywords && keywords.length > 0) {
        keywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag'; // Apply CSS class for styling
            tag.textContent = keyword;
            container.appendChild(tag);
        });
    } else {
        // Display a message if no keywords are present
        const noKeywordsSpan = document.createElement('span');
        noKeywordsSpan.className = 'no-keywords'; // Apply CSS class for styling
        noKeywordsSpan.textContent = 'None specified.';
        container.appendChild(noKeywordsSpan);
    }
}

/**
 * Displays messages (errors or success) in a designated HTML element.
 * @param {string} elementId - The ID of the message display element.
 * @param {string} message - The message text to display.
 * @param {boolean} [isError=false] - If true, styles the message as an error (e.g., red text).
 */
function displayMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = isError ? 'red' : 'green'; // Style based on message type
    } else {
        // Fallback if message element isn't found (e.g., alert or console log)
        console.warn(`Message element not found: ${elementId}. Message: ${message}`);
        // alert(message); // Use alert as a fallback if critical
    }
}

/**
 * Handles user logout by clearing stored credentials and redirecting.
 */
function handleLogout() {
    // Clear authentication token and any related user info from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName'); // Example: clear stored name if any
    localStorage.removeItem('userId');   // Example: clear stored ID if any
    console.log("User logged out.");
    // Redirect the user to the login page
    window.location.href = 'login.html';
}