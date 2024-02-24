const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand} = require('@aws-sdk/lib-dynamodb');
const logger = require('../util/logger');

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);
const TableName = 'FoundationsTickets';


async function createTicket(Item) {
    const command = new PutCommand({
        TableName,
        Item
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
    }
    return null;
}

async function getTicketsByUsername(username) {
    const command = new ScanCommand({
        TableName,
        FilterExpression:'author = :username',
        ExpressionAttributeValues: {':username': username}
    });

    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        logger.error(error);
    }
    return null;
}

async function getTicketsByUsernameAndType(username, typeQuery) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: 'author = :username AND #type = :type',
        ExpressionAttributeNames: {'#type': 'type'},
        ExpressionAttributeValues: {
            ':username': username,
            ':type': typeQuery
        }
    });

    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        logger.error(error);
    }
    return null;
}

async function getPendingTickets() {
    // const status = 'pending';
    const command = new ScanCommand({
        TableName,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {'#status': 'status'},
        ExpressionAttributeValues: {':status': 'pending'}
    });

    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        logger.error(error);
    }
    return null;
}

module.exports = {
    createTicket,
    getTicketsByUsername,
    getTicketsByUsernameAndType,
    getPendingTickets
}
