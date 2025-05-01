const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Extract the token from the 'Authorization' header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If no token is provided, return a 401 response
    if (!token) {
      return res.status(401).json({ error: true, msg: 'No token provided' });
    }

    // Log the token for debugging purposes (only in development)
    console.log('Token:', token);

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID to the request object
    req.userId = decoded.userId;

    // Proceed to the next middleware
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.message === 'jwt expired') {
      return res.status(403).send({ msg: 'Please login again' });
    } 
    if (err.message === 'jwt malformed') {
      return res.status(401).json({ error: true, msg: 'Invalid token format' });
    }

    // Log any other errors
    console.error('Authentication error:', err);

    // Handle generic authentication errors
    return res.status(401).json({ error: true, msg: 'Not authorized' });
  }
};

module.exports = auth;

