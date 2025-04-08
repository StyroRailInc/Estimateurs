import { BlockQuantities, BlockType, BridgeQuantities, HouseSpecifications } from "./types.js";
import getBlockSpecifications from "./BlockSpecifications.js";
import { WallConfig, WallMaterials } from "./types.js";
import { roundNumber } from "../utils/roundNumber.js";
import { createBlockQuantities, createBridgeQuantities, createHouseSpecifications, createRebarQuantities } from "../utils/createObject.js";

class Wall {
  private nCourses: number = 0;
  private remainingSurfaceArea: number = 0;
  private hs: HouseSpecifications = createHouseSpecifications();

  constructor(private wConfig: WallConfig, private wm: WallMaterials) {}

  computeWall(): HouseSpecifications {
    const width = this.wConfig.dimensions.width;
    this.nCourses = this.wConfig.dimensions.getNCourses();
    let openingSurfaceArea = this.getOpeningSurfaceArea();

    this.computeOpenings(openingSurfaceArea);
    this.computeBlockQuantities();
    this.adjustDttQuantities();

    const nBlocks = this.computeTotalBlocks();
    this.hs.blockQuantities[width].thermalsert.quantity = this.wm.thermalserts.nLayers * nBlocks;

    this.computeRebars();
    this.computeClips(nBlocks);
    this.computeBridges(nBlocks);
    this.computeConcreteVolume();
    this.computeSquareFootage(openingSurfaceArea);

    return this.hs;
  }

  private computeOpenings(openingSurfaceArea: number) {
    this.remainingSurfaceArea = this.wConfig.dimensions.getCoursesSurfaceArea(this.wConfig.wallType);
    let openingPerimeter = this.getOpeningPerimeter();

    this.remainingSurfaceArea -= openingSurfaceArea;
    this.remainingSurfaceArea -= this.wm.corners.getTotalSurfaceArea() * this.nCourses;
    this.remainingSurfaceArea += this.wm.specialBlocks.getTotalSurfaceArea();

    this.wm.specialBlocks.setBuckLength(openingPerimeter);
  }

  private adjustDttQuantities() {
    const width = this.wConfig.dimensions.width;
    if (this.wm.specialBlocks.getTotalDoubleTaperTop()) {
      this.hs.blockQuantities[width].ninetyCorner.quantity -= this.wm.corners.getTotal90();
      this.hs.blockQuantities[width].fortyFiveCorner.quantity -= this.wm.corners.getTotal45();
      this.hs.blockQuantities[width].straight.quantity += this.wm.specialBlocks.getDoubleTaperTopNCorners();
    }
  }

  private computeBlockQuantities() {
    this.hs.blockQuantities = createBlockQuantities({} as BlockQuantities, this.wConfig.dimensions.width);
    const bq = this.hs.blockQuantities[this.wConfig.dimensions.width];
    bq.straight.quantity =
      this.getTotalStraight("straight") + this.wm.specialBlocks.getBrickLedgeN45Corners() + this.wm.specialBlocks.getBrickLedgeNCorners();
    bq.ninetyCorner.quantity = this.getTotalNinetyCorner("ninetyCorner") - this.wm.specialBlocks.getBrickLedgeNCorners();
    bq.fortyFiveCorner.quantity = Math.ceil(this.wm.corners.getTotal45() * this.nCourses) - this.wm.specialBlocks.getBrickLedgeN45Corners();
    bq.doubleTaperTop.quantity = this.wm.specialBlocks.getTotalDoubleTaperTop() + this.wm.specialBlocks.getDoubleTaperTopNCorners();
    bq.brickLedge.quantity = this.wm.specialBlocks.getTotalBrickLedge();
    bq.buck.quantity = this.wm.specialBlocks.getTotalBuck();
    bq.kdStraight.quantity = this.getTotalStraight("kdStraight");
    bq.kdNinetyCorner.quantity = this.getTotalNinetyCorner("kdNinetyCorner");
  }

