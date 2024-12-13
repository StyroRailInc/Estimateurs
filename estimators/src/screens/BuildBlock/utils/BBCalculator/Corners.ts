import { BlockType, Width } from "../../../../../../backend/computeBuildblock/types/index.js";
import getBlockSpecifications from "./BlockSpecifications.js";

class CornerBase {
  protected width: Width;
  protected nInside: number;
  protected nOutside: number;

  constructor(nInside: number, nOutside: number, width: Width) {
    this.nInside = nInside;
    this.nOutside = nOutside;
    this.width = width;
  }

  getInsideSurfaceArea(blockType: BlockType) {
    return this.nInside * getBlockSpecifications(blockType, this.width).surfaceArea.int;
  }

  getOutsideSurfaceArea(blockType: BlockType) {
    return this.nOutside * getBlockSpecifications(blockType, this.width).surfaceArea.ext;
  }

  getConcreteVolume(blockType: BlockType) {
    return this.getTotal() * getBlockSpecifications(blockType, this.width).concreteVolume;
  }

  getTotalSurfaceArea(blockType: BlockType) {
    return this.getInsideSurfaceArea(blockType) + this.getOutsideSurfaceArea(blockType);
  }

  getTotal() {
    return this.nOutside + this.nInside;
  }
}

class NinetyDegreeCorner extends CornerBase {
  constructor(nInside: number, nOutside: number, width: Width) {
    super(nInside, nOutside, width);
  }

  getTotalSurfaceArea() {
    return super.getTotalSurfaceArea("ninetyCorner");
  }

  getConcreteVolume() {
    return super.getConcreteVolume("ninetyCorner");
  }
}

class FortyFiveDegreeCorner extends CornerBase {
  constructor(nInside: number, nOutside: number, width: Width) {
    super(nInside, nOutside, width);
  }

  getTotalSurfaceArea() {
    return super.getTotalSurfaceArea("fortyFiveCorner");
  }

  getConcreteVolume() {
    return super.getConcreteVolume("fortyFiveCorner");
  }
}

class Corners {
  private ninetyDegreeCorner: NinetyDegreeCorner;
  private fortyFiveDegreeCorner: FortyFiveDegreeCorner;

  constructor(
    nInside90: number,
    nOutside90: number,
    nInside45: number,
    nOutside45: number,
    width: Width
  ) {
    this.ninetyDegreeCorner = new NinetyDegreeCorner(nInside90, nOutside90, width);
    this.fortyFiveDegreeCorner = new FortyFiveDegreeCorner(nInside45, nOutside45, width);
  }

  getTotalSurfaceArea() {
    return (
      this.ninetyDegreeCorner.getTotalSurfaceArea() +
      this.fortyFiveDegreeCorner.getTotalSurfaceArea()
    );
  }

  getTotalConcreteVolume() {
    return (
      this.ninetyDegreeCorner.getConcreteVolume() + this.fortyFiveDegreeCorner.getConcreteVolume()
    );
  }

  getTotal90() {
    return this.ninetyDegreeCorner.getTotal();
  }

  getTotal45() {
    return this.fortyFiveDegreeCorner.getTotal();
  }
}

export default Corners;
