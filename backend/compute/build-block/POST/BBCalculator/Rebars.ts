class Rebar {
  readonly type;
  readonly wallHeight;
  readonly wallLength;
  readonly barLength = 20;

  readonly excelFileConstant = 40;
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
