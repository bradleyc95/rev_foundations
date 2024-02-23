const accountsDao = require('../repository/AccountsDAO');

async function createNewAccount(receivedData) {
    // Validate that required fields are not empty
    if (validateFields(receivedData)) {
        // Validate that no account with specified username already exists
        const doesExist = await accountDoesExist(receivedData.username);
        if (!doesExist) {
            const data = await accountsDao.createNewAccount({
                username: receivedData.username,
                password: receivedData.password,
                is_admin: receivedData.is_admin
            });
            return data;
        }
        return 'username already exists';
    }
    return null;
}

async function login(receivedData) {
    const data = await accountsDao.validateLogin(receivedData.username, receivedData.password);


    if (data.Items.length == 0) {
        return null;
    } else {
        return data;
    }
}

async function accountDoesExist(username) {
    const account = await accountsDao.getAccountByUsername(username);
    // console.log(account.Items);
    // console.log(account.Items.length);
    if (account.Items.length > 0) {
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
};
