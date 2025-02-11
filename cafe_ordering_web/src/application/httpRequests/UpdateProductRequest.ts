// CreateProductRequest.ts

import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "./HostUrl";

// Ürün oluşturma komutunun (request) arayüzü
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


export class UpdateProductRequest extends ABaseHttpRequest<boolean> {
    private command: UpdateProductCommand;

    constructor(url: string, command: UpdateProductCommand) {
        super(url);
        this.command = command;
    }

    public async execute(): Promise<boolean> {
        try {
            // FormData nesnesi oluşturulur.
            const formData = new FormData();
            formData.append("ProductId", this.command.productId.toString());
            formData.append("Name", this.command.name);
            formData.append("Description", this.command.description);
            formData.append("Price", this.command.price.toString());

            // Kategori ID'leri varsa formData'ya eklenir.
            if (this.command.categoryIds && this.command.categoryIds.length > 0) {
                this.command.categoryIds.forEach((id) => formData.append("CategoryIds", id.toString()));
            }

            // Dosya varsa formData'ya eklenir.
            if (this.command.imageFile) { formData.append("imageFile", this.command.imageFile, this.command.imageFile.name); }
            else if (this.command.imagePath != null) { formData.append("imagePath", this.command.imagePath); }

            // API'ye POST isteği gönderilir.
            const response = await this.client.put(
                this.url,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    validateStatus: (status) => status < 500, // 500'den küçük tüm status kodları geçerli sayılır
                }
            );

            // Sadece 201 (Created) başarılı kabul edilir.
            return this.isSuccessStatusCode(response.status);
        } catch (error) {
            console.error("Error creating product:", error);
            return false;
        }
    }

    public static async send(command: UpdateProductCommand): Promise<boolean> {
        const url: string = ApiUrls.GetUpdateProductUrl();
        const request = new UpdateProductRequest(url, command);
        return await request.execute();
    }
}
