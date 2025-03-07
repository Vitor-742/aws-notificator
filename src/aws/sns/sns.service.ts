import { Injectable } from '@nestjs/common';
import { snsClient } from './sns.client';
import {
  CreateTopicCommand,
  DeleteTopicCommand,
  ListTopicsCommand,
  SubscribeCommand,
} from '@aws-sdk/client-sns';

@Injectable()
export class SnsService {
  topicArn: string;

  async createTopic() {
    try {
      const response = await snsClient.send(
        new CreateTopicCommand({ Name: 'ProductsEmailSender' }),
      );

      if (response && response.TopicArn) {
        this.topicArn = response.TopicArn;
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async subscribeEmail(emailAddress: string) {
    if (!this.topicArn) {
      await this.retrieveArnTopic();
    }

    console.log(this.topicArn);

    const response = await snsClient.send(
      new SubscribeCommand({
        Protocol: 'email',
        TopicArn: this.topicArn,
        Endpoint: emailAddress,
      }),
    );

    console.log(response);

    return response;
  }

  async retrieveArnTopic() {
    if (this.topicArn) {
      return this.topicArn;
    }
    const response = await snsClient.send(new ListTopicsCommand({}));

    if (!response || !response.Topics) {
      throw new Error('Falha na comunicacao com AWS');
    }

    for (let topic of response.Topics) {
      console.log(topic);
      if (topic.TopicArn?.includes('ProductsEmailSender')) {
        console.log(topic.TopicArn);
        this.topicArn = topic.TopicArn;
        return this.topicArn;
      }
    }
    throw new Error('SNS Topic not found');
  }

  async deleteTopic() {
    try {
      await this.retrieveArnTopic();
      await snsClient.send(new DeleteTopicCommand({ TopicArn: this.topicArn }));
    } catch (error) {
      console.log('Erro ao deletar topico SNS:' + error);
    }
  }
}
