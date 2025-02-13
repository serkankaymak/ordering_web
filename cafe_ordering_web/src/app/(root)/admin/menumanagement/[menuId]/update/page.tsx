"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import MenuItemAddOrUpdateComponentContent from "../../components/MenuItemAddOrUpdateComponentContent";
import { Box, TextField, Button } from "@mui/material";
import { ProductService } from "@/application/services/product/ProductService";
import { IPage } from "@/app/types/ViewTypes";
import MenuItemAddOrUpdateComponent from "../../components/MenuItemAddOrUpdateComponent";

const UpdateMenuPage: IPage = () => {
    const router = useRouter();
    const params = useParams();
    const productId = params?.menuId;


    const [products, setProducts] = useState<ProductModel[]>([]);
    const [avaibleProductImages, setAvaibleProductImages] = useState<string[]>([]);
    const [productCategories, setProductCategories] = useState<CategoryModel[]>([]);
    const [menu, setMenu] = useState<ProductModel>(ProductModel.getEmptyInstance());


    useEffect(() => {
        if (productId) {
            const productService = new ProductService();
            productService.GetMenuWithCategoriesById(Number(productId)).then((menuResponse) => {
                console.log("menuResponse", menuResponse);
                if (menuResponse.data) { setMenu(menuResponse.data); }
            });
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
        }
    }, [productId]);



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

export default UpdateMenuPage;
