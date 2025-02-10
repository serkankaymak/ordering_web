"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import AdminProductAddOrUpdateCard from "../../components/trash/AdminProductAddOrUpdateCard";
import ProductAddOrUpdateComponent from "../../components/ProductAddOrUpdateComponent";

const UpdateProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams(); // Dinamik parametreleri almak için
  const productId = params?.productId;
  const [product, setProduct] = useState<ProductModel | null>(null);


  useEffect(() => {
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
        console.log(JSON.stringify(updatedProduct))
      }} ></ProductAddOrUpdateComponent>
    </>
  );
};

export default UpdateProductPage;
