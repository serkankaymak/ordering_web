import ApiUrls from "@/application/httpRequests/HostUrl";
import ArrayListStream from "@/shared/ArrayListStream";
// Diğer import'lar kaldırıldı, hepsi tek dosyada tanımlanıyor.

export class ProductCommentModel {
  id: number = 0;
  comment: string = "";
  userId: number = 0;
  productId: number = 0;
  product: ProductModel | null = null;

  constructor(init?: Partial<ProductCommentModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  static fromJson(json: Partial<ProductCommentModel>): ProductCommentModel {
    return new ProductCommentModel({
      id: json.id ?? 0,
      comment: json.comment ?? "",
      userId: json.userId ?? 0,
      productId: json.productId ?? 0,
      product: json.product ? ProductModel.fromJson(json.product) : null,
    });
  }

  static getExample(index: number = 1): ProductCommentModel {
    return new ProductCommentModel({
      id: index,
      comment: `Sample comment ${index}`,
      userId: index,
      productId: index,
    });
  }

  static getExampleList(count: number): ProductCommentModel[] {
    const examples: ProductCommentModel[] = [];
    for (let i = 1; i <= count; i++) {
      examples.push(ProductCommentModel.getExample(i));
    }
    return examples;
  }
}

export class CurrencyModel {
  type: string = "";
  symbol: string = "";
  constructor(init?: Partial<CurrencyModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }
  static fromJson(json: Partial<CurrencyModel>): CurrencyModel {
    return new CurrencyModel({
      type: json.type ?? "",
      symbol: json.symbol ?? "",
    });
  }
}

export class ProductModel {
  id: number = 0;
  name: string = "";
  description: string = "";
  quantity: number = 1;
  currency!: CurrencyModel;
  price: number = 0;
  imagePath: string | null = null;
  categories: CategoryModel[] = [];
  productComments: ProductCommentModel[] = [];

  // Box özellikleri
  parentBoxId?: number | null = null;
  parent?: ProductModel | null = null;
  products?: ProductModel[] | null = null;
  productsPrice?: number | null = null;

  constructor(init?: Partial<ProductModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  private _getCleanedImagePath(): string {
    return this.imagePath ? this.imagePath.replace(/^\/+/, "") : "";
  }

  getImagePathWithHost(): string | null {
    if (!this.imagePath) return null;
    return this.imagePath.includes(ApiUrls.Host())
      ? this.imagePath
      : `${ApiUrls.Host()}/${this.imagePath}`;
  }

  getImagePathWithoutHost(): string | null {
    if (!this.imagePath) return null;
    const cleaned = this._getCleanedImagePath();
    return cleaned.includes(ApiUrls.Host())
      ? cleaned.replace(`${ApiUrls.Host()}/`, "")
      : cleaned;
  }

  getImagePathForShow(): string {
    return this.imagePath ? this.getImagePathWithHost()! : `/images/image_not_found.png`;
  }

  copy(updatedFields: Partial<ProductModel>): ProductModel {
    return new ProductModel({
      ...this,
      ...updatedFields,
      categories: updatedFields.categories ? [...updatedFields.categories] : [...this.categories],
      products: updatedFields.products ? [...updatedFields.products] : (this.products ? [...this.products] : null),
      productComments: updatedFields.productComments ? [...updatedFields.productComments] : [...this.productComments],
    });
  }

  static fromJson(json: Partial<ProductModel>): ProductModel {
    const p = new ProductModel({
      id: json.id ?? 0,
      name: json.name ?? "",
      description: json.description ?? "",
      price: json.price ?? 0,
      imagePath: json.imagePath ?? null,
      quantity: json.quantity ?? 1,
      parentBoxId: json.parentBoxId ?? null,
      categories: json.categories ?? [],
      productComments: json.productComments?.map(c => ProductCommentModel.fromJson(c)) ?? [],
      products: json.products?.map(p => ProductModel.fromJson(p)) ?? null,
      productsPrice: json.productsPrice ?? null,
      currency: json!.currency ?? new CurrencyModel(),
    });
    return p;
  }

  static getEmptyProductInstance(): ProductModel {
    return new ProductModel({
      id: 0,
      name: "",
      description: "",
      price: 10,
      imagePath: null,
    });
  }

  static getEmptyBoxInstance(): ProductModel {
    var p = this.getEmptyProductInstance();
    p.products = [];
    return p;
  }


  static getExample(index: number = 1): ProductModel {
    const product = new ProductModel({
      id: index,
      name: "Example Product",
      description: "This is an example product description.",
      price: 19.99,
      imagePath: null,
    });
    product.categories.push(...CategoryModel.getExamples());
    return product;
  }

  static getBoxProductExample(index: number = 1): ProductModel {
    const product = new ProductModel({
      id: index,
      name: "Example Box Product",
      description: "This is a box example product description.",
      price: 25.00,
      imagePath: null,
    });
    const child1 = ProductModel.getExample(1);
    child1.parentBoxId = product.id;
    const child2 = ProductModel.getExample(2);
    child2.parentBoxId = product.id;
    product.products = [child1, child2];
    child1.parent = product;
    child2.parent = product;
    product.categories.push(...CategoryModel.getExamples());
    return product;
  }

  static getExamples(): ProductModel[] {
    const examples = ArrayListStream.fromEmpty<ProductModel>();
    examples.add(ProductModel.getBoxProductExample(0));
    examples.addAll(Array.from({ length: 6 }, (_, i) => ProductModel.getExample(i + 1)));
    examples.add(ProductModel.getBoxProductExample(7));

    const productWithNoImage = ProductModel.getBoxProductExample(8);
    productWithNoImage.imagePath = null;
    const child1 = ProductModel.getExample(3);
    child1.parentBoxId = productWithNoImage.id;
    const child2 = ProductModel.getExample(4);
    child2.parentBoxId = productWithNoImage.id;
    productWithNoImage.products = [child1, child2];
    child1.parent = productWithNoImage;
    child2.parent = productWithNoImage;
    examples.add(productWithNoImage);

    return examples.toList();
  }
}

export class CategoryModel {
  id: number = 0;
  name: string = "";
  parentId: number | null = null;

  constructor(init?: Partial<CategoryModel>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  static fromJson(json: Partial<CategoryModel>): CategoryModel {
    return new CategoryModel({
      id: json.id ?? 0,
      name: json.name ?? "",
      parentId: json.parentId ?? null,
    });
  }

  static getExample(index: number = 1): CategoryModel {
    return new CategoryModel({
      id: index,
      name: "Example Category",
    });
  }

  static getExamples(): CategoryModel[] {
    return [
      new CategoryModel({ id: 1, name: "Food", parentId: null }),
      new CategoryModel({ id: 2, name: "Drinks", parentId: null }),
      new CategoryModel({ id: 3, name: "Fruits", parentId: 1 }),
      new CategoryModel({ id: 4, name: "Vegetables", parentId: 1 }),
      new CategoryModel({ id: 5, name: "Soda", parentId: 2 }),
      new CategoryModel({ id: 6, name: "Juice", parentId: 2 }),
      new CategoryModel({ id: 8, name: "Citrus", parentId: null }),
      new CategoryModel({ id: 9, name: "Cakes", parentId: null }),
      new CategoryModel({ id: 10, name: "Pastas", parentId: null }),
    ];
  }
}
