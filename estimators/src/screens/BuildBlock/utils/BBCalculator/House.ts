import Wall from "./Wall.js";
import { BlockType, Width } from "../../../../../../backend/computeBuildblock/types/index.js";

class House {
  private walls: Wall[];

  private blockQuantities: Record<Width, Record<BlockType, number>> = {
    '8"': {
      straight: 0,
      ninetyCorner: 0,
      fortyFiveCorner: 0,
      doubleTaperTop: 0,
      brickLedge: 0,
      buck: 0,
    },
    '6"': {
      straight: 0,
      ninetyCorner: 0,
      fortyFiveCorner: 0,
      doubleTaperTop: 0,
      brickLedge: 0,
      buck: 0,
    },
    '4"': {
      straight: 0,
      ninetyCorner: 0,
      fortyFiveCorner: 0,
      doubleTaperTop: 0,
      brickLedge: 0,
      buck: 0,
    },
  };

  private concreteVolume = 0;

  private adjustBlockQuantities(blockQuantities: {
    width: Width;
    blockQuantities: Record<BlockType, number>;
    concreteVolume: number;
  }) {
    this.blockQuantities[blockQuantities.width]["straight"] +=
      blockQuantities.blockQuantities["straight"];
    this.blockQuantities[blockQuantities.width]["ninetyCorner"] +=
      blockQuantities.blockQuantities["ninetyCorner"];
    this.blockQuantities[blockQuantities.width]["fortyFiveCorner"] +=
      blockQuantities.blockQuantities["fortyFiveCorner"];
    this.blockQuantities[blockQuantities.width]["doubleTaperTop"] +=
      blockQuantities.blockQuantities["doubleTaperTop"];
    this.blockQuantities[blockQuantities.width]["brickLedge"] +=
      blockQuantities.blockQuantities["brickLedge"];
    this.blockQuantities[blockQuantities.width]["buck"] += blockQuantities.blockQuantities["buck"];
    this.concreteVolume += blockQuantities.concreteVolume * 0.7645; // Can be improved
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
