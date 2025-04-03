class Opening {
  private OPENING_LOSS_FACTOR = 0.8;

  readonly perimeter: number;
  readonly surfaceArea: number;

  constructor(readonly width: number, readonly height: number, readonly quantity: number) {
    this.surfaceArea = this.getSurfaceArea();
    this.perimeter = this.getPerimeter();
  }

  private getSurfaceArea() {
    return this.width * this.height * this.quantity * this.OPENING_LOSS_FACTOR;
  }

  private getPerimeter() {
    return (this.width + this.height) * 2 * this.quantity;
  }
}

export default Opening;
