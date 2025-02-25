export class ProductImageDto {
    path: string;
    tags: string[];
  
    constructor(data?: Partial<ProductImageDto>) {
      this.path = data?.path ?? "";
      this.tags = data?.tags ?? [];
    }
  
    static fromJson(json: Partial<ProductImageDto>): ProductImageDto {
      var dto =  new ProductImageDto(json);
      return dto;
    }
  }
  