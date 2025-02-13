'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo } from 'react';
import { ProductModel } from '@/domain/ProductModels';
import { ProductService } from '@/application/services/product/ProductService';
import ArrayListStream from '@/shared/ArrayListStream';
import { Logcat } from '@/shared/LogCat';
import { OrderItemModel } from '@/domain/OrderModels';
import { OrderService } from '@/application/services/product/OrderService';

interface ProductContextType {
  products: ProductModel[];
  orderedProducts: OrderItemModel[];
  addProductToOrder: (productId: number) => void;
  removeProductFromOrder: (productId: number) => void;
  clearProductFromOrder: (productId: number) => void;
  clearOrder: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {

  //useMemo --> sayesinde useEffect gereksiz yere çalışmaz ve performans kaybı yaşamazsın.
  const productService = useMemo(() => new ProductService(), []);
  const orderService = useMemo(() => new OrderService(), []);
  const [products, setProducts] = useState<ProductModel[]>([]);

  const [orderedProducts, setOrderedProducts] = useState<OrderItemModel[]>(
    orderService.orderedProducts
      .map(p => { p.product = products.find(x => x.id == p.productId) ?? null; return p })
      .filter(x => x.quantity != 0)
  );


  const loadProducts = () => {
    productService.loadProducts().then(response1 => {
      if (response1.isSuccess) {
        productService.loadMenus().then(response2 => {
          if (response2.isSuccess) {
            const d = [...response1.data!, ...response2.data!]
            setProducts(d);
          }
          else throw new Error("");
        })
      }
      else throw new Error("");
    })
  }

  useEffect(() => {
    loadProducts();
    Logcat.Debug(`productProvider useEffect executed`);
    orderService.addProductAddedToOrderListener(productAddedOrRemovedOrCleanedFromOrderListener);
    orderService.addProductRemovedFromOrderListener(productAddedOrRemovedOrCleanedFromOrderListener);
    orderService.addProductClearedFromOrderListener(productAddedOrRemovedOrCleanedFromOrderListener);
    orderService.addOrderClearedListener(performOnOrderedProductsChanged);
    return () => { };
    //Bu useEffect’in her render'da tetiklenmesine neden olabilir çünkü ProductService ve OrderService her render'da yeniden oluşturuluyor. Sürekli event listener eklenmesi ve olası bellek sızıntısı (memory leak) olabilir.
  }, [productService, orderService]); // instance daki değişiklikleri algıla...

  const performOnOrderedProductsChanged = () => {
    const _orderedProducts = orderService.orderedProducts.filter(x => x.quantity != 0);
    _orderedProducts.forEach(oP => { oP.product = products.find(x => x.id == oP.productId)! })
    setOrderedProducts(_orderedProducts);
  }

  const productAddedOrRemovedOrCleanedFromOrderListener = (product: ProductModel) => {
    performOnOrderedProductsChanged();
    Logcat.Debug(`product added|removed|cleaned from basket.   ${JSON.stringify(product.id)}`);
  };



  // order a product ekle
  const addProductToOrder = (productId: number) => { orderService.addProductToOrder(ArrayListStream.fromList(products).firstOrDefault(x => x?.id == productId)!); };
  // order dan product 1 tane var ise sil fazla var ise 1 tanesini sil
  const removeProductFromOrder = (productId: number) => { orderService.removeProductFromOrder(ArrayListStream.fromList(products).firstOrDefault(x => x?.id == productId)!); };
  // orderdan product ı tamamen sil, sayısı kaç olursa olsun
  const clearProductFromOrder = (productId: number) => { orderService.clearProductFromOrder(ArrayListStream.fromList(products).firstOrDefault(x => x?.id == productId)!); };
  // order ı temizle
  const clearOrder = () => { orderService.clearOrder(); }

  return (
    <ProductContext.Provider value={{ products, orderedProducts, addProductToOrder, removeProductFromOrder, clearProductFromOrder, clearOrder }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) { throw new Error('useProductContext must be used within a ProductProvider'); }
  return context;
};
