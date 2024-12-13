import { BlockType } from "../../../../../../backend/computeBuildblock/types/index.js";
import getBlockSpecifications from "./BlockSpecifications.js";
import Dimensions from "./Dimensions.js";
import Opening from "./Opening.js";
import Corners from "./Corners.js";
import SpecialBlocks from "./SpecialBlocks.js";
import { Width } from "../../../../../../backend/computeBuildblock/types/index.js";

class Wall {
  private dimensions: Dimensions;
  private corners: Corners;
  private specialBlocks: SpecialBlocks;
  private openings: Opening[];
  private nCourses: number = 0;

  constructor(
    dimensions: Dimensions,
    corners: Corners,
    specialBlocks: SpecialBlocks,
    openings: Opening[]
  ) {
    this.dimensions = dimensions;
    this.corners = corners;
    this.specialBlocks = specialBlocks;
    this.openings = openings;
  }

  computeWall(): {
    width: Width;
    blockQuantities: Record<BlockType, number>;
    concreteVolume: number;
  } {
    this.nCourses = this.dimensions.getNCourses();
    let remainingSurfaceArea = this.dimensions.getSurfaceArea();
    let openingPerimeter = 0;
    let openingSurfaceArea = 0;

    for (let opening of this.openings) {
      openingPerimeter += opening.getPerimeter();
      openingSurfaceArea += opening.getSurfaceArea();
      remainingSurfaceArea -= opening.getSurfaceArea();
    }

    remainingSurfaceArea -=
      this.corners.getTotalSurfaceArea() * this.nCourses + this.specialBlocks.getTotalSurfaceArea();
    this.specialBlocks.setBuckLength(openingPerimeter);

    const straight = getBlockSpecifications("straight", this.dimensions.getWidth());

    const blockQuantities: Record<BlockType, number> = {
      straight: Math.ceil(remainingSurfaceArea / straight.surfaceArea.ext),
      ninetyCorner: this.corners.getTotal90() * this.nCourses,
      fortyFiveCorner: this.corners.getTotal45() * this.nCourses,
      doubleTaperTop: this.specialBlocks.getTotalDoubleTaperTop(),
      brickLedge: this.specialBlocks.getTotalBrickLedge(),
      buck: this.specialBlocks.getTotalBuck(),
    };

    const concreteVolume =
      this.corners.getTotalConcreteVolume() +
      this.specialBlocks.getTotalConcreteVolume() +
      (blockQuantities.straight - openingSurfaceArea / straight.surfaceArea.ext) *
        straight.concreteVolume;

    return {
      width: this.dimensions.getWidth(),
      blockQuantities: blockQuantities,
      concreteVolume: concreteVolume,
    };
  }
}

export default Wall;
