import { parseWall } from "../utils/parseWall.js";
import { HTTP_STATUS } from "../utils/http.js";
import House from "./../classes/House.js";
import { AWSEvent, HandlerResponse } from "../interfaces/aws";
import { jsonResponse } from "../utils/response.js";

export const handler = async (event: AWSEvent): Promise<HandlerResponse> => {
  try {
    const payload = JSON.parse(event.body);
    const walls = payload.map(parseWall);
    const house = new House(walls);
    const computedHouse = house.computeHouse();

    return jsonResponse(HTTP_STATUS.SUCCESS, JSON.stringify(computedHouse));
  } catch (error) {
    return jsonResponse(HTTP_STATUS.BAD_REQUEST, { message: `Error processing: ${error.message}` });
  }
};
