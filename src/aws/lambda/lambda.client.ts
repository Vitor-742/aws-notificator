import { LambdaClient } from '@aws-sdk/client-lambda';

export const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'chave de acesso',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'chave de acesso secreta',
  },
});
