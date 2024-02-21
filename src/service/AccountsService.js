const accountsDao = require('../repository/AccountsDAO');
const currentUser = [];

async function createNewAccount(receivedData) {
    // Validate that required fields are not empty
    if (validateFields(receivedData)) {
        // Validate that no account with specified username already exists
        if (!accountDoesExist(receivedData.username)) {
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
        logout();
        currentUser.push(data.Items[0]);
        return data;
    }
}

function logout() {
    currentUser.splice(0, currentUser.length);
}

function accountDoesExist(username) {
    if (accountsDao.getAccountByUsername(username)) {
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
    currentUser
};
