import { HorizontalRebar } from "./Rebars";

export type Width = '4"' | '6"' | '8"';

export type BlockType =
  | "straight"
  | "ninetyCorner"
  | "fortyFiveCorner"
  | "doubleTaperTop"
  | "brickLedge"
  | "buck"
  | "thermalsert"
  | "kdStraight"
  | "kdNinetyCorner";

export type BlockQuantities = Record<
  string,
  Record<BlockType, { quantity: number; nBundles: number }>
>;

export type BridgeQuantities = Record<string, { quantity: number; nBundles: number }>;

export type WallSpecifications = {
  width: Width;
  blockQuantities: Record<BlockType, number>;
  horizontalRebars: { type: string; quantity: number };
  verticalRebars: { type: string; quantity: number };
  coldJointPins: { type: string; quantity: number };
  concreteVolume: number;
  bridges: number;
  nBlocks: number;
};

export type HouseSpecifications = {
  blockQuantities: BlockQuantities;
  bridges: BridgeQuantities;
  clips: { quantity: number; nBundles: number };
  concreteVolume: number;
  rebars: Record<string, number>;
};

export type WallType = "Reg" | "KD" | "HW" | "Pign";
