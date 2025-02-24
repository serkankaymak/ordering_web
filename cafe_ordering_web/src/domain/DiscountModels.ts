import ArrayListStream from "@/shared/ArrayListStream";
import { ProductModel } from "./ProductModels";
import { th } from "date-fns/locale";

export enum DiscountType {
  ProductBasedDiscount = 1,
  SpecialDayDiscount = 2,
  CategoryBasedDiscount = 3,
  ThresholdDiscount = 4,
  BirthdayDiscount = 5,
  MilestoneDiscount = 6
  // Diğer indirim türleri eklenebilir...
}

export class DiscountItemModel {
  id: number = 0;
  discountId: number = 0;
  discount?: DiscountModel;
  productId: number = 0;
  product?: ProductModel | null = null;
  requiredQuantity: number = 1;
  productsPrice: number = 0;
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


  getProductsPrice() {
    if (this.productsPrice != 0) return this.productsPrice;
    if (this.product != null) {
      return this.product.price * this.requiredQuantity;
    }
  }



  static fromJson(json: Partial<DiscountItemModel>): DiscountItemModel {
    console.log(json);
    try {
      var d = new DiscountItemModel({
        id: json.id ?? 0,
        discountId: json.discountId ?? 0,
        productId: json.productId ?? 0,
        requiredQuantity: json.requiredQuantity ?? 1,
        discountPercentage: json.discountPercentage ?? null,
        product: json.product ? ProductModel.fromJson(json.product) : null,
        productsPrice: json.productsPrice ?? 0,
        lastProductDiscountPercentage: json.discountPercentage ?? null
      });
      return d;
    }
    catch (e: any) {
      console.log(e);
      return new DiscountItemModel();
    }

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
  discountPercentage?: number = 0;
  discountType: DiscountType = DiscountType.ProductBasedDiscount;
  maxApplicableTimes: number = 1;
  discountItems: DiscountItemModel[] = [];
  StartDateUtc?:string|null;
  endDateUtc?: string | null = null;
  categoryId: number = 0;


  getEndDateLocale() { if (this.endDateUtc == null) return null; return new Date(this.endDateUtc!); }
  getStartDateLocale() { if (this.StartDateUtc == null) return null; return new Date(this.StartDateUtc!); }

  getProductsPrice() {
    if (this.discountType != DiscountType.ProductBasedDiscount) throw Error(" sadece ürün bazlı için ");
    if (this.discountItems.length == 0) return 0;
    return ArrayListStream.fromList(this.discountItems).sum(x => x?.getProductsPrice()!)
  }

  getDiscountedProductsPrice() {
    const price = this.getProductsPrice();
    const discount = price * (this.discountPercentage! / 100)!
    return price - discount;
  }


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
    var discount = new DiscountModel({
      id: json.id ?? 0,
      name: json.name ?? "",
      discountType: json.discountType!, // DiscountType mutlaka gelmelidir, aksi halde uygun bir varsayılan kullanılabilir.
      discountPercentage: json.discountPercentage,
      maxApplicableTimes: json.maxApplicableTimes ?? 1,
      discountItems: json.discountItems
        ? json.discountItems.map(item => DiscountItemModel.fromJson(item))
        : [],
      endDateUtc: json.endDateUtc ? (json.endDateUtc) : null,
      categoryId: json.categoryId ?? 0,
    });
    return discount;
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
      discountType: DiscountType.SpecialDayDiscount,
      discountPercentage: 25,
      maxApplicableTimes: 1,
      discountItems: [],
    });
  }

  static getExamples(): DiscountModel[] {
    return [this.getProductBasedExample(), this.getSpecialBasedExample()];
  }
}
