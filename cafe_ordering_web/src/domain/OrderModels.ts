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

  copy(updatedFields: Partial<OrderItemModel>): OrderItemModel {
    return new OrderItemModel({ ...this, ...updatedFields });
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



export class OrderModel {
  orderItems: OrderItemModel[] = [];
  userId?: number;
  tableId?: number = 0;
  price: number = 0;
  indirimsizToplamFiyat: number = 0;
  indirimliToplamFiyat: number = 0;

  constructor(init?: Partial<OrderModel>) {
    Object.assign(this, init);
  }


  static fromJson(json: any): OrderModel {
    try {
      var order = new OrderModel({
        ...json,
        orderItems: Array.isArray(json.orderItems)
          ? json.orderItems.map((item: any) => new OrderItemModel(item))
          : [],
      });
      return order;
    }
    catch (e: any) {
      console.log("error parsing...", e)
      return OrderModel.getEmptyIntance();
    }

  }
  static getEmptyIntance(): OrderModel {
    return new OrderModel();
  }
}
