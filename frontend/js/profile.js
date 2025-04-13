// frontend/js/profile.js

let viewedUserId = null;
let loggedInUserId = null;
const STARTING_TOKENS = 5;

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    const messageEl = document.getElementById('message');

    if (!token) {
        console.log("No token found, redirecting to login.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const meResult = await getUserProfile();
        if (meResult.ok) {
            loggedInUserId = meResult.data.id;
        } else {
            console.error("Could not verify logged-in user:", meResult.data.message);
            if (meResult.status === 401) {
                handleLogout();
                return;
            }
            displayMessage('message', 'Error verifying your session. Please try again.', true, 'error');
            return;
        }
    } catch (error) {
        console.error("Network or unexpected error fetching logged-in user ID:", error);
        displayMessage('message', 'Network error verifying session. Please check connection.', true, 'error');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userId');
    let isViewingOtherUserProfile = false;

    if (userIdFromUrl && !isNaN(parseInt(userIdFromUrl, 10))) {
        viewedUserId = parseInt(userIdFromUrl, 10);
        if (viewedUserId !== loggedInUserId) {
            isViewingOtherUserProfile = true;
            console.log(`Attempting to view profile for other user ID: ${viewedUserId}`);
        } else {
            viewedUserId = loggedInUserId;
            console.log(`Viewing own profile (via URL param, user ID: ${viewedUserId})`);
        }
    } else {
        viewedUserId = loggedInUserId;
        console.log(`Viewing own profile directly (user ID: ${viewedUserId})`);
    }

    let profileDataResult;
    if (isViewingOtherUserProfile) {
        profileDataResult = await getUserPublicProfile(viewedUserId);
    } else {
        profileDataResult = await getUserProfile();
    }

    if (profileDataResult && profileDataResult.ok) {
        const user = profileDataResult.data;
        displayProfileData(user);
        updateUIForViewMode();

        if (isViewingOtherUserProfile) {
            const requestButton = document.getElementById('request-skill-button');
            if (requestButton) {
                requestButton.dataset.providerId = viewedUserId;
                requestButton.addEventListener('click', handleRequestSkillClick);
            } else {
                console.warn("Request skill button not found.");
            }
        }

    } else {
        const errorMessage = profileDataResult?.data?.message || 'Could not load profile data.';
        console.error('Failed to fetch profile data:', errorMessage);
        displayMessage('message', `Error loading profile: ${errorMessage}`, true, 'error');

        if (profileDataResult?.status === 404) {
            document.getElementById('page-title').textContent = 'User Not Found';
            const profileInfoDiv = document.getElementById('profile-info');
            if (profileInfoDiv) {
                 profileInfoDiv.closest('.card').innerHTML = '<h2>User Not Found</h2><p>This user profile does not exist or could not be loaded.</p>';
            }
             updateUIForViewMode();
        } else if (profileDataResult?.status === 401) {
            handleLogout();
        }
    }

    if (!isViewingOtherUserProfile) {
        const searchForm = document.getElementById('skill-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', handleSkillSearch);
        } else {
             console.warn("Search form not found.");
        }

        fetchAndDisplayIncomingRequests();
        fetchAndDisplayOutgoingRequests();
        fetchAndDisplayUserList();
    }

     const logoutButton = document.getElementById('logout-button');
     if (logoutButton) {
         logoutButton.addEventListener('click', handleLogout);
     }

});

function displayProfileData(user) {
    if (!user) {
        console.error('No user data provided to displayProfileData');
        document.getElementById('page-title').textContent = 'Error Loading Profile';
        return;
    }

    const isViewingSelf = (viewedUserId === loggedInUserId);

    document.getElementById('page-title').textContent =
        isViewingSelf ? 'My Profile' : `${user.name || 'User'}'s Profile`;

    setTextContent('profile-name', user.name || 'N/A');
    setTextContent('profile-location', user.locationZip || 'N/A');
    setTextContent('profile-created', user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A');
    setTextContent('profile-offer-text', user.offerText || 'No skills offered listed.');

    populateKeywords('profile-offer-keywords', user.offerKeywords);

    if (isViewingSelf) {
        setTextContent('profile-email', user.email || 'N/A');
        setTextContent('profile-tokens', user.tokens ?? STARTING_TOKENS);
        setTextContent('profile-need-text', user.needText || 'No skills needed listed.');
        populateKeywords('profile-need-keywords', user.needKeywords);
    }
}

function populateKeywords(elementId, keywords) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.warn(`Keyword container not found: ${elementId}`);
        return;
    }

    container.innerHTML = '';

    if (keywords && keywords.length > 0) {
        keywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag';
            tag.textContent = keyword;
            container.appendChild(tag);
        });
    } else {
        const noKeywordsSpan = document.createElement('span');
        noKeywordsSpan.className = 'no-keywords';
        noKeywordsSpan.textContent = 'None specified.';
        container.appendChild(noKeywordsSpan);
    }
}

