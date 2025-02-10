import { ProductModel } from "@/domain/ProductModels";
import { Delete, Update } from "@mui/icons-material";
import { Box, Typography, Table, TableBody, TableCell, TableRow, TableContainer, Paper, IconButton, Button } from "@mui/material";
import React from "react";

interface AdminProductTableComponentProps {
    product: ProductModel;
    showActions: boolean;
    onUpdateButtonClicked?: (boxProductId: number) => void | null;
    onDeleteButtonClicked?: (boxProductId: number) => void | null;

}

const AdminProductTableComponent: React.FC<AdminProductTableComponentProps> = ({ product, onUpdateButtonClicked, onDeleteButtonClicked, showActions }) => {
    return (
        <TableContainer  className="border my-1" component={Paper} sx={{ mb: 0, px: product.parentBoxId == null ? 1 : 0, py: product.parentBoxId == null ? 2 : 0 }}>
            <Table size="small">
                <TableBody>
                    <TableRow>
                        {/* Görsel */}
                        <TableCell sx={{ padding: 0, width: "50px" }}>
                            <img
                                src={product.imageUrl!}
                                alt={product.productTitle}
                                style={{ marginLeft: 3, width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                            />
                        </TableCell>

                        {/* Başlık ve Açıklama */}
                        <TableCell sx={{ padding: 1 }}>
                            <Typography variant="subtitle2" sx={{ textWrap: "wrap", fontSize: "0.9rem" }}>
                                {product.productTitle}
                            </Typography>
                            <Typography variant="body2" sx={{ textWrap: "wrap", fontSize: "0.8rem", color: "text.secondary" }}>
                                {product.productDescription}
                            </Typography>
                        </TableCell>

                        <TableCell sx={{ maxWidth: '120px' }}>
                            <Typography variant="body2" sx={{ textWrap: "nowrap", fontSize: "0.8rem", color: "text.secondary" }}>
                                {product.price + ' TL'}
                            </Typography>
                        </TableCell>
                    </TableRow>


                </TableBody>



                <TableRow >
                    <TableCell colSpan={3} align="right">
                        <Box className='text-xs' sx={{ display: 'flex', flexDirection: 'column' }}>
                            <span>   Product Price Sum : 20.00</span>

                        </Box>
                    </TableCell>
                </TableRow>

                {showActions && <TableRow >
                    <TableCell colSpan={3} align="right">
                        <Box className='text-xs'
                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                            {false ?
                                <>
                                    <Button sx={{ width: 'auto' }} endIcon={<Update />}></Button>
                                    <Button sx={{ width: 'auto' }} endIcon={<Delete />}></Button>
                                </>
                                :
                                <>
                                    <IconButton onClick={() => onUpdateButtonClicked && onUpdateButtonClicked(product.id)} ><Update /></IconButton>
                                    <IconButton onClick={() => onDeleteButtonClicked && onDeleteButtonClicked(product.id)}   ><Delete /></IconButton>
                                </>}

                        </Box>
                    </TableCell>
                </TableRow>
                }


            </Table>
        </TableContainer>
    );
};

export default React.memo(AdminProductTableComponent);