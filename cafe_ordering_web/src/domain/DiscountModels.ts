import { ProductModel } from "./ProductModels";

export enum DiscountType {
    ProductBasedDiscount = "ProductBasedDiscount",
    DynamicDiscount = "DynamicDiscount",
    // Diğer indirim türleri eklenebilir...
}

export class DiscountItem {
    id: number;
    discountId: number;
    productId: number;
    product?: ProductModel | null;
    requiredQuantity: number = 1;
    // Ürün bazlı özel indirim oranı. Eğer tanımlı değilse Discount içindeki oran kullanılabilir.
    discountPercentage?: number;

    constructor(
        id: number,
        discountId: number,
        productId: number,
        requiredQuantity: number,
        discountPercentage: number,
        product?: ProductModel | null,

    ) {
        this.id = id;
        this.discountId = discountId;
        this.productId = productId;
        this.requiredQuantity = requiredQuantity;
        this.discountPercentage = discountPercentage;
        this.product = product;
    }


    public static getExample(id?: number): DiscountItem {
        const itemId = id ?? 1;
        var _discountItem = new DiscountItem(itemId, 2, 1, 3, 10, null);
        _discountItem.product = ProductModel.getExample(_discountItem.productId);
        return _discountItem;
    }

    public static getExampleWithProductBox(id?: number): DiscountItem {
        const itemId = id ?? 1;
        var _discountItem = new DiscountItem(itemId, 2, 2, 3, 10, null);
        _discountItem.product = ProductModel.getBoxProductExample(_discountItem.productId);
        return _discountItem;
    }

    public static getExamples(): DiscountItem[] {
        return [
            DiscountItem.getExample(),
            DiscountItem.getExampleWithProductBox(),
        ];
    }
}


export class Discount {
    id: number;
    name: string;
    // Eğer tüm ürünler için tek oran kullanılacaksa bu alan tanımlanır.
    discountPercentage?: number;
    discountType: DiscountType;
    maxApplicableTimes: number = 1; // Genellikle özel indirimler sadece 1 kez uygulanır.
    discountItems: DiscountItem[] = [];

    constructor(
        id: number,
        name: string,
        discountType: DiscountType,
        discountPercentage?: number,
        maxApplicableTimes: number = 1,
        discountItems: DiscountItem[] = []
    ) {
        this.id = id;
        this.name = name;
        this.discountType = discountType;
        this.discountPercentage = discountPercentage;
        this.maxApplicableTimes = maxApplicableTimes;
        this.discountItems = discountItems;
    }


    public static getProductBasedExample(): Discount {

        const discountItems: DiscountItem[] = [
            new DiscountItem(1, 1, 1, 1, 10, ProductModel.getExample(1)), // Örneğin: 3 adet ürün alana özel %10 indirim
            new DiscountItem(2, 2, 2, 1, 15, ProductModel.getBoxProductExample(2))  // Örneğin: 2 adet ürün alana özel %15 indirim
        ];

        var _discount = new Discount(0, "ProductBasedDiscount", DiscountType.ProductBasedDiscount, 20, 1, discountItems);
        return _discount;
    }

    public static getSpecialBasedExample(): Discount {
        // Örnek: Dinamik indirim türü (DynamicDiscount) kullanılarak siparişin toplam tutarı üzerinden %25 indirim uygulanır.
        const _discount = new Discount(
            2, // id
            "Special Based Discount", // isim
            DiscountType.DynamicDiscount, // indirim türü
            25, // %25 indirim oranı (C#'daki 25m yerine TS'de 25 olarak kullanılır)
            1,  // maxApplicableTimes (genellikle özel indirimler 1 kez uygulanır)
            []  // Dinamik indirimlerde ürün bazlı koşul gerekmediği için boş liste
        );
        return _discount;
    }

    public static getExamples(): Discount[] 
    {
        return [this.getProductBasedExample(),this.getSpecialBasedExample()]
    }
}