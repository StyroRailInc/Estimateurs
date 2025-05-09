import { HTTP_STATUS } from "../utils/http.js";
import DatabaseManager from "../managers/DatabaseManager.js";
import { validateRequestBody } from "../utils/validateRequestBody.js";
import { jsonResponse } from "../utils/response.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  const databaseManager = new DatabaseManager("Users");

  const requestBody = validateRequestBody(event.body);

  if (!requestBody?.email || !requestBody?.name || !requestBody?.password) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, {
      message: "Missing or invalid fields: email, name, or password",
    });
  }

  const { email, name, password } = requestBody;
  const isExistingUser = await databaseManager.findUser(email);

  if (isExistingUser) {
    return jsonResponse(HTTP_STATUS.CONFLICT, { message: "Email already selected" });
  }

  const token = await databaseManager.createUser(email, name, password);

  if (token) {
    return jsonResponse(HTTP_STATUS.CREATED, { name }, token);
  }

  return jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error creating account" });
};
