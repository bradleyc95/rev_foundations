const express = require('express');
const router = express.Router();

const webToken = require ('../util/WebToken');
const ticketsService = require('../service/TicketsService');

// CREATE

// Create a new ticket
/**
 * TODO: Verify user is logged in before allowing submission
 */
router.post('/submit', authenticateToken, async (req, res) => {
    const username = req.user.username;
    const data = await ticketsService.createTicket(req.body, username);
    if (data) {
        res.status(201).json({message: 'Ticket created successfully', data});
    } else {
        res.status(400).json({message: 'Ticket creation failed, missing one or more required fields', receivedData: req.body});
    }
});

// READ

// View own tickets
/**
 * TODO: extract username from token?
 */
router.get('/view', authenticateToken, async (req, res) => {
    const typeQuery = req.query.type;
    const username = req.user.username;
    if (typeQuery) {
        const data = await ticketsService.getTicketsByUsernameAndType(username, typeQuery);
        res.status(200).json({message: `Successfully retrieved all previous tickets of type: ${typeQuery}`, data});
    } else {
        const data = await ticketsService.getTicketsByUsername(username);
        if (data) {
            res.status(200).json({message: 'Successfully retrieved all previous tickets', data})
        } else {
            res.status(400).json({message: 'You have no previous tickets associated with your account'})
        }
    }   
})


// UPDATE

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
                console.log(user);
                console.log(user.is_admin)
                req.user = user;
                next();
            }
        })




        // const result = webToken.authenticateToken(token);
        // console.log(result);
        // if (result == false) {
        //     res.status(403).json({message: 'You do not have permission to access this feature'});
        // } else {
        //     req.user = result;
        //     next();
        // }
    }
}

function getUsernameFromToken(token) {

}


module.exports = router;
