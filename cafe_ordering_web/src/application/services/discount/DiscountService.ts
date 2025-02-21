'use client'
import { ServiceResponse } from '../ServiceResponse';
import { DiscountModel } from '@/domain/DiscountModels';
import { GetDiscountsRequest } from '@/application/httpRequests/discount/GetDiscountsRequest';
import { GetDiscountByIdRequest } from '@/application/httpRequests/discount/GetDiscountByIdRequest';
import { CreateDiscountCommand, CreateDiscountRequest } from '@/application/httpRequests/discount/CreateDiscountRequest';
import { UpdateDiscountCommand, UpdateDiscountRequest } from '@/application/httpRequests/discount/UpdateDiscountRequest';
import { GetAwaibleDiscountsOfOrderedItemsRequestPayload, GetAwaibleDiscountsRequest } from '@/application/httpRequests/discount/GetAwaibleDiscountsOfOrderedItemsRequest';
import { GetOrderItemsHasDiscountsRequest, GetOrderItemsHasDiscountsRequestPayload } from '@/application/httpRequests/discount/GetOrderItemsHasDiscountsRequest';
import { OrderCanHaveDiscountDto } from '@/application/dtos/OrderCanHaveDiscountDto';

export interface IDiscountService {
  loadDiscounts(): Promise<ServiceResponse<DiscountModel[]>>;
  get discounts(): DiscountModel[];
}

export class DiscountService implements IDiscountService {
  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private _localStorage: Storage | undefined;
  private _discounts: DiscountModel[] = [];

  public get discounts(): DiscountModel[] {
    return this._discounts;
  }

  constructor() {
    try {
      this._localStorage = localStorage;
    } catch (e: any) {
      // LocalStorage erişilemezse hata yakalanır.
    }
  }

  public async loadDiscounts(): Promise<ServiceResponse<DiscountModel[]>> {
    const response = await GetDiscountsRequest.send();
    if (response.isSuccess) {
      this._discounts = response.data!;
      return ServiceResponse.success(this._discounts);
    }
    return ServiceResponse.failure(response.error!);
  }


  public async RequestDiscountById(discountId: number): Promise<ServiceResponse<DiscountModel>> {
    const response = await GetDiscountByIdRequest.send(discountId);
    if (response.isSuccess) {
      return ServiceResponse.success(response.data!);
    }
    return ServiceResponse.failure(response.error!);
  }


  public async createDiscount(command: CreateDiscountCommand) {
    const response = CreateDiscountRequest.send(command);
    if ((await response).isSuccess) return ServiceResponse.success(null);
    return ServiceResponse.failure((await response).error!);
  }
  public async updateDiscount(command: UpdateDiscountCommand) {
    const response = UpdateDiscountRequest.send(command);
    if ((await response).isSuccess) return ServiceResponse.success(null);
    return ServiceResponse.failure((await response).error!);
  }



  public async getAwabileDiscountsOfOrderedItems(payload: GetAwaibleDiscountsOfOrderedItemsRequestPayload) {
    const response = await GetAwaibleDiscountsRequest.send(payload);
    if ((response).isSuccess) return ServiceResponse.success(response.data!);
    return ServiceResponse.failure<DiscountModel[]>((response).error!);
  }


  public async getOrderItemsHasDiscounts(payload: GetOrderItemsHasDiscountsRequestPayload) {
    const response = await GetOrderItemsHasDiscountsRequest.send(payload);
    if ((response).isSuccess) return ServiceResponse.success(response.data!);
    return ServiceResponse.failure<OrderCanHaveDiscountDto[]>((response).error!);
  }


}
