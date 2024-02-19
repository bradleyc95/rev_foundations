const {logger} = require('./util/logger');

const users = [];
const tickets = [];
const pendingTickets = [];
const currentUser = [];
let ticketID = 0;

function createNewUser(username, password, admin = false) {
    const newUser = {
        username,
        password,
        admin
    }
    users.push(newUser);
    logger.info(`Added user: ${newUser.username}`);
    return `${username} has been registered`;
}

function logout() {
    let user = currentUser.splice(0, 1);
    logger.info(`Logout successful: ${user[0].username}`);
    return `User ${user[0].username} successfully logged out`;
}

function login(username, password) {
    for (let i = 0; i < users.length; i++) {
        // CHECK FOR VALID CREDENTIALS
        if (users[i].username == username && users[i].password == password) {
            // RESET CURRENT USER
            currentUser.splice(0, 1);
            currentUser.push(users[i]);
            const message = currentUser[0].admin ? `Admin ${currentUser[0].username} logged in successfully` : `Employee ${currentUser[0].username} logged in successfully`;
            logger.info(`Login successful: ${username}`);
            return message;
        }
    }
    // IF UNABLE TO VALIDATE CREDENTIALS, RETURN 0
    logger.error(`Invalid username or password: ${username}`);
    return 0;
}

function submitTicket(description, type, amount) {
    const newTicket = {
        id: ticketID,
        author: currentUser[0].username,
        status: 'pending',
        description,
        type,
        amount
    }
    tickets.push(newTicket);
    logger.info(`Ticket created successfully (ID: ${ticketID}, User: ${currentUser[0].username})`);
    ticketID++;
    return `Ticket #${ticketID} submitted by user ${currentUser[0].username} successfully`;
}

function displayPendingTickets() {
    if (tickets.length == 0) {
        return 'There are currently no pending tickets to display';
    } else {
        // RESET CURRENT LIST OF PENDINGTICKETS BEFORE DISPLAY
        pendingTickets.splice(0, pendingTickets.length);

        // ADD ALL TICKETS WITH STATUS PENDING TO PENDINGTICKETS
        for (let i = 0; i < tickets.length; i++) {
            if (tickets[i].status == 'pending') {
                pendingTickets.push(tickets[i]);
            }
        }
        logger.info(`Displaying ${pendingTickets.length} pending tickets`);
        return `There are currently ${pendingTickets.length} pending tickets`;
    }
}

module.exports = {
    users,
    currentUser,
    tickets,
    pendingTickets,
    createNewUser,
    logout,
    login,
    submitTicket,
    displayPendingTickets
}
