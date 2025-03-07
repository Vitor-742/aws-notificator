import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import * as dotenv from 'dotenv';
dotenv.config();

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'chave de acesso',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'chave de acesso secreta',
  },
});

const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

export { dynamoClient, dynamoDocClient };
