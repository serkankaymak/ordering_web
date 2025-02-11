import axios from "axios";
import ApiUrls from "./HostUrl";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";

const fetchProductImages = async (url: string): Promise<string[]> => {
    try {
        const response = await axios.get<string[]>(url, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("response", response);
        return response.data; // Başarılı ise ürün görsellerini döndür
    } catch (error) {
        console.log("Ürün görselleri alınırken hata oluştu:", error);
        return []; // Hata durumunda boş dizi döndür
    }
};


export class GetAvaibleProductImagesRequest extends ABaseHttpRequest<string[]> {
    public execute(): Promise<string[]> {
        return fetchProductImages(ApiUrls.GetProductImagesUrl());
    }
    constructor(url: string) {
        super(url);
    }

    public static async sendAsync(): Promise<string[]> {
        const url: string = ApiUrls.GetCategoriesUrl(); // UrlManager'dan ürünleri getiren endpoint'i alınır
        const request = new GetAvaibleProductImagesRequest(url);
        return await request.execute();
    }
}