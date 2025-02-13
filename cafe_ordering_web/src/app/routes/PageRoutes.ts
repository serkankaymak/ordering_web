

export class AppRoutes {
    // **Menü Yönetimi**
    static readonly MenuManagement = '/admin/menumanagement';
    static MenuManagementAdd(): string { return `${this.MenuManagement}/add`; }
    static MenuManagementUpdate(id: string): string { return `${this.MenuManagement}/update/${id}`; }
    // **Ürün Yönetimi**
    static readonly ProductManagement = '/admin/productmanagement';
    static ProductManagementAdd(): string { return `${this.ProductManagement}/add`; }
    static ProductManagementUpdate(id: string): string { return `${this.ProductManagement}/update/${id}`; }
    // **İndirim Yönetimi**
    static readonly DiscountManagement = '/admin/discountmanagement';
    static DiscountManagementAdd(): string { return `${this.DiscountManagement}/add`; }
    static DiscountManagementAddUpdate(id: string): string { return `${this.DiscountManagement}/update/${id}`; }
}
