// GetProductsRequest.ts
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "./HostUrl";
import { ProductModel } from "@/domain/ProductModels";


export class GetProductsRequest extends ABaseHttpRequest<ProductModel[]> {
  constructor(url: string) {
    super(url);
  }

  /**
   * API'ye GET isteği gönderir ve ürün listesini döndürür.
   * @returns Ürün listesini içeren ProductModel[]; hata durumunda boş dizi döner.
   */
  public async execute(): Promise<ProductModel[]> {
    try {
      const response = await this.client.get<ProductModel[]>(this.url, {
        headers: { "Accept": "application/json" },
        validateStatus: (status) => status < 500, // 500'den küçük tüm durum kodlarını başarılı sayar
      });

      if (this.isSuccessStatusCode(response.status)) {
        const products = response.data.map((productJson) => {
          const product = ProductModel.fromJson(productJson);
          if (product.imagePath) {
            // imageUrl'in başındaki eğik çizgileri temizleyip base URL ile birleştiriyoruz.
            //product.imagePath = `${ApiUrls.Host()}/${product.imagePath.replace(/^\/+/, "")}`;
          }
          return product;
        });
        return products.map(p => ProductModel.fromJson(p));
      }
      console.error(`Request failed with status: ${response.status}`);
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  /**
   * Statik metod; GetProductsRequest instance'ını oluşturur ve isteği yürütür.
   * @returns Ürün listesini içeren Promise<ProductModel[]>.
   */
  public static async sendAsync(): Promise<ProductModel[]> {
    const url = ApiUrls.GetProductsUrl(); // UrlManager'dan ürünleri getiren endpoint'i alınır
    const request = new GetProductsRequest(url);
    return await request.execute();
  }
}
