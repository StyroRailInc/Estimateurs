import Wall from "./Wall.js";
import { BlockType, BlockQuantities, WallSpecifications, HouseSpecifications } from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";

class House {
  private walls: Wall[];
  private blockQuantities: BlockQuantities = {};
  private concreteVolume = 0;
  private nBridges = 0;
  private nBlocks = 0;
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
      concreteVolume,
      bridges,
      nBlocks,
    } = wallSpecifications;

    // Initialize width entry if it doesn't exist yet
    if (!this.blockQuantities[width]) {
      this.blockQuantities[width] = {
        straight: { quantity: 0, nBundles: 0 },
        ninetyCorner: { quantity: 0, nBundles: 0 },
        fortyFiveCorner: { quantity: 0, nBundles: 0 },
        doubleTaperTop: { quantity: 0, nBundles: 0 },
        brickLedge: { quantity: 0, nBundles: 0 },
        buck: { quantity: 0, nBundles: 0 },
        thermalsert: { quantity: 0, nBundles: 0 },
      };
    }

    for (const blockType in sourceQuantities) {
      const block = blockType as BlockType;
      const quantity = sourceQuantities[block];
      this.blockQuantities[width][block].quantity += quantity;
    }

    this.rebars[horizontalRebars.type] += horizontalRebars.quantity;
    this.rebars[verticalRebars.type] += verticalRebars.quantity;
    this.concreteVolume += concreteVolume;
    this.nBridges += bridges;
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
  }

  computeHouse(): HouseSpecifications {
    for (let wall of this.walls) {
      const wallBlockQuantities = wall.computeWall();
      this.adjustBlockQuantities(wallBlockQuantities);
    }
    this.computeBundleQuantity();

    return {
      blockQuantities: this.blockQuantities,
      bridges: { quantity: this.nBridges, nBundles: this.nBridges / 256 },
      clips: { quantity: this.nBlocks, nBundles: Math.ceil(this.nBlocks / 200) },
      concreteVolume: Math.ceil(this.concreteVolume / 1.308), // To cubic meters instead of cubic yards
      rebars: this.rebars,
    };
  }
}

export default House;
