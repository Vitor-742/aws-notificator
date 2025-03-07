import { Module } from '@nestjs/common';
import { DynamodbService } from './dynamodb/dynamodb.service';
import { SnsService } from './sns/sns.service';
import { LambdaService } from './lambda/lambda.service';
import { IamService } from './iam/iam.service';
import { EventbridgeService } from './eventbridge/eventbridge.service';

@Module({
  providers: [DynamodbService, SnsService, LambdaService, IamService, EventbridgeService],
  exports: [DynamodbService, SnsService, IamService, LambdaService, EventbridgeService],
})
export class AwsModule {}
