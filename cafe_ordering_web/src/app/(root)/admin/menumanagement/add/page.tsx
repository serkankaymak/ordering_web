"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js 13 için useRouter
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import MenuItemAddOrUpdateComponentContent from "../components/MenuItemAddOrUpdateComponentContent";
import { ProductService } from "@/application/services/product/ProductService";
import { Logcat } from "@/shared/LogCat";
import { Box } from "@mui/material";
import MenuItemAddOrUpdateComponent from "../components/MenuItemAddOrUpdateComponent";


const productService = new ProductService();

const AddMenuPage: React.FC = () => {

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [avaibleProductImages, setAvaibleProductImages] = useState<string[]>([]);
    const [productCategories, setProductCategories] = useState<CategoryModel[]>([]);
    const [menu, setMenu] = useState<ProductModel>(ProductModel.getEmptyInstance());


    useEffect(() => {
        productService.loadProductImages().then(() => { setAvaibleProductImages(productService.avaibleProductImages); });
        productService.loadCategories().then(() => {
            setProductCategories(productService.categories);
        });

        productService.loadProducts().then(res => {
            if (res.isSuccess) {
                productService.loadMenus().then(res => {
                    if (res.isSuccess) { setProducts([...productService.products, ...productService.menus]) }
                })
            }
        })

    }, []);


    return (
        <Box className="flex flex-col items-center justify-center">
            <Box className="w-[100%] md:w-[70%]">
                {menu && (
                    <MenuItemAddOrUpdateComponent
                        menu={menu}
                        products={products}
                        productCategories={productCategories}
                        avaibleProductImages={avaibleProductImages}
                        onSubmitClicked={function (menu: ProductModel) {
                        }}>
                    </MenuItemAddOrUpdateComponent>
                )}
            </Box>
        </Box>
    );
};

export default AddMenuPage;
