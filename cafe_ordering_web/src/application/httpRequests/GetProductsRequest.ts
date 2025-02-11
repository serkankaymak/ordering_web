// GetProductsRequest.ts
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import UrlManager from "./HostUrl";
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
        const products = response.data.map((product) => {
          if (product.imagePath) {
            // imageUrl'in başındaki eğik çizgileri temizleyip base URL ile birleştiriyoruz.
            product.imagePath = `${UrlManager.Host()}/${product.imagePath.replace(/^\/+/, "")}`;
          }
          return product;
        });
        return products;
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
  public static async send(): Promise<ProductModel[]> {
    const url = UrlManager.GetProductsUrl(); // UrlManager'dan ürünleri getiren endpoint'i alınır
    const request = new GetProductsRequest(url);
    return await request.execute();
  }
}
