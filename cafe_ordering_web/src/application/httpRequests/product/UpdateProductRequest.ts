import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";


// Ürün güncelleme komutunun (request) arayüzü
export interface UpdateProductCommand {
  productId: number;
  name: string;
  description: string;
  price: number;
  categoryIds?: number[]; // İsteğe bağlı kategori ID listesi
  imageFile?: File | null;       // İsteğe bağlı dosya (formdan gelecek)
  imagePath?: string | null;
  // Diğer alanlar eklenebilir...
}

export class UpdateProductRequest extends ABaseHttpRequest<ApiResponse<void>> {
  private command: UpdateProductCommand;

  constructor(url: string, command: UpdateProductCommand) {
    super(url);
    this.command = command;
  }

  /**
   * API'ye PUT isteği gönderir ve ürün güncelleme işlemini gerçekleştirir.
   * Başarılı durumda ApiResponse.success(undefined) döner;
   * hata durumunda HTTP durum koduna göre otomatik hata mesajı içeren ApiResponse.failureFromStatus
   * veya genel hata mesajı ile ApiResponse.failure döner.
   */
  public async execute(): Promise<ApiResponse<void>> {
    try {
      // FormData nesnesi oluşturulur.
      const formData = new FormData();
      formData.append("ProductId", this.command.productId.toString());
      formData.append("Name", this.command.name);
      formData.append("Description", this.command.description);
      formData.append("Price", this.command.price.toString());

      // Kategori ID'leri varsa formData'ya eklenir.
      if (this.command.categoryIds && this.command.categoryIds.length > 0) {
        this.command.categoryIds.forEach((id) =>
          formData.append("CategoryIds", id.toString())
        );
      }

      // Dosya varsa formData'ya eklenir.
      if (this.command.imageFile) {
        formData.append("imageFile", this.command.imageFile, this.command.imageFile.name);
      } else if (this.command.imagePath != null) {
        formData.append("imagePath", this.command.imagePath);
      }

      // API'ye PUT isteği gönderilir.
      const response = await this.client.put(
        this.url,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          validateStatus: (status: number) => status < 500, // 500'den küçük tüm status kodları geçerli sayılır
        }
      );

      if (this.isSuccessStatusCode(response.status)) {
        return ApiResponse.success<void>(undefined);
      }
      console.error(`Update product failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<void>(response.status);
    } catch (error: any) {
      console.error("Error updating product:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<void>(error.response.status);
      }
      return ApiResponse.failure<void>("Bilinmeyen bir hata oluştu.");
    }
  }

  /**
   * Statik metod; UpdateProductRequest instance'ını oluşturur ve isteği yürütür.
   *
   * @param command Ürün güncelleme komutu
   * @returns ApiResponse<void> sonucu
   */
  public static async send(command: UpdateProductCommand): Promise<ApiResponse<void>> {
    const url: string = ApiUrls.GetUpdateProductUrl();
    const request = new UpdateProductRequest(url, command);
    return await request.execute();
  }
}
