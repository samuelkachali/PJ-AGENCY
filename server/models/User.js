﻿const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
email: { type: String, required: true, unique: true, trim: true, lowercase: true },
password: { type: String, required: true, minlength: 6 },
role: { type: String, enum: ['admin', 'user'], default: 'user' },
isActive: { type: Boolean, default: true },
lastLogin: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});

userSchema.methods.comparePassword = function(candidate) {
return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
