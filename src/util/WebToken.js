const jwt = require('jsonwebtoken');
require('dotenv').config();

// secret key
const secretKey = process.env.SECRET_KEY;

function generateToken(user) {
    const token = jwt.sign(
        {
            username: user.username,
            is_admin: user.is_admin
        },
        secretKey,
        {
            expiresIn: '60m'
        }
    );
    return token;
}

function authenticateToken(token) {
    jwt.verify(token, secretKey, (err, user) => {
        // console.log(user);
        if (err) {
            return false;
        } else {
            // console.log('I am here')
            return user;
        }
    })
}

function isAdmin(token) {
    const decoded = jwt.decode(token);
    return decoded.is_admin;
}


module.exports = {
    jwt,
    secretKey,
    generateToken,
    authenticateToken,
    isAdmin
}
