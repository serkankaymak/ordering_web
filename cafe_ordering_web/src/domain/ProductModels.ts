import ApiUrls from "@/application/httpRequests/HostUrl";
import ArrayListStream from "@/shared/ArrayListStream";
import { randomInt } from "crypto";


export class ProductCommentModel {
  public id: number;
  public comment: string;
  public userId: number;
  public productId: number;
  public product: ProductModel | null = null;

  constructor(
    id: number,
    comment: string,
    userId: number,
    productId: number,
  ) {
    this.id = id;
    this.comment = comment;
    this.userId = userId;
    this.productId = productId;
  }

  static fromJson(json: Partial<ProductCommentModel>): ProductCommentModel {
    const model = new ProductCommentModel(
      json.id ?? 0,
      json.comment ?? "",
      json.userId ?? 0,
      json.productId ?? 0
    );

    // İç içe (nested) bir product varsa, onu da ProductModel.fromJson() ile dönüştürüyoruz
    if (json.product) {
      model.product = ProductModel.fromJson(json.product);
    }
    return model;
  }






  static getExample(index: number = 1): ProductCommentModel {
    return new ProductCommentModel(
      index,
      `Sample comment ${index}`,
      index,
      index
    );
  }
  // Static method to generate a list of example instances
  static getExampleList(count: number): ProductCommentModel[] {
    const examples: ProductCommentModel[] = [];
    for (let i = 1; i <= count; i++) {
      examples.push(this.getExample(i));
    }
    return examples;
  }

}


export class ProductModel {
  parentBoxId: number | null;
  parent?: ProductModel | null;
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath: string | null;
  categories: CategoryModel[];
  products: ProductModel[] | null;
  productComments: ProductCommentModel[];

  constructor(
    id: number,
    productTitle: string,
    description: string,
    price: number,
    imageUrl: string | null,
  ) {
    this.parentBoxId = null;
    this.id = id;
    this.name = productTitle;
    this.description = description;
    this.price = price;
    this.imagePath = imageUrl;
    this.products = null;
    this.categories = [];
    this.productComments = [];
  }


  private _getCleanedImagePath(): string { return this.imagePath!.replace(/^\/+/, ""); }
  getImagePathWithHost(): string | null {
    if (this.imagePath == null) return null;
    if (!this.imagePath.includes(ApiUrls.Host())) {
      const path =  ApiUrls.Host() + "/" + this.imagePath;
      return path;
    }
    return this.imagePath;
  }

  getImagePathWithoutHost(): string | null {
    if (this.imagePath == null) return null;
    this.imagePath = this._getCleanedImagePath();
    if (this.imagePath.includes(ApiUrls.Host())) {
      return this.imagePath.replace(ApiUrls.Host() + "/", "");
    }
    return this.imagePath;
  }
  getImagePathForShow(): string { return (this.imagePath != null) ? this.getImagePathWithHost()! : `/images/image_not_found.png` }

  // ✅ Yeni copy metodu
  copy(updatedFields: Partial<ProductModel>): ProductModel {
    let copied =  Object.assign(new ProductModel(
      this.id,
      this.name,
      this.description,
      this.price,
      this.imagePath
    ), {
      ...this, // Eski nesneyi kopyala
      ...updatedFields, // Güncellenen alanları ekle
      categories: updatedFields.categories ? [...updatedFields.categories] : [...this.categories],
      products: updatedFields.products ? [...updatedFields.products] : this.products ? [...this.products] : null,
      productComments: updatedFields.productComments ? [...updatedFields.productComments] : [...this.productComments]
    });
    //console.log("copied",copied);
    return copied;
  }



  static fromJson(json: Partial<ProductModel>): ProductModel {
    const model = new ProductModel(
      json.id ?? 0,
      json.name ?? "",
      json.description ?? "",
      json.price ?? 0,
      json.imagePath ?? null
    );

    model.parentBoxId = json.parentBoxId ?? null;
    model.categories = json.categories ?? [];
    model.productComments =
      json.productComments?.map((c) => ProductCommentModel.fromJson(c)) ?? [];
    model.products = json.products?.map((p) => ProductModel.fromJson(p)) ?? null;

    return model;
  }


  static getEmptyInstance(): ProductModel {
    return new ProductModel(0, '', '', 10, null);
  }




  // Statik metod: Örnek bir MenuItem nesnesi döner
  static getExample(index?: number): ProductModel {
    var product = new ProductModel(
      index ?? 1,
      "Example Product",
      "This is an example product description.",
      19.99,
      `/images/menu-item-${index ?? 1}.jpg` // Şablon string ile index kullanımı
    );
    CategoryModel.getExamples().forEach(c => product.categories.push(c));
    return product;
  }


  static getBoxProductExample(index?: number): ProductModel {
    var product = new ProductModel(
      index ?? 1,
      "Example Box Product",
      "This is an  box example product description.",
      25.00,
      `/images/antique-cafe-bg-04.jpg` // Şablon string ile index kullanımı
    );
    const child1 = this.getExample(1); child1.parentBoxId = product.id;
    const child2 = this.getExample(2); child2.parentBoxId = product.id;
    product.products = [child1, child2]
    child1.parent = product;
    child2.parent = product;
    CategoryModel.getExamples().forEach(c => product.categories.push(c));
    return product;
  }


  static getExamples = () => {
    const examples = ArrayListStream.fromEmpty<ProductModel>();
    examples.add(ProductModel.getBoxProductExample(0));
    examples.addAll(Array.from({ length: 6 }, (_, i) => ProductModel.getExample(i + 1)));
    examples.add(ProductModel.getBoxProductExample(7));


    var productWithNoImage = ProductModel.getBoxProductExample(8);
    productWithNoImage.imagePath = null;
    const child1 = this.getExample(3); child1.parentBoxId = productWithNoImage.id;
    const child2 = this.getExample(4); child2.parentBoxId = productWithNoImage.id;
    productWithNoImage.products = [child1, child2];
    child1.parent = productWithNoImage;
    child2.parent = productWithNoImage;
    examples.add(productWithNoImage);

    return examples.toList();
  };

}

export class CategoryModel {
  id: number;
  name: string;
  parentId: number | null; // Alt kategori değilse null olabilir.

  constructor(id: number, name: string, parentId: number | null = null) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
  }

  static fromJson(json: Partial<CategoryModel>): CategoryModel {
    const model = new CategoryModel(
      json.id ?? 0,
      json.name ?? "",
      json.parentId ?? null
    );
    return model;
  }
  // Alt kategori mi kontrolü
  isSubCategory(): boolean {
    return this.parentId !== null;
  }
  // Statik bir örnek oluşturma metodu
  static getExample(index?: number): CategoryModel {
    return new CategoryModel(index ?? 1, "Example Category");
  }
  static getExamples(): CategoryModel[] {
    return [
      new CategoryModel(1, "Food", null),
      new CategoryModel(2, "Drinks", null),
      new CategoryModel(3, "Fruits", 1),
      new CategoryModel(4, "Vegetables", 1),
      new CategoryModel(5, "Soda", 2),
      new CategoryModel(6, "Juice", 2),
      new CategoryModel(8, "Citrus", null),
      new CategoryModel(9, "Cakes", null),
      new CategoryModel(10, "Pastas", null),
    ];
  }

}
