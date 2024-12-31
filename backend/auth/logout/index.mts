import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_STATUS } from "./utils/http";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userToken = event.get("Authorization").split(" ")[1];

  if (!userToken) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
    };
  }
  // TO DO
  const userIsLoggedOff = await this.authManager.logOffUser(userToken);

  if (userIsLoggedOff) {
    return {
      statusCode: HTTP_STATUS.NO_CONTENT,
    };
  }
  return {
    statusCode: HTTP_STATUS.UNAUTHORIZED,
  };
};
