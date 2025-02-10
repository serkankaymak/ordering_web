"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation"; // Next.js 13 için useRouter
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import AdminProductAddOrUpdateCard from "../components/AdminProductAddOrUpdateCard";

const AddProductPage: React.FC = () => {
  const router = useRouter();

  // Form alanları için state tanımlamaları
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Yeni ürün oluşturma (id olarak Date.now() kullanılıyor)
    const newProduct = new ProductModel(
      Date.now(), // Benzersiz id örneği
      title,
      description,
      price,
      imageUrl ? imageUrl : null
    );

    // Gerçek uygulamada burada API çağrısı yaparak veriyi sunucuya gönderebilirsiniz.
    console.log("Yeni Ürün Eklendi:", newProduct);
    alert("Ürün eklendi!");

    // İşlem sonrası ürünler listesi veya başka bir sayfaya yönlendirme
    router.push("/products");
  };

  return (
    <><AdminProductAddOrUpdateCard categories={CategoryModel.getExamples()}
      product={ProductModel.getExample(0)}
      onSaveClicked={function (product: ProductModel, imageFile?: File): void {
        throw new Error("Function not implemented.");
      }}></AdminProductAddOrUpdateCard></>
  );
};

export default AddProductPage;
