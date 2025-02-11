"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductAddOrUpdateComponent from "../components/ProductAddOrUpdateComponent";
import { CreateProductRequest } from "@/application/httpRequests/CreateProductRequest";
import { ProductService } from "@/application/services/product/ProductService";
import Toast from "@/shared/Toast";
import { CategoryModel, ProductModel } from "@/domain/ProductModels";


const productService = new ProductService();

const AddProductPage: React.FC = () => {
  const router = useRouter();
  const [productImages, setProductImages] = useState<string[]>([]); // ✅ State düzgün tanımlandı
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  useEffect(() => {
    productService.loadProductImages().then(() => {
      setProductImages(productService.avaibleProductImages)
    });
    productService.loadCategories().then(() => {
      setCategories(productService.categories)
    });

  }, []); // ✅ useEffect'in bağımlılık dizisi boş bırakıldı, sadece bir kez çalışacak


  // onSubmitClicked fonksiyonunu component içinde tanımlayabilirsiniz:
  const createProductHandler = (product: ProductModel, imageFormFile: File | null) => {
    productService.CreateProductAsync({
      name: product.name,
      price: product.price,
      imageFile: imageFormFile,
      categoryIds: product.categories.map(x => x.id),
      imagePath:product.getImagePathWithoutHost(),
    
    })
      .then(isSuccess => {
        if (isSuccess) {
          Toast.success("Product created");
        } else {
          Toast.error("Product creating unsuccessful");
        }
      })
      .catch((e: any) => {
        Toast.error("Product creating unsuccessful");
      });
  };



  return (
    <ProductAddOrUpdateComponent
      imageUrlList={productImages}
      onSubmitClicked={(product, imageFormFile) => {
        createProductHandler(product, imageFormFile);

      } } categories={[]}
    />
  );
};

export default AddProductPage;