function updateUIForViewMode() {
    const isViewingSelf = (viewedUserId === loggedInUserId);
    console.log(`Updating UI. Is viewing self: ${isViewingSelf}`);

    const selfOnlyElements = document.querySelectorAll('.self-only');
    selfOnlyElements.forEach(el => {
        el.style.display = isViewingSelf ? '' : 'none';
    });

    const otherOnlyElements = document.querySelectorAll('.other-only');
    otherOnlyElements.forEach(el => {
        el.style.display = isViewingSelf ? 'none' : '';
    });

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.style.display = isViewingSelf ? 'inline-block' : 'none';
    }
}

function updateRequestItemUI(requestItemElement, updatedRequestData) {
    if (!requestItemElement || !updatedRequestData) return;

    const statusSpan = requestItemElement.querySelector('.status');
    if (statusSpan) {
        statusSpan.className = `status ${updatedRequestData.status}`;
        statusSpan.textContent = updatedRequestData.status;
    } else {
        const statusDetailsDiv = requestItemElement.querySelector('.status-details');
        if (statusDetailsDiv) {
             const newStatusSpan = document.createElement('span');
             newStatusSpan.className = `status ${updatedRequestData.status}`;
             newStatusSpan.textContent = updatedRequestData.status;
             statusDetailsDiv.prepend(newStatusSpan);
        }
    }

     const statusDetailsDiv = requestItemElement.querySelector('.status-details');
     if(statusDetailsDiv) {
         const existingStatusSpan = statusDetailsDiv.querySelector('.status');
         let newDetailsHTML = existingStatusSpan ? existingStatusSpan.outerHTML : '';

         newDetailsHTML += `<br><small>Created: ${new Date(updatedRequestData.createdAt).toLocaleString()}</small>`;
         if (updatedRequestData.createdAt !== updatedRequestData.updatedAt) {
              newDetailsHTML += `<br><small>Updated: ${new Date(updatedRequestData.updatedAt).toLocaleString()}</small>`;
         }
         statusDetailsDiv.innerHTML = newDetailsHTML;
     }

    const actionsDiv = requestItemElement.querySelector('.actions');
    if (actionsDiv) {
        actionsDiv.innerHTML = '';
        let hasActions = false;

        if (updatedRequestData.status === 'accepted') {
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Mark Completed';
            completeButton.className = 'button button-info complete-button';
            completeButton.dataset.requestId = updatedRequestData.id;
            completeButton.dataset.newStatus = 'completed';
            completeButton.addEventListener('click', handleUpdateRequestStatus);
            actionsDiv.appendChild(completeButton);
            hasActions = true;
        } else if (updatedRequestData.status === 'pending') {
            const acceptButton = document.createElement('button');
            acceptButton.textContent = 'Accept';
            acceptButton.className = 'button button-success accept-button';
            acceptButton.dataset.requestId = updatedRequestData.id;
            acceptButton.dataset.newStatus = 'accepted';
            acceptButton.addEventListener('click', handleUpdateRequestStatus);

            const declineButton = document.createElement('button');
            declineButton.textContent = 'Decline';
            declineButton.className = 'button button-danger decline-button';
            declineButton.dataset.requestId = updatedRequestData.id;
            declineButton.dataset.newStatus = 'declined';
            declineButton.addEventListener('click', handleUpdateRequestStatus);

            actionsDiv.appendChild(acceptButton);
            actionsDiv.appendChild(declineButton);
            hasActions = true;
        }

        actionsDiv.style.display = hasActions ? '' : 'none';
    }
}

