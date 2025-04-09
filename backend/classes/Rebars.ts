import { RebarQuantity, RebarSize, WallType } from "./types";

class Rebar {
  readonly barLength = 20;

  readonly excelFileConstant = 40; // Conventionally 40 times rebar diameter
  readonly nInchesInFoot = 12;

  protected pinionMultiplier = 1;

  constructor(readonly type: number, readonly wallHeight: number, readonly wallLength: number, readonly wallType: WallType) {
    if (wallType === "Pign") this.pinionMultiplier = 0.5;
  }

  getSpacing() {
    return (this.type * this.excelFileConstant) / this.nInchesInFoot;
  }
}

export class HorizontalRebar extends Rebar {
  private nRows;

  constructor(type: number, wallHeight: number, wallLength: number, nRows: number, wallType: WallType) {
    super(type, wallHeight, wallLength, wallType);
    this.nRows = nRows;
  }

  computeHorizontalRebars(): RebarQuantity {
    return {
      type: this.type.toString() as RebarSize,
      quantity: Math.ceil(
        ((this.wallLength * this.nRows * (1 + (this.getSpacing() * 2) / this.barLength)) / this.barLength / this.nInchesInFoot) *
          this.pinionMultiplier
      ),
    };
  }
}

export class VerticalRebar extends Rebar {
  private verticalSpacing;

  constructor(type: number, wallHeight: number, wallLength: number, verticalSpacing: number, wallType: WallType) {
    super(type, wallHeight, wallLength, wallType);
    this.verticalSpacing = verticalSpacing;
  }

  computeVerticalRebars(): RebarQuantity {
    return {
      type: this.type.toString() as RebarSize,
      quantity: Math.ceil(
        (((this.getSpacing() + this.wallHeight / this.nInchesInFoot) * this.wallLength) /
          (this.verticalSpacing / this.nInchesInFoot) /
          this.barLength /
          this.nInchesInFoot) *
          this.pinionMultiplier
      ),
    };
  }
}

export class ColdJointPin extends Rebar {
  readonly centerSpacing;
  readonly lLength;
  readonly depthInFooting;
  readonly BEND_RADIUS = 6;

  constructor(
    type: number,
    wallHeight: number,
    wallLength: number,
    centerSpacing: number,
    lLength: number,
    depthInFooting: number,
    wallType: WallType
  ) {
    super(type, wallHeight, wallLength, wallType);
    this.centerSpacing = centerSpacing;
    this.lLength = lLength;
    this.depthInFooting = depthInFooting;
  }

  getBendRadius() {
    return this.BEND_RADIUS * this.type;
  }

  getBendLength() {
    // 90 degrees
    return Math.ceil((2 * Math.PI * this.getBendRadius() * 90) / 360);
  }

  getLapSpliceLength() {
    return this.excelFileConstant * this.type;
  }

  getHeight() {
    return this.lLength + this.depthInFooting + this.getLapSpliceLength() + this.getBendLength();
  }

  getNBarColumns() {
    return this.wallLength / this.centerSpacing;
  }

  computeColdJointPins(): RebarQuantity {
    return {
      type: this.type.toString() as RebarSize,
      quantity: Math.ceil((this.pinionMultiplier * this.getNBarColumns() * this.getHeight()) / (this.barLength * this.nInchesInFoot)),
    };
  }
}
