import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { PublishCommand } from '@aws-sdk/client-sns';
// import { snsClient } from "./libs/snsClient.js";
// import { dynamoClient } from "./libs/dynamoClient.js";
import { SNSClient } from '@aws-sdk/client-sns';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';

const config = {
  region: process.env.AWS_REGION,
};

const snsClient = new SNSClient(config);
const dynamoClient = new DynamoDBClient(config);

const SNSTopicArn = process.env.SNS_TOPIC_ARN;

const defaultParams = {
  ProjectionExpression: 'desired_price, product_name',
  TableName: 'Products',
};

export const handler = async () => {
  async function retriveDBData() {
    return await dynamoClient.send(new ScanCommand(defaultParams));
  }

  async function retriveMeliData(items) {
    const minorPriceItems = {};
    //items.forEach(async (element, idx, arr) => {
    for (const item of items) {
      item.product_name.S.replace(' ', '%20');
      let response = await fetch(
        'https://api.mercadolibre.com/sites/MLB/search?q=' + item.product_name.S,
      );
      response = await response.json();

      let idxMinorPrice = 0;
      response['results'].forEach((element, idx, arr) => {
        if (element['price'] < arr[idxMinorPrice]['price']) {
          idxMinorPrice = idx;
        }
      });
      //console.log(item)
      minorPriceItems[item.product_name.S] = {
        price: response['results'][idxMinorPrice]['price'],
        link: response['results'][idxMinorPrice]['permalink'],
      };
    }

    return minorPriceItems;
  }

  function getDreamPrices(desiredProducts, meliProducts) {
    const dreamProductsList = [];
    for (const dProduct of desiredProducts) {
      if (dProduct.desired_price.N > meliProducts[dProduct.product_name.S]['price']) {
        dreamProductsList.push({
          ...meliProducts[dProduct.product_name.S],
          desired_price: dProduct.desired_price.N,
          product_name: dProduct.product_name.S,
        });
      }
    }
    return dreamProductsList;
  }

  async function sendEmail(Products) {
    if (Products.length === 0) {
      return;
    }

    let message = '';
    for (const { product_name, price, link, desired_price } of Products) {
      message += `Hoje ${product_name} está com valor de ${price} reais, abaixo do valor requisitado de ${desired_price}.\nLink: ${link}\n\n`;
    }

    const textParams = {
      Message: message,
      TopicArn: SNSTopicArn,
    };

    try {
      await snsClient.send(new PublishCommand(textParams));
      console.log('Message sent');
    } catch (err) {
      console.log('Error, message not sent ', err);
    }
  }

  try {
    // Read DynamoDB
    const totalProducts = await retriveDBData();

    // Retrive data from Mercado Livre
    const meliProducts = await retriveMeliData(totalProducts.Items);
    console.log(meliProducts);

    // Filter products with required prices
    const dreamProducts = getDreamPrices(totalProducts.Items, meliProducts);
    // console.log(dreamProducts);

    // Send Email by SNS
    sendEmail(dreamProducts);
  } catch (err) {
    console.log('Error: ', err);
  }
};
