"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import MenuItemAddOrUpdateComponentContent from "../../components/MenuItemAddOrUpdateComponentContent";
import { Box, TextField, Button } from "@mui/material";
import { ProductService } from "@/application/services/product/ProductService";
import { IPage } from "@/app/types/ViewTypes";
import MenuItemAddOrUpdateComponent from "../../components/MenuItemAddOrUpdateComponent";
import { UpdateMenuCommand, UpdateMenuItemCommand } from "@/application/httpRequests/menu/UpdateMenuRequest";
import Toast from "@/shared/Toast";
import { ProductImageDto } from "@/application/dtos/ProductImageDto";


const productService = new ProductService();

const UpdateMenuPage: IPage = () => {
    const router = useRouter();
    const params = useParams();
    const productId = params?.menuId;

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [avaibleProductImages, setAvaibleProductImages] = useState<string[]>([]);
    const [avaibleProductImageDtos, setavaibleProductImageDtos] = useState<ProductImageDto[]>([]);
    const [productCategories, setProductCategories] = useState<CategoryModel[]>([]);
    const [menu, setMenu] = useState<ProductModel>(ProductModel.getEmptyProductInstance());


    useEffect(() => {
        if (productId) {

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
            });
            productService.loadProductImagesWithTags().then(response => {
                if (response.isSuccess) {
                    setavaibleProductImageDtos(response.data!);
                }
            })

        }
    }, [productId]);



    return (
        <Box className="flex flex-col items-center justify-center">
            <Box className="w-[100%] ">
                {menu && (
                    <MenuItemAddOrUpdateComponent
                        menu={menu}
                        products={products}
                        productCategories={productCategories}
                        avaibleProductImages={avaibleProductImages}
                        avaibleProductImageDtos={avaibleProductImageDtos}
                        onSubmitClicked={function (menu: ProductModel, imageFile) {
                            console.log(menu);
                            var _command = {} as UpdateMenuCommand;
                            var _menuItems = menu.products?.map(p => {
                                var _item = {} as UpdateMenuItemCommand;
                                _item.MenuItemId = p.id;
                                _item.Quantity = p.quantity;
                                return _item;
                            });

                            _command.MenuId = menu.id;
                            _command.menuItems = _menuItems!;
                            _command.categoryIds
                            _command.description = menu.description;
                            _command.name = menu.name;
                            _command.price = menu.price;
                            _command.imagePath = menu.getImagePathWithoutHost();
                            _command.imageFile = imageFile;
                            _command.categoryIds = menu.categories.map(x => x.id);
                            console.log(_command);
                            productService.UpdateMenuAsync(_command).then(response => {
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

export default UpdateMenuPage;
