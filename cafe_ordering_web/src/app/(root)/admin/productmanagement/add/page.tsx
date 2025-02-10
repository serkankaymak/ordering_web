"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import ProductAddOrUpdateComponent from "../components/ProductAddOrUpdateComponent";
import { fetchProductImages } from "@/application/httpRequests/FetchProductImages";

const AddProductPage: React.FC = () => {
  const router = useRouter();
  const [productImages, setProductImages] = useState<string[]>([]); // ✅ State düzgün tanımlandı

  useEffect(() => {
    fetchProductImages().then((urlList) => {
      console.log(urlList);
      setProductImages(urlList); // ✅ Doğrudan productImages değiştirilemez, setProductImages kullanılmalı
    });
  }, []); // ✅ useEffect'in bağımlılık dizisi boş bırakıldı, sadece bir kez çalışacak

  return (
    <ProductAddOrUpdateComponent 
      imageUrlList={productImages} 
      onSubmitClicked={(product, imageFormFile) => {
        // Ürünü kaydetme işlemi buraya eklenecek
      }} 
    />
  );
};

export default AddProductPage;
