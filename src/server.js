const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {

});

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
