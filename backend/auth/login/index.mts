import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_STATUS } from "./utils/http";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { username, password } = event.body;

  if (!password || !username) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
    };
  }
  // TO DO
  const userToken = await this.authManager.logInUser(username, password);
  if (userToken) {
    // res.set("Access-Control-Expose-Headers", "x-auth-token");
    return {
      statusCode: HTTP_STATUS.SUCCESS,
      headers: { "x-auth-token": userToken },
    };
  }
  return {
    statusCode: HTTP_STATUS.UNAUTHORIZED,
  };
};
