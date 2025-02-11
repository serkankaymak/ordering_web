import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "./HostUrl";

export class DeleteProductRequest extends ABaseHttpRequest<boolean> {
  /**
   * Ürün silme isteğinde URL'e ürün ID'si eklenir.
   * Örneğin: "https://localhost:7106/api/Product/deleteproduct/3"
   */
  constructor(url: string) {
    super(url);
  }

  /**
   * DELETE isteğini gönderir.
   */
  public async execute(): Promise<boolean> {
    try {
      const response = await this.client.delete<void>(this.url, {
        headers: { Accept: "*/*" },
        validateStatus: (status) => status < 500, // 500'den küçük tüm durum kodlarını başarılı kabul et
      });

      if (!this.isSuccessStatusCode(response.status)) {
        throw new Error(`Delete product failed with status code ${response.status}`);
      }
      return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        return false;
    }
  }

  /**
   * Static metod ile ürün silme isteğini tetikler.
   * Örneğin: DeleteProductRequest.send(3) çağrısı,
   * "https://localhost:7106/api/Product/deleteproduct/3" adresine DELETE isteği gönderir.
   */
  public static async send(productId: number): Promise<boolean> {
    const url: string = ApiUrls.GetDeleteProductUrl(); // Örneğin, "https://localhost:7106/api/Product/deleteproduct"
    const _url = `${url}/${productId}`;
    const request = new DeleteProductRequest(_url);
    return await request.execute();
  }
}
