import {
  RebarQuantities,
  SquareFootage,
  BlockQuantities,
  Width,
  BridgeQuantities,
  Quantity,
  HouseSpecifications,
  BLOCK_TYPES,
  BlockType,
} from "../interfaces/build-block.js";

export function createRebarQuantities(): RebarQuantities {
  return {
    "0.375": 0,
    "0.5": 0,
    "0.625": 0,
    "0.75": 0,
    "0.875": 0,
    "1": 0,
  };
}

export function createSquareFootage(): SquareFootage {
  return {
    gross: 0,
    net: 0,
    opening: 0,
  };
}

export function createBlockQuantities(blockQuantities: BlockQuantities = {} as BlockQuantities, width: Width = '8"'): BlockQuantities {
  const allBlockTypes = Object.keys(BLOCK_TYPES) as BlockType[];
  blockQuantities[width] = Object.fromEntries(allBlockTypes.map((type) => [type, createDefaultQuantity()])) as BlockQuantities[Width];
  return blockQuantities;
}

export function createBridgeQuantities(bridgeQuantities: BridgeQuantities = {} as BridgeQuantities, width: Width = '8"'): BridgeQuantities {
  bridgeQuantities[width] = createDefaultQuantity();
  return bridgeQuantities;
}

export function createHouseSpecifications(): HouseSpecifications {
  return {
    concreteVolume: 0,
    clips: createDefaultQuantity(),
    rebars: createRebarQuantities(),
    squareFootage: createSquareFootage(),
    bridges: {} as BridgeQuantities,
    blockQuantities: {} as BlockQuantities,
  };
}

function createDefaultQuantity(): Quantity {
  return { quantity: 0, nBundles: 0 };
}
