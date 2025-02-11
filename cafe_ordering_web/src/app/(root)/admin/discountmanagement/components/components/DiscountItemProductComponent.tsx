import { DiscountItem } from '@/domain/DiscountModels';
import { Update, Delete } from '@mui/icons-material';
import { Box, Button, Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import AdminMenuItemTableComponent from '../../../menumanagement/components/AdminMenuItemTableComponent';
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
                        <TableCell sx={{ padding: 0, width: "40px" }}>

                            <img
                                src={product!.imagePath ?? `/images/image_not_found.png`}
                                alt={product!.name}
                                style={{
                                    marginLeft: 3,
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                }}
                            />
                        </TableCell>

                        {/* Başlık ve Açıklama */}
                        <TableCell>
                            <Typography variant="subtitle2" sx={{ textWrap: "wrap", fontSize: "0.9rem" }}>
                                {product!.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ textWrap: "wrap", fontSize: "0.8rem", color: "text.secondary" }}
                            >
                                {product!.productDescription}
                            </Typography>
                        </TableCell>

                        <TableCell sx={{ maxWidth: "120px" }}>
                            <Typography
                                variant="body2"
                                sx={{ textWrap: "nowrap", fontSize: "0.8rem", color: "text.secondary" }}
                            >
                                {product!.price + " TL"}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    {/* Recursive: Alt Menü/Ürün Listeleme */}
                    {product!.products && product!.products.length > 0 && (
                        <TableRow>
                            <TableCell colSpan={3} sx={{ pl: 1 }}>
                                {product!.products.map((item) => (
                                    <AdminMenuItemTableComponent key={item.id} menu={item} showActions={false} />
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
