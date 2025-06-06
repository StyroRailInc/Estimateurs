import Wall from "./Wall.js";
import { BlockType, HouseSpecifications } from "./../interfaces/build-block.js";
import getBlockSpecifications from "./BlockSpecifications.js";
import { createBlockQuantities, createBridgeQuantities, createHouseSpecifications } from "../utils/createObject.js";
import { typedKeys } from "../utils/typedKeys.js";

class House {
  private nBlocks: number = 0;
  private hs: HouseSpecifications = createHouseSpecifications();
  private CONCRETE_VOLUME_CONVERSION_FACTOR = 1.308;

  constructor(private walls: Wall[]) {}

  private adjustBlockQuantities(ws: HouseSpecifications) {
    for (const width of typedKeys(ws.blockQuantities)) {
      if (!this.hs.blockQuantities[width]) {
        this.hs.blockQuantities = createBlockQuantities(this.hs.blockQuantities, width);
        this.hs.bridges = createBridgeQuantities(this.hs.bridges, width);
      }

      for (const blockType of typedKeys(ws.blockQuantities[width])) {
        const quantity = ws.blockQuantities[width][blockType].quantity;
        this.hs.blockQuantities[width][blockType].quantity += quantity;
      }

      this.hs.bridges[width].quantity += ws.bridges[width].quantity;
    }

    for (const size of typedKeys(ws.rebars)) {
      this.hs.rebars[size] += ws.rebars[size];
    }

    this.nBlocks += ws.clips.quantity;
    this.hs.concreteVolume += ws.concreteVolume;
    this.hs.squareFootage.net += ws.squareFootage.net;
    this.hs.squareFootage.gross += ws.squareFootage.gross;
    this.hs.squareFootage.opening += ws.squareFootage.opening;
  }

  private computeBundleQuantity() {
    for (const width of typedKeys(this.hs.blockQuantities)) {
      for (const blockType of typedKeys(this.hs.blockQuantities[width])) {
        const block = this.hs.blockQuantities[width][blockType];
        if (block.quantity < 0) block.quantity = 0; // just in case the inputs are invalid
        const qtyPerBundle = getBlockSpecifications(blockType as BlockType, width)?.qtyPerBundle || Infinity;
        block.nBundles += Math.ceil(block.quantity / qtyPerBundle);
      }
    }

    for (const width of typedKeys(this.hs.bridges)) {
      this.hs.bridges[width].nBundles = Math.ceil(this.hs.bridges[width].quantity / 256);
    }
  }

  private roundBlockQuantities() {
    for (const width of typedKeys(this.hs.blockQuantities)) {
      for (const blockType of typedKeys(this.hs.blockQuantities[width])) {
        const block = this.hs.blockQuantities[width][blockType];
        block.quantity = Math.ceil(block.quantity);
      }
    }
  }

  computeHouse(): HouseSpecifications {
    for (const wall of this.walls) {
      const wallBlockQuantities = wall.computeWall();
      this.adjustBlockQuantities(wallBlockQuantities);
    }
    this.roundBlockQuantities();
    this.computeBundleQuantity();

    this.hs.clips = { quantity: this.nBlocks, nBundles: Math.ceil(this.nBlocks / 200) };
    this.hs.concreteVolume = Math.round((Math.ceil(this.hs.concreteVolume) / this.CONCRETE_VOLUME_CONVERSION_FACTOR + Number.EPSILON) * 100) / 100; // To cubic meters instead of cubic yards
    return this.hs;
  }
}

export default House;
