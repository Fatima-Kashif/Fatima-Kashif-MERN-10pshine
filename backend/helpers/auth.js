const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
 
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: true, msg: 'No token provided' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
  
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err.message === "jwt expired")
        {
            return res.status(403).send({msg:"Please login again"})
        }
    console.error('Authentication error:', err);
    return res.status(401).json({ error: true, msg: 'Not authorized' });
  }
};

module.exports = auth;

