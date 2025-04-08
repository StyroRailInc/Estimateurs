import { WallType, Width } from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";

class Dimensions {
  private HALF_INCREMENT = 2;
  private pinionMultiplier = 1;

  constructor(readonly height: number, readonly length: number, readonly width: Width) {}

  private ceilToHalfBlock(nBlocks: number) {
    return Math.ceil(nBlocks * this.HALF_INCREMENT) / this.HALF_INCREMENT;
  }

  tryApplyPinion(wallType: WallType) {
    if (wallType === "Pign") this.pinionMultiplier = 0.5;
  }

  getSurfaceArea(): number {
    return this.height * this.length * this.pinionMultiplier;
  }

  getCoursesSurfaceArea(): number {
    const straightHeight = getBlockSpecifications("straight", this.width).height;
    return this.getNCourses() * straightHeight * this.length * this.pinionMultiplier;
  }

  getNCourses() {
    const nCourses = this.height / getBlockSpecifications("straight", this.width).height;
    return this.ceilToHalfBlock(nCourses);
  }
}

export default Dimensions;
