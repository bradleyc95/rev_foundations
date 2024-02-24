const accountsDao = require('../repository/AccountsDAO');
const encrypt = require('../util/encrypt');

async function createNewAccount(receivedData) {
    // Validate that required fields are not empty
    if (validateFields(receivedData)) {
        // Validate that no account with specified username already exists
        const doesExist = await accountDoesExist(receivedData.username);
        if (!doesExist) {
            const encryptedPassword = await encrypt.encrypt(receivedData.password);
            const data = await accountsDao.createNewAccount({
                username: receivedData.username,
                password: encryptedPassword,
                is_admin: receivedData.is_admin
            });
            return data;
        }
        return 'username already exists';
    }
    return null;
}

async function login(receivedData) {
    const data = await accountsDao.getAccountByUsername(receivedData.username);
    console.log(data);

    if (data.Items.length == 0 || !(await encrypt.validatePassword(receivedData.password, data.Items[0].password))) {
        return null;
    } else {
        return data;
    }
}

async function accountDoesExist(username) {
    const data = await accountsDao.getAccountByUsername(username);
    if (data.Items.length > 0) {
        console.log(`An account with username: ${username} already exists`);
        return true;
    }
    return false;
}

function validateFields(data) {
    if (!data.username || !data.password || typeof data.is_admin != 'boolean') {
        return false;
    }
    return true;
}


module.exports = {
    createNewAccount,
    login,
    accountDoesExist,
    validateFields
};
