import { ProductModel } from "./ProductModels";

export enum DiscountType {
  ProductBasedDiscount = 1,
  DynamicDiscount = 2,
  CategoryBasedDiscount = 3
  // Diğer indirim türleri eklenebilir...
}

export class DiscountItemModel {
  id: number = 0;
  discountId: number = 0;
  discount?: DiscountModel;
  productId: number = 0;
  product?: ProductModel | null = null;
  requiredQuantity: number = 1;
  productsPrice: number = 1;
  // Ürün bazlı özel indirim oranı. Eğer tanımlı değilse Discount içindeki oran kullanılabilir.
  discountPercentage?: number | null;
  lastProductDiscountPercentage?: number | null;

  constructor(init?: Partial<DiscountItemModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }
  copy(updatedFields: Partial<DiscountItemModel>): DiscountItemModel {
    return new DiscountItemModel({ ...this, ...updatedFields });
  }

  static fromJson(json: Partial<DiscountItemModel>): DiscountItemModel {
    return new DiscountItemModel({
      id: json.id ?? 0,
      discountId: json.discountId ?? 0,
      productId: json.productId ?? 0,
      requiredQuantity: json.requiredQuantity ?? 1,
      discountPercentage: json.discountPercentage ?? null,
      product: json.product ? ProductModel.fromJson(json.product) : null,
      productsPrice: json.productsPrice ?? 0,
      lastProductDiscountPercentage: json.discountPercentage ?? null
    });
  }

  static getExample(id?: number): DiscountItemModel {
    const itemId = id ?? 1;
    return new DiscountItemModel({
      id: itemId,
      discountId: 2,
      productId: 1,
      requiredQuantity: 3,
      discountPercentage: 10,
      product: ProductModel.getExample(1)
    });
  }

  static getExampleWithProductBox(id?: number): DiscountItemModel {
    const itemId = id ?? 1;
    return new DiscountItemModel({
      id: itemId,
      discountId: 2,
      productId: 2,
      requiredQuantity: 3,
      discountPercentage: 10,
      product: ProductModel.getBoxProductExample(2)
    });
  }

  static getExamples(): DiscountItemModel[] {
    return [this.getExample(), this.getExampleWithProductBox()];
  }
}

export class DiscountModel {
  id: number = 0;
  name: string = "";
  discountPercentage?: number;
  discountType: DiscountType = DiscountType.ProductBasedDiscount;
  maxApplicableTimes: number = 1;
  discountItems: DiscountItemModel[] = [];
  endDate?: Date | null = null;
  categoryId: number = 0;

  constructor(init?: Partial<DiscountModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  static getEmptyInstance(): DiscountModel {
    return new DiscountModel({
      id: 0,
      name: "",
      discountType: DiscountType.ProductBasedDiscount,
      maxApplicableTimes: 1,
    });
  }

  static fromJson(json: Partial<DiscountModel>): DiscountModel {
    return new DiscountModel({
      id: json.id ?? 0,
      name: json.name ?? "",
      discountType: json.discountType!, // DiscountType mutlaka gelmelidir, aksi halde uygun bir varsayılan kullanılabilir.
      discountPercentage: json.discountPercentage,
      maxApplicableTimes: json.maxApplicableTimes ?? 1,
      discountItems: json.discountItems
        ? json.discountItems.map(item => DiscountItemModel.fromJson(item))
        : [],
      endDate: json.endDate ?? null,
      categoryId: json.categoryId ?? 0,
    });
  }

  copy(updatedFields: Partial<DiscountModel>): DiscountModel {
    return new DiscountModel({ ...this, ...updatedFields });
  }

  static getProductBasedExample(): DiscountModel {
    const discountItems: DiscountItemModel[] = [
      new DiscountItemModel({
        id: 1,
        discountId: 1,
        productId: 1,
        requiredQuantity: 1,
        discountPercentage: 10,
        product: ProductModel.getExample(1)
      }),
      new DiscountItemModel({
        id: 2,
        discountId: 2,
        productId: 2,
        requiredQuantity: 1,
        discountPercentage: 15,
        product: ProductModel.getBoxProductExample(2)
      }),
    ];
    return new DiscountModel({
      id: 0,
      name: "ProductBasedDiscount",
      discountType: DiscountType.ProductBasedDiscount,
      discountPercentage: 20,
      maxApplicableTimes: 1,
      discountItems: discountItems,
    });
  }

  static getSpecialBasedExample(): DiscountModel {
    return new DiscountModel({
      id: 2,
      name: "Special Based Discount",
      discountType: DiscountType.DynamicDiscount,
      discountPercentage: 25,
      maxApplicableTimes: 1,
      discountItems: [],
    });
  }

  static getExamples(): DiscountModel[] {
    return [this.getProductBasedExample(), this.getSpecialBasedExample()];
  }
}
