'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { IPageContent } from '@/app/types/ViewTypes';
import { OrderModel } from '@/domain/OrderModels';
import OrderCard from './components/OrderCard';
import { ProductService } from '@/application/services/product/ProductService';
import { ProductModel } from '@/domain/ProductModels';
import ProductSelector from '../../components/ProductSelector';
import MyModal from '@/shared/components/MyModal';
import { OrderService } from '@/application/services/product/OrderService';
import { OrderItemModel } from '@/domain/OrderModels';
import Masonry from 'react-masonry-css';
import MyMasonry from '@/shared/components/MyMasonary';

const productService = new ProductService();
const orderService = new OrderService();

interface OrderPageContentProps { }

const OrderPageContent: IPageContent<OrderPageContentProps> = ({ }) => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [orders, setOrders] = useState<OrderModel[]>([]);
    // Seçili siparişi tutan state; null ise modal kapalı.
    const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);

    useEffect(() => {
        productService.loadAllProductsAndMenus().then((res) => {
            setProducts(res.data!);
        });
        orderService.GetUnCompletedOrders().then((response) => {
            setOrders(response.data!);
        });
    }, []);



    const defaultBreakpoints = { default: 4, 1600: 3, 1000: 2, 800: 2, 500: 1 };

    // Parent state'i güncellemek için fonksiyon.
    const updateOrder = (updatedOrder: OrderModel) => {
        setOrders((prevOrders) => {
            const otherOrders = prevOrders.filter((o) => o.id !== updatedOrder.id);
            const newOrders = [...otherOrders, updatedOrder].sort((a, b) => (a.tableId || 0) - (b.tableId || 0));
            return newOrders;
        });
    };

    return (
        <Container className="flex flex-col mt-5">
            {false &&

                <Box className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-1">
                    {orders
                        .sort((a, b) => (a.tableId || 0) - (b.tableId || 0))
                        .map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onOrderModified={(modifiedOrder) => updateOrder(modifiedOrder)}
                                onAddProductClicked={(order) => setSelectedOrder(order)}
                            />
                        ))}
                </Box>

            }

            {true &&

                <MyMasonry
                    breakpointCols={defaultBreakpoints}
                    items={
                        orders
                            .sort((a, b) => (a.tableId || 0) - (b.tableId || 0))
                            .map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onOrderModified={(modifiedOrder) => updateOrder(modifiedOrder)}
                                    onAddProductClicked={(order) => setSelectedOrder(order)}
                                />
                            ))
                    } ></MyMasonry>

            }


            <MyModal
                className=""
                isOpen={selectedOrder !== null}
                onCloseClicked={() => setSelectedOrder(null)}
            >
                <ProductSelector
                    products={products}
                    onChooseButtonClicked={(selectedProduct: ProductModel): void => {
                        if (!selectedOrder) return;
                        const updatedOrder = selectedOrder.copy({});
                        const existingItem = updatedOrder.orderItems.find(
                            (x) => x.productId === selectedProduct.id
                        );
                        if (existingItem) {
                            existingItem.increase();
                        } else {
                            const newOrderItem = new OrderItemModel();
                            newOrderItem.quantity = 1;
                            newOrderItem.product = selectedProduct;
                            newOrderItem.productId = selectedProduct.id;
                            updatedOrder.orderItems.push(newOrderItem);
                        }
                        updateOrder(updatedOrder);
                        setSelectedOrder(null);
                    }}
                />
            </MyModal>
        </Container>
    );
};

export default React.memo(OrderPageContent);
