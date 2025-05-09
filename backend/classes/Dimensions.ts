import { BlockType, WallType, Width } from "./../interfaces/build-block.js";
import getBlockSpecifications from "./BlockSpecifications.js";

class Dimensions {
  private HALF_INCREMENT = 2;
  private pinionMultiplier = 1;
  private straight: BlockType = "straight";

  constructor(readonly height: number, readonly length: number, readonly width: Width, wallType: WallType) {
    if (wallType === "KD") this.straight = "kdStraight";
    else if (wallType === "Pign") this.pinionMultiplier = 0.5;
  }

  private ceilToHalfBlock(nBlocks: number) {
    return Math.ceil(nBlocks * this.HALF_INCREMENT) / this.HALF_INCREMENT;
  }

  getSurfaceArea(): number {
    return this.height * this.length * this.pinionMultiplier;
  }

  getCoursesSurfaceArea(): number {
    const straightHeight = getBlockSpecifications(this.straight, this.width).height;
    return this.getNCourses() * straightHeight * this.length * this.pinionMultiplier;
  }

  getNCourses() {
    const nCourses = this.height / getBlockSpecifications(this.straight, this.width).height;
    return this.ceilToHalfBlock(nCourses);
  }
}

export default Dimensions;
