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
  constructor(nInside: number, nOutside: number, width: Width, wallType: WallType) {
    super(nInside, nOutside, width, wallType);
  }

  getTotalSurfaceArea() {
    if (this.wallType === "KD") return super.getTotalSurfaceArea("kdNinetyCorner");
    return super.getTotalSurfaceArea("ninetyCorner");
  }

  getConcreteVolume() {
    if (this.wallType === "KD") return super.getConcreteVolume("kdNinetyCorner");
    return super.getConcreteVolume("ninetyCorner");
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

  constructor(
    nInside90: number,
    nOutside90: number,
    nInside45: number,
    nOutside45: number,
    width: Width,
    wallType: WallType
  ) {
    this.ninetyDegreeCorner = new NinetyDegreeCorner(nInside90, nOutside90, width, wallType);
    this.fortyFiveDegreeCorner = new FortyFiveDegreeCorner(nInside45, nOutside45, width, wallType);
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
