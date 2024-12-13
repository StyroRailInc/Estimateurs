import Opening from "../utils/BBCalculator/Opening";

export type Width = '4"' | '6"' | '8"';

export type BlockType =
  | "straight"
  | "ninetyCorner"
  | "fortyFiveCorner"
  | "doubleTaperTop"
  | "brickLedge"
  | "buck";

export type BuildBlockFormState = {
  length: string;
  height: string;
  width: string;
  nInsideCorners: string;
  nOutsideCorners: string;
  n45InsideCorners: string;
  n45OutsideCorners: string;
  doubleTaperTopLength: string;
  brickLedgeLength: string;
  isValidLength: boolean;
  isValidHeight: boolean;
  isValidWidth: boolean;
};

export type BuildBlockFormAction =
  | { type: "setLength"; payload: string }
  | { type: "setHeight"; payload: string }
  | { type: "setWidth"; payload: string }
  | { type: "setNInsideCorners"; payload: string }
  | { type: "setNOutsideCorners"; payload: string }
  | { type: "setN45OutsideCorners"; payload: string }
  | { type: "setN45InsideCorners"; payload: string }
  | { type: "setBrickLedgeLength"; payload: string }
  | { type: "setDoubleTaperTopLength"; payload: string }
  | { type: "resetInputs" }
  | {
      type: "setInputs";
      payload: {
        length: string;
        height: string;
        width: string;
        nInsideCorners: string;
        nOutsideCorners: string;
        n45InsideCorners: string;
        n45OutsideCorners: string;
        brickLedgeLength: string;
        doubleTaperTopLength: string;
        isValidLength: boolean;
        isValidHeight: boolean;
        isValidWidth: boolean;
      };
    }
  | { type: "setIsValidLength"; payload: boolean }
  | { type: "setIsValidHeight"; payload: boolean }
  | { type: "setIsValidWidth"; payload: boolean };

export type OpeningState = {
  openings: { width: string; height: string; quantity: string }[];
};

export type OpeningAction =
  | { type: "setOpeningHeight"; payload: string }
  | { type: "setOpeningWidth"; payload: string }
  | { type: "setOpeningQuantity"; payload: string }
  | { type: "addOpening" }
  | { type: "deleteOpening" }
  | {
      type: "modifyOpening";
      payload: { index: number; attribute: "width" | "height" | "quantity"; value: string };
    }
  | { type: "setOpenings"; payload: OpeningState }
  | { type: "resetOpening" };

export type WallState = {
  walls: { buildBlockFormState: BuildBlockFormState; openingState: OpeningState }[];
  clickedWallIndex: number;
};

export type WallAction =
  | {
      type: "modifyWall";
      payload: {
        buildBlockFormState: BuildBlockFormState;
        openingState: OpeningState;
        index: number;
      };
    }
  | {
      type: "addWall";
      payload: { buildBlockFormState: BuildBlockFormState; openingState: OpeningState };
    }
  | {
      type: "deleteWall";
      payload: {
        index: number;
      };
    }
  | { type: "setClickedWallIndex"; payload: number }
  | { type: "setWalls"; payload: WallState };

export type InnerPage = "buildBlockForm" | "buildDeckForm" | "summary";
