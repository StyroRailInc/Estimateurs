import { HTTP_STATUS } from "../utils/http.js";
import DatabaseManager from "../managers/DatabaseManager.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import { validateRequestBody } from "../utils/validateRequestBody.js";
import { jsonResponse } from "../utils/response.js";
import { TOKEN_LENGTH } from "./../constants/token-constants.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  const databaseManager = new DatabaseManager("Users");
  const replace = event.queryStringParameters?.replace === "true" || false;
  let token = event.headers.Authorization;

  const requestBody = validateRequestBody(event.body);
  if (!requestBody?.email || !requestBody?.payload || !token?.startsWith("Bearer ")) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: "Missing or invalid fields: email, token, or payload" });
  }

  const { email, payload } = requestBody;
  token = token.substring(TOKEN_LENGTH);

  const user = await databaseManager.findUser(email);
  if (!user) {
    return jsonResponse(HTTP_STATUS.NOT_FOUND, { message: "User not found" });
  }

  if (user.token.S !== token) {
    return jsonResponse(HTTP_STATUS.UNAUTHORIZED, { message: `Invalid token ${token}` });
  }

  let buildBlock = validateRequestBody(user.buildblock?.S || "[]");
  if (!buildBlock) {
    return jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error parsing buildblock" });
  }

  const index = buildBlock.findIndex((block: any) => block.name === payload.name);
  const isExistingSubmission = index > -1;

  if (isExistingSubmission && !replace) {
    return jsonResponse(HTTP_STATUS.CONFLICT, { message: `Resource with name ${payload.name} already exists` });
  } else if (isExistingSubmission && replace) {
    buildBlock[index].submission = payload.submission;
  } else {
    buildBlock.push({ name: payload.name, submission: payload.submission });
  }

  const isUpdatedSubmission = await databaseManager.updateSubmissions(user, buildBlock);

  if (isUpdatedSubmission) {
    return jsonResponse(HTTP_STATUS.CREATED);
  }

  return jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error creating submission" });
};
