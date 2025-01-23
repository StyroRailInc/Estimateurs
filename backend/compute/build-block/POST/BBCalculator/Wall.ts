import { BlockType, WallSpecifications } from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";
import Dimensions from "./Dimensions.js";
import Opening from "./Opening.js";
import Corners from "./Corners.js";
import SpecialBlocks from "./SpecialBlocks.js";
import { VerticalRebar, HorizontalRebar } from "./Rebars.js";

class Wall {
  private dimensions: Dimensions;
  private corners: Corners;
  private specialBlocks: SpecialBlocks;
  private openings: Opening[];
  private horizontalRebar: HorizontalRebar;
  private verticalRebar: VerticalRebar;
  private thermalserts: { nLayers: number; width: string };
  private nCourses: number = 0;

  constructor(
    dimensions: Dimensions,
    corners: Corners,
    specialBlocks: SpecialBlocks,
    openings: Opening[],
    horizontalRebar: HorizontalRebar,
    verticalRebar: VerticalRebar,
    thermalserts: { nLayers: number; width: string }
  ) {
    this.dimensions = dimensions;
    this.corners = corners;
    this.specialBlocks = specialBlocks;
    this.verticalRebar = verticalRebar;
    this.horizontalRebar = horizontalRebar;
    this.openings = openings;
    this.thermalserts = thermalserts;
  }

  computeWall(): WallSpecifications {
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

    const calculateTotalBlocksExcludingBuckAndThermalsert = (): number => {
      const { buck, thermalsert, ...otherBlocks } = blockQuantities;
      return Object.values(otherBlocks).reduce((total, quantity) => total + quantity, 0);
    };

    const blockQuantities: Record<BlockType, number> = {
      straight: Math.ceil(remainingSurfaceArea / straight.surfaceArea.ext),
      ninetyCorner: this.corners.getTotal90() * this.nCourses,
      fortyFiveCorner: this.corners.getTotal45() * this.nCourses,
      doubleTaperTop: this.specialBlocks.getTotalDoubleTaperTop(),
      brickLedge: this.specialBlocks.getTotalBrickLedge(),
      buck: this.specialBlocks.getTotalBuck(),
      thermalsert: 0,
    };

    const nBlocks = calculateTotalBlocksExcludingBuckAndThermalsert();

    blockQuantities.thermalsert = this.thermalserts.nLayers * nBlocks;

    const verticalRebars = this.verticalRebar.computeVerticalRebars();
    const horizontalRebars = this.horizontalRebar.computeHorizontalRebars();

    const concreteVolume =
      this.corners.getTotalConcreteVolume() +
      this.specialBlocks.getTotalConcreteVolume() +
      (blockQuantities.straight - openingSurfaceArea / straight.surfaceArea.ext) *
        straight.concreteVolume;

    const bridgeQuantity = nBlocks * 16;

    return {
      width: this.dimensions.getWidth(),
      blockQuantities: blockQuantities,
      horizontalRebars: horizontalRebars,
      verticalRebars: verticalRebars,
      concreteVolume: concreteVolume,
      bridges: bridgeQuantity,
      nBlocks: nBlocks,
    };
  }
}

export default Wall;
