const {logger} = require('./util/logger');

const users = [];

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

module.exports = {
    users,
    createNewUser
}
