const bcrypt = require('bcrypt');
const saltRounds = 10;

async function encrypt(password) {
    const encrypted = await bcrypt.hash(password, saltRounds);
    return encrypted;
}

async function validatePassword(receivedData, storedData) {
    return bcrypt.compare(receivedData, storedData);
}

module.exports = {
    bcrypt,
    saltRounds,
    encrypt,
    validatePassword
}
