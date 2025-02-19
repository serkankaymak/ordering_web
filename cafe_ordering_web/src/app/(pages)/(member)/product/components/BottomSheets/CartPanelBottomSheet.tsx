
import { DragHandle, Close, Send, Clear, Delete } from "@mui/icons-material";
import { SwipeableDrawer, Box, IconButton, Typography, Button, useTheme } from "@mui/material";
import OrderItemComponent from "../order/OrderItemCardComponent";
import React from "react";
import { OrderItemModel } from "@/domain/OrderModels";
import MyBottomSheet from "@/shared/components/MyBottomSheet";
import { IComponent } from "@/app/types/ViewTypes";

const CartPanelBottomSheet: IComponent<{
    open: boolean;
    onClose: () => void;
    orderItems: OrderItemModel[];
    onIncrease: (productId: number) => void;
    onDecrease: (productId: number) => void;
    onRemove: (productId: number) => void;
    onOrderSendClicked: () => void;
    onOrderClearClicked?: () => void;
    onViewClicked: (productId: number) => void;
    lang?: string

}> = ({ open, onClose, orderItems, onIncrease, onDecrease, onRemove, onOrderSendClicked, onOrderClearClicked,
    onViewClicked, lang = "tr" }) => {
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
                                            orderItem={item ?? new OrderItemModel({ productId: 0 })}
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
                        <Box className="  flex flex-col  sm:flex-row justify-end ">
                            <Typography
                                className="flex-1"
                                variant="h6" fontWeight="bold">
                                Toplam: ${totalPrice.toFixed(2)}
                            </Typography>


                            <Box className="  flex flex-row gap-1  justify-end">

                                <Button
                                    startIcon={<Delete></Delete>}
                                    lang={lang}
                                    variant="outlined"
                                    color="secondary"

                                    onClick={() => { onOrderClearClicked && onOrderClearClicked(); }}
                                >
                                    Siparişi Temizle
                                </Button>

                                <Button

                                    startIcon={<Send></Send>}
                                    lang={lang}
                                    variant="contained"
                                    color="secondary"

                                    onClick={() => { onOrderSendClicked(); }}
                                >
                                    Siparişi Gönder
                                </Button>


                            </Box>


                        </Box>

                    </Box>

                </>



            </MyBottomSheet >
        );
    };


export default React.memo(CartPanelBottomSheet);