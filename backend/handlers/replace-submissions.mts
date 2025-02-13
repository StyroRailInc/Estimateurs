import { HTTP_STATUS } from "../utils/http.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import DatabaseManager from "../managers/DatabaseManager.js";
import { validateRequestBody } from "../utils/validateRequestBody.js";
import { jsonResponse } from "../utils/response.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  const databaseManager = new DatabaseManager("Users");
  const { email } = event.queryStringParameters;
  let token = event.headers.Authorization;
  const requestBody = validateRequestBody(event.body);

  if (!requestBody) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: "Invalid request body" });
  }

  const { submissions } = requestBody;

  // Need to add payload verification
  if (!email || !submissions || !token.startsWith("Bearer ")) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, {
      message: "Missing required fields: email, token or payload",
    });
  }

  const user = await databaseManager.findUser(email);

  if (!user) {
    return jsonResponse(HTTP_STATUS.NOT_FOUND, { message: "User not found" });
  }

  if (user.token.S !== token) {
    return jsonResponse(HTTP_STATUS.UNAUTHORIZED, { message: `Invalid token ${token}` });
  }

  const isReplacedSubmissions = await databaseManager.replaceSubmissions(user, submissions);

  if (isReplacedSubmissions) {
    return jsonResponse(HTTP_STATUS.CREATED);
  }

  return jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error creating submission" });
};
