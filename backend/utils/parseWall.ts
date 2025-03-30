import Wall from "./../classes/Wall.js";
import Dimensions from "../classes/Dimensions.js";
import { WallType, Width } from "../classes/types.js";
import SpecialBlocks from "../classes/SpecialBlocks.js";
import Opening from "../classes/Opening.js";
import { HorizontalRebar, VerticalRebar } from "../classes/Rebars.js";
import { parseInput, parseIntegerInput } from "./inputParser.js";
import Corners from "../classes/Corners.js";
import { ColdJointPin } from "../classes/Rebars.js";
import { IS_FEET, EMPTY_STRING_VALID } from "./../constants/input-parser-constants.js";

export const parseWall = (wallData: any): Wall => {
  const wallType = wallData.buildBlockFormState.wallType as WallType;

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
    wallData.buildBlockFormState.width as Width,
    wallType
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
    wallType,
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
