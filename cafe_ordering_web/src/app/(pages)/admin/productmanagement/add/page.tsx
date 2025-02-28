"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductAddOrUpdateComponent from "../components/ProductAddOrUpdateComponent";
import { CreateProductRequest } from "@/application/httpRequests/product/CreateProductRequest";
import { ProductService } from "@/application/services/product/ProductService";
import Toast from "@/shared/Toast";
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import { AppRoutes } from "@/app/routes/PageRoutes";
import { ProductImageDto } from "@/application/dtos/ProductImageDto";


const productService = new ProductService();

const AddProductPage: React.FC = () => {
  const router = useRouter();
  const [productImages, setProductImages] = useState<string[]>([]); // ✅ State düzgün tanımlandı
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [avaibleProductImageDtos, setavaibleProductImageDtos] = useState<ProductImageDto[]>([]);



  useEffect(() => {
    productService.loadProductImages().then(() => {
      setProductImages(productService.avaibleProductImages)
    });
    productService.loadCategories().then(() => {
      setCategories(productService.categories)
    });

    productService.loadProductImagesWithTags().then(response => {
      if (response.isSuccess) {
        setavaibleProductImageDtos(response.data!);
      }
    })

  }, []);


  // onSubmitClicked fonksiyonunu component içinde tanımlayabilirsiniz:
  const createProductHandler = (product: ProductModel, imageFormFile: File | null) => {
    productService.CreateProductAsync({
      description: product.description,
      name: product.name,
      price: product.price,
      imageFile: imageFormFile,
      categoryIds: product.categories.map(x => x.id),
      imagePath: product.getImagePathWithoutHost(),

    })
      .then(isSuccess => {
        if (isSuccess) {
          router.push(AppRoutes.ProductManagement);
          Toast.success("Product created");
        } else {

        }
      })
      .catch((e: any) => {

      });
  };


  return (
    <ProductAddOrUpdateComponent
      avaibleProductImageDtos={avaibleProductImageDtos}
      avaibleProductImagePaths={productImages}
      onSubmitClicked={(product, imageFormFile) => {
        createProductHandler(product, imageFormFile);

      }} categories={categories}
    />
  );
};

export default AddProductPage;
