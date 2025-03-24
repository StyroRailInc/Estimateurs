import { AttributeValue, DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

class DatabaseManager {
  private table: string;
  private client = new DynamoDBClient({});
  private dynamodb = DynamoDBDocumentClient.from(this.client);

  constructor(table: string) {
    this.table = table;
  }

  async createUser(email: string, name: string, password: string) {
    const token = uuidv4();

    const params = {
      TableName: this.table,
      Item: {
        UserID: `${Date.now()}`,
        Email: email,
        name,
        password,
        token,
      },
    };

    try {
      await this.dynamodb.send(new PutCommand(params));
      return token;
    } catch (error) {
      return null;
    }
  }

  async findUser(email: string): Promise<Record<string, AttributeValue> | undefined | null> {
    const params = {
      TableName: this.table,
      KeyConditionExpression: "Email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
    };

    try {
      const user = await this.dynamodb.send(new QueryCommand(params));
      return user?.Items?.length === 1 ? user.Items[0] : null;
    } catch (error) {
      return undefined;
    }
  }

  async updateUserToken(user: Record<string, AttributeValue>): Promise<string | null> {
    if (!user?.Email?.S || !user?.UserID?.S) {
      return null;
    }

    const token = uuidv4();

    const params = {
      TableName: this.table,
      Key: { Email: user.Email.S, UserID: user.UserID.S },
      UpdateExpression: "set #token = :token",
      ExpressionAttributeNames: { "#token": "token" },
      ExpressionAttributeValues: { ":token": token },
      ReturnValues: "ALL_NEW" as const,
    };

    try {
      await this.dynamodb.send(new UpdateCommand(params));
      return token;
    } catch (error) {
      return null;
    }
  }

  async deleteUserToken(user: Record<string, AttributeValue>) {
    if (!user?.Email?.S || !user?.UserID?.S) {
      return false;
    }

    const params = {
      TableName: this.table,
      Key: { Email: user.Email.S, UserID: user.UserID.S },
      UpdateExpression: "REMOVE #token",
      ExpressionAttributeNames: { "#token": "token" },
      ReturnValues: "ALL_NEW" as const,
    };

    try {
      await this.dynamodb.send(new UpdateCommand(params));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Need to add another submission attribute such as ISO date
  async deleteSubmission(user: Record<string, AttributeValue>, submissionName: string) {
    let buildBlock;
    try {
      buildBlock = JSON.parse(user.buildblock?.S || "[]");
    } catch (error) {
      return false;
    }

    const updatedSumbissions = buildBlock.filter(
      (submission: any) => submission.name !== submissionName
    );

    const params = {
      TableName: this.table,
      Key: { Email: user.Email.S, UserID: user.UserID.S },
      UpdateExpression: "set #buildblock = :buildblock",
      ExpressionAttributeNames: { "#buildblock": "buildblock" },
      ExpressionAttributeValues: { ":buildblock": JSON.stringify(updatedSumbissions) },
      ReturnValues: "ALL_NEW" as const,
    };

    try {
      await this.dynamodb.send(new UpdateCommand(params));
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateSubmissions(user: Record<string, AttributeValue>, submissions: object) {
    const params = {
      TableName: this.table,
      Key: { Email: user.Email.S, UserID: user.UserID.S },
      UpdateExpression: "set #buildblock = :buildblock",
      ExpressionAttributeNames: { "#buildblock": "buildblock" },
      ExpressionAttributeValues: { ":buildblock": JSON.stringify(submissions) },
      ReturnValues: "ALL_NEW" as const,
    };

    try {
      await this.dynamodb.send(new UpdateCommand(params));
      return true;
    } catch (error) {
      return false;
    }
  }

  async replaceSubmissions(user: Record<string, AttributeValue>, submissions: object) {
    const params = {
      TableName: this.table,
      Key: { Email: user.Email.S, UserID: user.UserID.S },
      UpdateExpression: "set #buildblock = :buildblock",
      ExpressionAttributeNames: { "#buildblock": "buildblock" },
      ExpressionAttributeValues: { ":buildblock": JSON.stringify(submissions) },
      ReturnValues: "ALL_NEW" as const,
    };

    try {
      await this.dynamodb.send(new UpdateCommand(params));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default DatabaseManager;
