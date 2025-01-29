class Rebar {
  readonly type;
  readonly wallHeight;
  readonly wallLength;
  readonly barLength = 20;

  readonly excelFileConstant = 40; // Conventionally 40 times rebar diameter
  readonly nInchesInFoot = 12;

  constructor(type: number, wallHeight: number, wallLength: number) {
    this.type = type;
    this.wallHeight = wallHeight;
    this.wallLength = wallLength;
  }

  getSpacing() {
    return (this.type * this.excelFileConstant) / this.nInchesInFoot;
  }
}

export class HorizontalRebar extends Rebar {
  private nRows;

  constructor(type: number, wallHeight: number, wallLength: number, nRows: number) {
    super(type, wallHeight, wallLength);
    this.nRows = nRows;
  }

  computeHorizontalRebars() {
    return {
      type: this.type.toString(),
      quantity: Math.ceil(
        (this.wallLength * this.nRows * (1 + (this.getSpacing() * 2) / this.barLength)) /
          this.barLength /
          this.nInchesInFoot
      ),
    };
  }
}

export class VerticalRebar extends Rebar {
  private verticalSpacing;

  constructor(type: number, wallHeight: number, wallLength: number, verticalSpacing: number) {
    super(type, wallHeight, wallLength);
    this.verticalSpacing = verticalSpacing;
  }

  computeVerticalRebars() {
    return {
      type: this.type.toString(),
      quantity: Math.ceil(
        ((this.getSpacing() + this.wallHeight / this.nInchesInFoot) * this.wallLength) /
          (this.verticalSpacing / this.nInchesInFoot) /
          this.barLength /
          this.nInchesInFoot
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
    depthInFooting: number
  ) {
    super(type, wallHeight, wallLength);
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

  computeColdJointPins() {
    return {
      type: this.type.toString(),
      quantity: Math.ceil(
        (this.getNBarColumns() * this.getHeight()) / (this.barLength * this.nInchesInFoot)
      ),
    };
  }
}

const hey = new ColdJointPin(0.625, 240, 24000, 12, 36, 7);

console.log(hey.computeColdJointPins());
