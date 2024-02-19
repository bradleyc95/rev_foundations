const http = require('http');
const PORT = 3000;

const {users, createNewUser} = require('./foundationsFunctions');

const server = http.createServer((req, res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    })
    .on('end', () => {
        body = body.length > 0 ? JSON.parse(body) : {};
        const contentType = {'Content-Type': 'application/json'};

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

        } else if (req.method == 'POST' && req.url == '/login') {

        }

    });

});

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
