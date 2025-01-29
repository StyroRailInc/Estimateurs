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
import { ColdJointPin, HorizontalRebar, VerticalRebar } from "./BBCalculator/Rebars.js";

interface ComputeResponse {
  statusCode: number;
  headers: Record<string, string>;
  body?: string;
}

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

  const horizontalRebar = new HorizontalRebar(
    parseIntegerInput(wallData.buildBlockFormState.horizontalRebar.diameter),
    parseInput(wallData.buildBlockFormState.height, IS_FEET, !EMPTY_STRING_VALID),
    parseInput(wallData.buildBlockFormState.length, IS_FEET, !EMPTY_STRING_VALID),
    parseIntegerInput(wallData.buildBlockFormState.horizontalRebar.quantity)
  );

  const verticalRebar = new VerticalRebar(
    parseIntegerInput(wallData.buildBlockFormState.verticalRebar.diameter),
    parseInput(wallData.buildBlockFormState.height, IS_FEET, !EMPTY_STRING_VALID),
    parseInput(wallData.buildBlockFormState.length, IS_FEET, !EMPTY_STRING_VALID),
    parseInput(wallData.buildBlockFormState.verticalRebar.spacing, IS_FEET, !EMPTY_STRING_VALID)
  );

  console.log(
    parseIntegerInput(wallData.buildBlockFormState.coldJointPin.diameter),
    parseInput(wallData.buildBlockFormState.height, IS_FEET, !EMPTY_STRING_VALID),
    parseInput(wallData.buildBlockFormState.length, IS_FEET, !EMPTY_STRING_VALID),
    parseInput(
      wallData.buildBlockFormState.coldJointPin.centerSpacing,
      !IS_FEET,
      !EMPTY_STRING_VALID
    ),
    parseInput(wallData.buildBlockFormState.coldJointPin.lLength, !IS_FEET, !EMPTY_STRING_VALID),
    parseInput(
      wallData.buildBlockFormState.coldJointPin.depthInFooting,
      !IS_FEET,
      !EMPTY_STRING_VALID
    )
  );

  const coldJointPin = new ColdJointPin(
    parseIntegerInput(wallData.buildBlockFormState.coldJointPin.diameter),
    parseInput(wallData.buildBlockFormState.height, IS_FEET, !EMPTY_STRING_VALID),
    parseInput(wallData.buildBlockFormState.length, IS_FEET, !EMPTY_STRING_VALID),
    parseInput(
      wallData.buildBlockFormState.coldJointPin.centerSpacing,
      !IS_FEET,
      !EMPTY_STRING_VALID
    ),
    parseInput(wallData.buildBlockFormState.coldJointPin.lLength, !IS_FEET, !EMPTY_STRING_VALID),
    parseInput(
      wallData.buildBlockFormState.coldJointPin.depthInFooting,
      !IS_FEET,
      !EMPTY_STRING_VALID
    )
  );

  const thermalserts = {
    nLayers: parseIntegerInput(wallData.buildBlockFormState.thermalsert.nLayers),
    width: wallData.buildBlockFormState.thermalsert.width,
  };

  return new Wall(
    dimensions,
    corners,
    specialBlocks,
    openings,
    horizontalRebar,
    verticalRebar,
    coldJointPin,
    thermalserts
  );
};

export const handler = async (event: any): Promise<ComputeResponse> => {
  const payload = JSON.parse(event.body);

  try {
    const walls = payload.map(parseWall);
    const house = new House(walls);
    const computedHouse = house.computeHouse();

    return {
      statusCode: HTTP_STATUS.SUCCESS,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(computedHouse),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: HTTP_STATUS.SERVER_ERROR,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: `Error processing request: ${error.message}` }),
    };
  }
};
