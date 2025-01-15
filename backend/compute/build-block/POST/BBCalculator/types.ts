export type Width = '4"' | '6"' | '8"';

export type BlockType =
  | "straight"
  | "ninetyCorner"
  | "fortyFiveCorner"
  | "doubleTaperTop"
  | "brickLedge"
  | "buck"
  | "thermalsert";

export type BlockQuantities = Record<
  string,
  Record<BlockType, { quantity: number; nBundles: number }>
>;

export type WallSpecifications = {
  width: Width;
  blockQuantities: Record<BlockType, number>;
  concreteVolume: number;
  bridges: number;
  nBlocks: number;
};

export type HouseSpecifications = {
  blockQuantities: BlockQuantities;
  bridges: { quantity: number; nBundles: number };
  clips: { quantity: number; nBundles: number };
  concreteVolume: number;
};
