// interfaces/IProductService.ts

import { CreateProductCommand, CreateProductRequest } from '@/application/httpRequests/product/CreateProductRequest';
import { DeleteProductRequest } from '@/application/httpRequests/product/DeleteProductRequest';
import { GetAvaibleProductImagesRequest } from '@/application/httpRequests/GetAvaibleProductImagesRequest';
import { GetMenuWithCategoriesByIdRequest } from '@/application/httpRequests/menu/GetMenuByIdRequest';
import { GetMenusRequest } from '@/application/httpRequests/menu/GetMenusRequest';
import { GetProductWithCategoriesByIdRequest } from '@/application/httpRequests/product/GetProductByIdRequest';
import { GetCategoriesRequest } from '@/application/httpRequests/GetProductCategoriesRequest';
import { GetProductsRequest } from '@/application/httpRequests/product/GetProductsRequest';
import { UpdateProductCommand, UpdateProductRequest } from '@/application/httpRequests/product/UpdateProductRequest';
import { OrderItemModel } from '@/domain/OrderModels';
import { CategoryModel, ProductModel } from '@/domain/ProductModels';
import { Logcat } from '@/shared/LogCat';
import { ServiceResponse } from '../ServiceResponse';
import { CreateMenuCommand, CreateMenuRequest } from '@/application/httpRequests/menu/CreateMenuRequest';
import { UpdateMenuCommand, UpdateMenuRequest } from '@/application/httpRequests/menu/UpdateMenuRequest';
import { ProductImageDto } from '@/application/dtos/ProductImageDto';
import { GetAvaibleProductImagesWithTagsRequest } from '@/application/httpRequests/GetAvaibleProductImagesWithTagsRequest';

export interface IProductService {
    readonly products: ProductModel[];
    readonly categories: CategoryModel[];
    readonly avaibleProductImages: string[];

    loadAllProductsAndMenus(): Promise<ServiceResponse<ProductModel[]>>;
    loadMenus(): Promise<ServiceResponse<ProductModel[]>>;
    loadProducts(): Promise<ServiceResponse<ProductModel[]>>;
    loadCategories(): Promise<ServiceResponse<CategoryModel[]>>;
    loadProductImages(): Promise<ServiceResponse<string[]>>;
}

export class ProductService implements IProductService {

    private async wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    private _localStorage: Storage | undefined;

    private _menus: ProductModel[] = [];
    private _products: ProductModel[] = [];
    private _avaibleProductImages: string[] = [];
    private _categories: CategoryModel[] = [];

    public get products(): ProductModel[] { return this._products; }
    public get menus(): ProductModel[] { return this._menus; }
    public get avaibleProductImages(): string[] { return this._avaibleProductImages; }
    public get categories(): CategoryModel[] { return this._categories; }

    constructor() {
        try { this._localStorage = localStorage; }
        catch (e: any) { }
    }


    public async loadAllProductsAndMenus(): Promise<ServiceResponse<ProductModel[]>> {
        var response1 = await this.loadProducts();
        var response2 = await this.loadMenus();
        if (response1.isSuccess && response2.isSuccess)
            return ServiceResponse.success([...this._products, ...this._menus])
        return ServiceResponse.failure("Some thing goes wrong!");
    }

    public async loadMenus(): Promise<ServiceResponse<ProductModel[]>> {
        var response = await GetMenusRequest.send();
        if (response.isSuccess) { this._menus = response.data!; return ServiceResponse.success(this._menus); }
        return ServiceResponse.failure(response.error!);
    }

    // Ürün listesini API'den yükler, cache'e atar ve ServiceResponse olarak döner.
    public async loadProducts(): Promise<ServiceResponse<ProductModel[]>> {
        const response = await GetProductsRequest.send();
        if (response.isSuccess && response.data) {
            this._products = response.data;
            //Logcat.Debug(`IProductService --> load products: ${JSON.stringify(this._products)}`);
            return ServiceResponse.success<ProductModel[]>(this._products);
        } else {
            Logcat.Debug(`IProductService --> Failed to load products: ${response.error}`);
            return ServiceResponse.failure<ProductModel[]>(response.error || "Ürünler yüklenemedi.");
        }
    }

