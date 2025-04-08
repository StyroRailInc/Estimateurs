import Wall from "./Wall.js";
import { BlockType, HouseSpecifications, BridgeQuantities, RebarQuantities, SquareFootage, Width } from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";
import { createBlockQuantities, createBridgeQuantities, createHouseSpecifications } from "../utils/createObject.js";
import { typedKeys } from "../utils/typedKeys.js";

class House {
  private nBlocks: number = 0;
  private hs: HouseSpecifications = createHouseSpecifications();
  private CONCRETE_VOLUME_CONVERSION_FACTOR = 1.308;

  constructor(private walls: Wall[]) {}

  private adjustBlockQuantities(ws: HouseSpecifications) {
    const [widthKey] = Object.entries(ws.blockQuantities)[0];
    const width = widthKey as Width;

    if (!this.hs.blockQuantities[width]) {
      this.hs.blockQuantities = createBlockQuantities(this.hs.blockQuantities, width);
      this.hs.bridges = createBridgeQuantities(this.hs.bridges, width);
    }

    for (const width of typedKeys(ws.blockQuantities)) {
      for (const blockType of typedKeys(ws.blockQuantities[width])) {
        const quantity = ws.blockQuantities[width][blockType].quantity;
        this.hs.blockQuantities[width][blockType].quantity += quantity;
      }
    }

    for (const size of typedKeys(ws.rebars)) {
      this.hs.rebars[size] += ws.rebars[size];
    }

    this.nBlocks += ws.clips.quantity;
    this.hs.concreteVolume += ws.concreteVolume;
    this.hs.squareFootage.net += ws.squareFootage.net;
    this.hs.squareFootage.gross += ws.squareFootage.gross;
    this.hs.squareFootage.opening += ws.squareFootage.opening;
    this.hs.bridges[width].quantity += ws.bridges[width].quantity;
  }

  private computeBundleQuantity() {
    for (const width of typedKeys(this.hs.blockQuantities)) {
      for (const blockType of typedKeys(this.hs.blockQuantities[width])) {
        const block = this.hs.blockQuantities[width][blockType];
        block.nBundles += Math.ceil(block.quantity / getBlockSpecifications(blockType as BlockType, width).qtyPerBundle);
      }
    }

    for (const width of typedKeys(this.hs.bridges)) {
      this.hs.bridges[width].nBundles = Math.ceil(this.hs.bridges[width].quantity / 256);
    }
  }

  computeHouse(): HouseSpecifications {
    for (let wall of this.walls) {
      const wallBlockQuantities = wall.computeWall();
      this.adjustBlockQuantities(wallBlockQuantities);
    }
    this.computeBundleQuantity();

    this.hs.clips = { quantity: this.nBlocks, nBundles: Math.ceil(this.nBlocks / 200) };
    this.hs.concreteVolume = Math.round((Math.ceil(this.hs.concreteVolume) / this.CONCRETE_VOLUME_CONVERSION_FACTOR + Number.EPSILON) * 100) / 100; // To cubic meters instead of cubic yards
    return this.hs;
  }
}

export default House;
