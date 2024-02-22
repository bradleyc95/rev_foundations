const ticketsDao = require('../repository/TicketsDAO');
const accountsService = require('./AccountsService');
const uuid = require('uuid');

// add logged-in validation
async function createTicket(receivedData) {
    if (validateTicket(receivedData)) {
        const data = await ticketsDao.createTicket({
            ticket_id: uuid.v4(),
            time: Math.floor(new Date().getTime() / 1000),
            description: receivedData.description,
            type: receivedData.type,
            amount: receivedData.amount,
            status: 'pending',
            author: accountsService.currentUser[0].username
        });
        // console.log(accountsService.currentUser)
        // console.log(data);
        return data;
    }
    return null;
}

async function getTicketsByUsername() {
    const data = await ticketsDao.getTicketsByUsername(accountsService.currentUser[0].username);
    return data;
}

async function getTicketsByUsernameAndType(typeQuery) {
    const data = await ticketsDao.getTicketsByUsernameAndType(accountsService.currentUser[0].username, typeQuery);
    return data;
}

// Tickets must include description, type, amount, default status of pending
function validateTicket(receivedData) {
    if (!receivedData.description || !receivedData.type || !receivedData.amount) {
        return false;
    }
    return true;
}

module.exports = {
    createTicket,
    getTicketsByUsername,
    getTicketsByUsernameAndType
}
