import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { HTTP_STATUS } from "./utils/http.js";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

interface UpdateEvent {
  body: string;
}

interface UpdateResponse {
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
    if (user?.Items && user?.Items.length === 1) {
      return user.Items[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error querying the table:", error);
    throw new Error("Failed to fetch user");
  }
}

export const handler = async (event: any): Promise<UpdateResponse> => {
  const tableName = "Users";
  const { email } = event.queryStringParameters;
  const token = event.headers.Authorization;
  const payload = JSON.parse(event.body);

  // Add payload verification later
  if (!email || !token || !payload) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Missing required fields: email, token or payload" }),
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
        body: JSON.stringify({ message: `Invalid token ${token}` }),
      };
    }

    const params = {
      TableName: tableName,
      Key: { Email: email, UserID: user.UserID.S },
      UpdateExpression: "set #buildblock = :buildblock",
      ExpressionAttributeNames: { "#buildblock": "buildblock" },
      ExpressionAttributeValues: { ":buildblock": JSON.stringify(payload) },
      ReturnValues: "ALL_NEW" as const,
    };

    await dynamodb.send(new UpdateCommand(params));
    return {
      statusCode: HTTP_STATUS.CREATED,
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
