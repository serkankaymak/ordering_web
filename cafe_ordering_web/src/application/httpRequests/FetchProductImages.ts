import axios from "axios";
import UrlManager from "./HostUrl";

export const fetchProductImages = async (): Promise<string[]> => {
    try {
        const response = await axios.get<string[]>(UrlManager.GetProductImagesUrl(), {
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