async function fetchAndDisplayUserList() {
    const listContainer = document.getElementById('user-list-container');
    if (!listContainer) { console.warn("User list container not found."); return; }
    listContainer.innerHTML = '<p>Loading community members...</p>';

    try {
        const result = await getAllUsers();
        if (result.ok) {
            displayUserList(result.data);
        } else {
             console.error("Failed to fetch user list:", result.data.message);
             listContainer.innerHTML = `<p class="error-text">Could not load community list: ${result.data.message}</p>`;
        }
    } catch (error) {
        console.error("Error fetching or displaying user list:", error);
        listContainer.innerHTML = '<p class="error-text">Could not load community list due to a network or server error.</p>';
    }
}

function displayUserList(users) {
    const listContainer = document.getElementById('user-list-container');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (!users || users.length === 0) {
        listContainer.innerHTML = '<p>No other users found in the community yet.</p>';
        return;
    }

    users.forEach(user => {
        if (user.id === loggedInUserId) return;

        const userDiv = document.createElement('div');
        userDiv.className = 'user-list-item';

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

        if (user.offerKeywords && user.offerKeywords.length > 0) {
            const keywordsDiv = document.createElement('div');
            keywordsDiv.className = 'keywords-preview';
            keywordsDiv.innerHTML = '<span>Offers: </span>';
            user.offerKeywords.slice(0, 5).forEach(keyword => {
                const tag = document.createElement('span');
                tag.className = 'keyword-tag';
                tag.textContent = keyword;
                keywordsDiv.appendChild(tag);
            });
             if (user.offerKeywords.length > 5) keywordsDiv.innerHTML += ' ...';
            userDiv.appendChild(keywordsDiv);
        } else {
            const noKeywordsP = document.createElement('p');
            noKeywordsP.className = 'keywords-preview no-keywords';
            noKeywordsP.textContent = 'No specific skills offered listed.';
            userDiv.appendChild(noKeywordsP);
        }
        listContainer.appendChild(userDiv);
    });
}

async function fetchAndDisplayIncomingRequests() {
    const container = document.getElementById('incoming-requests-container');
    if (!container) { console.warn("Incoming requests container not found."); return; }
    container.innerHTML = '<p>Loading incoming requests...</p>';

    try {
        const result = await getIncomingSkillRequests();
        if (result.ok) {
            displayRequests(result.data, 'incoming-requests-container', 'incoming');
        } else {
            console.error("Failed to fetch incoming requests:", result.data.message);
            container.innerHTML = `<p class="error-text">Could not load incoming requests: ${result.data.message}</p>`;
        }
    } catch (error) {
        console.error("Error fetching incoming requests:", error);
        container.innerHTML = '<p class="error-text">Network error loading incoming requests.</p>';
    }
}

async function fetchAndDisplayOutgoingRequests() {
    const container = document.getElementById('outgoing-requests-container');
    if (!container) { console.warn("Outgoing requests container not found."); return; }
    container.innerHTML = '<p>Loading outgoing requests...</p>';

    try {
        const result = await getOutgoingSkillRequests();
        if (result.ok) {
            displayRequests(result.data, 'outgoing-requests-container', 'outgoing');
        } else {
            console.error("Failed to fetch outgoing requests:", result.data.message);
            container.innerHTML = `<p class="error-text">Could not load outgoing requests: ${result.data.message}</p>`;
        }
    } catch (error) {
        console.error("Error fetching outgoing requests:", error);
        container.innerHTML = '<p class="error-text">Network error loading outgoing requests.</p>';
    }
}

