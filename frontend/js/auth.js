// frontend/js/auth.js

// --- Shared Functionality ---
function displayMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = isError ? 'red' : 'green';
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName'); // Optional: clear user info
    localStorage.removeItem('userId');
    console.log("User logged out");
    // Redirect to login page after logout
    window.location.href = 'login.html';
}

// --- Signup Logic ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        const messageEl = document.getElementById('message');
        messageEl.textContent = ''; // Clear previous messages

        const formData = new FormData(signupForm);
        const userData = Object.fromEntries(formData.entries());

        // Basic validation (more robust validation is recommended)
        if (userData.password.length < 6) {
            displayMessage('message', 'Password must be at least 6 characters long.', true);
            return;
        }

        try {
            displayMessage('message', 'Signing up...');
            const result = await signupUser(userData);

            if (result.ok) {
                displayMessage('message', 'Signup successful! Please login.');
                // Optional: Redirect to login after a short delay
                setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            } else {
                displayMessage('message', `Signup failed: ${result.data.message}`, true);
            }
        } catch (error) {
            console.error('Signup fetch error:', error);
            displayMessage('message', 'An error occurred during signup.', true);
        }
    });
}

// --- Login Logic ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
         const messageEl = document.getElementById('message');
         messageEl.textContent = ''; // Clear previous messages

        const formData = new FormData(loginForm);
        const credentials = Object.fromEntries(formData.entries());

        try {
            displayMessage('message', 'Logging in...');
            const result = await loginUser(credentials);

            if (result.ok && result.data.token) {
                // Store token and user info in localStorage
                localStorage.setItem('authToken', result.data.token);
                localStorage.setItem('userName', result.data.name); // Store for convenience
                localStorage.setItem('userId', result.data.userId);

                displayMessage('message', 'Login successful! Redirecting...');
                // Redirect to profile page
                window.location.href = 'profile.html';
            } else {
                displayMessage('message', `Login failed: ${result.data.message}`, true);
            }
        } catch (error) {
             console.error('Login fetch error:', error);
             displayMessage('message', 'An error occurred during login.', true);
        }
    });
}


// --- Logout Logic ---
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}