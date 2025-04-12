// backend/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization'); // Typically "Bearer TOKEN_STRING"

    // Check if not token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Auth Middleware: No token or invalid format');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1]; // Extract token part
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user payload from token to request object
        req.user = decoded; // req.user will contain { userId: ..., email: ..., iat: ..., exp: ... }
        console.log(`Auth Middleware: Token verified for user ${req.user.email}`);
        next(); // Move to the next middleware or route handler
    } catch (err) {
        console.error('Auth Middleware Error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = authMiddleware;