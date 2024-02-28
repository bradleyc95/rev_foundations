const express = require('express');
const router = express.Router();

const webToken = require('../util/WebToken');
const accountsService = require('../service/AccountsService');

// CREATE
// New User Registration
router.post('/register', async (req, res) => {
    const data = await accountsService.createNewAccount(req.body);
    if (data == 'username already exists') {
        res.status(400).json({message: 'An account with this username already exists', receivedData: req.body});
    } else if (data) {
        res.status(201).json({message: 'Account created successfully', data});
    } else {
        res.status(400).json({message: 'Account registration failed, missing one or more required fields', receivedData: req.body});
    }
});

// User Login
router.post('/login', async (req, res) => {
    const data = await accountsService.login(req.body);
    if (data) {
        const token = webToken.generateToken(data.Items[0]);
        res.status(201).json({message: `Login successful, welcome: ${data.Items[0].username}`, data, token: token});
    } else {
        res.status(400).json({message: 'Invalid login credentials, please try again', receivedData: req.body});
    }
})


// READ
// View own account information
router.get('/profile', authenticateToken, async (req, res) => {
    const data = await accountsService.getProfileInfo(req.user.username);
    if (data) {
        res.status(201).json({message: `Account information retrieved successfully for user: ${req.user.username}`, data});
    } else {
        res.status(400).json({message: `Failed to retrieve account information for user: ${req.user.username}`, receivedData: req.body});
    }
})

// UPDATE
// Add profile information
router.put('/profile', authenticateToken, async (req, res) => {
    const data = await accountsService.updateProfile(req.user.username, req.body);
    if (data) {
        res.status(201).json({message: `Account information updated successfully for user: ${req.user.username}`, data});
    } else {
        res.status(400).json({message: `Failed to update account information for user: ${req.user.username}`, receivedData: req.body});
    }
});

// DELETE


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({message: 'You must be logged in to use this feature'});
    } else {
        webToken.jwt.verify(token, webToken.secretKey, (err, user) => {
            if (err) {
                res.status(403).json({message: 'You do not have permission to access this feature'});
            } else {
                req.user = user;
                next();
            }
        })
    }
}


module.exports = router;
