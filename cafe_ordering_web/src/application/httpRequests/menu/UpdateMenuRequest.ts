import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";

// Menü oluşturma komutunun (request) arayüzü
export interface UpdateMenuCommand {
    MenuId: number;
    name: string;
    description?: string;
    price: number;
    imageFile?: File | null;       // İsteğe bağlı dosya (formdan gelecek)
    imagePath?: string | null;
    menuItems: UpdateMenuItemCommand[];
    categoryIds: number[]; // "ctegoryIds" yerine doğru yazım: categoryIds
}

export interface UpdateMenuItemCommand {
    MenuItemId: number;
    Quantity: number;
}

/**
 * CreateMenuRequest, backend'de ProductBox olarak karşılık bulan menü (ürün kutusu) oluşturma isteğini
 * API'ye göndermek için ABaseHttpRequest sınıfından türetilmiştir.
 * İşlem sonucu ApiResponse<void> olarak döndürülür.
 */
export class UpdateMenuRequest extends ABaseHttpRequest<ApiResponse<void>> {
    private command: UpdateMenuCommand;

    constructor(url: string, command: UpdateMenuCommand) {
        super(url);
        this.command = command;
    }

    /**
     * API'ye menü oluşturma isteğini gönderir.
     * Backend başarılı bir şekilde 201 (Created) statüsü döndürdüğünde, ApiResponse.success döner;
     * aksi durumda ApiResponse.failureFromStatus veya ApiResponse.failure ile hata mesajı döndürür.
     */
    public async execute(): Promise<ApiResponse<void>> {
        try {
            // FormData nesnesi oluşturuluyor.
            const formData = new FormData();
            formData.append("menuId", this.command.MenuId.toString());
            formData.append("Name", this.command.name);
            formData.append("Description", this.command.description ?? "");
            formData.append("Price", this.command.price.toString() ?? "");

            // Kategori ID'leri ekleniyor
            if (this.command.categoryIds && this.command.categoryIds.length > 0) {
                this.command.categoryIds.forEach((id) => {
                    formData.append("CategoryIds", id.toString());
                });
            }

            // Menü öğelerini indekse göre ekliyoruz
            if (this.command.menuItems && this.command.menuItems.length > 0) {
                this.command.menuItems.forEach((item, index) => {
                    formData.append(`MenuItems[${index}].MenuItemId`, item.MenuItemId.toString());
                    formData.append(`MenuItems[${index}].Quantity`, item.Quantity.toString());
                });
            }



            // Dosya varsa formData'ya ekleniyor. (Backend'de parametre adı "ImageFile" olarak beklenebilir.)
            if (this.command.imageFile) {
                formData.append("ImageFile", this.command.imageFile, this.command.imageFile.name);
            } else if (this.command.imagePath != null) {
                formData.append("ImagePath", this.command.imagePath);
            }

            // Önemli: FormData gönderirken "Content-Type" header'ını elle ayarlamayın.
            const response = await this.client.put(
                this.url,
                formData,
                {
                    validateStatus: (status: number) => status < 500, // 500'den küçük tüm durum kodlarını başarılı sayar
                }
            );

            if (this.isSuccessStatusCode(response.status)) {
                return ApiResponse.success<void>(undefined);
            }

            console.error(`Request failed with status: ${response.status}`);
            return ApiResponse.failureFromStatus<void>(response.status);
        } catch (error: any) {
            console.error("Error creating menu:", error);
            if (axios.isAxiosError(error) && error.response) {
                return ApiResponse.failureFromStatus<void>(error.response.status);
            }
            return ApiResponse.failure<void>("Bilinmeyen bir hata oluştu.");
        }
    }

    /**
     * Statik metod; CreateMenuRequest instance'ını oluşturur ve isteği yürütür.
     *
     * @param command Menü oluşturma komutu
     * @returns ApiResponse<void> sonucu
     */
    public static async send(command: UpdateMenuCommand): Promise<ApiResponse<void>> {
        // Backend'deki ProductBox oluşturma endpoint'i için URL alınır.
        const url: string = ApiUrls.GetUpdateMenuUrl();
        const request = new UpdateMenuRequest(url, command);
        return await request.execute();
    }
}