function displayRequests(requests, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!requests || requests.length === 0) {
        container.innerHTML = `<p>No ${type} requests found.</p>`;
        return;
    }

    requests.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    requests.forEach(req => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'request-item';
        itemDiv.dataset.requestId = req.id;

        let userHTML = '';
        if (type === 'incoming') {
            userHTML = `From: <span class="user-name">${req.requesterName || 'Unknown'}</span>`;
        } else {
            userHTML = `To: <span class="user-name">${req.providerName || 'Unknown'}</span>`;
        }

        itemDiv.innerHTML = `
            <p>Skill: <span class="skill">${req.skill || 'N/A'}</span></p>
            <p>${userHTML}</p>
            ${req.message ? `<p class="message">${escapeHTML(req.message)}</p>` : ''}
            <div class="status-details">
                 <span class="status ${req.status}">${req.status}</span>
                 <br><small>Created: ${new Date(req.createdAt).toLocaleString()}</small>
                 ${req.createdAt !== req.updatedAt ? `<br><small>Updated: ${new Date(req.updatedAt).toLocaleString()}</small>` : ''}
            </div>
            <div class="actions" style="display: none;"></div>
        `;

        const actionsDiv = itemDiv.querySelector('.actions');
        let addedActions = false;

        if (type === 'incoming' && req.status === 'pending') {
            actionsDiv.innerHTML = `
                <button class="button button-success accept-button" data-request-id="${req.id}" data-new-status="accepted">Accept</button>
                <button class="button button-danger decline-button" data-request-id="${req.id}" data-new-status="declined">Decline</button>
            `;
            addedActions = true;
        } else if (type === 'incoming' && req.status === 'accepted') {
             actionsDiv.innerHTML = `
                <button class="button button-info complete-button" data-request-id="${req.id}" data-new-status="completed">Mark Completed</button>
             `;
             addedActions = true;
        }

        if (addedActions) {
            actionsDiv.style.display = '';
            actionsDiv.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', handleUpdateRequestStatus);
            });
        }

        container.appendChild(itemDiv);
    });
}

async function handleSkillSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-query');
    const resultsContainer = document.getElementById('search-results-container');
    const messageEl = document.getElementById('message');

    if (!searchInput || !resultsContainer) { console.error("Search elements missing."); return; }

    const query = searchInput.value.trim();
    if (!query) {
        resultsContainer.innerHTML = '<p style="color: orange;">Please enter a skill to search for.</p>';
        return;
    }

    resultsContainer.innerHTML = `<p>Searching for users offering "<strong>${query}</strong>" nearby...</p>`;
    if (messageEl) displayMessage(messageEl.id, '', false, 'info');

    try {
        const result = await searchUsers(query);
        if (result.ok) {
            displaySearchResults(result.data, query);
        } else {
            console.error("Search failed:", result.data.message);
            resultsContainer.innerHTML = `<p class="error-text">Search failed: ${result.data.message}</p>`;
        }
    } catch (error) {
        console.error("Error during search:", error);
        resultsContainer.innerHTML = '<p class="error-text">An error occurred while searching.</p>';
    }
}

function displaySearchResults(users, query) {
    const resultsContainer = document.getElementById('search-results-container');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';

    if (!users || users.length === 0) {
        resultsContainer.innerHTML = `<p>No users found offering "<strong>${query}</strong>" nearby.</p>`;
        return;
    }

    const resultsHeader = document.createElement('h3');
    resultsHeader.innerHTML = `Users offering "<strong>${query}</strong>" nearby:`;
    resultsContainer.appendChild(resultsHeader);

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-list-item';

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

        if (user.offerKeywords && user.offerKeywords.length > 0) {
            const keywordsDiv = document.createElement('div');
            keywordsDiv.className = 'keywords-preview';
            keywordsDiv.innerHTML = '<span>Offers: </span>';
            user.offerKeywords.slice(0, 5).forEach(keyword => {
                 const tag = document.createElement('span');
                 tag.className = 'keyword-tag';
                 if (keyword.toLowerCase() === query.toLowerCase()) {
                     tag.style.fontWeight = 'bold';
                     tag.style.backgroundColor = '#fff3cd';
                 }
                 tag.textContent = keyword;
                 keywordsDiv.appendChild(tag);
            });
            if (user.offerKeywords.length > 5) keywordsDiv.innerHTML += ' ...';
            userDiv.appendChild(keywordsDiv);
        }
        resultsContainer.appendChild(userDiv);
    });
}


