import { KeyType, ScalarAttributeType } from "@aws-sdk/client-dynamodb";

export const default_create_table = {
    AttributeDefinitions: [
      {
        AttributeName: "product_name",
        AttributeType: ScalarAttributeType.S
      },
      // {
      //   AttributeName: "desired_price",
      //   AttributeType: ScalarAttributeType.N
      // }
    ],
    KeySchema: [
      {
        AttributeName: "product_name",
        KeyType: KeyType.HASH
      }
    ],
    TableName: "Products",
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
};

export const TableName = "Products"
