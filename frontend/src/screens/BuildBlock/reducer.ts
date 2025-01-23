import {
  BuildBlockFormState,
  BuildBlockFormAction,
  OpeningAction,
  OpeningState,
  WallState,
  WallAction,
} from "./types/BBTypes";

function buildBlockFormReducer(
  state: BuildBlockFormState,
  action: BuildBlockFormAction
): BuildBlockFormState {
  switch (action.type) {
    case "setLength":
      return { ...state, length: action.payload };
    case "setHeight":
      return { ...state, height: action.payload };
    case "setWidth":
      return { ...state, width: action.payload };
    case "setNInsideCorners":
      return { ...state, nInsideCorners: action.payload };
    case "setNOutsideCorners":
      return { ...state, nOutsideCorners: action.payload };
    case "setN45InsideCorners":
      return { ...state, n45InsideCorners: action.payload };
    case "setN45OutsideCorners":
      return { ...state, n45OutsideCorners: action.payload };
    case "setDoubleTaperTopLength":
      return { ...state, doubleTaperTopLength: action.payload };
    case "setBrickLedgeLength":
      return { ...state, brickLedgeLength: action.payload };
    case "resetInputs":
      return { ...initialBuildBlockFormState };
    case "setInputs":
      return { ...action.payload };
    case "setNThermalsertLayers":
      return {
        ...state,
        thermalsert: {
          ...state.thermalsert,
          nLayers: action.payload,
        },
      };
    case "setThermalsertWidth":
      return {
        ...state,
        thermalsert: {
          ...state.thermalsert,
          width: action.payload,
        },
      };
    case "setHorizontalRebarQuantity":
      return {
        ...state,
        horizontalRebar: {
          ...state.horizontalRebar,
          quantity: action.payload,
        },
      };
    case "setHorizontalRebarDiameter":
      return {
        ...state,
        horizontalRebar: {
          ...state.horizontalRebar,
          diameter: action.payload,
        },
      };

    default:
      return state;
  }
}

const initialBuildBlockFormState: BuildBlockFormState = {
  length: "",
  height: "",
  width: '8"',
  nInsideCorners: "",
  nOutsideCorners: "",
  n45InsideCorners: "",
  n45OutsideCorners: "",
  doubleTaperTopLength: "",
  brickLedgeLength: "",
  thermalsert: { nLayers: "", width: "" },
  horizontalRebar: { quantity: "5", diameter: "0.625" },
  verticalRebar: { spacing: '12"', diameter: "0.625" },
};

function openingReducer(state: OpeningState, action: OpeningAction) {
  switch (action.type) {
    case "setOpeningHeight":
      return { ...state, height: action.payload };
    case "setOpeningWidth":
      return { ...state, width: action.payload };
    case "setOpeningQuantity":
      return { ...state, quantity: action.payload };
    case "addOpening":
      return { ...state, openings: [...state.openings, { width: "", height: "", quantity: "" }] };
    case "deleteOpening":
      return {
        ...state,
        openings: [...state.openings.slice(0, state.openings.length - 1)],
      };
    case "modifyOpening":
      return {
        ...state,
        openings: state.openings.map((opening, index) => {
          if (index === action.payload.index) {
            let updatedOpening = {
              width: opening.width,
              height: opening.height,
              quantity: opening.quantity,
            };
            switch (action.payload.attribute) {
              case "width":
                updatedOpening.width = action.payload.value;
                break;
              case "height":
                updatedOpening.height = action.payload.value;
                break;
              case "quantity":
                updatedOpening.quantity = action.payload.value;
                break;
              default:
                break;
            }
            return updatedOpening;
          }
          return opening;
        }),
      };
    case "setOpenings": {
      const updatedOpenings = action.payload.openings;
      return {
        ...state,
        openings: updatedOpenings,
      };
    }
    case "resetOpening": {
      return {
        ...initialOpeningState,
      };
    }
    default:
      return state;
  }
}

const initialOpeningState: OpeningState = {
  openings: [{ width: "", height: "", quantity: "" }],
};

function wallReducer(state: WallState, action: WallAction) {
  switch (action.type) {
    case "modifyWall": {
      const updatedWalls = [...state.walls];
      updatedWalls[action.payload.index] = {
        name: action.payload.name,
        buildBlockFormState: action.payload.buildBlockFormState,
        openingState: action.payload.openingState,
      };

      return {
        ...state,
        walls: updatedWalls,
      };
    }
    case "addWall": {
      // Remove payload from type
      const updatedWalls = [...state.walls];
      updatedWalls.push({
        name: `Wall ${updatedWalls.length + 1}`,
        buildBlockFormState: initialBuildBlockFormState,
        openingState: initialOpeningState,
      });

      return { ...state, walls: updatedWalls };
    }

    case "deleteWall": {
      let updatedWalls = [...state.walls];
      updatedWalls = [
        ...updatedWalls.slice(0, action.payload.index),
        ...updatedWalls.slice(action.payload.index + 1),
      ];

      return { ...state, walls: updatedWalls };
    }

    case "setClickedWallIndex":
      return { ...state, clickedWallIndex: action.payload };

    case "setWalls":
      return { ...action.payload };

    default:
      return state;
  }
}

const initialWallState: WallState = {
  walls: [
    {
      name: `Wall 1`,
      buildBlockFormState: initialBuildBlockFormState,
      openingState: initialOpeningState,
    },
  ],
  clickedWallIndex: 0,
};

export {
  buildBlockFormReducer,
  initialBuildBlockFormState,
  openingReducer,
  initialOpeningState,
  wallReducer,
  initialWallState,
};
