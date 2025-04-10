import getBlockSpecifications from "./BlockSpecifications.js";
import { BlockType, Width } from "./types.js";

class SpecialBlockBase {
  protected length: number;
  protected width: Width;

  constructor(length: number, width: Width) {
    this.length = length;
    this.width = width;
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

  getBlockLength() {
    return super.getBlockLength("brickLedge");
  }

  getLength() {
    return this.length;
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

  getBlockLength() {
    return super.getBlockLength("doubleTaperTop");
  }

  getLength() {
    return this.length;
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
    this.brickLedge = new BrickLedge(brickLedgeLength, width, brickLedgeNCorners, brickLedgeN45Corners);
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

  getTotalBrickLedge() {
    const total = Math.ceil(this.brickLedge.getLength() / this.brickLedge.getBlockLength());
    if (Number.isNaN(total)) return 0;
    else return total;
  }

  getTotalDoubleTaperTop() {
    const total = Math.ceil(this.doubleTaperTop.getLength() / this.doubleTaperTop.getBlockLength());
    if (Number.isNaN(total)) return 0;
    else return total;
  }

  getTotalBuck() {
    return this.buck.getLength() / this.buck.getBlockLength();
  }

  setBuckLength(length: number) {
    this.buck.setLength(length);
  }

  getTotalConcreteVolume(totalBrickLedge: number, totalDoubleTaperTop: number) {
    const brickLedgeConcreteVolume = totalBrickLedge * this.brickLedge.getConcreteVolume();
    const doubleTaperTopConcreteVolume = totalDoubleTaperTop * this.doubleTaperTop.getConcreteVolume();
    return brickLedgeConcreteVolume + doubleTaperTopConcreteVolume;
  }
}

export default SpecialBlocks;
