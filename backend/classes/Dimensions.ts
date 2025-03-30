import { Width } from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";

class Dimensions {
  private height: number;
  private length: number;
  private width: Width;

  constructor(height: number, length: number, width: Width) {
    this.height = height;
    this.length = length;
    this.width = width;
  }

  getSurfaceArea(): number {
    return this.height * this.length;
  }

  getNCourses() {
    return this.height / getBlockSpecifications("straight", this.width).height;
  }

  getHeight(): number {
    return this.height;
  }

  getLength(): number {
    return this.length;
  }

  getWidth(): Width {
    return this.width;
  }
}

export default Dimensions;
