import Dimensions from "./Dimensions";
import Opening from "./Opening";
import { ColdJointPin, VerticalRebar, HorizontalRebar } from "./Rebars";
import SpecialBlocks from "./SpecialBlocks";
import Corners from "./Corners";

export type Width = '4"' | '6"' | '8"';

export type WallType = "Reg" | "KD" | "HW" | "Pign";

export type RebarSize = "0.375" | "0.5" | "0.625" | "0.75" | "0.875" | "1";

export const BLOCK_TYPES = {
  straight: true,
  ninetyCorner: true,
  fortyFiveCorner: true,
  doubleTaperTop: true,
  brickLedge: true,
  buck: true,
  thermalsert: true,
  kdStraight: true,
  kdNinetyCorner: true,
} as const;

export type BlockType = keyof typeof BLOCK_TYPES;

export type BlockQuantities = Record<Width, Record<BlockType, Quantity>>;

export type BridgeQuantities = Record<Width, Quantity>;

export type RebarQuantities = Record<RebarSize, number>;

export interface SquareFootage {
  gross: number;
  net: number;
  opening: number;
}

export interface Quantity {
  quantity: number;
  nBundles: number;
}

export interface RebarQuantity {
  type: RebarSize;
  quantity: number;
}

export interface WallConfig {
  wallType: WallType;
  dimensions: Dimensions;
}

export interface WallMaterials {
  corners: Corners;
  specialBlocks: SpecialBlocks;
  openings: Opening[];
  horizontalRebar: HorizontalRebar;
  verticalRebar: VerticalRebar;
  coldJointPin: ColdJointPin;
  thermalserts: { nLayers: number; width: string };
}

export interface HouseSpecifications {
  clips: Quantity;
  concreteVolume: number;
  rebars: RebarQuantities;
  bridges: BridgeQuantities;
  squareFootage: SquareFootage;
  blockQuantities: BlockQuantities;
}
