import { ProductModel } from "../ProductModels";

// Doğrulama sonucunu temsil eden arayüz (interface)
export interface IValidationResult {
    isValid: boolean;
    message: string;
}

interface IModelValidator{
    validate(): IValidationResult;
}

export class CreateProductValidator implements IModelValidator {
    public product: ProductModel;

    constructor(product: ProductModel) {
        this.product = product;
    }

    public validate(): IValidationResult {
        if (!this.product.name || this.product.name.trim() === "") {
            return { isValid: false, message: "Product name is required." };
        }
        if (this.product.price <= 0) {
            return { isValid: false, message: "Product price must be greater than zero." };
        }
        if (!this.product.description || this.product.description.trim() === "") {
            return { isValid: false, message: "Product description is required." };
        }
        return { isValid: true, message: "Product is valid." };
    }
}


export class UpdateProductValidator implements IModelValidator {
    public product: ProductModel;

    constructor(product: ProductModel) {
        this.product = product;
    }
    public validate(): IValidationResult {

        if (!this.product.name || this.product.name.trim() === "") {
            return { isValid: false, message: "Product name is required." };
        }
        if (this.product.price <= 0) {
            return { isValid: false, message: "Product price must be greater than zero." };
        }
        if (!this.product.description || this.product.description.trim() === "") {
            return { isValid: false, message: "Product description is required." };
        }

        return { isValid: true, message: "Product is valid." };
    }
}
