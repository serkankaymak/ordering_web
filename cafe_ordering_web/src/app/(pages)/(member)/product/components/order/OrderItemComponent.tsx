import React from "react";
import { Box, Typography, Card, CardMedia, IconButton, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Analytics, Delete, Preview } from "@mui/icons-material";
import { OrderItemModel } from "@/domain/OrderModels";
// react-slick'in düzgün çalışması için gerekli CSS dosyaları
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ProductModel } from "@/domain/ProductModels";
import useMyMediaQuery, { Breakpoints } from "@/shared/hooks/UseMediaQuery";
import { IComponent } from "@/app/types/ViewTypes";
import OrderItemProductComponent from "./OrderItemProductComponent";

// Sol yön okunu gösteren özel bileşen
function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: "block",
                left: 10,
                zIndex: 2,
            }}
            onClick={onClick}
        />
    );
}

// Sağ yön okunu gösteren özel bileşen
function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: "block",
                right: 10,
                zIndex: 2,
            }}
            onClick={onClick}
        />
    );
}
// Responsive ayarları kaldırarak, her zaman 1 slide gösteriyoruz
const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1.06,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
};


// Props için interface tanımı
interface OrderItemComponentProps {
    className?: string; // Dışarıdan eklenebilir className
    orderItem: OrderItemModel;
    showActions?: boolean;
    onIncreaseClicked?: () => void; // Miktarı artırma işlemi için callback
    onDecreaseClicked?: () => void; // Miktarı azaltma işlemi için callback
    onRemoveClicked?: () => void;
    onViewClicked?: (productId: number) => void;
}


// Fonksiyonel bileşen tanımı
const OrderItemComponent: IComponent<OrderItemComponentProps> = ({
    showActions,
    className, orderItem, onIncreaseClicked: onIncrease, onDecreaseClicked: onDecrease, onRemoveClicked: onRemove, onViewClicked }) => {

    const isSmallScreen = useMyMediaQuery(Breakpoints.SMALL, 'max');

    return (
        <Card
            className="flex sm:flex-row flex-row justify-between mb-2 p-2 border  "
            sx={{
                boxShadow: 2,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "scale(1.0)", boxShadow: 6, },
            }}
        >

            <Box className="flex items-start w-full">
                
                {/* Ürün Bilgisi */}
                <Box className="w-full "
                    sx={{ flex: 1 }}>

                    <Box className=" w-full flex flex-col sm:flex-col  justify-around">
                        <OrderItemProductComponent
                            menu={orderItem.product!}
                        ></OrderItemProductComponent>

                        <Box className=" mt-1 flex w-full flex-row justify-end items-center  ">


                            {showActions &&
                                <>
                                    {/* Miktar Kontrolü */}
                                    <Box className="flex items-center gap-0 sm:gap-1  m-0 sm:m-2">
                                        <IconButton
                                            onClick={onDecrease && onDecrease}
                                            color="primary"
                                            disabled={orderItem.quantity <= 1}
                                            sx={{
                                                "&:hover": { backgroundColor: "primary.light" },
                                                "&:active": { transform: "scale(0.9)" },
                                            }}
                                        >
                                            <RemoveIcon className="text-xl sm:text-2xl" />
                                        </IconButton>
                                        <Typography variant="body1" fontWeight="bold">
                                            {orderItem.quantity}
                                        </Typography>
                                        <IconButton
                                            onClick={onIncrease && onIncrease}
                                            color="primary"
                                            sx={{
                                                "&:hover": { backgroundColor: "primary.light" },
                                                "&:active": { transform: "scale(0.9)" },
                                            }}
                                        >
                                            <AddIcon className="text-xl sm:text-2xl" />
                                        </IconButton>
                                    </Box>

                                    {/* Ürünü Kaldırma Butonu */}
                                    <IconButton
                                        onClick={onRemove && onRemove}
                                        sx={{
                                            color: "error.main",
                                            "&:hover": { backgroundColor: "error.light" },
                                            "&:active": { transform: "scale(0.9)" },
                                        }}
                                    >
                                        <Delete className="text-xl sm:text-2xl" />
                                    </IconButton>
                                </>
                            }



                            <IconButton onClick={() => { onViewClicked && onViewClicked(orderItem.productId) }} color="primary">
                                <Preview></Preview>
                            </IconButton>

                        </Box>

                    </Box>

                </Box>

            </Box>

        </Card>
    );
};

export default OrderItemComponent;