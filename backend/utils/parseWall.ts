import Wall from "./../classes/Wall.js";
import Dimensions from "../classes/Dimensions.js";
import { WallType, Width } from "./../interfaces/build-block.js";
import SpecialBlocks from "../classes/SpecialBlocks.js";
import Opening from "../classes/Opening.js";
import { HorizontalRebar, VerticalRebar } from "../classes/Rebars.js";
import { parseInput, parseIntegerInput } from "./inputParser.js";
import Corners from "../classes/Corners.js";
import { ColdJointPin } from "../classes/Rebars.js";
import { IS_FEET, EMPTY_STRING_VALID } from "./../constants/input-parser-constants.js";
import { Straight } from "../classes/Straight.js";

export const parseWall = (wallData: any): Wall | undefined => {
  const { buildBlockFormState: formState, openingState: openingsState } = wallData;
  const wallType = formState.wallType as WallType;

  try {
    tryApplyPinionWallFilter(formState, wallType);

    const dimensions = new Dimensions(
      parseInput(formState.height, IS_FEET, !EMPTY_STRING_VALID),
      parseInput(formState.length, IS_FEET, !EMPTY_STRING_VALID),
      formState.width as Width,
      wallType
    );

    const corners = new Corners(
      parseIntegerInput(formState.nInsideCorners),
      parseIntegerInput(formState.nOutsideCorners),
      parseIntegerInput(formState.n45InsideCorners),
      parseIntegerInput(formState.n45OutsideCorners),
      formState.width as Width,
      wallType
    );

    const specialBlocks = new SpecialBlocks(
      parseInput(formState.doubleTaperTop.length, IS_FEET, EMPTY_STRING_VALID),
      parseIntegerInput(formState.doubleTaperTop.nCorners),
      parseInput(formState.brickLedge.length, IS_FEET, EMPTY_STRING_VALID),
      parseIntegerInput(formState.brickLedge.nCorners),
      parseIntegerInput(formState.brickLedge.n45Corners),
      0,
      formState.width as Width,
      wallType
    );

    const openings = (openingsState.openings || []).map(
      (opening: any) =>
        new Opening(
          parseInput(opening.width, IS_FEET, EMPTY_STRING_VALID),
          parseInput(opening.height, IS_FEET, EMPTY_STRING_VALID),
          parseIntegerInput(opening.quantity)
        )
    );

    const horizontalRebar = new HorizontalRebar(
      parseIntegerInput(formState.horizontalRebar.diameter),
      parseInput(formState.height, IS_FEET, !EMPTY_STRING_VALID),
      parseInput(formState.length, IS_FEET, !EMPTY_STRING_VALID),
      parseIntegerInput(formState.horizontalRebar.quantity),
      wallType
    );

    const verticalRebar = new VerticalRebar(
      parseIntegerInput(formState.verticalRebar.diameter),
      parseInput(formState.height, IS_FEET, !EMPTY_STRING_VALID),
      parseInput(formState.length, IS_FEET, !EMPTY_STRING_VALID),
      parseInput(formState.verticalRebar.spacing, IS_FEET, !EMPTY_STRING_VALID),
      wallType
    );

    const coldJointPin = new ColdJointPin(
      parseIntegerInput(formState.coldJointPin.diameter),
      parseInput(formState.height, IS_FEET, !EMPTY_STRING_VALID),
      parseInput(formState.length, IS_FEET, !EMPTY_STRING_VALID),
      parseInput(formState.coldJointPin.centerSpacing, !IS_FEET, !EMPTY_STRING_VALID),
      parseInput(formState.coldJointPin.lLength, !IS_FEET, !EMPTY_STRING_VALID),
      parseInput(formState.coldJointPin.depthInFooting, !IS_FEET, !EMPTY_STRING_VALID),
      wallType
    );

    const thermalserts = {
      nLayers: parseIntegerInput(formState.thermalsert.nLayers),
      width: formState.thermalsert.width,
    };

    const straight = new Straight(wallType);

    const wallConfig = { wallType, dimensions };
    const wallMaterials = { corners, specialBlocks, openings, horizontalRebar, verticalRebar, coldJointPin, thermalserts, straight };

    return new Wall(wallConfig, wallMaterials);
  } catch (error) {
    throw new Error(error.message + " at " + wallData.name);
  }
};

function tryApplyPinionWallFilter(formState: any, wallType: WallType) {
  if (!(wallType === "Pign")) return;
  formState.nInsideCorners = "0";
  formState.n45InsideCorners = "0";
  formState.nOutsideCorners = "0";
  formState.n90OutsideCorners = "0";
  formState.doubleTaperTop.nCorners = "0";
  formState.doubleTaperTop.length = "";
  formState.brickLedge.nCorners = "0";
  formState.brickLedge.n45Corners = "0";
}
