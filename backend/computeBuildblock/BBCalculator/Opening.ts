class Opening {
  constructor(private width: number, private height: number, private quantity: number) {}

  getSurfaceArea() {
    return this.width * this.height * this.quantity * 0.8;
  }

  getPerimeter() {
    return (this.width + this.height) * 2 * this.quantity;
  }

  getWidth(): number {
    return this.width;
  }

  setWidth(value: number): void {
    this.width = value;
  }

  getHeight(): number {
    return this.height;
  }

  setHeight(value: number): void {
    this.height = value;
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(value: number): void {
    this.quantity = value;
  }
}

export default Opening;
