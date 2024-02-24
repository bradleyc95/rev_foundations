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

// UPDATE

// DELETE


module.exports = router;
