import { CategoryModel } from "@/domain/ProductModels";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "./HostUrl";

export class GetCategoriesRequest extends ABaseHttpRequest<CategoryModel[]> {

    constructor(url: string) { super(url); }

    public async execute(): Promise<CategoryModel[]> {
        try {
            const response = await this.client.get<CategoryModel[]>(this.url, {
                headers: { "Accept": "application/json" },
                validateStatus: (status) => status < 500, // 500'den küçük tüm durum kodlarını başarılı sayar
            });

            if (this.isSuccessStatusCode(response.status)) {
                const categories = response.data.map((category) => {
                    return category;
                });
                return categories;
            }
            console.error(`Request failed with status: ${response.status}`);
            return [];
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    public static async sendAsync(): Promise<CategoryModel[]> {
        const url: string = ApiUrls.GetCategoriesUrl(); // UrlManager'dan ürünleri getiren endpoint'i alınır
        const request = new GetCategoriesRequest(url);
        return await request.execute();
    }
}