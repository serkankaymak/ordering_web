// interfaces/IProductService.ts

'use client'
import { CreateProductCommand, CreateProductRequest } from '@/application/httpRequests/CreateProductRequest';
import { DeleteProductRequest } from '@/application/httpRequests/DeleteProductRequest';
import { GetAvaibleProductImagesRequest } from '@/application/httpRequests/GetAvaibleProductImagesRequest';
import { GetProductWithCategoriesByIdRequest } from '@/application/httpRequests/GetProductByIdRequest';
import { GetCategoriesRequest } from '@/application/httpRequests/GetProductCategoriesRequest';
import { GetProductsRequest } from '@/application/httpRequests/GetProductsRequest';
import { UpdateProductCommand, UpdateProductRequest } from '@/application/httpRequests/UpdateProductRequest';
import { OrderItemModel } from '@/domain/OrderModels';
import { CategoryModel, ProductModel } from '@/domain/ProductModels';
import { Logcat } from '@/shared/LogCat';

export interface IProductService {
    readonly products: ProductModel[];
    readonly categories: CategoryModel[];
    readonly avaibleProductImages: string[];

    loadProducts(): Promise<void>;
    loadCategories(): Promise<void>;
    loadProductImages(): Promise<void>;
}

export class ProductService implements IProductService {
    private async wait(ms: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, ms)); }
    private _localStorage: Storage | undefined;

    private _products: ProductModel[] = [];
    private _avaibleProductImages: string[] = [];
    private _categories: CategoryModel[] = [];

    public get products(): ProductModel[] { return this._products; }
    public get avaibleProductImages(): string[] { return this._avaibleProductImages; }
    public get categories(): CategoryModel[] { return this._categories; }

    constructor() {
        if (typeof window !== 'undefined') { this._localStorage = localStorage; }
        this.loadProducts();
    }




    public async loadProducts(): Promise<void> {
        const fetched = await GetProductsRequest.sendAsync();
        this._products = fetched;
        Logcat.Debug(`IProductService --> load products : ${this._products} `)
    }

    public async loadCategories(): Promise<void> {
        const fetched = await GetCategoriesRequest.sendAsync();
        this._categories = fetched;
    }
    public async loadProductImages(): Promise<void> {
        const fetched = await GetAvaibleProductImagesRequest.sendAsync();
        this._avaibleProductImages = fetched;
    }


    public async DeleteProductAsync(productId:number):Promise<boolean>{
      return await  DeleteProductRequest.send(productId);
    }

    public async GetProductWithCategoriesById(productId: number): Promise<ProductModel> {
        console.log(this._products);
        if (this._products.some(x => x.id == productId)) { return this._products.filter(x => x.id == productId)[0]; }
        const product = await GetProductWithCategoriesByIdRequest.send(productId);
        return product;

    }

    public async CreateProductAsync(command: CreateProductCommand): Promise<boolean> {
        return CreateProductRequest.send(command);
    }

    public async UpdateProductAsync(command: UpdateProductCommand): Promise<boolean> {
        return UpdateProductRequest.send(command);
    }

}
