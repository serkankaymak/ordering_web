import { ProductModel } from "../ProductModels";
import { IModelValidator, IValidationResult } from "./AValidator";


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
