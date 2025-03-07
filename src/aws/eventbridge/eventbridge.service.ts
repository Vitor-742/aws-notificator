import {
  DeleteRuleCommand,
  PutRuleCommand,
  PutTargetsCommand,
  RemoveTargetsCommand,
} from '@aws-sdk/client-eventbridge';
import { eventBridgeClient } from './eventbridge.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventbridgeService {
  ruleName = 'DailyLambdaProductsTrigger';
  targetId = 'LambdaProductsTarget';

  createEventBridgeRule = async (lambdaArn) => {
    const ruleCommand = new PutRuleCommand({
      Name: this.ruleName,
      ScheduleExpression: 'cron(0 23 * * ? *)',
      State: 'ENABLED',
    });

    const ruleResponse = await eventBridgeClient.send(ruleCommand);
    console.log('Regra do EventBridge criada:', ruleResponse);

    // Associar a regra à função Lambda
    const targetCommand = new PutTargetsCommand({
      Rule: this.ruleName,
      Targets: [{ Arn: lambdaArn, Id: this.targetId }],
    });

    const targetResponse = await eventBridgeClient.send(targetCommand);
    console.log('Alvo associado à regra do EventBridge:', targetResponse);

    return ruleResponse.RuleArn || '';
  };

  deleteEventBridgeRule = async () => {
    try {
      // Remover os alvos da regra antes de deletá-la
      const removeTargetsCommand = new RemoveTargetsCommand({
        Rule: this.ruleName,
        Ids: [this.targetId],
      });

      await eventBridgeClient.send(removeTargetsCommand);
      console.log(`Alvos removidos da regra: ${this.ruleName}`);

      // Agora deletamos a regra
      const deleteRuleCommand = new DeleteRuleCommand({
        Name: this.ruleName,
      });

      await eventBridgeClient.send(deleteRuleCommand);
      console.log(`Regra deletada: ${this.ruleName}`);
    } catch (error) {
      console.error(`Erro ao deletar regra ${this.ruleName}`);
    }
  };
}
