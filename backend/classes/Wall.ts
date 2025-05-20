import getBlockSpecifications from "./BlockSpecifications.js";
import { roundNumber } from "../utils/roundNumber.js";
import { BlockQuantities, BlockType, HouseSpecifications, WallConfig, WallMaterials, Width } from "./../interfaces/build-block.js";
import { createBlockQuantities, createBlockQuantity, createBridgeQuantities, createHouseSpecifications } from "../utils/createObject.js";

class Wall {
  private nCourses: number = 0;
  private remainingSurfaceArea: number = 0;
  private hs: HouseSpecifications = createHouseSpecifications();
  private straightType: BlockType;
  private widths: Width[] = [];

  constructor(private wConfig: WallConfig, private wm: WallMaterials) {
    this.straightType = this.wConfig.wallType === "KD" ? "kdStraight" : "straight";
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
      this.hs.blockQuantities[width].ninetyCorner.quantity -= this.wm.corners.getTotal90("ninetyCorner");
      this.hs.blockQuantities[width].fortyFiveCorner.quantity -= this.wm.corners.getTotal45();
      this.hs.blockQuantities[width].straight.quantity += this.wm.specialBlocks.getDoubleTaperTopNCorners();
    }
  }

  adjustSpecialBlocks() {
    const specialBlocks = this.wm.specialBlocks.getTotalDoubleTaperTop() + this.wm.specialBlocks.getTotalBrickLedge();
    this.hs.blockQuantities[this.wConfig.dimensions.width][this.straightType].quantity +=
      -specialBlocks + this.wm.specialBlocks.getBrickLedgeN45Corners() + this.wm.specialBlocks.getBrickLedgeNCorners();
  }

  private computeBlockQuantities() {
    this.hs.blockQuantities = createBlockQuantities({} as BlockQuantities, this.wConfig.dimensions.width);
    if (this.wm.thermalserts.nLayers) this.hs.blockQuantities[this.widths[1]] = createBlockQuantity();
    const bq = this.hs.blockQuantities[this.wConfig.dimensions.width];

    this.getTotalStraight();
    bq.ninetyCorner.quantity = this.getTotalNinetyCorner("ninetyCorner") - this.wm.specialBlocks.getBrickLedgeNCorners();

    bq.fortyFiveCorner.quantity = Math.ceil(this.wm.corners.getTotal45() * this.nCourses) - this.wm.specialBlocks.getBrickLedgeN45Corners();
    bq.doubleTaperTop.quantity = this.wm.specialBlocks.getTotalDoubleTaperTop() + this.wm.specialBlocks.getDoubleTaperTopNCorners();
    bq.brickLedge.quantity = this.wm.specialBlocks.getTotalBrickLedge();
    bq.buck.quantity = this.wm.specialBlocks.getTotalBuck();
    bq.kdNinetyCorner.quantity = this.getTotalNinetyCorner("kdNinetyCorner");
    // bq.kdDoubleTaperTop.quantity =
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
    const cornersConcreteVolume = this.wm.corners.getTotalConcreteVolume(bq.ninetyCorner.quantity, bq.fortyFiveCorner.quantity);
    const specialBlocksConcreteVolume = this.wm.specialBlocks.getTotalConcreteVolume(bq.brickLedge.quantity, bq.doubleTaperTop.quantity);
    const straightConcreteVolume = bq.straight.quantity * straight.concreteVolume;
    const kdStraightConcreteVolume = (bq.kdStraight.quantity / 2) * straight.concreteVolume;
    this.hs.concreteVolume = cornersConcreteVolume + specialBlocksConcreteVolume + straightConcreteVolume + kdStraightConcreteVolume;
  }

  private computeClips(nBlocks: number) {
    this.hs.clips.quantity = nBlocks;
  }

  private getTotalNinetyCorner(blockType: BlockType) {
    return Math.ceil(this.wm.corners.getTotal90(blockType) * this.nCourses);
  }

  private getTotalStraight() {
    const width = this.wConfig.dimensions.width;
    this.hs.blockQuantities[width][this.straightType].quantity = this.wm.straight.getTotalStraight(this.remainingSurfaceArea, width);
    this.adjustSpecialBlocks();
  }

  private computeTotalBlocks() {
    const { buck, thermalsert, ...otherBlocks } = this.hs.blockQuantities[this.wConfig.dimensions.width];
    return Object.entries(otherBlocks).reduce((total, [key, block]) => {
      return total + (key === "kdStraight" ? block.quantity / 2 : block.quantity);
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
}

export default Wall;
