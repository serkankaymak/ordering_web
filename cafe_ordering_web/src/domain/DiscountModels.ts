import { ProductModel } from "./ProductModels";

export enum DiscountType {
    ProductBasedDiscount = 1,
    DynamicDiscount = 2,
    CategoryBasedDiscount = 3
    // Diğer indirim türleri eklenebilir...
}

export class DiscountItemModel {
    id: number;
    discountId: number;
    discount?: DiscountModel;
    productId: number;
    product?: ProductModel | null;
    requiredQuantity: number = 1;
    // Ürün bazlı özel indirim oranı. Eğer tanımlı değilse Discount içindeki oran kullanılabilir.
    discountPercentage?: number | null;
    lastProductDiscountPercentage?: number | null;
    constructor(
        id: number,
        discountId: number,
        productId: number,
        requiredQuantity: number,
        discountPercentage?: number | null,
        product?: ProductModel | null,

    ) {
        this.id = id;
        this.discountId = discountId;
        this.productId = productId;
        this.requiredQuantity = requiredQuantity;
        this.discountPercentage = discountPercentage;
        this.product = product;
    }
    static fromJson(json: Partial<DiscountItemModel>): DiscountItemModel {
        var discount = new DiscountItemModel(
            json.id ?? 0,
            json.discountId ?? 0,
            json.productId ?? 0,
            json.requiredQuantity ?? 1,
            json.discountPercentage ?? null,
            json.product ? ProductModel.fromJson(json.product) : null
        );
        discount.lastProductDiscountPercentage = json.discountPercentage ?? null;
        return discount;
    }

    public static getExample(id?: number): DiscountItemModel {
        const itemId = id ?? 1;
        var _discountItem = new DiscountItemModel(itemId, 2, 1, 3, 10, null);
        _discountItem.product = ProductModel.getExample(_discountItem.productId);
        return _discountItem;
    }

    public static getExampleWithProductBox(id?: number): DiscountItemModel {
        const itemId = id ?? 1;
        var _discountItem = new DiscountItemModel(itemId, 2, 2, 3, 10, null);
        _discountItem.product = ProductModel.getBoxProductExample(_discountItem.productId);
        return _discountItem;
    }

    public static getExamples(): DiscountItemModel[] {
        return [
            DiscountItemModel.getExample(),
            DiscountItemModel.getExampleWithProductBox(),
        ];
    }
}


export class DiscountModel {
    static fromJson(json: Partial<DiscountModel>): DiscountModel {
        const model = new DiscountModel(
            json.id ?? 0,
            json.name ?? "",
            json.discountType!, // discountType mutlaka gelmelidir, aksi halde uygun bir varsayılan değeri kullanabilirsiniz
            json.discountPercentage,
            json.maxApplicableTimes ?? 1,
            json.discountItems
                ? json.discountItems.map(item => DiscountItemModel.fromJson(item))
                : []
        );
        return model;
    }
    id: number;
    name: string;
    // Eğer tüm ürünler için tek oran kullanılacaksa bu alan tanımlanır.
    discountPercentage?: number;
    discountType: DiscountType;
    maxApplicableTimes: number = 1; // Genellikle özel indirimler sadece 1 kez uygulanır.
    discountItems: DiscountItemModel[] = [];

    constructor(
        id: number,
        name: string,
        discountType: DiscountType,
        discountPercentage?: number,
        maxApplicableTimes: number = 1,
        discountItems: DiscountItemModel[] = []
    ) {
        this.id = id;
        this.name = name;
        this.discountType = discountType;
        this.discountPercentage = discountPercentage;
        this.maxApplicableTimes = maxApplicableTimes;
        this.discountItems = discountItems;
    }


    public static getProductBasedExample(): DiscountModel {

        const discountItems: DiscountItemModel[] = [
            new DiscountItemModel(1, 1, 1, 1, 10, ProductModel.getExample(1)), // Örneğin: 3 adet ürün alana özel %10 indirim
            new DiscountItemModel(2, 2, 2, 1, 15, ProductModel.getBoxProductExample(2))  // Örneğin: 2 adet ürün alana özel %15 indirim
        ];

        var _discount = new DiscountModel(0, "ProductBasedDiscount", DiscountType.ProductBasedDiscount, 20, 1, discountItems);
        return _discount;
    }

    public static getSpecialBasedExample(): DiscountModel {
        // Örnek: Dinamik indirim türü (DynamicDiscount) kullanılarak siparişin toplam tutarı üzerinden %25 indirim uygulanır.
        const _discount = new DiscountModel(
            2, // id
            "Special Based Discount", // isim
            DiscountType.DynamicDiscount, // indirim türü
            25, // %25 indirim oranı (C#'daki 25m yerine TS'de 25 olarak kullanılır)
            1,  // maxApplicableTimes (genellikle özel indirimler 1 kez uygulanır)
            []  // Dinamik indirimlerde ürün bazlı koşul gerekmediği için boş liste
        );
        return _discount;
    }

    public static getExamples(): DiscountModel[] {
        return [this.getProductBasedExample(), this.getSpecialBasedExample()]
    }
}