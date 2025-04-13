# SkillVerse Network

A community-driven skill exchange platform where users can share their expertise and learn from others using a token-based economy.

## Features

- **User Authentication**: Secure signup and login system
- **Skill Management**: Users can list skills they offer and skills they need
- **Token Economy**: Users start with 5 tokens and earn more by completing skill exchanges
- **Community Directory**: Browse and search for users with specific skills
- **Request System**: Send, receive, and manage skill exchange requests
- **Location-Based**: Find skill providers in your area using zip code matching

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Express
- **Authentication**: JWT (JSON Web Tokens)
- **Natural Language Processing**: Natural.js for keyword extraction
- **Database**: SQLite (for demonstration)

## Project Structure

```
SkillVerse-Network/
├── frontend/
│   ├── css/
│   │   ├── style.css
│   │   ├── profile.css
│   │   └── home.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── profile.js
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   └── profile.html
└── backend/
    ├── services/
    │   └── nlpProcessor.js
    ├── authMiddleware.js
    ├── dataStore.js
    ├── db_init.js
    ├── generate_users.js
    ├── server.js
    ├── package.json
    └── .env
```

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd SkillVerse-Network
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with:
```
JWT_SECRET=YOUR_SUPER_SECRET_KEY_GOES_HERE_MAKE_IT_RANDOM
PORT=3001
```

4. Initialize the SQLite database:
```bash
node db_init.js
```

5. Start the backend server:
```bash
node server.js
```

6. Open the frontend in a web browser:
   - Navigate to `frontend/signup.html` to create an account
   - Or `frontend/login.html` if you already have an account

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Register new user
- `POST /api/auth/login`: Login user

### Profile
- `GET /api/users/me`: Get own profile
- `GET /api/users/:userId`: Get public profile
- `GET /api/users`: Get community directory

### Skill Exchange
- `GET /api/match/search`: Search for skills
- `POST /api/interactions/requests`: Create skill request
- `GET /api/interactions/requests/incoming`: View received requests
- `GET /api/interactions/requests/outgoing`: View sent requests
- `PUT /api/interactions/requests/:requestId`: Update request status

## Token System

- New users start with 5 tokens
- Complete a skill exchange to earn 1 token
- Tokens are automatically transferred upon request completion

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected API endpoints
- Input validation and sanitization

## Development Notes

- The project uses SQLite as the database for demonstration purposes
- Add error logging and monitoring for production deployment
- Consider adding email verification and password recovery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Video Link

https://youtu.be/CwFuLPOPBSU

## Author

Santosh Singh  
Rahul Kumar  
Saidul Hussain Chudhury

## Acknowledgments

- Natural.js for keyword extraction
- Express.js community
