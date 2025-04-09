import { BlockType, Width, WallType } from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";

class CornerBase {
  protected width: Width;
  protected nInside: number;
  protected nOutside: number;
  protected wallType: WallType;

  constructor(nInside: number, nOutside: number, width: Width, wallType: WallType) {
    this.nInside = nInside;
    this.nOutside = nOutside;
    this.width = width;
    this.wallType = wallType;
  }

  getInsideSurfaceArea(blockType: BlockType) {
    return this.nInside * getBlockSpecifications(blockType, this.width)?.surfaceArea?.int || 0;
  }

  getOutsideSurfaceArea(blockType: BlockType) {
    return this.nOutside * getBlockSpecifications(blockType, this.width)?.surfaceArea?.ext || 0;
  }

  getConcreteVolume(blockType: BlockType) {
    return getBlockSpecifications(blockType, this.width)?.concreteVolume || 0;
  }

  getTotalSurfaceArea(blockType: BlockType) {
    return this.getInsideSurfaceArea(blockType) + this.getOutsideSurfaceArea(blockType);
  }

  getTotal() {
    return this.nOutside + this.nInside;
  }
}

class NinetyDegreeCorner extends CornerBase {
  readonly corner: BlockType = "ninetyCorner";
  constructor(nInside: number, nOutside: number, width: Width, wallType: WallType) {
    super(nInside, nOutside, width, wallType);
    if (wallType === "KD" && ['10"', '12"'].includes(this.width)) this.corner = "kdNinetyCorner";
  }

  getTotalSurfaceArea() {
    return super.getTotalSurfaceArea(this.corner);
  }

  getConcreteVolume() {
    return super.getConcreteVolume(this.corner);
  }
}

class FortyFiveDegreeCorner extends CornerBase {
  constructor(nInside: number, nOutside: number, width: Width, wallType: WallType) {
    super(nInside, nOutside, width, wallType);
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

  constructor(nInside90: number, nOutside90: number, nInside45: number, nOutside45: number, width: Width, wallType: WallType) {
    this.ninetyDegreeCorner = new NinetyDegreeCorner(nInside90, nOutside90, width, wallType);
    this.fortyFiveDegreeCorner = new FortyFiveDegreeCorner(nInside45, nOutside45, width, wallType);
  }

  getTotalSurfaceArea(nCourses: number) {
    return (this.ninetyDegreeCorner.getTotalSurfaceArea() + this.fortyFiveDegreeCorner.getTotalSurfaceArea()) * nCourses;
  }

  getTotalConcreteVolume(totalNinetyCorners: number, totalFortyFiveCorners: number) {
    const ninetyCornersConcreteVolume = totalNinetyCorners * this.ninetyDegreeCorner.getConcreteVolume();
    const fortyFiveCornersConcreteVolume = totalFortyFiveCorners * this.fortyFiveDegreeCorner.getConcreteVolume();
    return ninetyCornersConcreteVolume + fortyFiveCornersConcreteVolume;
  }

  getTotal90(blockType: BlockType) {
    if (blockType !== this.ninetyDegreeCorner.corner) return 0;
    else return this.ninetyDegreeCorner.getTotal();
  }

  getTotal45() {
    return this.fortyFiveDegreeCorner.getTotal();
  }
}

export default Corners;
