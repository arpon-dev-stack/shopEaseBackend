// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const RefreshToken = require('../models/refreshToken');
// const { hashToken, rotateRefreshToken } = require('../utils/token');
// const {
//     createJti,
//     signAccessToken,
//     signRefreshToken,
//     persistRefreshToken,
//     setRefreshCookie
// } = require('../utils/token');

// const router = express.Router();

// router.post('/register', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: 'User already exists' });

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({ username, email, password: hashedPassword });
//         await newUser.save();

//         res.status(201).json({ message: 'User created successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log(email, password)

//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//         const accessToken = signAccessToken(user);

//         const jti = createJti();
//         const refreshToken = signRefreshToken(user, jti);

//         await persistRefreshToken({
//             user,
//             refreshToken,
//             jti,
//             ip: req.ip,
//             userAgent: req.headers['user-agent'] || ''
//         });

//         setRefreshCookie(res, refreshToken);

//         res.json({ accessToken });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// router.post('/refresh', async (req, res) => {
//     try {
//         const token = req.cookies?.refresh_token;
//         if (!token) return res.status(401).json({ message: 'No refresh token' });

//         let decoded;
//         try {
//             decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//         } catch (err) {
//             return res.status(401).json({ message: 'Invalid or expired refresh token' });
//         }

//         const tokenHash = hashToken(token);
//         const doc = await RefreshToken.findOne({ tokenHash, jti: decoded.jti }).populate('user');

//         if (!doc) {
//             return res.status(401).json({ message: 'Refresh token not recognized' });
//         }
//         if (doc.revokedAt) {
//             return res.status(401).json({ message: 'Refresh token revoked' });
//         }
//         if (doc.expiresAt < new Date()) {
//             return res.status(401).json({ message: 'Refresh token expired' });
//         }

//         const result = await rotateRefreshToken(doc, doc.user, req, res);
//         return res.json({ accessToken: result.accessToken });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// router.post('/logout', async (req, res) => {
//     try {
//         const token = req.cookies?.refresh_token;
//         if (token) {
//             const tokenHash = hashToken(token);
//             const doc = await RefreshToken.findOne({ tokenHash });
//             if (doc && !doc.revokedAt) {
//                 doc.revokedAt = new Date();
//                 await doc.save();
//             }
//         }
//         res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
//         res.json({ message: 'Logged out' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router


import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import RefreshToken from '../models/refreshToken.js';
import { 
    hashToken, 
    rotateRefreshToken,
    createJti,
    signAccessToken,
    signRefreshToken,
    persistRefreshToken,
    setRefreshCookie 
} from '../utils/token.js';

const router = express.Router();

// --- Register ---
router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Login ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const accessToken = signAccessToken(user);

        const jti = createJti();
        const refreshToken = signRefreshToken(user, jti);

        await persistRefreshToken({
            user,
            refreshToken,
            jti,
            ip: req.ip,
            userAgent: req.headers['user-agent'] || ''
        });

        setRefreshCookie(res, refreshToken);

        res.json({ user, token: accessToken });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Refresh Token ---
router.post('/refresh', async (req, res) => {
    try {
        const token = req.cookies?.refresh_token;
        if (!token) return res.status(401).json({ message: 'No refresh token' });

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        const tokenHash = hashToken(token);
        const doc = await RefreshToken.findOne({ tokenHash, jti: decoded.jti }).populate('user');

        if (!doc) return res.status(401).json({ message: 'Refresh token not recognized' });
        if (doc.revokedAt) return res.status(401).json({ message: 'Refresh token revoked' });
        if (doc.expiresAt < new Date()) return res.status(401).json({ message: 'Refresh token expired' });

        const result = await rotateRefreshToken(doc, doc.user, req, res);
        return res.json({ accessToken: result.accessToken });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Logout ---
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies?.refresh_token;
        if (token) {
            const tokenHash = hashToken(token);
            const doc = await RefreshToken.findOne({ tokenHash });
            if (doc && !doc.revokedAt) {
                doc.revokedAt = new Date();
                await doc.save();
            }
        }
        res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
        res.json({ message: 'Logged out' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;