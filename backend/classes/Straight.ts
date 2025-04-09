import getBlockSpecifications from "./BlockSpecifications.js";
import { BlockType, WallType, Width } from "./types.js";

export class Straight {
  private straightType: BlockType;
  private kdMultiplier = 1;

  constructor(wallType: WallType) {
    if (wallType === "KD") {
      this.straightType = "kdStraight";
      this.kdMultiplier = 2;
    } else {
      this.straightType = "straight";
    }
  }

  getTotalStraight(remainingSurfaceArea: number, width: Width) {
    const straight = getBlockSpecifications(this.straightType, width);
    const straightQuantity = Math.ceil(remainingSurfaceArea / straight.surfaceArea.ext) * this.kdMultiplier;
    return straightQuantity;
  }
}
