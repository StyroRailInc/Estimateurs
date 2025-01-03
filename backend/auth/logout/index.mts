import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { HTTP_STATUS } from "./utils/http.js";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

interface LogoutEvent {
  body: string;
}

interface LogoutResponse {
  statusCode: number;
  headers: Record<string, string>;
  body?: string;
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
    const user = await dynamodb.send(new QueryCommand(params));
    if (user?.Items && user.Count === 1) {
      return user.Items[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error querying the table:", error);
    throw new Error("Failed to fetch user");
  }
}

export const handler = async (event: LogoutEvent): Promise<LogoutResponse> => {
  const tableName = "Users";
  const { email, token } = JSON.parse(event.body);

  if (!email || !token) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Missing required fields: email or token" }),
    };
  }

  try {
    const user = await findUser(email, tableName);

    if (!user) {
      return {
        statusCode: HTTP_STATUS.NOT_FOUND,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    if (user.token.S !== token) {
      return {
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Wrong token" }),
      };
    }

    const params = {
      TableName: tableName,
      Key: { Email: email, UserID: user.UserID.S },
      UpdateExpression: "REMOVE #token",
      ExpressionAttributeNames: { "#token": "token" },
      ReturnValues: "ALL_NEW" as const,
    };

    await dynamodb.send(new UpdateCommand(params));
    return {
      statusCode: HTTP_STATUS.NO_CONTENT,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
