import { HTTP_STATUS } from "../utils/http.js";
import DatabaseManager from "../managers/DatabaseManager.js";
import { jsonResponse } from "../utils/response.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  const databaseManager = new DatabaseManager("Users");

  const { email, name } = event.queryStringParameters;
  let token = event.headers.Authorization;

  if (!email || !name || !token || !token.startsWith("Bearer ")) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, {
      message: "Missing required fields: email, name or token",
    });
  }

  token = token.substring(7, token.length);

  const user = await databaseManager.findUser(email);

  if (!user) {
    return jsonResponse(HTTP_STATUS.NOT_FOUND, { message: "User not found" });
  }

  if (user.token.S !== token) {
    return jsonResponse(HTTP_STATUS.UNAUTHORIZED, { message: `Invalid token ${token}` });
  }

  const isSubmissionDeleted = databaseManager.deleteSubmission(user, name);
  if (!isSubmissionDeleted) {
    return jsonResponse(HTTP_STATUS.NOT_FOUND, {
      message: `Resource with name ${name} does not exist`,
    });
  }

  return jsonResponse(HTTP_STATUS.NO_CONTENT);
};
