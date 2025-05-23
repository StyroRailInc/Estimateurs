import getBlockSpecifications from "./BlockSpecifications.js";
import { roundNumber } from "../utils/roundNumber.js";
import { BlockQuantities, BlockType, HouseSpecifications, WallConfig, WallMaterials, Width } from "./../interfaces/build-block.js";
import { createBlockQuantities, createBlockQuantity, createBridgeQuantities, createHouseSpecifications } from "../utils/createObject.js";

class Wall {
  private nCourses: number = 0;
  private remainingSurfaceArea: number = 0;
  private hs: HouseSpecifications = createHouseSpecifications();
  private straightType: BlockType;
  private brickLedgeType: BlockType;
  private doubleTaperTopType: BlockType;
  private ninetyCornerType: BlockType;
  private widths: Width[] = [];

  constructor(private wConfig: WallConfig, private wm: WallMaterials) {
    this.straightType = this.wConfig.wallType === "KD" ? "kdStraight" : "straight";
    this.brickLedgeType = this.wConfig.wallType === "KD" && ['10"', '12"'].includes(this.wConfig.dimensions.width) ? "kdBrickLedge" : "brickLedge";
    this.doubleTaperTopType =
      this.wConfig.wallType === "KD" && ['10"', '12"'].includes(this.wConfig.dimensions.width) ? "kdDoubleTaperTop" : "doubleTaperTop";
    this.ninetyCornerType =
      this.wConfig.wallType === "KD" && ['10"', '12"'].includes(this.wConfig.dimensions.width) ? "kdNinetyCorner" : "ninetyCorner";
    this.setWidths();
  }

  computeWall(): HouseSpecifications {
    this.nCourses = this.wConfig.dimensions.getNCourses();

    this.computeOpenings();
    this.computeBlockQuantities();
    this.adjustDttQuantities();

    const nBlocks = this.computeTotalBlocks();

    this.computeThermalserts(nBlocks);
    this.computeRebars();
    this.computeClips(nBlocks);
    this.computeBridges(nBlocks);
    this.computeConcreteVolume();
    this.computeSquareFootage();

    this.adjustQuantitiesIfKd();
    return this.hs;
  }

  private computeOpenings() {
    const openingSurfaceArea = this.getOpeningSurfaceArea();
    this.remainingSurfaceArea = this.wConfig.dimensions.getCoursesSurfaceArea();
    const openingPerimeter = this.getOpeningPerimeter();

    this.remainingSurfaceArea -= openingSurfaceArea;
    this.remainingSurfaceArea -= this.wm.corners.getTotalSurfaceArea(this.nCourses);

    this.wm.specialBlocks.setBuckLength(openingPerimeter);
  }

  private adjustDttQuantities() {
    const width = this.wConfig.dimensions.width;
    if (this.wm.specialBlocks.getTotalDoubleTaperTop()) {
      this.hs.blockQuantities[width][this.ninetyCornerType].quantity -= this.wm.corners.getTotal90();
      this.hs.blockQuantities[width].fortyFiveCorner.quantity -= this.wm.corners.getTotal45();
      this.hs.blockQuantities[width][this.straightType].quantity += this.wm.specialBlocks.getDoubleTaperTopNCorners();
    }
  }

  private adjustSpecialBlocks() {
    const specialBlocks = this.wm.specialBlocks.getTotalDoubleTaperTop() + this.wm.specialBlocks.getTotalBrickLedge();
    this.hs.blockQuantities[this.wConfig.dimensions.width][this.straightType].quantity +=
      -specialBlocks + this.wm.specialBlocks.getBrickLedgeN45Corners() + this.wm.specialBlocks.getBrickLedgeNCorners();
  }

  private computeBlockQuantities() {
    this.hs.blockQuantities = createBlockQuantities({} as BlockQuantities, this.wConfig.dimensions.width);
    if (this.wm.thermalserts.nLayers) this.hs.blockQuantities[this.widths[1]] = createBlockQuantity();
    const bq = this.hs.blockQuantities[this.wConfig.dimensions.width];

    this.getTotalStraight();

    bq.fortyFiveCorner.quantity = Math.ceil(this.wm.corners.getTotal45() * this.nCourses) - this.wm.specialBlocks.getBrickLedgeN45Corners();
    bq.buck.quantity = this.wm.specialBlocks.getTotalBuck();
    bq[this.ninetyCornerType].quantity = this.getTotalNinetyCorner() - this.wm.specialBlocks.getBrickLedgeNCorners();
    bq[this.doubleTaperTopType].quantity = this.wm.specialBlocks.getTotalDoubleTaperTop() + this.wm.specialBlocks.getDoubleTaperTopNCorners();
    bq[this.brickLedgeType].quantity = this.wm.specialBlocks.getTotalBrickLedge();
  }

