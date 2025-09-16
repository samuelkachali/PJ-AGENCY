﻿const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
const header = req.headers.authorization;
if (!header || !header.startsWith('Bearer ')) {
return res.status(401).json({ message: 'No token' });
}
try {
const token = header.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = { id: decoded.userId };
return next();
} catch {
return res.status(401).json({ message: 'Invalid token' });
}
};
