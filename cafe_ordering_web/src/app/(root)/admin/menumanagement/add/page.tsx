"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js 13 için useRouter
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import MenuItemAddOrUpdateComponentContent from "../components/MenuItemAddOrUpdateComponentContent";
import { ProductService } from "@/application/services/product/ProductService";
import { Logcat } from "@/shared/LogCat";
import { Box } from "@mui/material";
import MenuItemAddOrUpdateComponent from "../components/MenuItemAddOrUpdateComponent";
import { CreateMenuCommand, CreateMenuItemCommand } from "@/application/httpRequests/menu/CreateMenuRequest";
import Toast from "@/shared/Toast";


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
                        onSubmitClicked={(menu, imageFile) => {

                            var _command = {} as CreateMenuCommand;
                            var _menuItems = menu.products?.map(p => {
                                var _item = {} as CreateMenuItemCommand;
                                _item.MenuItemId = p.id;
                                _item.Quantity = p.quantity;
                                return _item;
                            });


                            _command.menuItems = _menuItems!;
                            _command.categoryIds
                            _command.description = menu.description;
                            _command.name = menu.name;
                            _command.price=menu.price;
                            _command.imagePath = menu.getImagePathWithoutHost();
                            _command.imageFile = imageFile;
                            _command.categoryIds = menu.categories.map(x=>x.id);

                            productService.CreateMenuAsync(_command).then(response => {
                                if (response.isSuccess) { Toast.success(); }
                                else { Toast.error(); }
                            });

                        }}>
                    </MenuItemAddOrUpdateComponent>
                )}
            </Box>
        </Box>
    );
};

export default AddMenuPage;