  private computeThermalserts(nBlocks: number) {
    const tWidth = this.wm.thermalserts.width as Width;
    if (this.wm.thermalserts.nLayers) this.hs.blockQuantities[tWidth].thermalsert.quantity = this.wm.thermalserts.nLayers * nBlocks;
  }

  private computeSquareFootage() {
    const openingSurfaceArea = this.getOpeningSurfaceArea();
    this.hs.squareFootage.gross = roundNumber(Math.round(this.wConfig.dimensions.getSurfaceArea()) / 144);
    this.hs.squareFootage.net = roundNumber(this.hs.squareFootage.gross - ((openingSurfaceArea / 8) * 10) / 144);
    this.hs.squareFootage.opening = roundNumber(((openingSurfaceArea / 8) * 10) / 144);
  }

  private computeRebars() {
    const verticalRebars = this.wm.verticalRebar.computeVerticalRebars();
    const horizontalRebars = this.wm.horizontalRebar.computeHorizontalRebars();
    const coldJointPins = this.wm.coldJointPin.computeColdJointPins();
    this.hs.rebars[verticalRebars.type] += verticalRebars.quantity;
    this.hs.rebars[horizontalRebars.type] += horizontalRebars.quantity;
    this.hs.rebars[coldJointPins.type] += coldJointPins.quantity;
  }

  private computeBridges(nBlocks: number) {
    // The loop is simply to avoid undefined errors when computing bridges sum inside house
    for (const width of this.widths) createBridgeQuantities(this.hs.bridges, width);
    this.hs.bridges[this.wConfig.dimensions.width].quantity += nBlocks * 16;
  }

  private computeConcreteVolume() {
    const width = this.wConfig.dimensions.width;
    const bq = this.hs.blockQuantities[width];
    const straight = getBlockSpecifications(this.straightType, this.wConfig.dimensions.width);
    const cornersConcreteVolume = this.wm.corners.getTotalConcreteVolume(bq[this.ninetyCornerType].quantity, bq.fortyFiveCorner.quantity);
    const specialBlocksConcreteVolume = this.wm.specialBlocks.getTotalConcreteVolume(
      bq[this.brickLedgeType].quantity,
      bq[this.doubleTaperTopType].quantity
    );
    const straightConcreteVolume = bq[this.straightType].quantity * straight.concreteVolume;

    this.hs.concreteVolume = cornersConcreteVolume + specialBlocksConcreteVolume + straightConcreteVolume;
    console.log(cornersConcreteVolume, specialBlocksConcreteVolume, straightConcreteVolume);
    console.log(this.hs.concreteVolume);
  }

  private computeClips(nBlocks: number) {
    this.hs.clips.quantity = nBlocks;
  }

  private getTotalNinetyCorner() {
    return Math.ceil(this.wm.corners.getTotal90() * this.nCourses);
  }

  private getTotalStraight() {
    const width = this.wConfig.dimensions.width;
    this.hs.blockQuantities[width][this.straightType].quantity = this.wm.straight.getTotalStraight(this.remainingSurfaceArea, width);
    this.adjustSpecialBlocks();
  }

  private computeTotalBlocks() {
    const { buck, thermalsert, ...otherBlocks } = this.hs.blockQuantities[this.wConfig.dimensions.width];
    return Object.entries(otherBlocks).reduce((total, [key, block]) => {
      return total + block.quantity;
    }, 0);
  }

  // To initialise the thermalsert width if present
  private setWidths() {
    this.widths.push(this.wConfig.dimensions.width);
    if (this.wm.thermalserts.nLayers) this.widths.push(this.wm.thermalserts.width as Width);
  }

  private getOpeningPerimeter(): number {
    return this.wm.openings.reduce((total, opening) => total + opening.perimeter, 0);
  }

  private getOpeningSurfaceArea(): number {
    return this.wm.openings.reduce((total, opening) => total + opening.surfaceArea, 0);
  }

  private adjustQuantitiesIfKd() {
    if (!(this.wConfig.wallType === "KD")) return;
    const width = this.wConfig.dimensions.width;
    this.hs.blockQuantities[width].kdStraight.quantity *= 2;
  }
}

export default Wall;
