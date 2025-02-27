"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import ProductAddOrUpdateComponent from "../../components/ProductAddOrUpdateComponent";
import { ProductService } from "@/application/services/product/ProductService";
import Toast from "@/shared/Toast";
import { UpdateProductValidator } from "@/domain/validators/UpdateProductValidator";
import { ProductImageDto } from "@/application/dtos/ProductImageDto";



const productService = new ProductService();

const UpdateProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams(); // Dinamik parametreleri almak için
  const productId = params?.productId;
  const [product, setProduct] = useState<ProductModel>(ProductModel.getEmptyProductInstance());
  const [productsImages, setProductsImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [avaibleProductImageDtos, setavaibleProductImageDtos] = useState<ProductImageDto[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {

    if (product.id == Number(productId!)) return;

    productService.loadProductImages().then(() => { setProductsImages(productService.avaibleProductImages) })
    productService.loadCategories().then(() => { setCategories(productService.categories) })
    productService.loadProductImagesWithTags().then(response => {
      if (response.isSuccess) {
        setavaibleProductImageDtos(response.data!);
      }
    })

    if (productId) {
      productService.GetProductWithCategoriesById(Number(productId)).then(p => {
        setProduct(p.data!);
        setIsLoading(false);
      });
    }
  }, [productId]);





  const updateProductHandler = (product: ProductModel, imageFormFile: File | null) => {


    productService.UpdateProductAsync({
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageFile: imageFormFile,
      categoryIds: product.categories.map(x => x.id),
      imagePath: product.getImagePathWithoutHost(),
    })
      .then(isSuccess => {
        if (isSuccess) {

        } else {

        }
      })
      .catch((e: any) => {

      });
  };


  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <ProductAddOrUpdateComponent
        avaibleProductImageDtos={avaibleProductImageDtos}
        product={product!}
        onSubmitClicked={(updatedProduct, formfile) => {
          const validationResult = new UpdateProductValidator(updatedProduct as ProductModel).validate();
          if (validationResult.isValid == false) { Toast.error(validationResult.message!); return; }
          updateProductHandler(updatedProduct, formfile);
        }} avaibleProductImagePaths={productsImages} categories={categories} />
    </>
  );
};

export default UpdateProductPage;
