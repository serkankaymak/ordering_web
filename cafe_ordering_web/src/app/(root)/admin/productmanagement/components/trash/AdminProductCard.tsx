import { ProductModel } from "@/domain/ProductModels";
import { AddShoppingCart, Description, Favorite, Update } from "@mui/icons-material";
import { Box, Card, CardMedia, IconButton, Typography } from "@mui/material";
import React from "react";

interface AdminProductCardProps {
    className?: string; // Dışarıdan eklenebilir className
    product: ProductModel;
    onOpenUpdateCardClicked?: (productId: number) => void; // Buton tıklaması için opsiyonel callback
}

// Fonksiyonel bileşen tanımı
const AdminProductCard: React.FC<AdminProductCardProps> = ({
    className,
    product,
    onOpenUpdateCardClicked,
}) => {
    return (<>
        <Box className={`${className}`}>
            <Box className="relative group rounded-lg overflow-hidden shadow-md">
                {/* Ürün Resmi */}
                <CardMedia
                    component="img"
                    image={product.imageUrl!}
                    alt={product.productTitle}
                    className="w-full  object-cover   transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <Box className="
                    sm:p-2 p-1
                    sm:ps-3 ps-2
                    absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white 
                    "
                >
                    <Box className="flex flex-row items-center justify-between">
                        <Box>
                            <Typography variant="h6"
                                className=" sm:text-sm text-xs font-bold text-wrap">
                                {product.productTitle}
                            </Typography>

                            <Typography variant="subtitle1" className=" sm:text-sm text-xs font-bold sm:mt-1    mt-0"     >
                                ${product.price.toFixed(2)}
                            </Typography>

                        </Box>

                        <Box>
                            <IconButton
                                onClick={() => { if (onOpenUpdateCardClicked != null) onOpenUpdateCardClicked(product.id) }}
                                sx={{ color: 'whitesmoke' }}>
                                <Update ></Update>
                            </IconButton>
                        </Box>

                    </Box>

                </Box>
            </Box>
        </Box>

    </>)
}


export default React.memo(AdminProductCard);