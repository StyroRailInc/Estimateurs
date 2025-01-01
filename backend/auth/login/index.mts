import { DynamoDBClient, QueryCommand, ReturnValue } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { HTTP_STATUS } from "./utils/http.js";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

interface LoginEvent {
  body: string;
}

interface LoginResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

async function findUser(email: string, table: string) {
  const params = {
    TableName: table,
    KeyConditionExpression: "Email = :email",
    ExpressionAttributeValues: {
      ":email": { S: email },
    },
  };
  try {
    return await dynamodb.send(new QueryCommand(params));
  } catch (error) {
    console.error("Error querying the table:", error);
    throw new Error("Failed to fetch user");
  }
}

export const handler = async (event: LoginEvent): Promise<LoginResponse> => {
  const tableName = "Users";
  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Missing required fields: email or password" }),
    };
  }

  try {
    const isExistingUser = await findUser(email, tableName);

    if (!isExistingUser?.Count) {
      return {
        statusCode: HTTP_STATUS.NOT_FOUND,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    if (!isExistingUser.Items[0].password === password) {
      return {
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Wrong credentials" }),
      };
    }

    const token = uuidv4();
    const params = {
      TableName: tableName,
      Key: { Email: email },
      UpdateExpression: "set #token = :token",
      ExpressionAttributeNames: { "#token": "token" },
      ExpressionAttributeValues: { ":token": token },
      ReturnValues: "ALL_NEW" as const,
    };

    await dynamodb.send(new UpdateCommand(params));
    return {
      statusCode: HTTP_STATUS.SUCCESS,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "x-auth-token",
        "x-auth-token": token,
      },
      body: JSON.stringify({ message: "User logged in successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: HTTP_STATUS.SERVER_ERROR,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: `Error processing request: ${error.message}` }),
    };
  }
};
