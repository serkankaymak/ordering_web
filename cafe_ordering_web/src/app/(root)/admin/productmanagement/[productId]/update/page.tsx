"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import AdminProductAddOrUpdateCard from "../../components/trash/AdminProductAddOrUpdateCard";
import ProductAddOrUpdateComponent from "../../components/ProductAddOrUpdateComponent";
import { fetchProductImages } from "@/application/httpRequests/FetchProductImages";

const UpdateProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams(); // Dinamik parametreleri almak için
  const productId = params?.productId;
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [productsImages, setProductsImages] = useState<string[]>([]);


  useEffect(() => {
    fetchProductImages().then((images) => { setProductsImages(images) });
    console.log(productId);
    if (productId) {
      const prod = ProductModel.getExample(Number(productId));
      setProduct(prod);
    }
  }, [productId]);



  if (!product) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <ProductAddOrUpdateComponent product={product} onSubmitClicked={(updatedProduct) => {
        console.log(JSON.stringify(updatedProduct));
      }} imageUrlList={productsImages} ></ProductAddOrUpdateComponent>
    </>
  );
};

export default UpdateProductPage;
