import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import { jsonResponse } from "../utils/response.js";
import { HTTP_STATUS } from "../utils/http.js";
import { createPDF, generateBuildBlockReport } from "../utils/createPDF.js";
import { validateRequestBody } from "../utils/validateRequestBody.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  const requestBody = validateRequestBody(event.body);

  if (!requestBody?.language || !requestBody?.data) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: "Missing or invalid fields: language or data" });
  }

  try {
    const fileBuffer = await createPDF((doc) => generateBuildBlockReport(doc, requestBody.language, requestBody.data));
    return jsonResponse(HTTP_STATUS.SUCCESS, { pdf: fileBuffer });
  } catch (error) {
    return jsonResponse(HTTP_STATUS.SERVER_ERROR);
  }
};
