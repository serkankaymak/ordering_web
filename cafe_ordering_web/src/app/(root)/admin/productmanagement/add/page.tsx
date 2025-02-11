"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductAddOrUpdateComponent from "../components/ProductAddOrUpdateComponent";
import { fetchProductImages } from "@/application/httpRequests/FetchProductImages";
import { CreateProductRequest } from "@/application/httpRequests/CreateProductRequest";

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
        CreateProductRequest.send({
          name: product.name,
          price: product.price,
          imageFile: imageFormFile,
          categoryIds: product.categories.map(x => x.id),
        }).then((isSuccess) => {
          if (isSuccess) {
            alert("succes");
           }
          else { }
        }).catch((e: any) => { });
      }}

    />
  );
};

export default AddProductPage;
