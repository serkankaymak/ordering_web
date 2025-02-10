import React, { useState, ChangeEvent } from "react";
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    Paper,
    TextField,
    Button,
    IconButton,
    Checkbox,
    FormControlLabel,
    FormGroup,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import ArrayListStream from "@/shared/ArrayListStream";

interface AdminMenuItemUpdateComponentProps {
    menu: ProductModel;
    // Değişiklik olduğunda güncellenmiş menüyü üst bileşene göndermek için opsiyonel callback
    onChange?: (updatedMenu: ProductModel) => void;
}

const AdminMenuItemUpdateComponent: React.FC<AdminMenuItemUpdateComponentProps> = ({
    menu,
    onChange,
}) => {
    // Üst seviye menü (parentBoxId == null) için input alanlarında gösterilecek değerleri state ile tutuyoruz
    const [title, setTitle] = useState(menu.productTitle);
    const [description, setDescription] = useState(menu.productDescription);
    const [price, setPrice] = useState(menu.price);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        onChange &&
            onChange({
                ...menu,
                productTitle: e.target.value,
                isModelValid: function (): boolean {
                    throw new Error("Function not implemented.");
                },
            });
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
        onChange &&
            onChange({
                ...menu,
                productDescription: e.target.value,
                isModelValid: function (): boolean {
                    throw new Error("Function not implemented.");
                },
            });
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newPrice = parseFloat(e.target.value);
        setPrice(newPrice);
        onChange &&
            onChange({
                ...menu,
                price: newPrice,
                isModelValid: function (): boolean {
                    throw new Error("Function not implemented.");
                },
            });
    };

    return (
        <TableContainer
            className="border my-1"
            component={Paper}
            sx={{
                width: "100%", overflowX: "auto",
                mb: 0,
                px: menu.parentBoxId == null ? 0 : 0,
                py: menu.parentBoxId == null ? 2 : 0,
            }}
        >
            <Table size="small" sx={{ "& td, & th": { borderBottom: "none" } }}>
                <TableBody sx={{ padding: 1 }} >
                    <TableRow >
                        {ArrayListStream.fromNumbers(10).toList().map(num =>
                            <TableCell padding='none'></TableCell>)}
                    </TableRow>

                    <TableRow >
                        {/* Görsel */}
                        <TableCell
                            padding='none' colSpan={1} sx={{ width: "50px" }}>
                            {menu.imageUrl ? (
                                <img
                                    src={menu.imageUrl}
                                    alt={menu.productTitle}
                                    style={{
                                        marginLeft: 10,
                                        width: "40px",
                                        height: "40px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                    }}
                                />
                            ) : (
                                <Box className="flex flex-row">
                                    {menu.products &&
                                        menu.products.map(
                                            (item) =>
                                                item.imageUrl && (
                                                    <img
                                                        key={item.id}
                                                        src={item.imageUrl}
                                                        alt={item.productTitle}
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            objectFit: "cover",
                                                            borderRadius: "4px",
                                                            marginRight: "4px",
                                                        }}
                                                    />
                                                )
                                        )}
                                </Box>
                            )}
                        </TableCell>

                        {/* Başlık ve Açıklama */}
                        <TableCell padding='checkbox' colSpan={menu.parentBoxId != null ? 8 : 9}>
                            {menu.parentBoxId == null ? (
                                <>
                                    <Box className="flex flex-col gap-2">
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            label="Title"
                                            value={title}
                                            onChange={handleTitleChange}
                                            fullWidth
                                        />
                                        <TextField
                                            multiline
                                            rows={2} // İstenirse varsayılan satır sayısını belirtebilirsiniz
                                            variant="outlined"
                                            size="small"
                                            label="Description"
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            fullWidth
                                        />
                                    </Box>
                                </>
                            ) : (
                                <Box className=''>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ textWrap: "wrap", fontSize: "0.9rem" }}
                                    >
                                        {menu.productTitle}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textWrap: "wrap",
                                            fontSize: "0.8rem",
                                            color: "text.secondary",
                                        }}
                                    >
                                        {menu.productDescription}
                                    </Typography>


                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textWrap: "nowrap",
                                            fontSize: "0.8rem",
                                            color: "text.secondary",
                                        }}
                                    >
                                        {menu.price + " TL"}
                                    </Typography>


                                </Box>
                            )}
                        </TableCell>

                        {/* Actions */}
                        {menu.parentBoxId != null && (
                            <TableCell
                                padding='none'
                                colSpan={1} sx={{ maxWidth: "40px" }}>
                                <Box className="
                                 flex flex-col sm:flex-row
                                  justify-end items-center gap-0 sm:gap-1 ">
                                    <Box className="flex justify-end items-center gap-0">
                                        <IconButton size="small">
                                            <Add></Add>
                                        </IconButton>
                                        <span>3</span>
                                        <IconButton size="small">
                                            <Remove></Remove>
                                        </IconButton>

                                    </Box>
                                    <IconButton size="small">
                                        <Delete></Delete>
                                    </IconButton>
                                </Box>
                            </TableCell>
                        )}

                    </TableRow>

                    <TableRow><TableCell></TableCell></TableRow>
                    {menu.parentBoxId == null &&

                        <TableRow  >
                            <TableCell sx={{ mt: 5 }} padding="checkbox"
                                className=""
                                align="right" colSpan={10}>
                                <Button startIcon={<Add />}>Add Product</Button>
                            </TableCell>
                        </TableRow>
                    }

                    {/* Recursive: Alt Menü/Ürün Listeleme */}
                    {menu.products && menu.products.length > 0 && (
                        <TableRow>
                            <TableCell padding="normal" colSpan={10} sx={{ pl: 1 }}>
                                {menu.products.map((item) => (
                                    <AdminMenuItemUpdateComponent
                                        key={item.id}
                                        menu={item}
                                        onChange={onChange}
                                    />
                                ))}
                            </TableCell>
                        </TableRow>
                    )}

                    {/* Üst seviye menüde ek bilgi satırı */}
                    {menu.parentBoxId == null && (
                        <TableRow>
                            <TableCell colSpan={8} >
                                <Box sx={{ mt: 3 }}>
                                    <FormGroup>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                                            {CategoryModel.getExamples().map((cat) => (
                                                <FormControlLabel
                                                    key={cat.id}
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            checked={false}
                                                            onChange={() => { }}
                                                        />
                                                    }
                                                    label={cat.name}
                                                />
                                            ))}
                                        </Box>
                                    </FormGroup>
                                </Box>

                            </TableCell>
                            <TableCell colSpan={2} align="center">
                                <Box
                                    className="text-xs"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: 'end',
                                        gap: 1
                                    }}
                                >
                                    <span>Products Price Sum : 20.00</span>
                                    <Box className="gap-1 flex items-center justify-center">
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            label="Price / TL"
                                            type="number"
                                            value={price}
                                            onChange={handlePriceChange}
                                            sx={{ width: "120px" }} // Fiyat inputunun genişliğini küçülttük
                                        />

                                    </Box>

                                </Box>
                            </TableCell>
                        </TableRow>
                    )}
                    {menu.parentBoxId == null && (

                        <TableRow>
                            <TableCell colSpan={10} align="right">
                                <Button>Save</Button>
                                <Button>Cancel</Button>
                            </TableCell>
                        </TableRow>

                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default React.memo(AdminMenuItemUpdateComponent);
