import getBlockSpecifications from "./BlockSpecifications.js";
import { BlockType, WallType, Width } from "./../interfaces/build-block.js";

export class Straight {
  private straightType: BlockType;

  constructor(wallType: WallType) {
    if (wallType === "KD") this.straightType = "kdStraight";
    else this.straightType = "straight";
  }

  getTotalStraight(remainingSurfaceArea: number, width: Width) {
    const straight = getBlockSpecifications(this.straightType, width);
    const straightQuantity = Math.ceil(remainingSurfaceArea / straight.surfaceArea.ext);
    return straightQuantity;
  }
}