    // Kategori listesini API'den yükler ve ServiceResponse olarak döner.
    public async loadCategories(): Promise<ServiceResponse<CategoryModel[]>> {
        const response = await GetCategoriesRequest.send();
        if (response.isSuccess && response.data) {
            this._categories = response.data;
            //Logcat.Debug(`IProductService --> load categories: ${JSON.stringify(this._categories)}`);
            return ServiceResponse.success<CategoryModel[]>(this._categories);
        } else {
            Logcat.Debug(`IProductService --> Failed to load categories: ${response.error}`);
            return ServiceResponse.failure<CategoryModel[]>(response.error || "Kategoriler yüklenemedi.");
        }
    }

    // Ürün görsellerini API'den yükler ve ServiceResponse olarak döner.
    public async loadProductImages(): Promise<ServiceResponse<string[]>> {
        const response = await GetAvaibleProductImagesRequest.send();
        if (response.isSuccess && response.data) {
            this._avaibleProductImages = response.data;
            //Logcat.Debug(`IProductService --> load product images: ${JSON.stringify(this._avaibleProductImages)}`);
            return ServiceResponse.success<string[]>(this._avaibleProductImages);
        } else {
            Logcat.Error(`IProductService --> Failed to load product images: ${response.error}`);
            return ServiceResponse.failure<string[]>(response.error || "Ürün görselleri yüklenemedi.");
        }
    }


    // Ürün görsellerini API'den yükler ve ServiceResponse olarak döner.
    public async loadProductImagesWithTags(): Promise<ServiceResponse<ProductImageDto[]>> {
        const response = await GetAvaibleProductImagesWithTagsRequest.send();
        if (response.isSuccess && response.data) {
            //Logcat.Debug(`IProductService --> load product images: ${JSON.stringify(this._avaibleProductImages)}`);
            return ServiceResponse.success<ProductImageDto[]>(response.data!);
        } else {
            Logcat.Error(`IProductService --> Failed to load product images: ${response.error}`);
            return ServiceResponse.failure<ProductImageDto[]>(response.error || "Ürün görselleri yüklenemedi.");
        }
    }


    public async DeleteProductAsync(productId: number): Promise<ServiceResponse<void>> {
        const response = await DeleteProductRequest.send(productId);
        if (response.isSuccess) {
            return ServiceResponse.success<void>(undefined);
        }
        return ServiceResponse.failure<void>(response.error || "Ürün silinemedi.");
    }

    public async GetProductWithCategoriesById(productId: number): Promise<ServiceResponse<ProductModel>> {
        const existing = this._products.find(x => x.id === productId);
        if (existing) {
            return ServiceResponse.success<ProductModel>(existing);
        }
        const response = await GetProductWithCategoriesByIdRequest.send(productId);
        if (response.isSuccess && response.data) {
            return ServiceResponse.success<ProductModel>(response.data);
        }
        return ServiceResponse.failure<ProductModel>(response.error || "Ürün alınamadı.");
    }

    public async GetMenuWithCategoriesById(productId: number): Promise<ServiceResponse<ProductModel>> {
        const existing = this._menus.find(x => x.id === productId);
        if (existing) {
            return ServiceResponse.success<ProductModel>(existing);
        }
        const response = await GetMenuWithCategoriesByIdRequest.send(productId);
        if (response.isSuccess && response.data) {
            return ServiceResponse.success<ProductModel>(response.data);
        }
        return ServiceResponse.failure<ProductModel>(response.error || "Menü alınamadı.");
    }

    public async CreateProductAsync(command: CreateProductCommand): Promise<ServiceResponse<void>> {
        const response = await CreateProductRequest.send(command);
        if (response.isSuccess) {
            return ServiceResponse.success<void>(undefined);
        }
        return ServiceResponse.failure<void>(response.error || "Ürün oluşturulamadı.");
    }


    public async CreateMenuAsync(command: CreateMenuCommand): Promise<ServiceResponse<void>> {
        const response = await CreateMenuRequest.send(command);
        if (response.isSuccess) { return ServiceResponse.success<void>(undefined); }
        return ServiceResponse.failure<void>(response.error || "Ürün oluşturulamadı.");
    }


    public async UpdateMenuAsync(command: UpdateMenuCommand): Promise<ServiceResponse<void>> {
        const response = await UpdateMenuRequest.send(command);
        if (response.isSuccess) { return ServiceResponse.success<void>(undefined); }
        return ServiceResponse.failure<void>(response.error || "Menü güncellenemedi.");
    }


    public async UpdateProductAsync(command: UpdateProductCommand): Promise<ServiceResponse<void>> {
        const response = await UpdateProductRequest.send(command);
        if (response.isSuccess) {
            return ServiceResponse.success<void>(undefined);
        }
        return ServiceResponse.failure<void>(response.error || "Ürün güncellenemedi.");
    }



}
