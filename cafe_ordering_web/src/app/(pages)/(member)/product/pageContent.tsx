'use client';

import React, { JSX, use, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Paper, useTheme } from '@mui/material';
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
import { CheckBox } from '@mui/icons-material';
import { useSitePreferencesContext } from '@/app/providers/global.providers/sitePreferences.provider';
import { useUserContext } from '@/app/providers/global.providers/user.provider';
import { SitePreferenceModel } from '@/app/api/preferences/SitePreferenceModel';
import DiscountsOfOrderBottomSheet from './components/BottomSheets/DiscountsOfOrderBottomSheet';

interface MenuPageContentProps { }

class MenuPageContentHelper {
    private products: ProductModel[];

    constructor(products: ProductModel[]) {
        this.products = products;
    }

    extractCategoriesFromProducts(): CategoryModel[] {
        const categories = ArrayListStream.fromEmpty<CategoryModel>();
        this.products.forEach((p) => categories.addAll(p.categories));
        return categories.getUniqueList((x) => x?.id).toList();
    }

    getCategoryById(categoryId: number): CategoryModel | undefined {
        return this.extractCategoriesFromProducts().find((x) => x.id === categoryId);
    }

    getProductsGroupedByCategoryId(): Map<number | undefined, ArrayListStream<ProductModel>> {
        const productsArray = ArrayListStream.fromList(this.products.filter((x) => x != null));
        return productsArray.groupByMulti(
            (product) => product!.categories,
            (category) => category?.id
        );
    }
}

const MenuPageContent: IPageContent<MenuPageContentProps> = () => {
    const isMediumScreen = useMyMediaQuery(Breakpoints.MEDIUM, 'max');
    const { products, addProductToOrder } = useProductContext();
    const [isOpenProductDetailBottomSheet, setOpenProductDetailBottomSheet] = useState<boolean>(false);
    const [isAddOrUpdateCommentBottomSheetOpen, setAddOrUpdateCommentBottomSheetOpen] = useState<boolean>(false);
    const [productDetail, setProductDetail] = useState<ProductModel | null>(null);

    const { sitePreferences, updatePreferences } = useSitePreferencesContext();
    const { user } = useUserContext();

    const helper = new MenuPageContentHelper(products);

    const handleOrderClick = (productId: number) => {
        addProductToOrder(productId);
        Toast.success("Ürün sepete eklendi.");
    };

    const handleInvestigateClick = (productId: number) => {
        const product = products.find((x) => x.id === productId);
        if (product) {
            setProductDetail(product);
            setOpenProductDetailBottomSheet(true);
        }
    };

    const renderProductSections = (): JSX.Element[] => {
        const views: JSX.Element[] = [];

        // Menüler bölümü
        const menuProducts = products.filter((x) => x.products?.length! > 0);
        if (menuProducts.length > 0) {
            views.push(
                <ProductListSection
                    title="Menüler"
                    key="menuler"
                    sectionId="menuler"
                    products={menuProducts}
                    onAnyOrderClick={handleOrderClick}
                    onAnyInvestigateClick={handleInvestigateClick}
                />
            );
        }

        // Kategorilere göre gruplanmış ürünler
        helper.getProductsGroupedByCategoryId().forEach((val, key) => {
            const category = helper.getCategoryById(key!);
            views.push(
                <ProductListSection
                    key={key ?? 'unknown'}
                    title={category?.name ?? 'Bilinmeyen Kategori'}
                    sectionId={(key ?? 'unknown').toString()}
                    products={val.toList()}
                    onAnyOrderClick={handleOrderClick}
                    onAnyInvestigateClick={handleInvestigateClick}
                />
            );
        });

        return views;
    };

    return (
        <Box>
            {/* Sticky Header */}
            <Paper variant="elevation" elevation={10}
                className="sticky top-0 z-10 min-h-[60px] flex items-center justify-center">
                <Box className="overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-500">
                    <Button size={isMediumScreen ? 'small' : 'medium'} color="secondary" variant="contained" sx={{ margin: 0.3 }}>
                        <a href="#menuler">Menüler</a>
                    </Button>
                    {helper.extractCategoriesFromProducts().map((category, index) => (
                        <Button key={`${category.id}_${index}`} size={isMediumScreen ? 'small' : 'medium'} color="secondary" variant="contained" sx={{ margin: 0.3 }}>
                            <a href={`#${category.id}`}>{category.name}</a>
                        </Button>
                    ))}
                </Box>
            </Paper>

            {/* Sepet Butonu */}
            <Box className="sticky top-[80px] mt-3 me-5 z-40 flex justify-end">
                <CartButtonComponent
                    onViewClicked={(productId: number) => {
                        const product = products.find((x) => x.id === productId);
                        if (product) {
                            setProductDetail(product);
                            setOpenProductDetailBottomSheet(true);
                        }
                    }}
                />
            </Box>

            {/* Ana İçerik */}
            <Box className="flex flex-col items-center p-0">
                <Box className="w-[100%] md:w-[80%]">


                    {user && <>
                        <Box className="flex flex-col gap-0">
                            <FormControlLabel
                                sx={{ "& .MuiTypography-root": { fontSize: 15 }, }}
                                className='text-wrap text-sm'
                                onChange={(e: any) => {
                                    const previous = sitePreferences;
                                    const updated = sitePreferences?.copy({ useTransitionableProductCard: !previous?.useTransitionableProductCard })
                                    updatePreferences(updated!);
                                }}
                                control={<Checkbox checked={sitePreferences?.useTransitionableProductCard ?? false} />}
                                label="Use transitionable product card description"
                            />

                            <FormControlLabel
                                sx={{ "& .MuiTypography-root": { fontSize: 15 }, }}
                                className='text-wrap text-sm'
                                onChange={(e: any) => {
                                    const previous = sitePreferences;
                                    const updated = sitePreferences?.copy({ showNameAndPriceOnProductCard: !previous?.showNameAndPriceOnProductCard })
                                    updatePreferences(updated!);
                                }}
                                control={<Checkbox checked={sitePreferences?.showNameAndPriceOnProductCard} />}
                                label="Show product name and price on product card"
                            />

                        </Box>
                    </>}


                    {renderProductSections()}
                    <ProductDetailBottomSheet
                        onAddCommentClicked={() => setAddOrUpdateCommentBottomSheetOpen(true)}
                        onCloseClicked={() => setOpenProductDetailBottomSheet(false)}
                        product={productDetail ?? ProductModel.getEmptyInstance()}
                        isOpen={isOpenProductDetailBottomSheet}
                    />
                    <AddOrUpdateCommentBottomSheet
                        isOpen={isAddOrUpdateCommentBottomSheetOpen}
                        performOnCloseClicked={() => setAddOrUpdateCommentBottomSheetOpen(false)}
                        onSaved={() => setAddOrUpdateCommentBottomSheetOpen(false)}
                    />

                   

                </Box>
            </Box>
        </Box>
    );
};

export default React.memo(MenuPageContent);