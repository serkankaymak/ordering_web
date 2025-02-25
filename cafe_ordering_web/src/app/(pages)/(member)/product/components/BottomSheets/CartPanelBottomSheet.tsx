
import { DragHandle, Close, Send, Clear, Delete, Discount } from "@mui/icons-material";
import { SwipeableDrawer, Box, IconButton, Typography, Button, useTheme, Card, Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import OrderItemComponent from "../order/OrderItemComponent";
import React from "react";
import { OrderItemModel } from "@/domain/OrderModels";
import MyBottomSheet from "@/shared/components/MyBottomSheet";
import { IComponent } from "@/app/types/ViewTypes";
import { DiscountModel, DiscountType } from "@/domain/DiscountModels";
import { useUserContext } from "@/app/providers/global.providers/user.provider";
import { useSitePreferencesContext } from "@/app/providers/global.providers/sitePreferences.provider";
import SelectInput, { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import ArrayListStream from "@/shared/ArrayListStream";
import { useOrderEvents } from "@/app/providers/orderEvents.provider";
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
    onDiscountsButonClicked?: () => void;
    onTableSelectValueChanged?: (tableId: number) => void;
    lang?: string

}> = ({
    onDiscountsButonClicked,
    open, onClose, orderItems,
    onIncrease, onDecrease, onRemove, onOrderSendClicked, onOrderClearClicked, onTableSelectValueChanged,
    onViewClicked, lang = "tr" }) => {
        // Toplam fiyatı hesapla
        const totalPrice = orderItems.reduce(
            (total, item) => total + (item.product?.price || 0) * item.quantity, 0
        );
        const drawerBleeding = 0;
        const isBasketEmpty = orderItems.filter(x => x.quantity != 0).length == 0;
        const theme = useTheme();
        const { user } = useUserContext();
        const { sitePreferences } = useSitePreferencesContext();
        const { joinTable} = useOrderEvents();
        return (
            <MyBottomSheet className='z-40' isOpen={open} onCloseButtonClicked={function (): void {
                if (onClose != null) onClose();
            }} drawerBleeding={drawerBleeding}
            >
                <>
                    <Box className="flex justify-start">


                        <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2 }}>
                            <InputLabel id="table-id-select-label">Masa Numarası</InputLabel>
                            <Select
                                size="small"
                                defaultValue="0" // value yerine defaultValue kullanılıyor
                                onChange={(event: SelectChangeEvent) => {
                                    const tableId = Number(event.target.value);
                                    onTableSelectValueChanged && onTableSelectValueChanged(tableId);
                                }}
                                labelId="table-id-select-label"
                                label="Masa Numarası"
                            >
                                {ArrayListStream.fromNumbers(20).toList().map((num) => (
                                    <MenuItem key={num} value={num}>
                                        {`Masa No : ${num}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                    </Box>
                    {/* Başlık ve Kapatma Düğmesi */}
                    <Box
                        className="gap-2 my-0 mt-0 mb-2"
                        display="flex" justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Sepetim
                        </Typography>
                        {
                            (
                                true ||
                                (sitePreferences?.showClientAwaibleDiscounts ||
                                    sitePreferences?.showClientDetailedAwaibleDiscounts ||
                                    user?.canChangeSitePreferences()
                                )
                            ) &&
                            <Button
                                onClick={(e: any) => { onDiscountsButonClicked && onDiscountsButonClicked(); }}
                                color="success" variant="contained" endIcon={
                                    <>
                                        <Discount></Discount>
                                        <Discount></Discount>
                                    </>
                                } >Discounts</Button>
                        }

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
                                            showActions={true}
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
                                <Box className="  flex flex-col sm:flex-row  gap-1  justify-end">

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