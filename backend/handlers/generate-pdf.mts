import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import { jsonResponse } from "../utils/response.js";
import { HTTP_STATUS } from "../utils/http.js";
import { createPDF, generateBuildBlockReport } from "../utils/createPDF.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  try {
    const data = JSON.parse(event.body || "{}");

    const fileBuffer = await createPDF((doc) => generateBuildBlockReport(doc, "fr", data));

    return jsonResponse(HTTP_STATUS.SUCCESS, { pdf: fileBuffer });
  } catch (error) {
    return jsonResponse(HTTP_STATUS.SERVER_ERROR);
  }
};
