"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import AdminMenuItemAddOrUpdateComponent from "../../components/AdminMenuItemAddOrUpdateComponent";
import { Box } from "@mui/material";
import { useProductContext } from "@/app/providers/product.provider";
import { ProductService } from "@/application/services/product/ProductService";
import ArrayListStream from "@/shared/ArrayListStream";
import { Logcat } from "@/shared/LogCat";

const UpdateMenuPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const productId = params?.menuId;

    const [avaibleProductImages, setAvaibleProductImages] = useState<string[]>([]);
    const [productCategories, setproductCategories] = useState<CategoryModel[]>([]);
    const [product, setProduct] = useState<ProductModel | null>(null);

    useEffect(() => {
        if (productId) {
            const productService = new ProductService();
            productService.GetMenuWithCategoriesById(Number(productId)).then((menu) => { setProduct(menu.data!); })
            productService.loadProductImages().then(() => { setAvaibleProductImages(productService.avaibleProductImages); })
            productService.loadCategories().then(() => { setproductCategories(productService.categories) })
        }
    }, [productId]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!product) return;
    };



    return (
        <Box className='flex flex-col items-center justify-center' >
            <Box className=" w-[100%] md:w-[70%]">
                {product && <AdminMenuItemAddOrUpdateComponent
                    menu={product!}
                    avaibleProductImagePaths={avaibleProductImages}
                    categories={productCategories}>
                </AdminMenuItemAddOrUpdateComponent>}
            </Box>
        </Box>
    );
};

export default UpdateMenuPage;
