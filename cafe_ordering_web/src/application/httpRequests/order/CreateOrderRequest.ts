import { ABaseHttpRequest } from "@/shared/ABaseHttpRequest";
import ApiUrls from "../HostUrl";
import { ApiResponse } from "../ApiResponse'T";


// UpdateOrderCommand, C#'daki yapıyla uyumlu olacak şekilde
export interface CreateOrderCommand {
  userId?: number;
  tableId: number;
  orderMenuItems: {
    productId: number;
    quantity: number;
  }[];
}

export class CreateOrderRequest extends ABaseHttpRequest<ApiResponse<void>> {
  private command:  CreateOrderCommand;

  constructor(url: string, command: CreateOrderCommand) {
    super(url);
    this.command = command;
  }

  // execute metodu HTTP PUT isteği yapacak şekilde implement edilmiştir.
  public async execute(): Promise<ApiResponse<void>> {
    const response = await fetch(this.url, {
      method: 'POST', // Güncelleme işlemi için PUT kullanıyoruz.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.command),
    });

    if (this.isSuccessStatusCode(response.status)) {
      return ApiResponse.success<void>(undefined);
    } else {
      return ApiResponse.failure<void>("Failed to update order");
    }
  }

  // Statik send metodu, URL'i ApiUrls üzerinden alıp isteği gönderir.
  public static async send(command: CreateOrderCommand): Promise<ApiResponse<void>> {
    const url: string = ApiUrls.GetCreateOrderUrl();
    const request = new CreateOrderRequest(url, command);
    return await request.execute();
  }
}
