import { Injectable } from '@nestjs/common';
import { dynamoClient, dynamoDocClient } from './dynamodb.client';
import { CreateTableCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { default_create_table, TableName } from './dynamodb.contants';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { PutCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamodbService {
  async createTable() {
    try {
      const result = await dynamoClient.send(new CreateTableCommand(default_create_table));

      return result?.TableDescription?.TableArn;
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(createProductDto: CreateProductDto) {
    try {
      const { product_name, desired_price } = createProductDto;

      const command = new PutCommand({
        TableName,
        Item: {
          product_name,
          desired_price,
        },
      });

      const response = await dynamoDocClient.send(command);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(product_name: string) {
    const command = new DeleteCommand({
      TableName,
      Key: {
        product_name,
      },
    });

    const response = await dynamoDocClient.send(command);
    console.log(response);
    return response;
  }

  async listAll() {
    const command = new ScanCommand({ TableName });

    try {
      const { Items } = await dynamoDocClient.send(command);
      return Items;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTable() {
    try {
      const command = new DeleteTableCommand({
        TableName,
      });

      await dynamoClient.send(command);
    } catch (error) {
      console.log('Erro ao deletar tabela do dynamoDB:' + error);
    }
  }

  //   update(id: number, updateProductDto: UpdateProductDto) {
  //     return `This action updates a #${id} product`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} product`;
  //   }
}
