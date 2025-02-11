
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;
const BASE_APİ_URL = process.env.NEXT_PUBLIC_HOST_URL + "/api";
const PRODUCT_IMAGES_URL = `${BASE_APİ_URL}/Product/getProductImages`;
const CREATE_PRODUCT_URL = `${BASE_APİ_URL}/Product`;
const GET_PRODUCTS_URL = `${BASE_APİ_URL}/Product/products`;


export default class UrlManager {
    static GetProductsUrl() { return GET_PRODUCTS_URL; }
    static GetCreateProductUrl(): string { return CREATE_PRODUCT_URL; }
    public static Host(): string { return HOST_URL || ""; }
    public static GetProductImagesUrl(): string { return PRODUCT_IMAGES_URL; }
}
