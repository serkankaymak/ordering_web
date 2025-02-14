import React, { useState, ChangeEvent, useRef, useEffect } from "react";
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
    Chip,
} from "@mui/material";
import { Add, Delete, Remove, Save } from "@mui/icons-material";
import ImageSelectorComponent from "@/shared/components/ImageSelectorComponent";
import MyModal from "@/shared/components/MyModal";
import ProductSelector from "@/app/(root)/components/ProductSelector";

interface MenuItemAddOrUpdateComponentContentProps {
    rootId?: number,
    productsForProductSelector?: ProductModel[],
    categories: CategoryModel[],
    avaibleProductImagePaths: string[];
    menu: ProductModel;
    onSubmitClicked?: (updatedMenu: ProductModel) => void;
    onInputChange?: (key: keyof ProductModel, value: any) => void;
    onAddProduct?: (productId: number) => void,
    onRemoveProduct?: (productId: number) => void,
    onClearProduct?: (productId: number) => void,
    onCategoryToggle?: (category: CategoryModel) => void,
    onImageFileUploaded?: (file: File | null) => void,
}

const MenuItemAddOrUpdateComponentContent:
    React.FC<MenuItemAddOrUpdateComponentContentProps> = ({

        menu,
        rootId = menu.id,
        productsForProductSelector,
        onAddProduct,
        onRemoveProduct,
        onClearProduct,
        onInputChange,
        onSubmitClicked,
        onCategoryToggle,
        onImageFileUploaded,
        categories,
        avaibleProductImagePaths
    }) => {

        const [isOpenImageSelectorModal, setOpenImageSelectorModal] = useState<boolean>(false);
        const [isOpenProductSelectorModal, setOpenProductSelectorModal] = useState<boolean>(false);
        const [imagePreview, setImagePreview] = useState<string>(menu.getImagePathForShow())
        const fileInputRef = useRef<HTMLInputElement | null>(null);

        useEffect(() => {
            { console.log("menu add update use effect", menu.parent) }
        }, [menu.id])

        // Üst seviye menü için input alanlarında gösterilecek değerleri state ile tutuyoruz

        const handleImageSelect = (imagePath: string) => {
            setImagePreview(imagePath);
            setOpenImageSelectorModal(false);
            onInputChange!("imagePath", imagePath);
            onImageFileUploaded && onImageFileUploaded(null);
        }

        const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                onImageFileUploaded && onImageFileUploaded(file);
                const imageUrl = URL.createObjectURL(file);
                setImagePreview(imageUrl);
                onInputChange!("imagePath", null);

            }
        };

        return (

            (menu.quantity == 0) ? <></> :
                <Box>
                    {false && <Box className="text-white">  {menu.id} </Box>}
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
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <FormGroup>
                                            <Box className="  flex flex-col sm:flex-row gap-3">
                                                <Box
                                                    sx={{ position: "relative", clear: "both" }}
                                                    className={`  ${menu.parentBoxId == null ? "flex flex-col items-start sm:items-center" : "w-full"} gap-1 `}
                                                >
                                                    <img
                                                        src={imagePreview}
                                                        alt="Ürün Resmi"
                                                        style={{
                                                            float: 'left',
                                                            width: "80px", height: "80px",
                                                            objectFit: "cover", borderRadius: "6px"
                                                        }}
                                                    />

                                                    {menu.parentBoxId == null && <> <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                                                        <Box>
                                                            <Button
                                                                onClick={() => { setOpenImageSelectorModal(true) }}
                                                                size="small" variant="outlined">
                                                                Choose
                                                            </Button>

                                                            <Button onClick={() => fileInputRef.current?.click()} size="small" variant="outlined">
                                                                Upload
                                                            </Button>
                                                        </Box></>}


                                                    {/* Ürün adı */}
                                                    {menu.parentBoxId != null && <Box className="flex justify-start gap-2">
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                marginLeft: 1,
                                                                whiteSpace: "normal",
                                                                overflowWrap: "break-word",
                                                                fontSize: "0.9rem",
                                                            }}
                                                        >
                                                            {menu.name}
                                                        </Typography>

                                                        <Box className="flex gap-3">
                                                            {
                                                                menu.parentBoxId != null &&
                                                                <Chip size="small" label={"Adet : " + menu.quantity} />
                                                            }
                                                            <Chip size="small" label={"Price : " + menu.price + " TL"} />
                                                        </Box>



                                                    </Box>
                                                    }
                                                    {menu.parentBoxId != null && <Typography
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
                                                        {menu.description}
                                                    </Typography>
                                                    }


                                                </Box>

                                                {/* Başlık ve Açıklama */}

                                                {menu.parentBoxId == null &&
                                                    <>
                                                        <Box className=" w-full flex flex-col gap-3">
                                                            <TextField
                                                                fullWidth variant="outlined" size="small"
                                                                label="Ürün Başlığı"
                                                                value={menu.name}
                                                                onChange={(e) => onInputChange!("name", e.target.value)}
                                                            />
                                                            <TextField
                                                                fullWidth multiline rows={2} variant="outlined" size="small"
                                                                label="Açıklama"
                                                                value={menu.description}
                                                                onChange={(e) => onInputChange!("description", e.target.value)}
                                                            />
                                                        </Box>
                                                    </>
                                                }


                                                {menu.parentBoxId != null && menu.parentBoxId == rootId &&

                                                    <Box className="   flex flex-row  justify-end items-center gap-0 sm:gap-1 ">
                                                        <Box className="flex justify-end items-center gap-0">
                                                            <IconButton onClick={() => { onRemoveProduct && onRemoveProduct(menu.id) }}
                                                                size="small">
                                                                <Remove />
                                                            </IconButton>

                                                            <span> {menu.quantity} </span>
                                                            <IconButton onClick={() => { onAddProduct && onAddProduct(menu.id) }} size="small">
                                                                <Add />
                                                            </IconButton>
                                                        </Box>
                                                        <IconButton onClick={() => { onClearProduct && onClearProduct!(menu.id) }} size="small">
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            </Box>

                                        </FormGroup>

                                    </TableCell>
                                </TableRow>
                            </TableBody>


                            <TableBody>
                                {menu.parentBoxId == null && <>

                                    <TableRow>
                                        <TableCell align="right">
                                            <Button
                                                onClick={() => { setOpenProductSelectorModal(true) }}
                                                size="small" variant="contained" color="secondary" sx={{ marginTop: 1 }} startIcon={<Add />} >Add</Button>
                                        </TableCell>
                                    </TableRow>
                                </>}

                                {/* Recursive: Alt Menü/Ürün Listeleme */}
                                {menu.products && menu.products.length > 0 && (
                                    <TableRow>
                                        <TableCell padding="normal" colSpan={10} sx={{ pl: 1 }}>
                                            {menu.products.map((item) => (
                                                <MenuItemAddOrUpdateComponentContent
                                                    rootId={rootId}
                                                    onAddProduct={onAddProduct}
                                                    onClearProduct={onClearProduct}
                                                    onRemoveProduct={onRemoveProduct}
                                                    key={item.id}
                                                    menu={item}
                                                    avaibleProductImagePaths={avaibleProductImagePaths}
                                                    categories={categories}
                                                />
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>


                            <TableBody className="">
                                {/* Üst seviye menüde ek bilgi satırı */}
                                {menu.parentBoxId == null && (
                                    <TableRow>
                                        <TableCell >
                                            <Box className="flex justify-between">
                                                <FormGroup>
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                                                        <Box sx={{ mt: 0 }}>
                                                            <h3>Categories</h3>
                                                            <FormGroup>
                                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                                                                    {categories.map((cat) => (
                                                                        <FormControlLabel
                                                                            key={cat.id}
                                                                            control={
                                                                                <Checkbox
                                                                                    size="small"
                                                                                    checked={menu.categories.some(c => c.id === cat.id)}
                                                                                    onChange={() => onCategoryToggle!(cat)}
                                                                                />
                                                                            }
                                                                            label={cat.name}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            </FormGroup>
                                                        </Box>
                                                    </Box>
                                                </FormGroup>
                                                <Box className=" text-xs" sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: 'end',
                                                    gap: 1
                                                }}>
                                                    <span>Products Price Sum :  {menu.productsPrice ?? 0} TL </span>
                                                    <Box className="gap-1 flex items-center justify-center">
                                                        <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            label="Price / TL"
                                                            type="number"
                                                            value={menu.price}
                                                            onChange={(e) => onInputChange!("price", parseFloat(e.target.value) || 0)}
                                                            sx={{ width: "120px" }}
                                                        />
                                                    </Box>
                                                </Box>


                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                            {menu.parentBoxId == null &&
                                <TableBody>
                                    {/* Kaydet Butonu */}
                                    <TableRow>
                                        <TableCell align="right">
                                            <Button size="small" variant="contained" color="primary"
                                                startIcon={<Save />}
                                                onClick={() => {
                                                    console.log("----->", menu.quantity)
                                                    console.log("----->", menu)
                                                    onSubmitClicked && onSubmitClicked(menu)
                                                }}>
                                                Kaydet
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>}

                        </Table>
                    </TableContainer>



                    {menu.parentBoxId == null &&
                        <Box>

                            <MyModal
                                isOpen={isOpenImageSelectorModal}
                                onCloseClicked={() => { setOpenImageSelectorModal(false) }}
                            >
                                <ImageSelectorComponent
                                    imageUrlList={avaibleProductImagePaths}
                                    onChooseButtonClicked={function (imageUrl: string): void {
                                        handleImageSelect(imageUrl);
                                    }} />
                            </MyModal>

                            <MyModal isOpen={isOpenProductSelectorModal}
                                onCloseClicked={() => { setOpenProductSelectorModal(false) }} >
                                <ProductSelector
                                    products={productsForProductSelector ?? []}
                                    onChooseButtonClicked={function (selectedProduct: ProductModel): void {
                                        setOpenProductSelectorModal(false)
                                        console.log(selectedProduct.id);
                                        onAddProduct && onAddProduct(selectedProduct.id);

                                    }} ></ProductSelector>

                            </MyModal>

                        </Box>


                    }



                </Box>

        );
    };

export default React.memo(MenuItemAddOrUpdateComponentContent);
