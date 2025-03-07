import { Injectable } from '@nestjs/common';
import { iamClient } from './iam.client';
import {
  CreateRoleCommand,
  DeletePolicyCommand,
  DeleteRoleCommand,
  DeleteRolePolicyCommand,
  PutRolePolicyCommand,
} from '@aws-sdk/client-iam';

@Injectable()
export class IamService {
  async createRole(SNSTopicArn, dynamoDBArn) {
    const roleParams = {
      RoleName: 'MyProductsRole',
      AssumeRolePolicyDocument: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { Service: 'lambda.amazonaws.com' },
            Action: 'sts:AssumeRole',
          },
        ],
      }),
    };

    const role = await iamClient.send(new CreateRoleCommand(roleParams));

    const policyParams = {
      RoleName: 'MyProductsRole',
      PolicyName: 'MyProductsPolicy',
      PolicyDocument: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:Scan'],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['sns:Publish'],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
            Resource: '*',
          },
        ],
      }),
    };

    await iamClient.send(new PutRolePolicyCommand(policyParams));

    return role.Role?.Arn;
  }

  async deleteRole() {
    try {
      const policyComand = new DeleteRolePolicyCommand({
        RoleName: 'MyProductsRole',
        PolicyName: 'MyProductsPolicy',
      });
      await iamClient.send(policyComand);
    } catch (error) {
      console.log('Erro ao deletar Role Policy' + error);
    }

    try {
      const command = new DeleteRoleCommand({ RoleName: 'MyProductsRole' });
      return await iamClient.send(command);
    } catch (error) {
      console.log('Erro ao deletar Role:' + error);
    }
  }
}
