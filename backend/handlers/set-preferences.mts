import { HTTP_STATUS } from "../utils/http.js";
import { jsonResponse } from "../utils/response.js";
import DatabaseManager from "../managers/DatabaseManager.js";
import { validateRequestBody } from "../utils/validateRequestBody.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import { TOKEN_LENGTH } from "../constants/token-constants.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  const databaseManager = new DatabaseManager("Users");

  const requestBody = validateRequestBody(event.body);
  let token = event.headers.Authorization;

  if (!requestBody || !requestBody.email || !requestBody.preferences || !token?.startsWith("Bearer ")) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: "Missing or invalid fields: email, token, or preferences" });
  }

  const { email, preferences } = requestBody;

  token = token.substring(TOKEN_LENGTH);

  const user = await databaseManager.findUser(email);

  if (!user) {
    return jsonResponse(HTTP_STATUS.NOT_FOUND, { message: "User not found" });
  }

  if (user.token.S !== token) {
    return jsonResponse(HTTP_STATUS.UNAUTHORIZED, { message: "Wrong token" });
  }

  const isPreferencesUpdated = await databaseManager.updatePreferences(user, preferences);

  if (isPreferencesUpdated) {
    return jsonResponse(HTTP_STATUS.NO_CONTENT);
  }

  return jsonResponse(HTTP_STATUS.UNAUTHORIZED, { message: "There has been an error updating preferences" });
};
