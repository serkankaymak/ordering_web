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
  id: number = 0;
  orderItems: OrderItemModel[] = [];
  userId?: number;
  tableId?: number = 0;
  price: number = 0;
  discountedPrice: number = 0;

  isReady: boolean = false;
  isDelivered: boolean = false;
  isPayed: boolean = false;
  orderNumber: string="";


  constructor(init?: Partial<OrderModel>) {
    Object.assign(this, init);
  }
  copy(updatedFields: Partial<OrderModel>): OrderModel {
    return new OrderModel({ ...this, ...updatedFields });
  }


  static fromJson(json: any): OrderModel {
    try {
      var order = new OrderModel({
        ...json,
        orderItems: Array.isArray(json.orderItems)
          ? json.orderItems.map((item: any) => OrderItemModel.fromJson(item))
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
