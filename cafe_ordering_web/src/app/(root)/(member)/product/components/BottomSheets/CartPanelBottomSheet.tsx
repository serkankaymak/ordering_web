
import { DragHandle, Close } from "@mui/icons-material";
import { SwipeableDrawer, Box, IconButton, Typography, Button, useTheme } from "@mui/material";
import OrderItemComponent from "../order/OrderItemCardComponent";
import React from "react";
import { OrderItemModel } from "@/domain/OrderModels";
import MyBottomSheet from "@/shared/components/MyBottomSheet";

const CartPanelBottomSheet: React.FC<{
    open: boolean;
    onClose: () => void;
    orderItems: OrderItemModel[];
    onIncrease: (productId: number) => void;
    onDecrease: (productId: number) => void;
    onRemove: (productId: number) => void;
    onPayed: () => void;
    onViewClicked: (productId: number) => void;

}> = ({ open, onClose, orderItems, onIncrease, onDecrease, onRemove, onPayed, onViewClicked }) => {
    // Toplam fiyatı hesapla
    const totalPrice = orderItems.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity, 0
    );
    const drawerBleeding = 0;
    const theme = useTheme();
    return (
        <MyBottomSheet className='z-40' isOpen={open} onCloseButtonClicked={function (): void {
            if (onClose != null) onClose();
        }} drawerBleeding={drawerBleeding}
        >

            <>
                {/* Başlık ve Kapatma Düğmesi */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        Sepetim
                    </Typography>

                </Box>

                {/* Sepet İçeriği */}
                <Box >
                    {orderItems.filter(x => x.quantity != 0).length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                            Sepetiniz boş.
                        </Typography>
                    ) : (
                        <>
                            <Box className=" whitespace-nowrap scrollbar-thin    scrollbar-track-gray-200       scrollbar-thumb-gray-500"
                                sx={{ overflowY: "auto", flex: 1 }}> {/* Kaydırma için */}
                                {orderItems.map((item) => (
                                    <OrderItemComponent
                                        key={item.productId}
                                        orderItem={item}
                                        onIncreaseClicked={() => onIncrease(item.productId)}
                                        onDecreaseClicked={() => onDecrease(item.productId)}
                                        onRemoveClicked={() => onRemove(item.productId)}
                                        onViewClicked={onViewClicked} />
                                ))}
                            </Box>

                        </>
                    )}


                </Box>
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                    <Typography variant="h6" fontWeight="bold">
                        Toplam: ${totalPrice.toFixed(2)}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => { onPayed(); }}
                    >
                        Ödeme Yap
                    </Button>
                </Box>

            </>



        </MyBottomSheet >
    );
};


export default React.memo(CartPanelBottomSheet);