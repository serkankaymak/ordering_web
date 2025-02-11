import { ProductModel } from "@/domain/ProductModels";
import { Delete, Update } from "@mui/icons-material";
import { Box, Typography, Table, TableBody, TableCell, TableRow, TableContainer, Paper, IconButton, Button, Chip } from "@mui/material";
import React from "react";

interface AdminProductTableComponentProps {
    product: ProductModel;
    showActions: boolean;
    showCategories?: boolean;
    onUpdateButtonClicked?: (productId: number) => void | null;
    onDeleteButtonClicked?: (productId: number) => void | null;

}

const AdminProductTableComponent: React.FC<AdminProductTableComponentProps> = ({
    product, onUpdateButtonClicked, onDeleteButtonClicked, showActions, showCategories = true }) => {
    return (
        <TableContainer className="border my-1" component={Paper} sx={{ mb: 0, px: product.parentBoxId == null ? 1 : 0, py: product.parentBoxId == null ? 2 : 0 }}>
            <Table padding='none' sx={{ "& td, & th": { borderBottom: "none" } }} size="small">


                <TableBody>
                    <TableRow>
                        {/* Görsel */}
                        <TableCell sx={{ padding: 0, width: "50px" }}>
                            <img
                                src={product.getImagePathForShow()}
                                alt={product.name}
                                style={{ marginLeft: 3, width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                            />
                        </TableCell>

                        {/* Başlık ve Açıklama */}
                        <TableCell sx={{ padding: 1 }}>
                            <Typography variant="subtitle2" sx={{ textWrap: "wrap", fontSize: "0.9rem" }}>
                                {product.name}
                            </Typography>
                            <Typography variant="body2" sx={{ textWrap: "wrap", fontSize: "0.8rem", color: "text.secondary" }}>
                                {product.description}
                            </Typography>
                        </TableCell>

                        <TableCell sx={{ maxWidth: '120px' }}>
                            <Typography variant="body2" sx={{ textWrap: "nowrap", fontSize: "0.8rem", color: "text.secondary" }}>
                                {product.price + ' TL'}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>

                <TableBody>
                    {showActions && <TableRow >
                        <TableCell colSpan={3} align="right">
                            <Box className="flex">
                                <Box>
                                    {showCategories && <>
                                        <Box className=' flex flex-wrap gap-1' >{product.categories.map((c, i) => <>
                                            <Chip size="small" label={c.name}></Chip>
                                        </>)}</Box>
                                    </>}
                                </Box>
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
                            </Box>

                        </TableCell>
                    </TableRow>
                    }
                </TableBody>
            </Table>


        </TableContainer>
    );
};

export default React.memo(AdminProductTableComponent);