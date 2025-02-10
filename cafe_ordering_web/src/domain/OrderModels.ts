import { ProductModel } from "./ProductModels";

export class OrderItemModel {

  public productId: number;
  public product: ProductModel | null = null;
  public quantity: number;

  constructor(productId: number, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }

  public increase(): void {
    this.quantity += 1;
  }

  public decrease(): void {
    if (this.quantity > 0) {
      this.quantity -= 1;
    }
  }

  static getExample(): OrderItemModel {
    const item = new OrderItemModel(0, 1);
    item.product = ProductModel.getExample(1);
    return item;
  }
}
