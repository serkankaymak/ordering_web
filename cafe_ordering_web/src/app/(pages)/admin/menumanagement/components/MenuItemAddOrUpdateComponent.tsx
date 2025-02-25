"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useEffect, useState } from "react";
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import { Box } from "@mui/material";
import { IComponent } from "@/app/types/ViewTypes";
import MenuItemAddOrUpdateComponentContent from "./MenuItemAddOrUpdateComponentContent";
import { ProductImageDto } from "@/application/dtos/ProductImageDto";

interface MenuItemAddOrUpdateComponentProps {
    products: ProductModel[],
    menu?: ProductModel
    productCategories: CategoryModel[]
    avaibleProductImages: string[],
    avaibleProductImageDtos:ProductImageDto[],
    onSubmitClicked: (menu: ProductModel, imageFile: File | null) => void
}

const MenuItemAddOrUpdateComponent: IComponent<MenuItemAddOrUpdateComponentProps> = ({
    menu = ProductModel.getEmptyBoxInstance(),
    productCategories,
    products,
    avaibleProductImages,
    avaibleProductImageDtos,
    onSubmitClicked
}) => {

    const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null); // Kullanıcının yüklediği dosyayı saklar
    const [updatedMenu, setUpdatedMenu] = useState<ProductModel>(menu);
    const handleInputChange = (key: keyof ProductModel, value: any) => { setUpdatedMenu((prevMenu) => prevMenu.copy({ [key]: value })); };

    useEffect(() => {
        if (menu.id !== updatedMenu.id) {
            setUpdatedMenu(menu);
        }
        console.log("MenuItemAddOrUpdateComponent -> useEffect", menu);
    }, [menu.id])



    const handleCategoryToggle = (category: CategoryModel) => {
        setUpdatedMenu((prevState) => {
            const isSelected = prevState.categories.some((c) => c.id === category.id);
            const updatedCategories = isSelected
                ? prevState.categories.filter((c) => c.id !== category.id)
                : [...prevState.categories, category];
            return prevState.copy({ categories: updatedCategories });
        });
    };

    // Recursive yapıda ürün ekleme işlemi (örnek: üst menünün altındaki ürünleri güncelleme)
    const handleAddProduct = (productId: number) => {
        console.log(productId);
        setUpdatedMenu(prevState => {
            if (!prevState.products) return prevState;
            if (prevState.products.some(x => x.id == productId)) {
                const updatedProducts = prevState.products.map(p =>
                    p.id === productId ? p.copy({ quantity: p.quantity + 1 }) : p
                );
                return prevState.copy({ products: updatedProducts });
            }
            var newProduct = products.find(x => x.id == productId);
            console.log(newProduct);
            if (newProduct) {
                newProduct.parentBoxId = updatedMenu.id;
                newProduct.parent = updatedMenu;
                var updatedProducts = [...prevState.products, newProduct];
                return prevState.copy({ products: updatedProducts })
            }
            return prevState;
        });
    };

    const handleRemoveProduct = (productId: number) => {
        setUpdatedMenu(prevState => {
            if (!prevState.products) return prevState;
            const updatedProducts = prevState.products.map(p =>
                p.id === productId ? p.copy({ quantity: p.quantity - 1 }) : p
            );
            return prevState.copy({ products: updatedProducts });
        });
    };

    // Sadece state güncellemesi yapan fonksiyon, JSX döndürmeyecek.
    const handleClearProduct = (productId: number) => {
        setUpdatedMenu(prevState => {
            if (!prevState.products) return prevState;
            const updatedProducts = prevState.products.filter(x => x.id != productId).map(p => p.copy({}));
            return prevState.copy({ products: updatedProducts });
        });
    };

    return (
        <Box className="flex flex-col items-center justify-center">
            {false && <Box className="text-white">  {menu.id} </Box>}
            <Box className="w-[100%] md:w-[70%]">
                {menu && (
                    <MenuItemAddOrUpdateComponentContent

                        menu={updatedMenu}
                        avaibleProductImagePaths={avaibleProductImages}
                        avaibleProductImageDtos={avaibleProductImageDtos}
                        categories={productCategories}
                        onAddProduct={handleAddProduct}
                        onCategoryToggle={handleCategoryToggle}
                        onClearProduct={handleClearProduct}
                        onInputChange={handleInputChange}
                        onImageFileUploaded={(file) => {
                            setUploadedImageFile(file);
                        }}
                        onRemoveProduct={handleRemoveProduct}
                        onSubmitClicked={(menu) => {
                            onSubmitClicked(menu, uploadedImageFile)
                        }}
                        productsForProductSelector={products} />
                )}
            </Box>
        </Box>
    );
};

export default MenuItemAddOrUpdateComponent;
