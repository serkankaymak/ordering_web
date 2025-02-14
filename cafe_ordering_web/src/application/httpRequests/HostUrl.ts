
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;
const BASE_APİ_URL = process.env.NEXT_PUBLIC_HOST_URL + "/api";
const PRODUCT_URL = `${BASE_APİ_URL}/Product`
const MENU_URL = `${BASE_APİ_URL}/Menu`


const PRODUCT_IMAGES_URL = `${PRODUCT_URL}/productimages`;
const CREATE_PRODUCT_URL = `${PRODUCT_URL}/createproduct`;
const DELETE_PRODUCT_URL = `${PRODUCT_URL}/deleteproduct`;
const UPDATE_PRODUCT_URL = `${PRODUCT_URL}/updateproduct`;
const GET_PRODUCTS_URL = `${PRODUCT_URL}/products`;
const GET_CATEGORİES_URL = `${PRODUCT_URL}/categories`;

const GET_MENUS_URL = `${MENU_URL}/menus`;
const CREATE_MENU_URL = `${MENU_URL}/createmenu`;
const UPDATE_MENU_URL = `${MENU_URL}/updatemenu`;

export default class ApiUrls {
    static GetCreateMenuUrl(): string { return CREATE_MENU_URL; }
    static GetUpdateMenuUrl(): string { return UPDATE_MENU_URL; }
    static GetUpdateProductUrl() { return UPDATE_PRODUCT_URL; }
    static GetCategoriesUrl() { return GET_CATEGORİES_URL; }
    static GetProductsUrl() { return GET_PRODUCTS_URL; }
    static GetMenusUrl() { return GET_MENUS_URL; }
    static GetCreateProductUrl(): string { return CREATE_PRODUCT_URL; }
    static GetDeleteProductUrl(): string { return DELETE_PRODUCT_URL; }
    static Host(): string { return HOST_URL || ""; }
    static GetProductImagesUrl(): string { return PRODUCT_IMAGES_URL; }
    static GetProductUrl(): string { return PRODUCT_URL; }
    static GetMenuUrl(): string { return MENU_URL; }
}
