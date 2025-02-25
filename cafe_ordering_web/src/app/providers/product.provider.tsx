'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo } from 'react';
import { ProductModel } from '@/domain/ProductModels';
import { ProductService } from '@/application/services/product/ProductService';
import ArrayListStream from '@/shared/ArrayListStream';
import { Logcat } from '@/shared/LogCat';
import { OrderItemModel } from '@/domain/OrderModels';
import { OrderService } from '@/application/services/product/OrderService';
import { DiscountModel } from '@/domain/DiscountModels';
import { DiscountService } from '@/application/services/discount/DiscountService';
import { useUserContext } from './global.providers/user.provider';
import { GetAwaibleDiscountsOfOrderedItemsRequestPayload } from '@/application/httpRequests/discount/GetAwaibleDiscountsOfOrderedItemsRequest';
import { OrderCanHaveDiscountDto } from '@/application/dtos/OrderCanHaveDiscountDto';
import { GetOrderItemsHasDiscountsRequestPayload } from '@/application/httpRequests/discount/GetOrderItemsHasDiscountsRequest';

interface ProductContextType {
  awaibleDiscounts: DiscountModel[];
  awaibleOrderDiscounts: OrderCanHaveDiscountDto[];
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

  const { user } = useUserContext();
  //useMemo --> sayesinde useEffect gereksiz yere çalışmaz ve performans kaybı yaşamazsın.
  const productService = useMemo(() => new ProductService(), []);
  const orderService = useMemo(() => new OrderService(), []);
  const discountService = useMemo(() => new DiscountService(), []);

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [orderedProducts, setOrderedProducts] = useState<OrderItemModel[]>(
    orderService.orderedProducts
      .map(p => { p.product = products.find(x => x.id == p.productId) ?? null; return p })
      .filter(x => x.quantity != 0)
  );

  const [awaibleDiscounts, setAwaibleDiscounts] = useState<DiscountModel[]>([]);
  const [awaibleOrderDiscounts, setAwaibleOrderDiscounts] = useState<OrderCanHaveDiscountDto[]>([]);

  const loadProducts = () => {
    productService.loadAllProductsAndMenus().then((response) => {
      setProducts(response.data!);
    })
  }

  const loadAwaibleDiscounts = (orderedProducts: OrderItemModel[]) => {
    if (orderedProducts == undefined || orderedProducts == null || orderedProducts.length == 0) {
      setAwaibleDiscounts([]);
      return;
    }
    var payload = { userId: user ? user.id : null, orderItems: [] } as GetAwaibleDiscountsOfOrderedItemsRequestPayload;
    orderedProducts.forEach(oi => {
      var item = { productId: oi.productId, quantity: oi.quantity };
      payload.orderItems.push(item);
    })
    discountService.getAwabileDiscountsOfOrderedItems(payload).then(response => {
      if (response.isSuccess) {
        setAwaibleDiscounts(response.data!)
      }
      else { setAwaibleDiscounts([]) }
    })
  }


  const loadAwaibleOrderDiscounts = (orderedProducts: OrderItemModel[]) => {
    if (orderedProducts == undefined || orderedProducts == null || orderedProducts.length == 0) {
      setAwaibleOrderDiscounts([]);
      return;
    }

    var payload = { userId: user ? user.id : null, orderItems: [] } as GetOrderItemsHasDiscountsRequestPayload;
    orderedProducts.forEach(oi => {
      var item = { productId: oi.productId, quantity: oi.quantity };
      payload.orderItems.push(item);
    })
    discountService.getOrderItemsHasDiscounts(payload).then(response => {
      if (response.isSuccess) {
        setAwaibleOrderDiscounts(response.data!)
      }
      else { setAwaibleDiscounts([]) }
    })
  }


  const productAddedOrRemovedOrCleanedFromOrderListener = (product: ProductModel) => {
    performOnOrderedProductsChanged();
    Logcat.Debug(`product added|removed|cleaned from basket.   ${JSON.stringify(product.id)}`);
  };

  useEffect(() => {
    Logcat.Debug(`productProvider useEffect executed`);
    loadProducts();
    loadAwaibleDiscounts(orderedProducts);
    loadAwaibleOrderDiscounts(orderedProducts);

    orderService.addProductAddedToOrderListener(productAddedOrRemovedOrCleanedFromOrderListener);
    orderService.addProductRemovedFromOrderListener(productAddedOrRemovedOrCleanedFromOrderListener);
    orderService.addProductClearedFromOrderListener(productAddedOrRemovedOrCleanedFromOrderListener);
    orderService.addOrderClearedListener(performOnOrderedProductsChanged);
    return () => { };
    //Bu useEffect’in her render'da tetiklenmesine neden olabilir çünkü ProductService ve OrderService her render'da yeniden oluşturuluyor. Sürekli event listener eklenmesi ve olası bellek sızıntısı (memory leak) olabilir.
  }, []); // instance daki değişiklikleri algıla...

  const performOnOrderedProductsChanged = () => {
    const _orderedProducts = orderService.orderedProducts.filter(x => x.quantity != 0);
    _orderedProducts.forEach(oP => { oP.product = products.find(x => x.id == oP.productId)! })
    setOrderedProducts(_orderedProducts);
    loadAwaibleDiscounts(_orderedProducts);
    loadAwaibleOrderDiscounts(_orderedProducts);
  }




  // order a product ekle
  const addProductToOrder = (productId: number) => { orderService.addProductToOrder(ArrayListStream.fromList(products).firstOrDefault(x => x?.id == productId)!); };
  // order dan product 1 tane var ise sil fazla var ise 1 tanesini sil
  const removeProductFromOrder = (productId: number) => { orderService.removeProductFromOrder(ArrayListStream.fromList(products).firstOrDefault(x => x?.id == productId)!); };
  // orderdan product ı tamamen sil, sayısı kaç olursa olsun
  const clearProductFromOrder = (productId: number) => { orderService.clearProductFromOrder(ArrayListStream.fromList(products).firstOrDefault(x => x?.id == productId)!); };
  // order ı temizle
  const clearOrder = () => { orderService.clearOrder(); }

  return (
    <ProductContext.Provider value={{ awaibleOrderDiscounts, awaibleDiscounts, products, orderedProducts, addProductToOrder, removeProductFromOrder, clearProductFromOrder, clearOrder }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) { throw new Error('useProductContext must be used within a ProductProvider'); }
  return context;
};
