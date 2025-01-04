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

  getHeight(): number {
    return this.height;
  }

  getQuantity(): number {
    return this.quantity;
  }
}

export default Opening;
