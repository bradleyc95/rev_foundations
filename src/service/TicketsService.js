const ticketsDao = require('../repository/TicketsDAO');
const accountsService = require('./AccountsService');
const uuid = require('uuid');

async function createTicket(receivedData, username) {
    if (validateTicket(receivedData)) {
        const data = await ticketsDao.createTicket({
            ticket_id: uuid.v4(),
            time: Math.floor(new Date().getTime() / 1000),
            description: receivedData.description,
            type: receivedData.type,
            amount: receivedData.amount,
            status: 'pending',
            author: username 
        });
        return data;
    }
    return null;
}

async function getTicketsByUsername(username) {
    const data = await ticketsDao.getTicketsByUsername(username);
    return data;
}

async function getTicketsByUsernameAndType(username, typeQuery) {
    const data = await ticketsDao.getTicketsByUsernameAndType(username, typeQuery);
    return data;
}

async function getPendingTickets() {
    const data = await ticketsDao.getPendingTickets();
    return data;
}

async function updateTicketStatus(status, id) {
    const data = await ticketsDao.updateTicketStatus(status, id);
    return data;
}

// Tickets must include description, type, amount, default status of pending
function validateTicket(receivedData) {
    if (!receivedData.description || !receivedData.type || !receivedData.amount || receivedData.amount <= 0) {
        return false;
    }
    return true;
}

module.exports = {
    createTicket,
    getTicketsByUsername,
    getTicketsByUsernameAndType,
    validateTicket,
    getPendingTickets,
    updateTicketStatus
}
