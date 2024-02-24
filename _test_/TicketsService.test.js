const {createTicket, getTicketsByUsername, getTicketsByUsernameAndType, validateTicket} = require('../src/service/TicketsService');

const ticketsDao = require('../src/repository/TicketsDAO');

describe('createTicket Tests', () => {

    test('should return data successfully', async () => {
        const receivedData = {description: 'description', type: 'Travel', amount: 1000};
        const username = 'revature';
        jest.spyOn(ticketsDao, 'createTicket').mockReturnValueOnce({Items: [{ticket: 'ticket'}]});

        const result = await createTicket(receivedData, username);
        const expected = {Items: [{ticket: 'ticket'}]};

        expect(result).toStrictEqual(expected);
    })

    test('should return null -- ticket not validated', async () => {
        const receivedData = {description: 'description', type: 'Travel', amount: ''};
        const username = 'revature';

        const result = await createTicket(receivedData, username);
        const expected = null;

        expect(result).toBe(expected);
    })
});

describe('getTicketsByUsername Tests', () => {

    test('should return data successfully', async () => {
        const username = 'revature';
        jest.spyOn(ticketsDao, 'getTicketsByUsername').mockReturnValueOnce({ticket1: 'ticket1', ticket2: 'ticket2'});

        const result = await getTicketsByUsername(username);
        const expected = {ticket1: 'ticket1', ticket2: 'ticket2'};

        expect(result).toStrictEqual(expected);
    })
});

describe('getTicketsByUsernameAndType Tests', () => {

    test('should return data successfully', async () => {
        const username = 'revature';
        const type = 'Travel';
        jest.spyOn(ticketsDao, 'getTicketsByUsernameAndType').mockReturnValueOnce({ticket1: 'ticket1', ticket2: 'ticket2'})

        const result = await getTicketsByUsernameAndType(username, type);
        const expected = {ticket1: 'ticket1', ticket2: 'ticket2'};

        expect(result).toStrictEqual(expected);
    })
});

describe('validateTicket Tests', () => {
    
    test('should return false -- missing description', () => {
        const receivedData = {description: '', type: 'Travel', amount: 1000};

        const result = validateTicket(receivedData);
        const expected = false;

        expect(result).toBe(expected);
    });

    test('should return false -- missing type', () => {
        const receivedData = {description: 'description', type: '', amount: 1000};

        const result = validateTicket(receivedData);
        const expected = false;

        expect(result).toBe(expected);
    });

    test('should return false -- missing amount', () => {
        const receivedData = {description: 'description', type: 'Travel', amount: ''};

        const result = validateTicket(receivedData);
        const expected = false;

        expect(result).toBe(expected);
    });

    test('should return true -- no missing fields', () => {
        const receivedData = {description: 'description', type: 'Travel', amount: 1000};

        const result = validateTicket(receivedData);
        const expected = true;

        expect(result).toBe(expected);
    });
});
