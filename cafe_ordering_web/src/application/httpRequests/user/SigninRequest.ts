import axios from "axios";
import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";
import { TokenDto } from "@/domain/UserModels";


// Signin isteğinde gönderilecek komut (payload) arayüzü
export interface SigninCommand {
    email: string;
    password: string;
}

/**
 * SigninRequest, API’ye signin isteğini göndermek için ABaseHttpRequest sınıfından türetilmiştir.
 * Bu sınıf, işlem sonucunu ApiResponse<TokenDto> olarak döndürür.
 */
export class SigninRequest extends ABaseHttpRequest<ApiResponse<TokenDto>> {
    private command: SigninCommand;

    constructor(url: string, command: SigninCommand) {
        super(url);
        this.command = command;
    }

    /**
     * API’ye signin isteğini JSON formatında gönderir.
     * Başarılı durumda (HTTP 200) ApiResponse.success<TokenDto>(response.data) döner;
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

            if (this.isSuccessStatusCode(response.status)) {
                return ApiResponse.success<TokenDto>(response.data);
            }
            console.error(`Signin request failed with status: ${response.status}`);
            return ApiResponse.failureFromStatus<TokenDto>(response.status);
        } catch (error: any) {
            console.error("Error during signin request:", error);
            if (axios.isAxiosError(error) && error.response) {
                return ApiResponse.failureFromStatus<TokenDto>(error.response.status);
            }
            return ApiResponse.failure<TokenDto>("Bilinmeyen bir hata oluştu.");
        }
    }

    /**
     * Statik metod; SigninRequest instance’ını oluşturur ve isteği yürütür.
     *
     * @param command Signin komutunu içeren obje (username ve password)
     * @returns ApiResponse<TokenDto> sonucu
     */
    public static async send(command: SigninCommand): Promise<ApiResponse<TokenDto>> {
        const url: string = ApiUrls.GetSigninUrl(); // API endpoint adresini döndüren metod
        const request = new SigninRequest(url, command);
        return await request.execute();
    }
}
