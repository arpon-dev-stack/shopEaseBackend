// const jwt = require('jsonwebtoken');

// function auth(req, res, next) {
//   const header = req.headers.authorization || '';
//   const [scheme, tokenFromHeader] = header.split(' ');
//   const tokenFromCookie = req.cookies?.access_token;

//   const token = scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : tokenFromCookie;

//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id: decoded.id, email: decoded.email };
//     next();
//   } catch (err) {
//     const msg = err.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid token';
//     return res.status(401).json({ message: msg });
//   }
// }

// module.exports = auth;

import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify JWT from Header or Cookies
 */
const auth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, tokenFromHeader] = header.split(' ');
  const tokenFromCookie = req.cookies?.access_token;

  // Prioritize Bearer token from header, fallback to cookie
  const token = scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : tokenFromCookie;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request object
    req.user = { id: decoded.id, email: decoded.email };
    
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid token';
    return res.status(401).json({ message: msg });
  }
};

export default auth;