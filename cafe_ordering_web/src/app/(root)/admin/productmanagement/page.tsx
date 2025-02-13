'use client'

import React, { useEffect, useState } from 'react';
import { ProductService } from '@/application/services/product/ProductService';
import { IPage } from '@/app/types/ViewTypes';
import ProductManagementPageContent from './pageContent';
import { ProductModel } from '@/domain/ProductModels';


const productService = new ProductService();

const ProductManagementPage: IPage = () => {
  // server side olunca ürün eklenince ve silinince , sayfa aynı kalıyor!
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    productService.loadProducts().then(response => {
      if (response.isSuccess) {
        setProducts(response.data!)
      }
    });
    const products = productService.products;
  }, [])

  return (
    <>
      <ProductManagementPageContent
        productsJson={JSON.stringify(products)}>
      </ProductManagementPageContent>
    </>
  );
};

// React.memo yerine normal export edebilirsiniz.
// Performans ihtiyacı varsa, alt bileşenlerde veya farklı yerlerde optimize kullanın.
export default ProductManagementPage;
