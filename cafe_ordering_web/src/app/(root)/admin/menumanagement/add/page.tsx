"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js 13 için useRouter
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import AdminMenuItemAddOrUpdateComponent from "../components/AdminMenuItemAddOrUpdateComponent";
import { ProductService } from "@/application/services/product/ProductService";
import { Logcat } from "@/shared/LogCat";


const productService = new ProductService();

const AddMenuPage: React.FC = () => {
    const [productCategories, setproductCategories] = useState<CategoryModel[]>([]);
    const [avaibleProductImages, setAvaibleProductImages] = useState<string[]>([]);

    useEffect(() => {
        productService.loadCategories().then(() => { setproductCategories(productService.categories) })
        productService.loadProductImages().then(() => {
            setAvaibleProductImages(productService.avaibleProductImages);
            Logcat.Debug(` AddMenuPage useEffect ${avaibleProductImages} `)
        })
    }, [])

    return (
        <>
            <AdminMenuItemAddOrUpdateComponent
                avaibleProductImagePaths={avaibleProductImages}
                categories={productCategories}>
            </AdminMenuItemAddOrUpdateComponent>
        </>
    );
};

export default AddMenuPage;
