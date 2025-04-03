import getBlockSpecifications from "./BlockSpecifications.js";
import { BlockType, Width } from "./types.js";

class SpecialBlockBase {
  protected length: number;
  protected width: Width;

  constructor(length: number, width: Width) {
    this.length = length;
    this.width = width;
  }

  getSurfaceArea(blockType: BlockType) {
    return getBlockSpecifications(blockType, this.width).height * this.length;
  }

  getBlockSurfaceArea(blockType: BlockType) {
    return getBlockSpecifications(blockType, this.width).surfaceArea.ext;
  }

  getBlockLength(blockType: BlockType) {
    return getBlockSpecifications(blockType, this.width).length.ext;
  }

  setLength(length: number) {
    this.length = length;
  }

  getConcreteVolume(blockType: BlockType) {
    if (this.length) return getBlockSpecifications(blockType, this.width).concreteVolume;
    else return 0;
  }
}

class BrickLedge extends SpecialBlockBase {
  readonly nCorners;
  readonly n45Corners;
  constructor(length: number, width: Width, nCorners: number, n45Corners: number) {
    super(length, width);
    this.nCorners = nCorners;
    this.n45Corners = n45Corners;
  }

  getSurfaceArea() {
    return super.getSurfaceArea("brickLedge");
  }

  getBlockSurfaceArea() {
    return super.getBlockSurfaceArea("brickLedge");
  }

  getConcreteVolume() {
    return super.getConcreteVolume("brickLedge");
  }
}

class DoubleTaperTop extends SpecialBlockBase {
  readonly nCorners;
  constructor(length: number, width: Width, nCorners: number) {
    super(length, width);
    this.nCorners = nCorners;
  }

  getSurfaceArea() {
    return super.getSurfaceArea("doubleTaperTop");
  }

  getBlockSurfaceArea() {
    return super.getBlockSurfaceArea("doubleTaperTop");
  }

  getConcreteVolume() {
    return super.getConcreteVolume("doubleTaperTop");
  }
}

class Buck extends SpecialBlockBase {
  constructor(length: number, width: Width) {
    super(length, width);
  }

  getLength() {
    return this.length;
  }

  getBlockLength() {
    return super.getBlockLength("buck");
  }
}

class SpecialBlocks {
  private doubleTaperTop: DoubleTaperTop;
  private brickLedge: BrickLedge;
  private buck: Buck;

  constructor(
    doubleTaperTopLength: number,
    doubleTaperTopNCorners: number,
    brickLedgeLength: number,
    brickLedgeNCorners: number,
    brickLedgeN45Corners: number,
    buckLength: number,
    width: Width
  ) {
    this.doubleTaperTop = new DoubleTaperTop(doubleTaperTopLength, width, doubleTaperTopNCorners);
    this.brickLedge = new BrickLedge(
      brickLedgeLength,
      width,
      brickLedgeNCorners,
      brickLedgeN45Corners
    );
    this.buck = new Buck(buckLength, width);
  }

  getDoubleTaperTopNCorners() {
    return this.doubleTaperTop.nCorners;
  }

  getBrickLedgeNCorners() {
    return this.brickLedge.nCorners;
  }

  getBrickLedgeN45Corners() {
    return this.brickLedge.n45Corners;
  }

  getTotalSurfaceArea() {
    return this.doubleTaperTop.getSurfaceArea() + this.brickLedge.getSurfaceArea();
  }

  getTotalBrickLedge() {
    const total = Math.ceil(
      this.brickLedge.getSurfaceArea() / this.brickLedge.getBlockSurfaceArea()
    );
    if (Number.isNaN(total)) return 0;
    else return total;
  }

  getTotalDoubleTaperTop() {
    const total = Math.ceil(
      this.doubleTaperTop.getSurfaceArea() / this.doubleTaperTop.getBlockSurfaceArea()
    );
    if (Number.isNaN(total)) return 0;
    else return total;
  }

  getTotalBuck() {
    return Math.ceil(this.buck.getLength() / this.buck.getBlockLength());
  }

  setBuckLength(length: number) {
    this.buck.setLength(length);
  }

  getTotalConcreteVolume() {
    return this.doubleTaperTop.getConcreteVolume() + this.brickLedge.getConcreteVolume();
  }
}

export default SpecialBlocks;
