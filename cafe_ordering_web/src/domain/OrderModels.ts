import { ProductModel } from "./ProductModels";

export class OrderItemModel {
  productId: number = 0;
  product: ProductModel | null = null;
  quantity: number = 0;

  constructor(init?: Partial<OrderItemModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  static fromJson(json: Partial<OrderItemModel>): OrderItemModel {
    return new OrderItemModel({
      productId: json.productId ?? 0,
      quantity: json.quantity ?? 0,
      product: json.product ? ProductModel.fromJson(json.product) : null,
    });
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
    return new OrderItemModel({
      productId: 0,
      quantity: 1,
      product: ProductModel.getExample(1),
    });
  }
}
