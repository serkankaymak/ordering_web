
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;
const BASE_APİ_URL = process.env.NEXT_PUBLIC_HOST_URL + "/api";
const PRODUCT_URL = `${BASE_APİ_URL}/Product`
const MENU_URL = `${BASE_APİ_URL}/Menu`
const ORDER_URL = `${BASE_APİ_URL}/Order`
const DİSCOUNT_URL = `${BASE_APİ_URL}/Discount`
const USER_URL = `${BASE_APİ_URL}/User`



const GET_USERLOGİN_URL = `${USER_URL}/login`;
const GET_USERSİGNİN_URL = `${USER_URL}/signin`;


const PRODUCT_IMAGES_URL = `${PRODUCT_URL}/productimages`;
const CREATE_PRODUCT_URL = `${PRODUCT_URL}/createproduct`;
const DELETE_PRODUCT_URL = `${PRODUCT_URL}/deleteproduct`;
const UPDATE_PRODUCT_URL = `${PRODUCT_URL}/updateproduct`;
const GET_PRODUCTS_URL = `${PRODUCT_URL}/products`;
const GET_CATEGORİES_URL = `${PRODUCT_URL}/categories`;

const GET_MENUS_URL = `${MENU_URL}/menus`;
const CREATE_MENU_URL = `${MENU_URL}/createmenu`;
const UPDATE_MENU_URL = `${MENU_URL}/updatemenu`;


const GET_ORDER_URL = `${ORDER_URL}/orders`;
const GET_Unocompleted_Orders_URL = `${ORDER_URL}/unCompletedOrders`;
const UPDATE_ORDER_URL = `${ORDER_URL}/updateOrder`;
const CREATE_ORDER_URL = `${ORDER_URL}/createOrder`;


const GET_DİSCOUNTS_URL = `${DİSCOUNT_URL}/discounts`;
const CREATE_DİSCOUNT_URL = `${DİSCOUNT_URL}/creatediscount`;
const UPDATE_DİSCPUNT_URL = `${DİSCOUNT_URL}/updatediscount`;
const GET_awaibleDiscountsOfOrderedItems_URL = `${DİSCOUNT_URL}/awaibleDiscountsOfOrderedItems`;
const GET_orderedItemsHasDiscounts_URL = `${DİSCOUNT_URL}/orderedItemsHasDiscounts`;






export default class ApiUrls {
    static GetCreateOrderUrl(): string {
        return CREATE_ORDER_URL;
    }
    static GetUpdateOrderUrl(): string {
        return UPDATE_ORDER_URL;
    }
    static GetUnCompletedOrdersUrl() {
        return GET_Unocompleted_Orders_URL;
    }

    static GetOrderItemsCanHaveDiscountsUrl(): string {
        return GET_orderedItemsHasDiscounts_URL;
    }

    static GetAwaibleDiscountsOfOrderedItemsUrl(): string {
        return GET_awaibleDiscountsOfOrderedItems_URL;
    }
    static GetSigninUrl(): string {
        return GET_USERSİGNİN_URL;
    }
    static GetLoginUrl(): string {
        return GET_USERLOGİN_URL;
    }
    static GetUpdateDiscountUrl(): string {
        return UPDATE_DİSCPUNT_URL;
    }
    static GetCreateDiscountUrl(): string {
        return CREATE_DİSCOUNT_URL;
    }

    static GetDiscountUrl() { return DİSCOUNT_URL; }
    static GetDiscountsUrl(): string { return GET_DİSCOUNTS_URL; }
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
