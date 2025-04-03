import { WallType, Width } from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";

class Dimensions {
  private HALF_INCREMENT = 2;

  constructor(readonly height: number, readonly length: number, readonly width: Width) {}

  private ceilToHalfBlock(nBlocks: number) {
    return Math.ceil(nBlocks * this.HALF_INCREMENT) / this.HALF_INCREMENT;
  }

  getSurfaceArea(): number {
    return this.height * this.length;
  }

  getCoursesSurfaceArea(wallType: WallType): number {
    let multiplier = 1;
    if (wallType === "Pign") multiplier = 0.5;
    const straightHeight = getBlockSpecifications("straight", this.width).height;
    return this.getNCourses() * straightHeight * this.length * multiplier;
  }

  getNCourses() {
    const nCourses = this.height / getBlockSpecifications("straight", this.width).height;
    return this.ceilToHalfBlock(nCourses);
  }
}

export default Dimensions;
