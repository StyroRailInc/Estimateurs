import { BlockType } from "./../interfaces/build-block.js";

interface BlockSpecification {
  length: { ext: number; int: number }; // Inches
  width: number; // Inches
  height: number; // Inches
  concreteVolume: number; // Cubic yards
  surfaceArea: { ext: number; int: number }; // Square feet
  qtyPerBundle: number; // Number
  return?: { ext: number; int: number }; // Inches
}

const blockSpecifications: Record<BlockType, Record<string, BlockSpecification>> = {
  straight: {
    '4"': {
      length: { ext: 48, int: 48 },
      width: 9,
      height: 16,
      concreteVolume: 0.065844,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 15,
    },
    '6"': {
      length: { ext: 48, int: 48 },
      width: 11,
      height: 16,
      concreteVolume: 0.098765,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 12,
    },
    '8"': {
      length: { ext: 48, int: 48 },
      width: 13,
      height: 16,
      concreteVolume: 0.131687,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 12,
    },
  },
  ninetyCorner: {
    '4"': {
      length: { ext: 31, int: 22 },
      width: 9,
      height: 16,
      concreteVolume: 0.054574,
      surfaceArea: { ext: 800, int: 512 },
      qtyPerBundle: 12,
      return: { ext: 19, int: 10 },
    },
    '6"': {
      length: { ext: 33, int: 22 },
      width: 11,
      height: 16,
      concreteVolume: 0.086528,
      surfaceArea: { ext: 864, int: 512 },
      qtyPerBundle: 12,
      return: { ext: 21, int: 10 },
    },
    '8"': {
      length: { ext: 35, int: 22 },
      width: 13,
      height: 16,
      concreteVolume: 0.121517,
      surfaceArea: { ext: 928, int: 512 },
      qtyPerBundle: 12,
      return: { ext: 23, int: 10 },
    },
  },
  kdStraight: {
    // deconstructed
    '4"': {
      length: { ext: 48, int: 48 },
      width: 9,
      height: 16,
      concreteVolume: 0.065844,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 32, // 16 blocks or 32 panels
    },
    '6"': {
      length: { ext: 48, int: 48 },
      width: 11,
      height: 16,
      concreteVolume: 0.098765,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 32, // 16 blocks or 32 panels
    },
    '8"': {
      length: { ext: 48, int: 48 },
      width: 13,
      height: 16,
      concreteVolume: 0.131687,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 32, // 16 blocks or 32 panels
    },
    '10"': {
      length: { ext: 48, int: 48 },
      width: 15,
      height: 16,
      concreteVolume: 0.164609,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 32, // 16 blocks or 32 panels
    },
    '12"': {
      length: { ext: 48, int: 48 },
      width: 17,
      height: 16,
      concreteVolume: 0.197529,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 32, // 16 blocks or 32 panels
    },
  },
  kdNinetyCorner: {
    // assembled
    '10"': {
      length: { ext: 37, int: 22 },
      width: 15,
      height: 16,
      concreteVolume: 0.151444,
      surfaceArea: { ext: 992, int: 512 },
      qtyPerBundle: 8, // 8 blocks or 16 panels
      return: { ext: 25, int: 10 },
    },
    '12"': {
      length: { ext: 39, int: 22 },
      width: 17,
      height: 16,
      concreteVolume: 0.191408,
      surfaceArea: { ext: 1056, int: 512 },
      qtyPerBundle: 8, // 8 block or 16 panels
      return: { ext: 27, int: 10 },
    },
  },
  fortyFiveCorner: {
    '4"': {
      length: { ext: 28, int: 24.272 },
      width: 9,
      height: 16,
      concreteVolume: 0.054985,
      surfaceArea: { ext: 704, int: 584.704 },
      qtyPerBundle: 12,
      return: { ext: 16, int: 12.272 },
    },
    '6"': {
      length: { ext: 28, int: 23.444 },
      width: 11,
      height: 16,
      concreteVolume: 0.080841,
      surfaceArea: { ext: 704, int: 558.21 },
      qtyPerBundle: 12,
      return: { ext: 16, int: 11.444 },
    },
    '8"': {
      length: { ext: 28, int: 22.615 },
      width: 13,
      height: 16,
      concreteVolume: 0.105425,
      surfaceArea: { ext: 704, int: 531.68 },
      qtyPerBundle: 12,
      return: { ext: 16, int: 10.615 },
    },
  },
  doubleTaperTop: {
    '4"': {
      length: { ext: 0, int: 0 },
      width: 0,
      height: 0,
      concreteVolume: 0,
      surfaceArea: { ext: 0, int: 0 },
      qtyPerBundle: 1,
    },
    '6"': {
      length: { ext: 48, int: 48 },
      width: 11,
      height: 16,
      concreteVolume: 0.130128,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 12,
    },
    '8"': {
      length: { ext: 48, int: 48 },
      width: 13,
      height: 16,
      concreteVolume: 0.16305,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 12,
    },
  },
  kdDoubleTaperTop: {
    '10"': {
      length: { ext: 48, int: 48 },
      width: 15,
      height: 16,
      concreteVolume: 0.195972, // to verify
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 12,
    },
    '12"': {
      length: { ext: 48, int: 48 },
      width: 17,
      height: 16,
      concreteVolume: 0.228894, // to verify
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 12,
    },
  },
  brickLedge: {
    '4"': {
      length: { ext: 0, int: 0 },
      width: 0,
      height: 0,
      concreteVolume: 0,
      surfaceArea: { ext: 0, int: 0 },
      qtyPerBundle: 1, // no division by 0 since product is not available
    },
    '6"': {
      length: { ext: 48, int: 48 },
      width: 11,
      height: 16,
      concreteVolume: 0.134148,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 6,
    },
    '8"': {
      length: { ext: 48, int: 48 },
      width: 13,
      height: 16,
      concreteVolume: 0.167074,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 6,
    },
  },
  kdBrickLedge: {
    '10"': {
      length: { ext: 48, int: 48 },
      width: 15,
      height: 17,
      concreteVolume: 0.200008,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 6, // to verify
    },
    '12"': {
      length: { ext: 48, int: 48 },
      width: 13,
      height: 16,
      concreteVolume: 0.232942,
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 6, // to verify
    },
  },
  buck: {
    '4"': {
      length: { ext: 48, int: 48 },
      width: 9,
      height: 2,
      concreteVolume: 0, // Not provided
      surfaceArea: { ext: 450, int: 450 },
      qtyPerBundle: 19,
    },
    '6"': {
      length: { ext: 48, int: 48 },
      width: 11,
      height: 2,
      concreteVolume: 0, // Not provided
      surfaceArea: { ext: 550.08, int: 550.08 },
      qtyPerBundle: 18,
    },
    '8"': {
      length: { ext: 48, int: 48 },
      width: 13,
      height: 2,
      concreteVolume: 0, // Not provided
      surfaceArea: { ext: 649.44, int: 649.44 },
      qtyPerBundle: 16,
    },
  },
  thermalsert: {
    '1"': {
      length: { ext: 48, int: 48 },
      width: 1,
      height: 16,
      concreteVolume: 0.014999421, // Concrete displacement
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 75, // used to be 150
    },
    '2"': {
      length: { ext: 48, int: 48 },
      width: 2,
      height: 16,
      concreteVolume: 0.030002851, // Concrete displacement
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 75,
    },
    '4"': {
      length: { ext: 48, int: 48 },
      width: 4,
      height: 16,
      concreteVolume: 0.060009709, // Concrete displacement
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 75, // used to be 36
    },
    '6"': {
      length: { ext: 48, int: 48 },
      width: 4,
      height: 16,
      concreteVolume: 0.090008553, // Concrete displacement APPROXIMATION
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 75, // used to be 25
    },
    '8"': {
      length: { ext: 48, int: 48 },
      width: 4,
      height: 16,
      concreteVolume: 0.120019418, // Concrete displacement APPROXIMATION
      surfaceArea: { ext: 767.52, int: 767.52 },
      qtyPerBundle: 75, // used to be 18
    },
  },
};

function getBlockSpecifications(blockType: BlockType, width: string): BlockSpecification {
  return blockSpecifications[blockType][width];
}

export default getBlockSpecifications;
