import { AWSEvent, HandlerResponse } from "../interfaces/aws.js";
import { jsonResponse } from "../utils/response.js";
import { HTTP_STATUS } from "../utils/http.js";
import { createPDF, generateBuildBlockReport } from "../utils/createPDF.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  try {
    const body = JSON.parse(event.body || "{}");

    if (!body.data) return jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: "Missing walls data" });

    const fileBuffer = await createPDF((doc) =>
      generateBuildBlockReport(doc, body.language, body.data)
    );

    return jsonResponse(HTTP_STATUS.SUCCESS, { pdf: fileBuffer });
  } catch (error) {
    return jsonResponse(HTTP_STATUS.SERVER_ERROR);
  }
};
