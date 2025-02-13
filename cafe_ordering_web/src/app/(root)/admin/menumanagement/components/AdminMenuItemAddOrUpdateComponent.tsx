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
import ArrayListStream from "@/shared/ArrayListStream";
import ImageSelectorComponent from "@/shared/components/ImageSelectorComponent";
import MyModal from "@/shared/components/MyModal";
import ProductSelector from "@/app/(root)/components/ProductSelector";

interface AdminMenuItemAddOrUpdateComponentProps {
    categories: CategoryModel[],
    avaibleProductImagePaths: string[];
    menu?: ProductModel;
    onSubmitClicked?: (updatedMenu: ProductModel) => void;
    menuCount?: number
}

const AdminMenuItemAddOrUpdateComponent: React.FC<AdminMenuItemAddOrUpdateComponentProps> = ({
    menu = ProductModel.getEmptyInstance(),
    onSubmitClicked,
    categories,
    avaibleProductImagePaths
}) => {

    const [isOpenImageSelectorModal, setOpenImageSelectorModal] = useState<boolean>(false);
    const [isOpenProductSelectorModal, setOpenProductSelectorModal] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string>(menu.getImagePathForShow())
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        { console.log("menu add update use effect", menu.parent) }
    }, [])


    // Üst seviye menü için input alanlarında gösterilecek değerleri state ile tutuyoruz
    const [updatedMenu, setUpdatedMenu] = useState(menu);

    const handleInputChange = (key: keyof ProductModel, value: any) => {
        setUpdatedMenu(prevMenu => {
            const newMenu = prevMenu.copy({ [key]: value });
            return newMenu;
        });
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            handleInputChange("imagePath", null);

        }
    };


    const handleImageSelect = (imagePath: string) => {
        handleInputChange("imagePath", imagePath);
        setImagePreview(imagePath);
        setOpenImageSelectorModal(false);
    }

    const handleCategoryToggle = (category: CategoryModel) => {
        setUpdatedMenu(prevState => {
            const isSelected = prevState.categories.some(c => c.id === category.id);
            const updatedCategories = isSelected
                ? prevState.categories.filter(c => c.id !== category.id) // Kategoriyi kaldır
                : [...prevState.categories, category]; // Kategoriyi ekle

            return prevState.copy({ categories: updatedCategories });
        });
    };


    const handleProductAddSelect = (product: ProductModel) => {
        setUpdatedMenu(prevState => {
            product.parentBoxId = prevState.id;
            const updatedProducts = [...prevState.products!, product]
            return prevState.copy({ products: updatedProducts });
        });
        setOpenProductSelectorModal(false);
    };

    const handleRemoveProduct = (product: ProductModel) => {
        setUpdatedMenu(prevState => {
            const updatedProducts = [...prevState.products!]; // Mevcut ürünleri kopyala
            const indexToRemove = updatedProducts.findIndex(p => p.id === product.id);
            if (indexToRemove !== -1) {
                updatedProducts.splice(indexToRemove, 1); // Sadece ilk eşleşeni kaldır
            }
            return prevState.copy({ products: updatedProducts });
        });
    };




    return (

        <Box>

            <TableContainer
                className="border my-1"
                component={Paper}
                sx={{
                    width: "100%", overflowX: "auto",
                    mb: 0,
                    px: updatedMenu.parentBoxId == null ? 0 : 0,
                    py: updatedMenu.parentBoxId == null ? 2 : 0,
                }}
            >


                <Table size="small" sx={{ "& td, & th": { borderBottom: "none" } }}>
                    <TableBody>

                        <TableRow>
                            <TableCell>
                                {menu.}
                            </TableCell>
                        </TableRow>

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
                                                        whiteSpace: "normal",
                                                        overflowWrap: "break-word",
                                                        fontSize: "0.9rem",
                                                    }}
                                                >
                                                    {menu.name}
                                                </Typography>
                                                <Chip size="small" label={menu.price + " TL"} />
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
                                                <Box className="w-full flex flex-col gap-3">
                                                    <TextField
                                                        fullWidth variant="outlined" size="small"
                                                        label="Ürün Başlığı"
                                                        value={updatedMenu.name}
                                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                                    />
                                                    <TextField
                                                        fullWidth multiline rows={2} variant="outlined" size="small"
                                                        label="Açıklama"
                                                        value={updatedMenu.description}
                                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                                    />
                                                </Box>
                                            </>
                                        }


                                        {menu.parentBoxId != null && <>

                                            <Box className="   flex flex-row  justify-end items-center gap-0 sm:gap-1 ">
                                                <Box className="flex justify-end items-center gap-0">
                                                    <IconButton
                                                        size="small">
                                                        <Remove />
                                                    </IconButton>

                                                    <span> {menu.parent?.products?.filter(x => x.id === menu.parentBoxId).length || 0} </span>
                                                    <IconButton onClick={() => { handleRemoveProduct(menu) }} size="small">
                                                        <Add />
                                                    </IconButton>
                                                </Box>
                                                <IconButton size="small">
                                                    <Delete />
                                                </IconButton>
                                            </Box></>}
                                    </Box>

                                </FormGroup>

                            </TableCell>
                        </TableRow>
                    </TableBody>


                    <TableBody>
                        {menu.parentBoxId == null && <>
                            <hr></hr>
                            <TableRow>
                                <TableCell align="right">
                                    <Button
                                        onClick={() => { setOpenProductSelectorModal(true) }}
                                        size="small" variant="contained" color="secondary" sx={{ marginTop: 1 }} startIcon={<Add />} >Add</Button>
                                </TableCell>
                            </TableRow>
                        </>}

                        {/* Recursive: Alt Menü/Ürün Listeleme */}
                        {updatedMenu.products && updatedMenu.products.length > 0 && (
                            <TableRow>
                                <TableCell padding="normal" colSpan={10} sx={{ pl: 1 }}>
                                    {updatedMenu.products.map((item) => (
                                        <AdminMenuItemAddOrUpdateComponent
                                            menuCount={updatedMenu.products?.filter(x => x.id == item.id).length}
                                            key={item.id}
                                            menu={item}
                                            avaibleProductImagePaths={avaibleProductImagePaths}
                                            categories={categories} />
                                    ))}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>


                    <TableBody className="">
                        {/* Üst seviye menüde ek bilgi satırı */}
                        {updatedMenu.parentBoxId == null && (
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
                                                                            checked={updatedMenu.categories.some(c => c.id === cat.id)}
                                                                            onChange={() => handleCategoryToggle(cat)}
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
                                                    value={updatedMenu.price}
                                                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                                                    sx={{ width: "120px" }}
                                                />
                                            </Box>
                                        </Box>


                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    {menu.parentBoxId == null && <TableBody>
                        {/* Kaydet Butonu */}
                        <TableRow>
                            <TableCell align="right">
                                <Button size="small" variant="contained" color="primary"
                                    startIcon={<Save />}
                                    onClick={() => onSubmitClicked && onSubmitClicked(updatedMenu)}>
                                    Kaydet
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>}

                </Table>
            </TableContainer>



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


            <MyModal isOpen={isOpenProductSelectorModal} onCloseClicked={() => { setOpenProductSelectorModal(false) }} >
                <ProductSelector products={ProductModel.getExamples()}
                    onChooseButtonClicked={function (selectedProduct: ProductModel): void {
                        handleProductAddSelect(selectedProduct);
                    }} ></ProductSelector>

            </MyModal>


        </Box>

    );
};

export default React.memo(AdminMenuItemAddOrUpdateComponent);
