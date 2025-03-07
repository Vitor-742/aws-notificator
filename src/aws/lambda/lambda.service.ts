import { Injectable } from '@nestjs/common';
import {
  AddPermissionCommand,
  CreateFunctionCommand,
  DeleteFunctionCommand,
  UpdateFunctionConfigurationCommand,
} from '@aws-sdk/client-lambda';
import { readFileSync } from 'fs';
import { lambdaClient } from './lambda.client';

@Injectable()
export class LambdaService {
  async deleteFuntion() {
    try {
      const command = new DeleteFunctionCommand({ FunctionName: 'LambdaProducts' });
      return await lambdaClient.send(command);
    } catch (error) {
      console.log('Erro ao deletar funcao lambda:' + error);
    }
  }

  async addLambdaPermission(sourceArn: string) {
    console.log(sourceArn);
    try {
      const permissionCommand = new AddPermissionCommand({
        FunctionName: 'LambdaProducts',
        StatementId: 'AllowEventBridgeInvoke',
        Action: 'lambda:InvokeFunction',
        Principal: 'events.amazonaws.com',
        SourceArn: sourceArn,
      });

      const response = await lambdaClient.send(permissionCommand);
      console.log('Permissão adicionada:', response);
    } catch (error) {
      console.error('Erro ao adicionar permissão:', error);
    }
  }

  async deployLambda(SNSTopicArn: string, LambdaRole: string) {
    try {
      if (!LambdaRole) {
        throw new Error('Role Lambda nao encontrada');
      }

      if (!SNSTopicArn) {
        throw new Error('SNS Topic nao encontrado');
      }

      const zipFile = readFileSync('./src/lambda_function/lambda_function.zip');

      const envVariables = {
        SNS_TOPIC_ARN: SNSTopicArn,
      };

      const createCommand = new CreateFunctionCommand({
        FunctionName: 'LambdaProducts',
        Runtime: 'nodejs18.x',
        Role: LambdaRole,
        Handler: 'index.handler',
        Code: { ZipFile: zipFile },
        Environment: { Variables: envVariables },
        Timeout: 5,
      });

      const response = await lambdaClient.send(createCommand);

      console.log('Lambda implantada com sucesso');

      return response.FunctionArn;

      // return { message: `Lambda ${lambdaName} implantada com sucesso!` };
    } catch (error) {
      console.error(`❌ Erro ao subir Lambda:`, error);
      throw error;
    }
  }
}
