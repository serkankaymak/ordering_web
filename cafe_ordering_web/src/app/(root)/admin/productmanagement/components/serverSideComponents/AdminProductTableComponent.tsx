import React from "react";
import { IComponent } from "@/app/types/ViewTypes";
import { ProductModel } from "@/domain/ProductModels";
import { Delete, Update } from "@mui/icons-material";
import { Box, Typography, Table, TableBody, TableCell, TableRow, TableContainer, Paper, IconButton, Button, Chip } from "@mui/material";

interface AdminProductTableComponentProps {
    product: ProductModel;
    showActions: boolean;
    showCategories?: boolean;
    onUpdateButtonClicked?: (productId: number) => void;
    onDeleteButtonClicked?: (productId: number) => void;
}

const AdminProductTableComponent: IComponent<AdminProductTableComponentProps> = ({
    product,
    onUpdateButtonClicked,
    onDeleteButtonClicked,
    showActions,
    showCategories = true,
}) => {
    return (
        <TableContainer
            className="border my-1"
            component={Paper}
            sx={{ mb: 0, px: product.parentBoxId == null ? 1 : 0, py: product.parentBoxId == null ? 2 : 0 }}
        >
            <Table padding="none" sx={{ "& td, & th": { borderBottom: "none" } }} size="small">
                <TableBody>
                    <TableRow>
                        <TableCell>
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

                </TableBody>
                <TableBody>
                    {showActions && (
                        <TableRow>
                            <TableCell>
                                <Box className="flex items-center">
                                    <Box>
                                        {showCategories && (
                                            <Box key="categories" className="flex flex-wrap gap-1">
                                                {product.categories.map((c, i) => (
                                                    <Chip key={`${i}_${c.id}`} size="small" label={c.name} />
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                    <Box
                                        className="flex-1 text-xs"
                                        sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}
                                    >
                                        <>
                                            <IconButton onClick={() => onUpdateButtonClicked && onUpdateButtonClicked(product.id)}>
                                                <Update />
                                            </IconButton>
                                            <IconButton onClick={() => onDeleteButtonClicked && onDeleteButtonClicked(product.id)}>
                                                <Delete />
                                            </IconButton>
                                        </>
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default React.memo(AdminProductTableComponent);
