// interfaces/IProductService.ts

'use client'
import { OrderItemModel } from '@/domain/OrderModels';
import { ProductModel } from '@/domain/ProductModels';

export interface IProductService {
    readonly products: ProductModel[];
}

export class ProductService implements IProductService {
    private async wait(ms: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, ms)); }
    private _localStorage: Storage | undefined;
    private _products: ProductModel[] = [];

    constructor() {
        if (typeof window !== 'undefined') {
            this._localStorage = localStorage;
        }
        this.loadProducts();
    }


    // Ürünleri yükleme
    public async loadProducts(): Promise<void> {
        this._products = ProductModel.getExamples();
    }

    // Tüm ürünleri alma
    public get products(): ProductModel[] { return this._products; }

}
