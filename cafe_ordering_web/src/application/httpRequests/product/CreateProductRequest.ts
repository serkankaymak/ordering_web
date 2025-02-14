import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";


// Ürün oluşturma komutunun (request) arayüzü
export interface CreateProductCommand {
  name: string;
  description: string;
  price: number;
  categoryIds?: number[]; // İsteğe bağlı kategori ID listesi
  imageFile?: File | null;       // İsteğe bağlı dosya (formdan gelecek)
  imagePath?: string | null;
  // Diğer alanlar eklenebilir...
}

/**
 * CreateProductRequest, API'ye ürün oluşturma isteğini göndermek için ABaseHttpRequest sınıfından türetilmiştir.
 * Bu sınıf, işlem sonucunu ApiResponse<void> olarak döndürür.
 */
export class CreateProductRequest extends ABaseHttpRequest<ApiResponse<void>> {
  private command: CreateProductCommand;

  constructor(url: string, command: CreateProductCommand) {
    super(url);
    this.command = command;
  }

  /**
   * API'ye ürün oluşturma isteğini gönderir.
   * Backend yalnızca 201 (Created) statüsü döndürdüğünde başarılı kabul edilir.
   * Başarılı durumda ApiResponse.success<void>(undefined) döner;
   * hata durumunda HTTP durum koduna göre otomatik hata mesajı içeren ApiResponse.failureFromStatus
   * veya genel hata mesajı ile ApiResponse.failure döner.
   */
  public async execute(): Promise<ApiResponse<void>> {
    try {
      // FormData nesnesi oluşturulur.
      const formData = new FormData();
      formData.append("Name", this.command.name);
      formData.append("description", this.command.description??'');
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

      // API'ye POST isteği gönderilir.
      const response = await this.client.post(
        this.url,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          validateStatus: (status: number) => status < 500, // 500'den küçük tüm durum kodlarını geçerli sayar
        }
      );

      // Backend, başarılı durumda genellikle 201 (Created) statüsü döndürür.
      if (response.status === 201) {
        return ApiResponse.success<void>(undefined);
      }
      console.error(`Request failed with status: ${response.status}`);
      return ApiResponse.failureFromStatus<void>(response.status);
    } catch (error: any) {
      console.error("Error creating product:", error);
      if (axios.isAxiosError(error) && error.response) {
        return ApiResponse.failureFromStatus<void>(error.response.status);
      }
      return ApiResponse.failure<void>("Bilinmeyen bir hata oluştu.");
    }
  }

  /**
   * Statik metod; CreateProductRequest instance'ını oluşturur ve isteği yürütür.
   *
   * @param command Ürün oluşturma komutu
   * @returns ApiResponse<void> sonucu
   */
  public static async send(command: CreateProductCommand): Promise<ApiResponse<void>> {
    const url: string = ApiUrls.GetCreateProductUrl();
    const request = new CreateProductRequest(url, command);
    return await request.execute();
  }
}
