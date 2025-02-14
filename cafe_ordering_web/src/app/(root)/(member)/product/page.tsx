
import React, { } from 'react';


import { ProductProvider } from '@/app/providers/product.provider';
import MenuPageContent from './pageContent';
import { IPage } from '@/app/types/ViewTypes';

//const _products = ProductModel.getExamples();
//const _productDetail: ProductDetailModel | null = null;



const MenuPage: IPage = () => (
  <ProductProvider>
    <MenuPageContent />
  </ProductProvider>
);

export default MenuPage;


