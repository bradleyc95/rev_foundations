const {createLogger, transports, format} = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({filename: 'error.log', level: 'error'}),
        new transports.File({filename: 'app.log'})
    ]
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error}`);
    process.exit(1);
});

module.exports = {logger};
