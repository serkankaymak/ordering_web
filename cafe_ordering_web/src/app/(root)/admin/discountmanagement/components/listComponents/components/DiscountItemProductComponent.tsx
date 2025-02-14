import { DiscountItemModel } from '@/domain/DiscountModels';
import { Update, Delete } from '@mui/icons-material';
import { Box, Button, Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import AdminMenuItemTableComponent from '../../../menumanagement/components/serverSideComponents/AdminMenuItemTableComponent';
import { ProductModel } from '@/domain/ProductModels';

// Props için interface tanımı
interface DiscountItemProductComponentProps {
    product: ProductModel;

}



// Fonksiyonel bileşen tanımı
const DiscountItemProductComponent: React.FC<DiscountItemProductComponentProps> = ({
    product

}) => {
    // State tanımı


    return (
        <TableContainer
            className="border my-1"
            component={Paper}
            sx={{
                mb: 0,
                px: product!.parentBoxId == null ? 1 : 0,
                py: product!.parentBoxId == null ? 2 : 0,
            }}
        >
            <Table sx={{ "& td, & th": { borderBottom: "none" } }} size="small">
                <TableBody>
                    <TableRow>
                        {/* Görsel */}
                        <TableCell sx={{ padding: 0 }}>

                            <Box sx={{ position: "relative", overflow: "hidden", clear: "both" }}>
                                {/* Resmi sol tarafa float ediyoruz */}
                                <img
                                    src={product.getImagePathForShow()}
                                    alt={product.name}
                                    style={{
                                        float: "left",
                                        width: "40px",
                                        height: "40px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        marginRight: "8px",
                                    }}
                                />
                                {/* Ürün adı */}
                                <Box className="flex justify-start gap-2">
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            whiteSpace: "normal",
                                            overflowWrap: "break-word",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {product.name}
                                    </Typography>
                                    <Chip size="small" label={product.price + " TL"} />
                                </Box>

                                {/* Ürün açıklaması; metin, resmin sağında başlayıp gerektiğinde altına geçecektir */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 1,
                                        whiteSpace: "normal",
                                        overflowWrap: "break-word",
                                        wordBreak: "break-word",
                                        fontSize: "0.8rem",
                                        color: "text.secondary",
                                    }}
                                >
                                    {product.description}
                                </Typography>
                                {/* Fiyat */}
                            </Box>

                        </TableCell>


                    </TableRow>
                    {/* Recursive: Alt Menü/Ürün Listeleme */}
                    {product!.products && product!.products.length > 0 && (
                        <TableRow>
                            <TableCell sx={{ pl: 1 }}>
                                {product!.products.map((item) => (
                                    <DiscountItemProductComponent key={item.id}
                                        product={item} />
                                ))}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>


        </TableContainer>
    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(DiscountItemProductComponent);
