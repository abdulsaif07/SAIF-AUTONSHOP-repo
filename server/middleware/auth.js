// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const tokenPart = token.split(' ')[1]; // "Bearer <token>"
    const decoded = jwt.verify(tokenPart || token, process.env.JWT_SECRET || 'super_secret_jwt_key_123');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