async function handleRequestSkillClick(event) {
    const button = event.target;
    const providerId = button.dataset.providerId;
    const requestMessageEl = document.getElementById('request-message');

    if (!providerId) { console.error("Provider ID missing."); return; }

    const skill = prompt("Which skill are you requesting? (e.g., 'gardening')");
    if (!skill || skill.trim().length === 0) {
        alert("Skill cannot be empty."); return;
    }
    const message = prompt("Optional: Add a short message:", "");

    button.disabled = true;
    if(requestMessageEl) {
        requestMessageEl.textContent = 'Sending request...';
        requestMessageEl.className = 'info-text';
    }

    try {
        const requestData = { providerId: parseInt(providerId, 10), skill: skill.trim(), message: message || "" };
        const result = await createSkillRequest(requestData);

        if (result.ok) {
             if(requestMessageEl) {
                requestMessageEl.textContent = 'Request sent successfully!';
                requestMessageEl.className = 'success-text';
             }
             button.textContent = 'Request Sent';
        } else {
             if(requestMessageEl) {
                requestMessageEl.textContent = `Failed: ${result.data.message}`;
                requestMessageEl.className = 'error-text';
             }
             button.disabled = false;
        }
    } catch (error) {
         console.error("Error sending skill request:", error);
         if(requestMessageEl) {
             requestMessageEl.textContent = 'Network error sending request.';
             requestMessageEl.className = 'error-text';
         }
         button.disabled = false;
    }
}

async function handleUpdateRequestStatus(event) {
    const button = event.target;
    const requestId = button.dataset.requestId;
    const newStatus = button.dataset.newStatus;

    if (!requestId || !newStatus) {
        console.error("Missing request ID or new status from button data.");
        return;
    }

    const requestItem = button.closest('.request-item');
    const actionButtons = requestItem ? requestItem.querySelectorAll('.actions button') : [];
    actionButtons.forEach(btn => btn.disabled = true);

    const messageEl = document.getElementById('message');
    if (messageEl) displayMessage(messageEl.id, `Updating request to ${newStatus}...`, false, 'info');

    try {
        const result = await updateSkillRequestStatus(requestId, newStatus);

        if (result.ok) {
            console.log(`Request ${requestId} successfully updated to ${newStatus}`);
            updateRequestItemUI(requestItem, result.data);
            if (messageEl) displayMessage(messageEl.id, `Request successfully ${newStatus}.`, false, 'success');

            if (newStatus === 'completed') {
                 fetchAndUpdateTokenBalance();
            }
        } else {
            console.error(`Failed to update request ${requestId}:`, result.data.message);
            if (messageEl) displayMessage(messageEl.id, `Failed to update request: ${result.data.message}`, true, 'error');
            actionButtons.forEach(btn => btn.disabled = false);
        }
    } catch (error) {
        console.error(`Error updating request ${requestId} status:`, error);
        if (messageEl) displayMessage(messageEl.id, 'A network error occurred while updating the request.', true, 'error');
        actionButtons.forEach(btn => btn.disabled = false);
    }
}

async function fetchAndUpdateTokenBalance() {
    const tokenSpan = document.getElementById('profile-tokens');
    if (!tokenSpan || document.querySelector('.self-only')?.style.display === 'none') {
        return;
    }
    try {
        const result = await getUserProfile();
        if (result.ok) {
            tokenSpan.textContent = result.data.tokens ?? STARTING_TOKENS;
        } else {
            console.error("Could not refresh token balance:", result.data.message);
        }
    } catch (error) {
        console.error("Network error refreshing token balance:", error);
    }
}

function displayMessage(elementId, message, isError = false, classType = null) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = '';

        let finalClassType = 'info';
        if (classType) {
            finalClassType = classType;
        } else if (isError) {
            finalClassType = 'error';
        } else if (message && message.trim() !== '') {
            finalClassType = 'success';
        }

        element.className = finalClassType;

    } else {
        console.warn(`Message element not found: ${elementId}. Message: ${message}`);
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    console.log("User logged out.");
    window.location.href = 'login.html';
}

function setTextContent(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    } else {
        console.warn(`Element with ID "${id}" not found for setting text content.`);
    }
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&')
              .replace(/</g, '<')
              .replace(/>/g, '>')
              .replace(/"/g, '"')
              .replace(/'/g, '&#39;');
}