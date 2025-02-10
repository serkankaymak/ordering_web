"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation"; // Next.js 13 için useRouter
import { CategoryModel, ProductModel } from "@/domain/ProductModels";

const AddMenuPage: React.FC = () => {
    const router = useRouter();

    // Form alanları için state tanımlamaları
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [imageUrl, setImageUrl] = useState("");

    return (
        <>
            ...
        </>
    );
};

export default AddMenuPage;
