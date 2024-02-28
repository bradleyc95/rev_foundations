const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand} = require('@aws-sdk/lib-dynamodb');
const logger = require('../util/logger');

const client = new DynamoDBClient({region: 'us-east-1'});
const documentClient = DynamoDBDocumentClient.from(client);
const TableName = 'FoundationsAccounts';

async function createNewAccount(Item) {
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

async function getAccountByUsername(username) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {':username': username}
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
    }
    return null;
}

async function validateLogin(username, password) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: 'username = :username',
        FilterExpression: 'password = :password',
        ExpressionAttributeValues: {
            ':username': username,
            ':password': password
        }
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
    }
    return null;
}

async function updateProfile(username, receivedData) {
    const command = new UpdateCommand({
        TableName,
        Key: {username: username},
        UpdateExpression: 'set profile_info = :info',
        ExpressionAttributeValues: {':info': receivedData},
        ReturnValues: 'ALL_NEW'
    })

    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
    }
    return null;
}


module.exports = {
    createNewAccount,
    getAccountByUsername,
    validateLogin,
    updateProfile,
};
