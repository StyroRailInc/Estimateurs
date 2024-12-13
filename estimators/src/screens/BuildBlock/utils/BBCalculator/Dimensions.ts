import { Width } from "../../../../../../backend/computeBuildblock/types/index.js";
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
    return Math.ceil(this.height / getBlockSpecifications("straight", this.width).height);
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

  setHeight(height: number) {
    this.height = height;
  }

  setLength(length: number) {
    this.length = length;
  }

  setWidth(width: Width) {
    this.width = width;
  }
}

export default Dimensions;