  private computeSquareFootage(openingSurfaceArea: number) {
    this.hs.squareFootage.gross = roundNumber(Math.round(this.wConfig.dimensions.height * this.wConfig.dimensions.length) / 144);
    this.hs.squareFootage.net = roundNumber(this.hs.squareFootage.gross - ((openingSurfaceArea / 8) * 10) / 144);
    this.hs.squareFootage.opening = roundNumber(((openingSurfaceArea / 8) * 10) / 144);
  }

  private computeRebars() {
    const verticalRebars = this.wm.verticalRebar.computeVerticalRebars(this.wConfig.wallType);
    const horizontalRebars = this.wm.horizontalRebar.computeHorizontalRebars(this.wConfig.wallType);
    const coldJointPins = this.wm.coldJointPin.computeColdJointPins(this.wConfig.wallType);
    this.hs.rebars[verticalRebars.type] += verticalRebars.quantity;
    this.hs.rebars[horizontalRebars.type] += horizontalRebars.quantity;
    this.hs.rebars[coldJointPins.type] += coldJointPins.quantity;
  }

  private computeBridges(nBlocks: number) {
    const width = this.wConfig.dimensions.width;
    this.hs.bridges = createBridgeQuantities({} as BridgeQuantities, width);
    this.hs.bridges[width].quantity += nBlocks * 16;
  }

  private computeConcreteVolume() {
    const width = this.wConfig.dimensions.width;
    const straight = getBlockSpecifications("straight", this.wConfig.dimensions.width);
    const cornerConcreteVolume = this.wm.corners.getTotalConcreteVolume() * this.nCourses;
    const specialBlockConcreteVolume = this.wm.specialBlocks.getTotalConcreteVolume() * this.nCourses;
    const straightConcreteVolume = this.hs.blockQuantities[width].straight.quantity * straight.concreteVolume;
    const kdStraightConcreteVolume = this.hs.blockQuantities[width].kdStraight.quantity * straight.concreteVolume;
    this.hs.concreteVolume = cornerConcreteVolume + specialBlockConcreteVolume + straightConcreteVolume + kdStraightConcreteVolume;
  }

  private computeClips(nBlocks: number) {
    this.hs.clips.quantity = nBlocks;
  }

  private getTotalNinetyCorner(blockType: BlockType) {
    const nCorners = Math.ceil(this.wm.corners.getTotal90() * this.nCourses);
    if (blockType === "ninetyCorner" && this.wConfig.wallType !== "KD") return nCorners;
    if (blockType === "kdNinetyCorner" && this.wConfig.wallType === "KD") return nCorners;
    return 0;
  }

  private getTotalStraight(blockType: BlockType) {
    const straight = getBlockSpecifications("straight", this.wConfig.dimensions.width);
    if (blockType === "straight" && this.wConfig.wallType !== "KD") return Math.ceil(this.remainingSurfaceArea / straight.surfaceArea.ext);
    if (blockType === "kdStraight" && this.wConfig.wallType === "KD") return Math.ceil(this.remainingSurfaceArea / straight.surfaceArea.ext) * 2;
    return 0;
  }

  private computeTotalBlocks() {
    const { buck, thermalsert, ...otherBlocks } = this.hs.blockQuantities[this.wConfig.dimensions.width];
    return Object.entries(otherBlocks).reduce((total, [key, quantity]) => {
      return total + (key === "kdStraight" ? quantity.quantity / 2 : quantity.quantity);
    }, 0);
  }

  private getOpeningPerimeter(): number {
    // let buckWidthSurfaceArea = 0;
    // if (opening.getPerimeter()) buckWidthSurfaceArea += 4 * buck.height * opening.quantity; //I am not sure if i should keep this
    return this.wm.openings.reduce((total, opening) => total + opening.perimeter, 0);
  }

  private getOpeningSurfaceArea(): number {
    return this.wm.openings.reduce((total, opening) => total + opening.surfaceArea, 0);
  }
}

export default Wall;
