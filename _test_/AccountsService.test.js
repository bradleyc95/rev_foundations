const {
    createNewAccount,
    login,
    accountDoesExist,
    validateFields
} = require('../src/service/AccountsService');
const accountsDao = require('../src/repository/AccountsDAO');
const encrypt = require('../src/util/encrypt');




describe('createNewAccount Tests', () => {

    test('should return data sucessfully', async () => {
        const receivedData = {
            username: 'revature',
            password: 'password123',
            is_admin: false
        };
        jest.spyOn(accountsDao, 'getAccountByUsername').mockReturnValueOnce({
            Items: []
        });
        jest.spyOn(encrypt, 'encrypt').mockReturnValueOnce('password123');
        jest.spyOn(accountsDao, 'createNewAccount').mockReturnValueOnce({
            Items: [{
                username: 'revature',
                password: 'password123',
                is_admin: false
            }]
        })

        const result = await createNewAccount(receivedData);
        const expected = {
            Items: [{
                username: 'revature',
                password: 'password123',
                is_admin: false
            }]
        };

        expect(result).toStrictEqual(expected);
    });

    test('should return username already exists', async () => {
        const receivedData = {
            username: 'revature',
            password: 'password123',
            is_admin: false
        };
        jest.spyOn(accountsDao, 'getAccountByUsername').mockReturnValueOnce({
            Items: [{username: 'revature', password: 'password123', is_admin: false}]
        });

        const result = await createNewAccount(receivedData);
        const expected = 'username already exists';

        expect(result).toBe(expected);
    });

    test('should return null -- missing required fields', async () => {
        const receivedData = {
            username: 'revature',
            password: '',
            is_admin: false
        };

        const result = await createNewAccount(receivedData);
        const expected = null;

        expect(result).toBe(expected);
    })

})

describe('login Tests', () => {

    test('should return data successfully', async () => {
        const receivedData = {
            username: 'revature',
            password: 'password123'
        };
        jest.spyOn(accountsDao, 'getAccountByUsername').mockReturnValueOnce({
            Items: [{
                password: 'password123',
                username: 'revature',
                is_admin: false
            }]
        });
        jest.spyOn(encrypt, 'validatePassword').mockReturnValueOnce(true);
        
        const result = await login(receivedData);
        const expected = {
            Items: [{
                password: 'password123',
                username: 'revature',
                is_admin: false
            }]
        }

        expect(result).toStrictEqual(expected);
    });

    test('should return null -- wrong password', async () => {
        const receivedData = {
            username: 'revature',
            password: 'password124'
        }
        jest.spyOn(accountsDao, 'getAccountByUsername').mockReturnValueOnce({
            Items: [{
                password: 'password123',
                username: 'revature',
                is_admin: false
            }]
        });
        jest.spyOn(encrypt, 'validatePassword').mockReturnValueOnce(false);

        const result = await login(receivedData);
        const expected = null;

        expect(result).toBe(expected);
    });

    test('should return null -- no account found with provided username', async () => {
        const receivedData = {
            username: 'revatu',
            password: 'password123'
        }
        jest.spyOn(accountsDao, 'getAccountByUsername').mockReturnValueOnce({
            Items: []
        });
        jest.spyOn(encrypt, 'validatePassword').mockReturnValueOnce(false);

        const result = await login(receivedData);
        const expected = null;

        expect(result).toBe(expected);
    }) 

})

describe('accountDoesExist Tests', () => {

        test('should return false', async () => {
            const username = 'revature';
            jest.spyOn(accountsDao, 'getAccountByUsername').mockReturnValueOnce({Items: []});

            const result = await accountDoesExist(username);
            const expected = false;

            expect(result).toBe(expected);
        })

        test('should return true', async () => {
            const username = 'revature';
            jest.spyOn(accountsDao, 'getAccountByUsername').mockReturnValueOnce({Items: [{username: 'revature', password: 'password123', is_admin: false}]});

            const result = await accountDoesExist(username);
            const expected = true;

            expect(result).toBe(expected);
        })
})

describe('validateFields Tests', () => {

    test('should return false -- missing username', () => {
        const data = {username: '', password: 'password123', is_admin: false};

        const result = validateFields(data);
        const expected = false;

        expect(result).toBe(expected);
    });

    test('should return false -- missing password', () => {
        const data = {username: 'revature', password: '', is_admin: false};

        const result = validateFields(data);
        const expected = false;

        expect(result).toBe(expected);
    });

    test('should return false -- missing is_admin', () => {
        const data = {username: 'revature', password: 'password123', is_admin: ''};

        const result = validateFields(data);
        const expected = false;

        expect(result).toBe(expected);
    });

    test('should return true -- no missing fields', () => {
        const data = {username: 'revature', password: 'password123', is_admin: false};

        const result = validateFields(data);
        const expected = true;

        expect(result).toBe(expected);
    });
})
