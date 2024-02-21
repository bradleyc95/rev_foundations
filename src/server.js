const express = require('express');
const app = express();
const accountsRouter = require('./controller/AccountsRouter');
const ticketsRouter = require('./controller/TicketsRouter');
const logger = require('./util/logger');
const PORT = 3000;

app.use(express.json());
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} to ${req.url}`);
    next();
});

// ACCOUNTS
app.use('/account', accountsRouter);

// TICKETS
app.use('/ticket', ticketsRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
