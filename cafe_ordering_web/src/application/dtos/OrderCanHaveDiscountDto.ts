import { DiscountModel } from "@/domain/DiscountModels";
import { OrderItemModel, OrderModel } from "@/domain/OrderModels";


export class OrderCanHaveDiscountDto {
    order!: OrderModel;
    discount!: DiscountModel;
    discountAmount: number = 0;
    netTotalPrice: number = 0;

    constructor(init?: Partial<OrderCanHaveDiscountDto>) {
        Object.assign(this, init);
    }
    static fromJson(json: Partial<OrderCanHaveDiscountDto>): OrderCanHaveDiscountDto {
        const instance = new OrderCanHaveDiscountDto();
        instance.order = OrderModel.fromJson(json.order);
        instance.discount = DiscountModel.fromJson(json.discount!)!;
        instance.discountAmount = json.discountAmount!;
        instance.netTotalPrice = json.netTotalPrice!;
        return instance;
    }
}
