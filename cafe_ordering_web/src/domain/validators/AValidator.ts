// Doğrulama sonucunu temsil eden arayüz (interface)
export interface IValidationResult {
    isValid: boolean;
    message?: string | null;
    messages?: string[] | null;
}

export interface IModelValidator {
    validate(): IValidationResult;
}