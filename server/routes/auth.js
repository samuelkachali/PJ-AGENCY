const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
try {
const { username, email, password, role } = req.body;
const exists = await User.findOne({ $or: [{ email }, { username }] });
if (exists) return res.status(400).json({ message: 'User already exists' });
const user = await User.create({ username, email, password, role: role || 'user' });
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.status(201).json({ token, user: { id: user._id, username, email, role: user.role } });
} catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user || !(await user.comparePassword(password))) {
return res.status(400).json({ message: 'Invalid credentials' });
}
user.lastLogin = new Date();
await user.save();
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, username: user.username, email, role: user.role } });
} catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
