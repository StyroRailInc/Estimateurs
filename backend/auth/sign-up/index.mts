import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { HTTP_STATUS } from "./utils/http.js";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

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
    return undefined;
  }
}
// Needs proper type
export const handler = async (event: any) => {
  const tableName = "Users";
  const { email, name, password } = JSON.parse(event.body);
  if (!email || !name || !password) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Missing required fields : email, name and password" }),
    };
  }
  const isExistingUser = await findUser(email, tableName);
  if (isExistingUser?.Count) {
    return {
      statusCode: HTTP_STATUS.CONFLICT,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Email already selected" }),
    };
  }

  const token = uuidv4();

  const params = {
    TableName: tableName,
    Item: {
      UserID: `${Date.now()}`,
      Email: email,
      name,
      password,
      token,
    },
  };
  try {
    await dynamodb.send(new PutCommand(params));
    return {
      statusCode: HTTP_STATUS.CREATED,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "x-auth-token",
        "x-auth-token": token,
      },
      body: JSON.stringify({ message: "User added successfully" }),
    };
  } catch (error) {
    console.error("DynamoDB error:", error);
    return {
      statusCode: HTTP_STATUS.SERVER_ERROR,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: `Error in DynamoDB: ${error.message}` }),
    };
  }
};
