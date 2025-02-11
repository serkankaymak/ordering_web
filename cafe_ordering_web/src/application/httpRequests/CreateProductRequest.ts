// CreateProductRequest.ts

import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import UrlManager from "./HostUrl";

// Ürün oluşturma komutunun (request) arayüzü
export interface CreateProductCommand {
    name: string;
    price: number;
    categoryIds?: number[]; // İsteğe bağlı kategori ID listesi
    imageFile?: File | null;       // İsteğe bağlı dosya (formdan gelecek)
    // Diğer alanlar eklenebilir...
}

/**
 * CreateProductRequest, API'ye ürün oluşturma isteğini göndermek için ABaseHttpRequest sınıfından türetilmiştir.
 * API URL'si UrlManager üzerinden alınır.
 */
export class CreateProductRequest extends ABaseHttpRequest<boolean> {
    private command: CreateProductCommand;

    constructor(url: string, command: CreateProductCommand) {
        super(url);
        this.command = command;
    }

    /**
     * API'ye ürün oluşturma isteğini gönderir.
     * Backend yalnızca 201 (Created) statüsü döndürdüğünde başarılı kabul edilir.
     *
     * @returns İstek başarılı ise true, aksi halde false.
     */
    public async execute(): Promise<boolean> {
        try {
            // FormData nesnesi oluşturulur.
            const formData = new FormData();
            formData.append("Name", this.command.name);
            formData.append("Price", this.command.price.toString());

            // Kategori ID'leri varsa formData'ya eklenir.
            if (this.command.categoryIds && this.command.categoryIds.length > 0) {
                this.command.categoryIds.forEach((id) => formData.append("CategoryIds", id.toString()));
            }

            // Dosya varsa formData'ya eklenir.
            if (this.command.imageFile) {
                formData.append("imageFile", this.command.imageFile, this.command.imageFile.name);
            }

            // API'ye POST isteği gönderilir.
            const response = await this.client.post(
                this.url,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    validateStatus: (status) => status < 500, // 500'den küçük tüm status kodları geçerli sayılır
                }
            );

            // Sadece 201 (Created) başarılı kabul edilir.
            return this.isCreatedStatusCode(response.status);
        } catch (error) {
            console.error("Error creating product:", error);
            return false;
        }
    }

    /**
     * Statik metod, CreateProductRequest instance'ını oluşturur ve isteği yürütür.
     *
     * @param command Ürün oluşturma komutu
     * @returns İstek başarılı ise true, aksi halde false.
     */
    public static async send(
        command: CreateProductCommand
    ): Promise<boolean> {
        const url = UrlManager.GetCreateProductUrl();
        const request = new CreateProductRequest(url, command);
        return await request.execute();
    }
}
