import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { HTTP_STATUS } from "./utils/http.js";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

interface DeleteResponse {
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

// Add event type
export const handler = async (event: any): Promise<DeleteResponse> => {
  const tableName = "Users";
  const { email, name } = event.queryStringParameters;
  const token = event.headers.Authorization;

  if (!email || !name || !token) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Missing required fields: email, name or token" }),
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

    let buildBlock = JSON.parse(user.buildblock?.S || "[]");

    const updatedSumbissions = buildBlock.filter((submission: any) => submission.name !== name);

    if (updatedSumbissions.length === buildBlock.length) {
      return {
        statusCode: HTTP_STATUS.NOT_FOUND,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: `Resource with name ${name} does not exist` }),
      };
    }

    const params = {
      TableName: tableName,
      Key: { Email: email, UserID: user.UserID.S },
      UpdateExpression: "set #buildblock = :buildblock",
      ExpressionAttributeNames: { "#buildblock": "buildblock" },
      ExpressionAttributeValues: { ":buildblock": JSON.stringify(updatedSumbissions) },
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
