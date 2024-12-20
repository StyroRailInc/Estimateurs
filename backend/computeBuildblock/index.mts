import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Wall from "./BBCalculator/Wall.js";
import Dimensions from "./BBCalculator/Dimensions.js";
import Opening from "./BBCalculator/Opening.js";
import House from "./BBCalculator/House.js";
import { parseInput, parseIntegerInput } from "./utils/inputParser.js";
import { Width } from "./BBCalculator/types.js";
import SpecialBlocks from "./BBCalculator/SpecialBlocks.js";
import Corners from "./BBCalculator/Corners.js";
import { HTTP_STATUS } from "./utils/http.js";

export const handler = async (event: any) => {
  const walls = [];
  const emptyStringIsValid = true;
  const isFeet = true;
  let statusCode;
  let body;

  try {
    for (let wall of event) {
      const dimensions = new Dimensions(
        parseInput(wall.buildBlockFormState.height, isFeet, !emptyStringIsValid),
        parseInput(wall.buildBlockFormState.length, isFeet, !emptyStringIsValid),
        wall.buildBlockFormState.width as Width
      );

      const corners = new Corners(
        parseIntegerInput(wall.buildBlockFormState.nInsideCorners),
        parseIntegerInput(wall.buildBlockFormState.nOutsideCorners),
        parseIntegerInput(wall.buildBlockFormState.n45InsideCorners),
        parseIntegerInput(wall.buildBlockFormState.n45OutsideCorners),
        wall.buildBlockFormState.width as Width
      );

      const specialBlocks = new SpecialBlocks(
        parseInput(wall.buildBlockFormState.doubleTaperTopLength, isFeet, emptyStringIsValid),
        parseInput(wall.buildBlockFormState.brickLedgeLength, isFeet, emptyStringIsValid),
        0,
        wall.buildBlockFormState.width as Width
      );

      const openings = [];
      for (let opening of wall.openingState.openings) {
        const openingObject = new Opening(
          parseInput(opening.width, isFeet, emptyStringIsValid),
          parseInput(opening.height, isFeet, emptyStringIsValid),
          parseIntegerInput(opening.quantity)
        );
        openings.push(openingObject);
      }

      const wallObject = new Wall(dimensions, corners, specialBlocks, openings);
      walls.push(wallObject);
      const house = new House(walls);
      house.computeHouse();

      statusCode = HTTP_STATUS.SUCCESS;

      body = JSON.stringify(house.getBlockQuantities());
    }
  } catch (error) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    body = "Missing critical input data";
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: body,
  };
  return response;
};
