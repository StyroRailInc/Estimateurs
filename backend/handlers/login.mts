import { HTTP_STATUS } from "../utils/http.js";
import DatabaseManager from "../managers/DatabaseManager.js";
import { jsonResponse } from "../utils/response.js";
import { validateRequestBody } from "../utils/validateRequestBody.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  const databaseManager = new DatabaseManager("Users");

  const requestBody = validateRequestBody(event.body);
  if (!requestBody) {
    jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: "Invalid request body" });
  }

  const { email, password } = requestBody;

  if (!email || !password) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: "Email and password are required." });
  }

  const user = await databaseManager.findUser(email);

  if (!user) {
    return jsonResponse(HTTP_STATUS.NOT_FOUND, { message: "User not found" });
  }

  if (password !== user.password.S) {
    return jsonResponse(HTTP_STATUS.UNAUTHORIZED, { message: "Wrong credentials" });
  }

  const token = await databaseManager.updateUserToken(user);
  let preferences = {};
  if (user.preferences?.S) preferences = JSON.parse(user.preferences?.S);

  if (token) {
    return jsonResponse(HTTP_STATUS.SUCCESS, { preferences, name: user.name?.S }, token);
  }

  return jsonResponse(HTTP_STATUS.UNAUTHORIZED, { message: "There has been an error logging in" });
};
