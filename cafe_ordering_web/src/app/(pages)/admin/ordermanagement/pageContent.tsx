'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Button, ButtonGroup } from '@mui/material';
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
import { useOrderEvents } from '@/app/providers/orderEvents.provider';
import { Check, ArrowUpward, ArrowDownward } from '@mui/icons-material';

const productService = new ProductService();
const orderService = new OrderService();

interface OrderPageContentProps { }

type SortOption = 'id' | 'createdDate' | 'tableId';
type SortDirection = 'asc' | 'desc';

const OrderPageContent: IPageContent<OrderPageContentProps> = ({ }) => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const { addOnOrderCreatedListener } = useOrderEvents();

    useEffect(() => {
        productService.loadAllProductsAndMenus().then((res) => {
            setProducts(res.data!);
        });
        orderService.GetUnCompletedOrders().then((response) => {
            setOrders(response.data!);
        });

        addOnOrderCreatedListener("OrderPageContent", (orderEvent) => {
            console.log(orderEvent);
            orderService.GetOrder(orderEvent.orderId).then(response => {
                console.log(response);
                if (response.isSuccess) {
                    setOrders((prevOrders) => [...prevOrders, response.data!]);
                }
            })
        });
    }, []);

    const defaultBreakpoints = { default: 3, 1800: 3, 1000: 2, 800: 1, 500: 1 };

    const updateOrder = (updatedOrder: OrderModel) => {
        setOrders((prevOrders) => {
            const otherOrders = prevOrders.filter((o) => o.id !== updatedOrder.id);
            return [...otherOrders, updatedOrder];
        });
    };

    const sortedOrders = orders.slice().sort((a, b) => {
        let comparison = 0;
        switch (sortOption) {
            case 'createdDate':
                comparison = new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime();
                break;
            case 'tableId':
                comparison = (a.tableId || 0) - (b.tableId || 0);
                break;
            default:
                comparison = a.id - b.id;
                break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const toggleSortDirection = () => {
        setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <Container className="flex flex-col mt-5">
            {/* Sort options UI */}
            <>
                <h6 className='text-center'>Sort By</h6>
                <Box display="flex" justifyContent="center" mb={2}>
                    <ButtonGroup size='small' className='gap-2 ' variant="contained" color="secondary">
                        <Button type='button' onClick={() => setSortOption('createdDate')}>
                            {sortOption === 'createdDate' && (
                                <Check fontSize="small" style={{ marginRight: 4 }} />
                            )}
                            Created
                        </Button>
                        <Button type='button' onClick={() => setSortOption('tableId')}>
                            {sortOption === 'tableId' && (
                                <Check fontSize="small" style={{ marginRight: 4 }} />
                            )}
                            Table ID
                        </Button>
                        <Button type='button' onClick={toggleSortDirection}>
                            {sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                        </Button>
                    </ButtonGroup>
                </Box>
            </>

            {false &&
                <Box className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-1">
                    {sortedOrders.map((order) => (
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
                        sortedOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onOrderModified={(modifiedOrder) => updateOrder(modifiedOrder)}
                                onAddProductClicked={(order) => setSelectedOrder(order)}
                            />
                        ))
                    }
                ></MyMasonry>
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