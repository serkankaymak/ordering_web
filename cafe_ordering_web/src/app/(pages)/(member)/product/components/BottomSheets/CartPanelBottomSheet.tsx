
import { DragHandle, Close, Send, Clear, Delete, Discount } from "@mui/icons-material";
import { SwipeableDrawer, Box, IconButton, Typography, Button, useTheme, Card, Chip } from "@mui/material";
import OrderItemComponent from "../order/OrderItemCardComponent";
import React from "react";
import { OrderItemModel } from "@/domain/OrderModels";
import MyBottomSheet from "@/shared/components/MyBottomSheet";
import { IComponent } from "@/app/types/ViewTypes";
import { DiscountModel } from "@/domain/DiscountModels";

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
    awaibleDiscounts?: DiscountModel[];
    onDiscountsButonClicked?: () => void;
    lang?: string

}> = ({
    onDiscountsButonClicked,
    awaibleDiscounts,
    open, onClose, orderItems, onIncrease, onDecrease, onRemove, onOrderSendClicked, onOrderClearClicked,
    onViewClicked, lang = "tr" }) => {
        // Toplam fiyatı hesapla
        const totalPrice = orderItems.reduce(
            (total, item) => total + (item.product?.price || 0) * item.quantity, 0
        );
        const drawerBleeding = 0;
        const isBasketEmpty = orderItems.filter(x => x.quantity != 0).length == 0;
        const theme = useTheme();
        return (
            <MyBottomSheet className='z-40' isOpen={open} onCloseButtonClicked={function (): void {
                if (onClose != null) onClose();
            }} drawerBleeding={drawerBleeding}
            >
                <>
                    {/* Başlık ve Kapatma Düğmesi */}
                    <Box
                        className="gap-2 my-2"
                        display="flex" justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Sepetim
                        </Typography>
                        <Button

                            onClick={(e: any) => { onDiscountsButonClicked && onDiscountsButonClicked(); }}
                            color="success" variant="contained" endIcon={
                                <>
                                    <Discount></Discount>
                                    <Discount></Discount>
                                </>

                            } >Discounts</Button>
                    </Box>

                    {/* Sepet İçeriği */}
                    <Box >
                        {isBasketEmpty ? (
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









                    <Box sx={{
                        mt: 2, pt: 2,
                        borderTop: 1, borderColor: "divider"
                    }}>
                        <Box className="  flex flex-col  sm:flex-row justify-end ">

                            {!isBasketEmpty &&
                                <Box className="w-full flex flex-row items-start ">
                                    <IconButton>
                                        <Discount></Discount>
                                    </IconButton>

                                    <Typography
                                        className="flex-1"
                                        variant="h6" fontWeight="bold">
                                        Toplam: ${totalPrice.toFixed(2)}
                                    </Typography>



                                </Box>
                            }
                            {!isBasketEmpty &&
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
                            }



                        </Box>

                    </Box>

                </>



            </MyBottomSheet >
        );
    };


export default React.memo(CartPanelBottomSheet);