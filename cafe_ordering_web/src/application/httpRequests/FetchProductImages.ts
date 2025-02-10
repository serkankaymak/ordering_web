import axios from "axios";

const API_URL = "https://localhost:7106/api/Product/getProductImages";

export const fetchProductImages = async (): Promise<string[]> => {
    try {
        const response = await axios.get<string[]>(API_URL, {
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
