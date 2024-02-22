const express = require('express');
const router = express.Router();

const ticketsService = require('../service/TicketsService');

// CREATE

// Create a new ticket
/**
 * TODO: Verify user is logged in before allowing submission
 */
router.post('/submit', async (req, res) => {
    const data = await ticketsService.createTicket(req.body);
    if (data) {
        res.status(201).json({message: 'Ticket created successfully', data});
    } else {
        res.status(400).json({message: 'Ticket creation failed, missing one or more required fields', receivedData: req.body});
    }
});

// READ

// View own tickets (ALL)
/**
 * TODO: Verify user is logged in before allowing them to view tickets
 */
router.get('/view', async (req, res) => {
    const typeQuery = req.query.type;
    if (typeQuery) {
        const data = await ticketsService.getTicketsByUsernameAndType(typeQuery);
        res.status(200).json({message: `Successfully retrieved all previous tickets of type: ${typeQuery}`, data});
    } else {
        const data = await ticketsService.getTicketsByUsername();
        if (data) {
            res.status(200).json({message: 'Successfully retrieved all previous tickets', data})
        } else {
            res.status(400).json({message: 'You have no previous tickets associated with your account'})
        }
    } 
})

// View own tickets (FILTERED BY TYPE)


// UPDATE

// DELETE


module.exports = router;
