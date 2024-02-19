const http = require('http');
const PORT = 3000;

const {users, currentUser, tickets, pendingTickets, createNewUser, logout, login, submitTicket, displayPendingTickets} = require('./foundationsFunctions');

const server = http.createServer((req, res) => {
    let body = '';
    
    req.on('data', (chunk) => {
        body += chunk;
    })
    .on('end', () => {
        body = body.length > 0 ? JSON.parse(body) : {};
        const contentType = {'Content-Type': 'application/json'};

        // USER LOGIN AND REGISTRATION
        if (req.method == 'POST' && req.url == '/register') {
            // REGISTERING NEW USERS
            const {username, password, admin} = body;

            // ERROR HANDLING: EMPTY FIELDS
            if (!username || !password) {
                res.writeHead(400, contentType);
                res.end(JSON.stringify({message: 'Please provide a username and password'}));
            } else {
                // ERROR HANDLING: USERNAME ALREADY EXISTS
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username == username) {
                        res.writeHead(400, contentType);
                        res.end(JSON.stringify({message: 'Username already exists'}));
                    }
                }

                // CREATE NEW USER 
                const postMessage = createNewUser(username, password, admin);
                res.writeHead(201, contentType);
                res.end(JSON.stringify({postMessage, users}));
            }

        // USER LOGIN
        } else if (req.method == 'POST' && req.url == '/login') {
            const {username, password} = body;

            // ERROR HANDLING: MISSING FIELDS
            if (!username || !password) {
                res.writeHead(400, contentType);
                res.end(JSON.stringify({message: 'Please provide a username and password'}));
            } else {
                const postMessage = login(username, password);

                // login returns 0 on fail
                if (postMessage == 0) {
                    res.writeHead(400, contentType);
                    res.end(JSON.stringify({message: 'Username or password do not match any profiles on record'}));
                } else {
                    res.writeHead(201, contentType);
                    let user = currentUser[0];
                    res.end(JSON.stringify({postMessage, user}));
                }
            }

        // LOGOUT CURRENT USER -- MOSTLY FOR TESTING PURPOSES
        } else if (req.method == 'POST' && req.url == '/logout') {
            if (currentUser.length > 0) {
                const postMessage = logout();
                res.writeHead(201, contentType);
                res.end(JSON.stringify({postMessage}));
            } else {
                res.writeHead(400, contentType);
                res.end(JSON.stringify({message: 'No user is currently logged in'}));
            }
            
        // TICKET SUBMISSION
        } else if (req.method == 'POST' && req.url == '/tickets') {
            const {description, type, amount} = body;

            // ERROR HANDLING
            if (currentUser.length == 0) {
                // NOT LOGGED IN
                res.writeHead(400, contentType);
                res.end(JSON.stringify({message: 'You must be logged in to submit a ticket'}))
            } else if (!description || !type || !amount) {
                // MISSING FIELD
                res.writeHead(400, contentType);
                res.end(JSON.stringify({message: 'Unable to submit ticket, tickets MUST contain a description, type, and amount'}));
            } else {
                // CREATE NEW TICKET
                const postMessage = submitTicket(description, type, amount);
                res.writeHead(201, contentType);
                res.end(JSON.stringify({postMessage}));
            }
        
        // TICKETING SYSTEM -- VIEW PENDING TICKETS (ADMIN ACCESS ONLY)
        } else if (req.method == 'GET' && req.url == '/tickets?status=Pending') {
            // CHECK FOR ADMIN PRIVELEGES
            if (currentUser[0].admin == false) {
                res.writeHead(400, contentType);
                res.end(JSON.stringify({message: 'Access denied -- You do not have administrative privileges'}));
            } else {
                // ACCESS GRANTED -- DISPLAY ALL PENDING TICKETS
                const postMessage = displayPendingTickets();
                res.writeHead(201, contentType);
                res.end(JSON.stringify({postMessage, pendingTickets}));
            }
        }

    });

});

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
