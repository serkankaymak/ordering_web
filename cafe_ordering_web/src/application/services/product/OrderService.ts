import { OrderItemModel, OrderModel } from '@/domain/OrderModels';
import { ProductModel } from '@/domain/ProductModels';
import { ServiceResponse } from '../ServiceResponse';
import { GetUnCompletedOrderRequest } from '@/application/httpRequests/order/GetUnCompletedOrders';
import { UpdateOrderCommand, UpdateOrderRequest } from '@/application/httpRequests/order/UpdateOrderRequest';
import { CreateOrderCommand, CreateOrderRequest } from '@/application/httpRequests/order/CreateOrderRequest';
import { GetOrderByOrderIdRequest } from '@/application/httpRequests/order/GetOrderByIdRequest';

export interface IOrderService {
    readonly orderedProducts: OrderItemModel[];

    addProductToOrder(product: ProductModel): void;
    removeProductFromOrder(product: ProductModel): void;
    clearProductFromOrder(product: ProductModel): void;
    clearOrder(): void;

    addProductAddedToOrderListener(listener: (product: ProductModel) => void): void;
    addProductRemovedFromOrderListener(listener: (product: ProductModel) => void): void;
    addProductClearedFromOrderListener(listener: (product: ProductModel) => void): void;
    addOrderClearedListener(listener: () => void): void;
}

export class OrderService implements IOrderService {
    private async wait(ms: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, ms)); }
    private _localStorage: Storage | undefined;
    private _orderedProducts: OrderItemModel[] = [];
    private readonly storageKey = 'orderedProducts';
    private productAddedListeners: ((product: ProductModel) => void)[] = [];
    private productRemovedListeners: ((product: ProductModel) => void)[] = [];
    private productClearedListeners: ((product: ProductModel) => void)[] = [];
    private orderClearedListeners: (() => void)[] = [];

    constructor() {
        try { this._localStorage = localStorage; }
        catch (e: any) { }
        try { this.loadOrderedProductsFromLocalStorage(); } catch (e: any) { }
    }


    // Siparişe eklenen ürünleri alma
    public get orderedProducts(): OrderItemModel[] { return this._orderedProducts; }

    // Ürünü sipariş listesine ekleme
    public addProductToOrder(product: ProductModel): void {
        const existingOrderItem = this._orderedProducts.find(orderItem => orderItem.productId === product.id);
        if (existingOrderItem) { (existingOrderItem as OrderItemModel).increase(); }
        else { this._orderedProducts.push(new OrderItemModel({ productId: product.id, quantity: 1 })); }
        this.saveOrderedProductsToLocalStorage();
        this.notifyProductAddedToOrderListeners(product);
    }

    public removeProductFromOrder(product: ProductModel): void {
        const existingOrderItem = this._orderedProducts.find(orderItem => orderItem.productId === product.id);
        if (existingOrderItem) { (existingOrderItem as OrderItemModel).decrease(); }
        else { throw new Error(""); }
        this.saveOrderedProductsToLocalStorage();
        this.notifyProductRemovedFromOrderListeners(product);
    }

    // Ürünü sipariş listesine ekleme
    public clearProductFromOrder(product: ProductModel): void {
        if (product.id == null) { this.clearOrder(); return; }
        const existingOrderItem = this._orderedProducts.find(orderItem => orderItem.productId === product.id);
        if (existingOrderItem) { this._orderedProducts = this._orderedProducts.filter(x => x.productId != product.id); }
        else { throw new Error(""); }
        this.saveOrderedProductsToLocalStorage();

        this.notifyProductClearedFromOrderListeners(product);
    }

    public clearOrder(): void {
        if (this._localStorage == undefined) return;
        this._localStorage.removeItem(this.storageKey);
        this._orderedProducts = [];
        this.notifyOrderClearedListeners();
    }

    // Ürün eklendiğinde,silindiğinde,temizlendiğinde çağrılacak dinleyici ekleme
    public addProductAddedToOrderListener(listener: (product: ProductModel) => void): void { this.productAddedListeners.push(listener); }
    public addProductRemovedFromOrderListener(listener: (product: ProductModel) => void): void { this.productRemovedListeners.push(listener); }
    public addProductClearedFromOrderListener(listener: (product: ProductModel) => void): void { this.productClearedListeners.push(listener); }
    public addOrderClearedListener(listener: () => void): void { this.orderClearedListeners.push(listener); }

    // Ürün eklendiğinde,silindiğinde,temizlendiğinde dinleyicileri bilgilendirme
    private notifyProductAddedToOrderListeners(product: ProductModel): void { for (const listener of this.productAddedListeners) { listener(product); } }
    private notifyProductRemovedFromOrderListeners(product: ProductModel): void { for (const listener of this.productRemovedListeners) { listener(product); } }
    private notifyProductClearedFromOrderListeners(product: ProductModel): void { for (const listener of this.productClearedListeners) { listener(product); } }
    private notifyOrderClearedListeners(): void { for (const listener of this.orderClearedListeners) { listener(); } }


    // LocalStorage'a verileri kaydetme
    private saveOrderedProductsToLocalStorage(): void {
        try {
            if (this._localStorage == undefined) return;
            const newOrdeeredProducts = this._orderedProducts.map(x => x.copy({ product: null }))
            const jsonData = JSON.stringify(newOrdeeredProducts);
            this._localStorage!.setItem(this.storageKey, jsonData);
        } catch (error) {
            console.error('Veriler localStorage\'a kaydedilirken bir hata oluştu:', error);
        }
    }
    // LocalStorage'dan verileri yükleme
    private loadOrderedProductsFromLocalStorage(): void {
        try {
            if (this._localStorage == undefined) return;
            const jsonData = this._localStorage!.getItem(this.storageKey);
            if (jsonData) {
                const parsedData = JSON.parse(jsonData);
                this._orderedProducts = parsedData.map((item: any) => {
                    const orderItem = new OrderItemModel({ productId: item.productId, quantity: item.quantity });
                    return orderItem;
                });
            }
        } catch (error) {
            console.error('Veriler localStorage\'dan yüklenirken bir hata oluştu:', error);
            this._orderedProducts = [];
        }
    }




    public async GetUnCompletedOrders(): Promise<ServiceResponse<OrderModel[]>> {
        var response = await GetUnCompletedOrderRequest.send();
        if (response.isSuccess) { return ServiceResponse.success(response.data!); }
        else { return ServiceResponse.failure(response.error!) }
    }

    public async UpdateOrder(command: UpdateOrderCommand): Promise<ServiceResponse<void>> {
        var response = await UpdateOrderRequest.send(command);
        if (response.isSuccess) { return ServiceResponse.success(response.data!); }
        else { return ServiceResponse.failure(response.error!) }
    }


    public async CreateOrder(command: CreateOrderCommand): Promise<ServiceResponse<void>> {
        var response = await CreateOrderRequest.send(command);
        if (response.isSuccess) { return ServiceResponse.success(response.data!); }
        else { return ServiceResponse.failure(response.error!) }
    }

    public async GetOrder(orderId: number): Promise<ServiceResponse<OrderModel>> {
        var response = await GetOrderByOrderIdRequest.send(orderId);
        if (response.isSuccess) { return ServiceResponse.success(response.data!); }
        else { return ServiceResponse.failure(response.error!) }
    }



}
