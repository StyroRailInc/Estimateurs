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
  wallType: string;
  length: string;
  height: string;
  width: string;
  nInsideCorners: string;
  nOutsideCorners: string;
  n45InsideCorners: string;
  n45OutsideCorners: string;
  doubleTaperTopLength: string;
  brickLedgeLength: string;
  thermalsert: { nLayers: string; width: string };
  horizontalRebar: { quantity: string; diameter: string };
  verticalRebar: { spacing: string; diameter: string };
  coldJointPin: {
    centerSpacing: string;
    lLength: string;
    depthInFooting: string;
    diameter: string;
  };
};

export type BuildBlockFormAction =
  | { type: "setWallType"; payload: string }
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
        wallType: string;
        length: string;
        height: string;
        width: string;
        nInsideCorners: string;
        nOutsideCorners: string;
        n45InsideCorners: string;
        n45OutsideCorners: string;
        brickLedgeLength: string;
        doubleTaperTopLength: string;
        thermalsert: { nLayers: string; width: string };
        horizontalRebar: { quantity: string; diameter: string };
        verticalRebar: { spacing: string; diameter: string };
        coldJointPin: {
          centerSpacing: string;
          lLength: string;
          depthInFooting: string;
          diameter: string;
        };
      };
    }
  | { type: "setNThermalsertLayers"; payload: string }
  | { type: "setThermalsertWidth"; payload: string }
  | { type: "setHorizontalRebarQuantity"; payload: string }
  | { type: "setHorizontalRebarDiameter"; payload: string }
  | { type: "setVerticalRebarSpacing"; payload: string }
  | { type: "setVerticalRebarDiameter"; payload: string }
  | { type: "setCJPCenterSpacing"; payload: string }
  | { type: "setCJPLLength"; payload: string }
  | { type: "setCJPDepthInFooting"; payload: string }
  | { type: "setCJPDiameter"; payload: string };

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
  walls: {
    name: string;
    buildBlockFormState: BuildBlockFormState;
    openingState: OpeningState;
  }[];
  clickedWallIndex: number;
};

export type WallAction =
  | {
      type: "modifyWall";
      payload: {
        name: string;
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
