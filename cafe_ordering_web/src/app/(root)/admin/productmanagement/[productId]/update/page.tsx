"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import AdminProductAddOrUpdateCard from "../../components/AdminProductAddOrUpdateCard";

const UpdateProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams(); // Dinamik parametreleri almak için
  const productId = params?.productId;

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    console.log(productId);
    if (productId) {
      // Örnek ürün çekme: Gerçek uygulamada API çağrısı yapabilirsiniz.
      const prod = ProductModel.getExample(Number(productId));
      console.log(prod);
      setProduct(prod);
      setTitle(prod.productTitle);
      setDescription(prod.productDescription);
      setPrice(prod.price);
      setImageUrl(prod.imageUrl || "");
    }
  }, [productId]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;

    // Ürün bilgilerini güncelleme
    product.productTitle = title;
    product.productDescription = description;
    product.price = price;
    product.imageUrl = imageUrl ? imageUrl : null;

    // Gerçek uygulamada API aracılığıyla güncelleme işlemi yapabilirsiniz.
    console.log("Güncellenmiş Ürün:", product);
    alert("Ürün güncellendi!");

    // İşlem sonrası yönlendirme yapılabilir
    router.push("/products");
  };

  if (!product) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <AdminProductAddOrUpdateCard categories={CategoryModel.getExamples()} product={product} onSaveClicked={function (product: ProductModel, imageFile?: File): void {
        throw new Error("Function not implemented.");
      }}></AdminProductAddOrUpdateCard>
    </>
  );
};

export default UpdateProductPage;
