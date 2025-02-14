'use client';

import React, { JSX, useState } from 'react';
import { Box, Button, useTheme, } from '@mui/material';

import ArrayListStream from '@/shared/ArrayListStream';
import ProductListSection from './components/product/ProductListSection';
import ProductDetailBottomSheet from './components/BottomSheets/ProductDetailBottomSheet';

import Toast from '@/shared/Toast';
import CartButtonComponent from './components/order/CartPanelComponent';
import useMyMediaQuery, { Breakpoints } from '@/shared/hooks/UseMediaQuery';
import AddOrUpdateCommentBottomSheet from './components/BottomSheets/AddCommentBottomSheet';
import { useProductContext, ProductProvider } from '@/app/providers/product.provider';
import { CategoryModel, ProductModel } from '@/domain/ProductModels';
import { IPageContent } from '@/app/types/ViewTypes';


interface MenuPageContentProps { }

const MenuPageContent: IPageContent<MenuPageContentProps> = () => {
    const isMediumScreen = useMyMediaQuery(Breakpoints.MEDIUM, 'max');

    const theme = useTheme();
    const { products, addProductToOrder } = useProductContext();
    const [isOpenProductDetailBottomSheet, setOpenProductDetailBottomSheet] = useState<boolean>(false);
    const [isAddOrUpdateCommentBottomSheetOpen, setAddOrUpdateCommentBottomSheetOpen] = useState<boolean>(false);
    const [productDetail, setProductDetail] = useState<ProductModel | null>(null);

    const extractCategoriesFromProducts = (): CategoryModel[] => {
        const categories: ArrayListStream<CategoryModel> = ArrayListStream.fromEmpty();
        products.forEach((p) => categories.addAll(p.categories));
        const _categories = categories.getUniqueList((x) => x?.id).toList();
        return _categories;
    };

    const getCategoryById = (categoryId: number): CategoryModel | undefined =>
        extractCategoriesFromProducts().find((x) => x.id === categoryId);

    const getProductsGroupedByCategoryId = (products: ProductModel[]) => {
        const productsArray = ArrayListStream.fromList(products.filter((x) => x != null));
        return productsArray.groupByMulti(
            (product) => product!.categories,
            (category) => category?.id
        );
    };

    const getContent = () => {
        const views: JSX.Element[] = [];

        const boxProducts = <ProductListSection
            title={'menuler'}
            sectionId={"0"}
            products={products.filter(x => x.products?.length! > 0)}
            onAnyOrderClick={(productId: number) => {
                console.log(productId);
                addProductToOrder(productId);
                Toast.success("success");
            }}
            onAnyInvestigateClick={(productId: number) => {
                setProductDetail(products.filter(x => x.id == productId)[0]);
                setOpenProductDetailBottomSheet(true);
            }}
        />
        views.push(boxProducts);


        getProductsGroupedByCategoryId(products).forEach((val, key) => {
            const category = getCategoryById(key!);
            const view = (
                <ProductListSection
                    key={key ?? 'unknown'}
                    title={category?.name ?? 'Unknown Category'}
                    sectionId={(key ?? 'unknown').toString()}
                    products={val.toList()}
                    onAnyOrderClick={(productId: number) => {
                        console.log(productId);
                        addProductToOrder(productId);
                        Toast.success("success");
                    }}
                    onAnyInvestigateClick={(productId: number) => {
                        setProductDetail(ProductModel.getExample(productId));
                        setOpenProductDetailBottomSheet(true);
                    }}
                />
            );
            views.push(view);
        });
        return views;
    };

    return (
        <Box className="" >
            {/* Sticky Header */}
            <Box sx={{ backgroundColor: theme.palette.background.default }}
                className="sticky top-0 z-10 min-h-[60px] flex  items-center justify-center">
                <Box className="overflow-x-auto
                 whitespace-nowrap   scrollbar-thin scrollbar-track-gray-200  scrollbar-thumb-gray-500">

                    <Button size={isMediumScreen ? 'small' : 'medium'} color='secondary' key={0}
                        variant='contained' sx={{ margin: 0.3 }}>
                        <a href={`#${0}`}>menuler</a>
                    </Button>

                    {extractCategoriesFromProducts().map((val, index) => (

                        <Button key={`${val.id}_${index}`} size={isMediumScreen ? 'small' : 'medium'} color='secondary'
                            variant='contained' sx={{ margin: 0.3 }}>
                            <a href={`#${val.id.toString()}`}>{val.name}</a>
                        </Button>
                    ))}

                </Box>
            </Box>

            {/* Main Content */}
            <Box className="sticky top-[80px] mt-3 me-5  z-40 flex justify-end ">
                <CartButtonComponent onViewClicked={function (productId: number): void {
                    setProductDetail(products.filter(x => x.id == productId)[0])
                    setOpenProductDetailBottomSheet(true);
                }} />
            </Box>

            {/* Main Content */}
            <Box className="flex flex-col items-center p-0">
                <Box className=" w-[100%] md:w-[80%]">
                    <AddOrUpdateCommentBottomSheet key={"?"} isOpen={isAddOrUpdateCommentBottomSheetOpen}
                        performOnCloseClicked={function (): void {
                            //setOpenProductDetailBottomSheet(false);
                            setAddOrUpdateCommentBottomSheetOpen(false);
                        }} onSaved={function (): void {
                            //setOpenProductDetailBottomSheet(false);
                            setAddOrUpdateCommentBottomSheetOpen(false);
                        }}>

                    </AddOrUpdateCommentBottomSheet>

                    <ProductDetailBottomSheet
                        onAddCommentClicked={() => {
                            //setOpenProductDetailBottomSheet(false);
                            setAddOrUpdateCommentBottomSheetOpen(true);
                        }}
                        onCloseClicked={() => {
                            setOpenProductDetailBottomSheet(false);
                        }}
                        product={productDetail ?? ProductModel.getEmptyInstance()}
                        isOpen={isOpenProductDetailBottomSheet}
                    />
                    {getContent()}
                </Box>
            </Box>

        </Box>
    );
};


export default React.memo(MenuPageContent);