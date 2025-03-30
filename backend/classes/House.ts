import Wall from "./Wall.js";
import {
  BlockType,
  BlockQuantities,
  WallSpecifications,
  HouseSpecifications,
  BridgeQuantities,
} from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";

class House {
  private walls: Wall[];
  private blockQuantities: BlockQuantities = {};
  private concreteVolume = 0;
  private nBlocks = 0;
  private bridges: BridgeQuantities = {};
  private rebars: Record<string, number> = {
    "0.375": 0,
    "0.5": 0,
    "0.625": 0,
    "0.75": 0,
    "0.875": 0,
    "1": 0,
  };
  private CONCRETE_VOLUME_CONVERSION_FACTOR = 0.7645;

  constructor(walls: Wall[]) {
    this.walls = walls;
  }

  private adjustBlockQuantities(wallSpecifications: WallSpecifications) {
    const {
      width,
      blockQuantities: sourceQuantities,
      horizontalRebars,
      verticalRebars,
      coldJointPins,
      concreteVolume,
      bridges,
      nBlocks,
    } = wallSpecifications;

    if (!this.blockQuantities[width]) {
      this.blockQuantities[width] = {
        straight: { quantity: 0, nBundles: 0 },
        ninetyCorner: { quantity: 0, nBundles: 0 },
        fortyFiveCorner: { quantity: 0, nBundles: 0 },
        doubleTaperTop: { quantity: 0, nBundles: 0 },
        brickLedge: { quantity: 0, nBundles: 0 },
        buck: { quantity: 0, nBundles: 0 },
        thermalsert: { quantity: 0, nBundles: 0 },
        kdStraight: { quantity: 0, nBundles: 0 },
        kdNinetyCorner: { quantity: 0, nBundles: 0 },
      };

      this.bridges[width] = { quantity: 0, nBundles: 0 };
    }

    for (const blockType in sourceQuantities) {
      const block = blockType as BlockType;
      const quantity = sourceQuantities[block];
      this.blockQuantities[width][block].quantity += quantity;
    }

    this.bridges[width].quantity += bridges;
    this.rebars[horizontalRebars.type] += horizontalRebars.quantity;
    this.rebars[verticalRebars.type] += verticalRebars.quantity;
    this.rebars[coldJointPins.type] += coldJointPins.quantity;
    this.concreteVolume += concreteVolume;
    this.nBlocks += nBlocks;
  }

  private computeBundleQuantity() {
    for (const width in this.blockQuantities) {
      for (const blockType in this.blockQuantities[width]) {
        const block = this.blockQuantities[width][blockType as BlockType];
        block.nBundles += Math.ceil(
          block.quantity / getBlockSpecifications(blockType as BlockType, width).qtyPerBundle
        );
      }
    }

    for (const width in this.bridges) {
      this.bridges[width].nBundles = Math.ceil(this.bridges[width].quantity / 256);
    }
  }

  computeHouse(): HouseSpecifications {
    for (let wall of this.walls) {
      const wallBlockQuantities = wall.computeWall();
      this.adjustBlockQuantities(wallBlockQuantities);
    }
    this.computeBundleQuantity();

    return {
      blockQuantities: this.blockQuantities,
      bridges: this.bridges,
      clips: { quantity: this.nBlocks, nBundles: Math.ceil(this.nBlocks / 200) },
      concreteVolume:
        Math.round((Math.ceil(this.concreteVolume) / 1.308 + Number.EPSILON) * 100) / 100, // To cubic meters instead of cubic yards
      rebars: this.rebars,
    };
  }
}

export default House;
