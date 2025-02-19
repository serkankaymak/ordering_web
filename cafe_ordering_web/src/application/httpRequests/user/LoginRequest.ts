import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";
import { TokenDto } from "@/domain/UserModels";


// Login isteğinde gönderilecek komut (payload) arayüzü
export interface LoginCommand {
    email: string;
    password: string;
}

/**
 * LoginRequest, API’ye login isteğini göndermek için ABaseHttpRequest sınıfından türetilmiştir.
 * Bu sınıf, işlem sonucunu ApiResponse<string[]> olarak döndürür.
 */
export class LoginRequest extends ABaseHttpRequest<ApiResponse<TokenDto>> {
    private command: LoginCommand;

    constructor(url: string, command: LoginCommand) {
        super(url);
        this.command = command;
    }

    /**
     * API’ye login isteğini JSON formatında gönderir.
     * Başarılı durumda (HTTP 200) ApiResponse.success<string[]>(response.data) döner;
     * aksi halde hata durumuna göre ApiResponse.failureFromStatus veya genel hata mesajı ile ApiResponse.failure döner.
     */
    public async execute(): Promise<ApiResponse<TokenDto>> {
        try {
            const response = await this.client.post(
                this.url,
                this.command,
                {
                    headers: { "Content-Type": "application/json" },
                    validateStatus: (status: number) => status < 500, // 500'den küçük tüm durum kodlarını kabul et
                }
            );

            console.log(response);

            if (this.isSuccessStatusCode(response.status)) {
                return ApiResponse.success<TokenDto>(response.data);
            }
            console.error(`Login request failed with status: ${response.status}`);
            return ApiResponse.failureFromStatus<TokenDto>(response.status);
        } catch (error: any) {
            console.error("Error during login request:", error);
            if (axios.isAxiosError(error) && error.response) {
                return ApiResponse.failureFromStatus<TokenDto>(error.response.status);
            }
            return ApiResponse.failure<TokenDto>("Bilinmeyen bir hata oluştu.");
        }
    }

    /**
     * Statik metod; LoginRequest instance’ını oluşturur ve isteği yürütür.
     *
     * @param command Login komutunu içeren obje (username ve password)
     * @returns ApiResponse<string[]> sonucu
     */
    public static async send(command: LoginCommand): Promise<ApiResponse<TokenDto>> {
        const url: string = ApiUrls.GetLoginUrl(); // API endpoint adresini döndüren metod
        const request = new LoginRequest(url, command);
        return await request.execute();
    }
}
