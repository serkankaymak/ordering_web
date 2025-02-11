// GetProductWithCategoriestById.ts
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import { ProductModel } from "@/domain/ProductModels";
import ApiUrls from "./HostUrl";

export class GetProductWithCategoriesByIdRequest extends ABaseHttpRequest<ProductModel> {
    // İsteğin yapılacağı URL'yi oluşturuyoruz
    constructor(url: string, productId: number) {
        super(url + "/" + productId.toString());
    }

    /**
     * API'ye GET isteği gönderir ve tek bir ürünü (ProductModel) döndürür.
     * Hata durumunda boş bir ProductModel döndürür.
     */
    public async execute(): Promise<ProductModel> {
        try {
            const response = await this.client.get<ProductModel>(this.url, {
                headers: { Accept: "application/json" },
                validateStatus: (status) => status < 500,
            });

            // Başarılıysa response.data içerisinde ProductModel verisi bulunur.
            if (this.isSuccessStatusCode(response.status)) {
                var product = ProductModel.fromJson(response.data);
                return product;
            }

            // Beklenen aralıkta değilse ya da data yoksa:
            return {} as ProductModel;

        } catch (error) {
            console.error("GetProductWithCategoriestById Hatası:", error);
            return {} as ProductModel;
        }
    }

    /**
     * Statik metod; GetProductWithCategoriestById instance'ını oluşturur ve isteği yürütür.
     * curl -X 'GET' 'https://localhost:7106/api/Product/{id}'
     */
    public static async send(id: number): Promise<ProductModel> {
        const url = ApiUrls.GetProductUrl();
        const request = new GetProductWithCategoriesByIdRequest(url, id);
        return await request.execute();
    }
}
