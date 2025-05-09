import { parseWall } from "../utils/parseWall.js";
import { HTTP_STATUS } from "../utils/http.js";
import House from "./../classes/House.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws";
import { jsonResponse } from "../utils/response.js";
import { validateRequestBody } from "../utils/validateRequestBody.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  const payload = validateRequestBody(event.body);

  if (!payload) return jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: "Invalid request body" });

  try {
    const walls = payload.map(parseWall);
    const house = new House(walls);
    const computedHouse = house.computeHouse();

    return jsonResponse(HTTP_STATUS.SUCCESS, computedHouse);
  } catch (error) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: `Error processing house` });
  }
};
