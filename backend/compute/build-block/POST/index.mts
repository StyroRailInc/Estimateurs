import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Wall from "./POST/BBCalculator/Wall.js";
import Dimensions from "./POST/BBCalculator/Dimensions.js";
import Opening from "./POST/BBCalculator/Opening.js";
import House from "./POST/BBCalculator/House.js";
import { parseInput, parseIntegerInput } from "./utils/inputParser.js";
import { Width } from "./POST/BBCalculator/types.js";
import SpecialBlocks from "./POST/BBCalculator/SpecialBlocks.js";
import Corners from "./POST/BBCalculator/Corners.js";
import { HTTP_STATUS } from "./utils/http.js";

const EMPTY_STRING_VALID = true;
const IS_FEET = true;

// Helper to validate and parse a wall object
const parseWall = (wallData: any): Wall => {
  const dimensions = new Dimensions(
    parseInput(wallData.buildBlockFormState.height, IS_FEET, !EMPTY_STRING_VALID),
    parseInput(wallData.buildBlockFormState.length, IS_FEET, !EMPTY_STRING_VALID),
    wallData.buildBlockFormState.width as Width
  );

  const corners = new Corners(
    parseIntegerInput(wallData.buildBlockFormState.nInsideCorners),
    parseIntegerInput(wallData.buildBlockFormState.nOutsideCorners),
    parseIntegerInput(wallData.buildBlockFormState.n45InsideCorners),
    parseIntegerInput(wallData.buildBlockFormState.n45OutsideCorners),
    wallData.buildBlockFormState.width as Width
  );

  const specialBlocks = new SpecialBlocks(
    parseInput(wallData.buildBlockFormState.doubleTaperTopLength, IS_FEET, EMPTY_STRING_VALID),
    parseInput(wallData.buildBlockFormState.brickLedgeLength, IS_FEET, EMPTY_STRING_VALID),
    0,
    wallData.buildBlockFormState.width as Width
  );

  const openings = (wallData.openingState.openings || []).map(
    (opening: any) =>
      new Opening(
        parseInput(opening.width, IS_FEET, EMPTY_STRING_VALID),
        parseInput(opening.height, IS_FEET, EMPTY_STRING_VALID),
        parseIntegerInput(opening.quantity)
      )
  );

  return new Wall(dimensions, corners, specialBlocks, openings);
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!Array.isArray(event)) {
      throw new Error("Input should be an array of wall data");
    }

    const walls = event.map(parseWall);
    const house = new House(walls);
    house.computeHouse();

    return {
      statusCode: HTTP_STATUS.SUCCESS,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(house.getBlockQuantities()),
    };
  } catch (error) {
    console.error("Error processing input:", error);

    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: error.message }),
    };
  }
};
