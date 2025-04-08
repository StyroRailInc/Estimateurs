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

  token = token.substring(7, token.length);

  if (user.token.S !== token) {
    return jsonResponse(HTTP_STATUS.UNAUTHORIZED, { message: `Invalid token ${token}` });
  }

  let buildBlock = validateRequestBody(user.buildblock?.S || "[]");
  if (!buildBlock) {
    return jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error parsing buildblock" });
  }

  const nameCountSet = new Set();
  const nameCountArray = [];

  submissions.forEach((submission: any) => {
    nameCountSet.add(submission.name);
    nameCountArray.push(submission.name);
  });

  const hasDuplicates = Array.from(nameCountSet).length !== nameCountArray.length;

  if (hasDuplicates) {
    return jsonResponse(HTTP_STATUS.CONFLICT, {
      message: `Resource with name already exists`,
    });
  }

  const isReplacedSubmissions = await databaseManager.updateSubmissions(user, submissions);

  if (isReplacedSubmissions) {
    return jsonResponse(HTTP_STATUS.SUCCESS);
  }

  return jsonResponse(HTTP_STATUS.SERVER_ERROR, { message: "Error creating submission" });
};
