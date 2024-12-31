import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_STATUS } from "./utils/http.js";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

async function findUser(email: string, table: string): Promise<GetCommandOutput | undefined> {
  var params = {
    TableName: table,
    Key: {
      Email: email,
    },
  };
  try {
    return await dynamodb.send(new GetCommand(params));
  } catch (error) {
    return undefined;
  }
}

// Needs proper type
export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const tableName = "Users";
  const { email, name, password } = event;

  if (!email || !name || !password) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      body: JSON.stringify({ message: "Missing required fields" }),
    };
  }

  const isExistingUser = await findUser(email, tableName);

  if (isExistingUser?.Item) {
    return {
      statusCode: HTTP_STATUS.CONFLICT,
      body: JSON.stringify({ message: "User already exists" }),
    };
  }

  const params = {
    TableName: tableName,
    Item: {
      UserID: `${Date.now()}`,
      Email: email,
      name,
      password,
    },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return {
      statusCode: HTTP_STATUS.CREATED,
      body: JSON.stringify({ message: "User added successfully" }),
    };
  } catch (error) {
    console.error("DynamoDB error:", error);
    return {
      statusCode: HTTP_STATUS.SERVER_ERROR,
      body: JSON.stringify({ message: `Error in DynamoDB: ${error.message}` }),
    };
  }
};
