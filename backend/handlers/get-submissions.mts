import { HTTP_STATUS } from "../utils/http.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import DatabaseManager from "../managers/DatabaseManager.js";
import { jsonResponse } from "../utils/response.js";
import { TOKEN_LENGTH } from "../constants/token-constants.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  const databaseManager = new DatabaseManager("Users");

  const { email } = event.queryStringParameters;
  let token = event.headers.Authorization;

  if (!email || !token.startsWith("Bearer ")) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, {
      message: "Missing required fields: email or token",
    });
  }

  token = token.substring(TOKEN_LENGTH);
  const user = await databaseManager.findUser(email);

  if (!user) {
    return jsonResponse(HTTP_STATUS.NOT_FOUND, { message: "User not found" });
  }

  if (user.token.S !== token) {
    return jsonResponse(HTTP_STATUS.UNAUTHORIZED, { message: `Invalid token ${token}` });
  }

  return jsonResponse(HTTP_STATUS.SUCCESS, user.buildblock?.S || "[]");
};
