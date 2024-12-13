import Wall from "./Wall.js";
import { BlockType, Width } from "./types.js";

class House {
  private walls: Wall[];

  private blockQuantities: Record<string, Record<BlockType, number>> = {};

  private concreteVolume = 0;

  private adjustBlockQuantities(blockQuantities: {
    width: Width;
    blockQuantities: Record<BlockType, number>;
    concreteVolume: number;
  }) {
    const { width, blockQuantities: sourceQuantities, concreteVolume } = blockQuantities;

    // Initialize width entry if it doesn't exist yet
    if (!this.blockQuantities[width]) {
      this.blockQuantities[width] = {
        straight: 0,
        ninetyCorner: 0,
        fortyFiveCorner: 0,
        doubleTaperTop: 0,
        brickLedge: 0,
        buck: 0,
      };
    }
    for (const blockType in sourceQuantities) {
      const quantity = sourceQuantities[blockType as BlockType];

      this.blockQuantities[width][blockType as BlockType] += quantity;
    }
    this.concreteVolume += concreteVolume * 0.7645; // Conversion factor
  }

  constructor(walls: Wall[]) {
    this.walls = walls;
  }

  computeHouse() {
    for (let wall of this.walls) {
      const wallBlockQuantities = wall.computeWall();
      this.adjustBlockQuantities(wallBlockQuantities);
    }
  }

  getBlockQuantities() {
    return this.blockQuantities;
  }
}

export default House;
