'use client'
import { GetMenusRequest } from '@/application/httpRequests/menu/GetMenusRequest';
import { OrderItemModel } from '@/domain/OrderModels';
import { ProductModel } from '@/domain/ProductModels';
import { ServiceResponse } from '../ServiceResponse';
import { DiscountModel } from '@/domain/DiscountModels';
import { GetDiscountsRequest } from '@/application/httpRequests/discount/GetDiscountsRequest';
import { GetDiscountByIdRequest } from '@/application/httpRequests/discount/GetDiscountByIdRequest';

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
    console.log(response);
    if (response.isSuccess) {
      return ServiceResponse.success(response.data!);
    }
    return ServiceResponse.failure(response.error!);
  }

}
