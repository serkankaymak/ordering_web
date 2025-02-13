"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import ProductAddOrUpdateComponent from "../../components/ProductAddOrUpdateComponent";
import { ProductService } from "@/application/services/product/ProductService";
import Toast from "@/shared/Toast";
import { UpdateProductValidator } from "@/domain/validators/UpdateProductValidator";



const productService = new ProductService();

const UpdateProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams(); // Dinamik parametreleri almak için
  const productId = params?.productId;
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [productsImages, setProductsImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    productService.loadProductImages().then(() => { setProductsImages(productService.avaibleProductImages) })
    productService.loadCategories().then(() => { setCategories(productService.categories) })

    if (productId) {
      productService.GetProductWithCategoriesById(Number(productId)).then(p => {
        console.log(p);
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
          Toast.success("Product updated");
        } else {
          Toast.error("Product updated unsuccessful");
        }
      })
      .catch((e: any) => {
        Toast.error("Product updated unsuccessful");
      });
  };


  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <ProductAddOrUpdateComponent product={product!} onSubmitClicked={(updatedProduct, formfile) => {
        const validationResult = new UpdateProductValidator(updatedProduct as ProductModel).validate();
        if (validationResult.isValid == false) { Toast.error(validationResult.message!); return; }
        updateProductHandler(updatedProduct, formfile);
      }} imageUrlList={productsImages} categories={categories} />
    </>
  );
};

export default UpdateProductPage;
