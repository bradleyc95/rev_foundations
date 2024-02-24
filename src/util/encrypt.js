const bcrypt = require('bcrypt');
const saltRounds = 10;

async function encrypt(password) {
    const encrypted = await bcrypt.hash(password, saltRounds);
    return encrypted;
}

module.exports = {
    bcrypt,
    saltRounds,
    encrypt
}
