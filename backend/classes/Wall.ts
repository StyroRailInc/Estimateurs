import { BlockType, WallSpecifications } from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";
import Dimensions from "./Dimensions.js";
import Opening from "./Opening.js";
import Corners from "./Corners.js";
import SpecialBlocks from "./SpecialBlocks.js";
import { VerticalRebar, HorizontalRebar, ColdJointPin } from "./Rebars.js";
import { WallType } from "./types.js";

class Wall {
  private wallType: WallType;
  private dimensions: Dimensions;
  private corners: Corners;
  private specialBlocks: SpecialBlocks;
  private openings: Opening[];
  private horizontalRebar: HorizontalRebar;
  private verticalRebar: VerticalRebar;
  private coldJointPin: ColdJointPin;
  private thermalserts: { nLayers: number; width: string };
  private nCourses: number = 0;

  constructor(
    wallType: WallType,
    dimensions: Dimensions,
    corners: Corners,
    specialBlocks: SpecialBlocks,
    openings: Opening[],
    horizontalRebar: HorizontalRebar,
    verticalRebar: VerticalRebar,
    coldJointPin: ColdJointPin,
    thermalserts: { nLayers: number; width: string }
  ) {
    this.wallType = wallType;
    this.dimensions = dimensions;
    this.corners = corners;
    this.specialBlocks = specialBlocks;
    this.verticalRebar = verticalRebar;
    this.horizontalRebar = horizontalRebar;
    this.coldJointPin = coldJointPin;
    this.openings = openings;
    this.thermalserts = thermalserts;
  }

  computeWall(): WallSpecifications {
    const straightType: BlockType = this.wallType === "KD" ? "kdStraight" : "straight";
    const straight = getBlockSpecifications(straightType, this.dimensions.getWidth());
    const buck = getBlockSpecifications("buck", this.dimensions.getWidth());
    this.nCourses = this.dimensions.getNCourses();
    let remainingSurfaceArea =
      this.wallType === "Pign"
        ? this.dimensions.getSurfaceArea() / 2
        : this.dimensions.getSurfaceArea();
    let openingPerimeter = 0;
    let openingSurfaceArea = 0;
    let buckWidthSurfaceArea = 0;

    for (let opening of this.openings) {
      openingPerimeter += opening.getPerimeter();
      openingSurfaceArea += opening.getSurfaceArea();
      remainingSurfaceArea -= opening.getSurfaceArea();
      if (opening.getPerimeter()) buckWidthSurfaceArea += 4 * buck.height;
    }

    remainingSurfaceArea -=
      this.corners.getTotalSurfaceArea() * this.nCourses + this.specialBlocks.getTotalSurfaceArea();
    this.specialBlocks.setBuckLength(openingPerimeter + buckWidthSurfaceArea);

    const calculateTotalBlocksExcludingBuckAndThermalsert = (): number => {
      const { buck, thermalsert, ...otherBlocks } = blockQuantities;
      return Object.entries(otherBlocks).reduce((total, [key, quantity]) => {
        return total + (key === "kdStraight" ? quantity / 2 : quantity);
      }, 0);
    };

    const getTotalStraight = (blockType: BlockType) => {
      if (blockType === "straight" && this.wallType !== "KD")
        return Math.ceil(remainingSurfaceArea / straight.surfaceArea.ext);
      if (blockType === "kdStraight" && this.wallType === "KD")
        return Math.ceil(remainingSurfaceArea / straight.surfaceArea.ext) * 2;
      return 0;
    };

    const getTotalNinetyCorner = (blockType: BlockType) => {
      if (blockType === "ninetyCorner" && this.wallType !== "KD")
        return this.corners.getTotal90() * this.nCourses;
      if (blockType === "kdNinetyCorner" && this.wallType === "KD")
        return this.corners.getTotal90() * this.nCourses;
      return 0;
    };

    const blockQuantities: Record<BlockType, number> = {
      straight: getTotalStraight("straight"),
      ninetyCorner: getTotalNinetyCorner("ninetyCorner"),
      fortyFiveCorner: this.corners.getTotal45() * this.nCourses,
      doubleTaperTop: this.specialBlocks.getTotalDoubleTaperTop(),
      brickLedge: this.specialBlocks.getTotalBrickLedge(),
      buck: this.specialBlocks.getTotalBuck(),
      thermalsert: 0,
      kdStraight: getTotalStraight("kdStraight"),
      kdNinetyCorner: getTotalNinetyCorner("kdNinetyCorner"),
    };

    const nBlocks = calculateTotalBlocksExcludingBuckAndThermalsert();
    blockQuantities.thermalsert = this.thermalserts.nLayers * nBlocks;
    const verticalRebars = this.verticalRebar.computeVerticalRebars(this.wallType);
    const horizontalRebars = this.horizontalRebar.computeHorizontalRebars(this.wallType);
    const coldJointPins = this.coldJointPin.computeColdJointPins(this.wallType);

    const concreteVolume =
      this.corners.getTotalConcreteVolume() * this.nCourses +
      this.specialBlocks.getTotalConcreteVolume() * this.nCourses +
      (blockQuantities.straight + blockQuantities.kdStraight) * straight.concreteVolume;

    const bridgeQuantity = nBlocks * 16;

    return {
      width: this.dimensions.getWidth(),
      blockQuantities: blockQuantities,
      horizontalRebars: horizontalRebars,
      verticalRebars: verticalRebars,
      coldJointPins: coldJointPins,
      concreteVolume: concreteVolume,
      bridges: bridgeQuantity,
      nBlocks: nBlocks,
    };
  }
}

export default Wall;
