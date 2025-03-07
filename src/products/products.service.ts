import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DynamodbService } from 'src/aws/dynamodb/dynamodb.service';
import { SnsService } from 'src/aws/sns/sns.service';
import { IamService } from 'src/aws/iam/iam.service';
import { LambdaService } from 'src/aws/lambda/lambda.service';
import { EventbridgeService } from 'src/aws/eventbridge/eventbridge.service';

@Injectable()
export class ProductsService {
  constructor(
    private dynamodbService: DynamodbService,
    private snsService: SnsService,
    private iamService: IamService,
    private lambdaService: LambdaService,
    private eventbridgeService: EventbridgeService,
  ) {}
  dynamoDBArn: string;
  SNSTopicArn: string;
  lambdaRole: string;

  create(createProductDto: CreateProductDto) {
    return this.dynamodbService.createProduct(createProductDto);
  }

  deleteServices() {
    this.eventbridgeService.deleteEventBridgeRule();
    this.lambdaService.deleteFuntion();
    this.dynamodbService.deleteTable();
    this.snsService.deleteTopic();
    this.iamService.deleteRole();
  }

  async startServices() {
    try {
      this.dynamoDBArn = (await this.dynamodbService.createTable()) || '';
      await this.snsService.createTopic();

      this.SNSTopicArn = (await this.snsService.retrieveArnTopic()) || '';
      console.log(this.SNSTopicArn);

      this.lambdaRole =
        (await this.iamService.createRole(this.SNSTopicArn, this.dynamoDBArn)) || '';
    } catch (error) {
      console.log(error);
    }
  }

  async deployLambda() {
    try {
      const lambdaArn = await this.lambdaService.deployLambda(this.SNSTopicArn, this.lambdaRole);

      // rodar todos os dias 8am
      const RuleArn = await this.eventbridgeService.createEventBridgeRule(lambdaArn);
      await this.lambdaService.addLambdaPermission(RuleArn);
    } catch (error) {
      console.log(error);
    }
  }

  subscribeEmail(emailAddress: string) {
    return this.snsService.subscribeEmail(emailAddress);
  }

  findAll() {
    return this.dynamodbService.listAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(product_name: string) {
    try {
      this.dynamodbService.deleteProduct(product_name);
    } catch (error) {
      console.log(error);
    }
  }
}
