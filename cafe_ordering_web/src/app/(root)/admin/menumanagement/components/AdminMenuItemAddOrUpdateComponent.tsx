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
} from "@mui/material";
import { Add, Delete, Remove, Save } from "@mui/icons-material";
import ArrayListStream from "@/shared/ArrayListStream";
import ImageSelectorComponent from "@/shared/components/ImageSelectorComponent";
import MyModal from "@/shared/components/MyModal";
import ProductSelector from "@/app/(root)/components/ProductSelector";

interface AdminMenuItemAddOrUpdateComponentProps {
    menu?: ProductModel;
    onSubmitClicked?: (updatedMenu: ProductModel) => void;
}

const AdminMenuItemAddOrUpdateComponent: React.FC<AdminMenuItemAddOrUpdateComponentProps> = ({
    menu = ProductModel.getEmptyInstance(),
    onSubmitClicked,
}) => {

    useEffect(() => {
        { console.log("menu add update use effect", menu.parent) }
    }, [])

    const imageUrlList = ["antique-cafe-bg-01.jpg", "antique-cafe-bg-02.jpg",
        "antique-cafe-bg-03.jpg", "antique-cafe-bg-04.jpg", "menu-item-1.jpg",
        "menu-item-2.jpg"
    ]
    const repeatedImageUrlList = Array(10).fill(imageUrlList.map((url) => "/images/" + url)).flat();
    const [isOpenImageSelectorModal, setOpenImageSelectorModal] = useState<boolean>(false);
    const [isOpenProductSelectorModal, setOpenProductSelectorModal] = useState<boolean>(false);


    // Üst seviye menü için input alanlarında gösterilecek değerleri state ile tutuyoruz
    const [updatedMenu, setUpdatedMenu] = useState(menu);

    const handleInputChange = (key: keyof ProductModel, value: any) => {
        setUpdatedMenu(prevMenu => {
            const newMenu = prevMenu.copy({ [key]: value });
            return newMenu;
        });
    };

    // Görsel Yükleme
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            handleInputChange("imageUrl", imageUrl);
        }
    };


    const handleCategoryToggle = (category: CategoryModel) => {
        setUpdatedMenu(prevState => {
            const isSelected = prevState.categories.some(c => c.id === category.id);
            const updatedCategories = isSelected
                ? prevState.categories.filter(c => c.id !== category.id) // Kategoriyi kaldır
                : [...prevState.categories, category]; // Kategoriyi ekle

            return prevState.copy({ categories: updatedCategories });
        });
    };


    const handleAddProduct = (product: ProductModel) => {
        setUpdatedMenu(prevState => {
            product.parentBoxId = prevState.id;
            const updatedProducts = [...prevState.products!, product]
            return prevState.copy({ products: updatedProducts });
        });
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


    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
                                <FormGroup>
                                    <Box className="flex flex-col sm:flex-row gap-3">
                                        <Box className='flex flex-col  items-start sm:items-center gap-1'>
                                            <img
                                                src={updatedMenu.imagePath || `/images/image_not_found.png`}
                                                alt="Ürün Resmi"
                                                style={{
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


                                        </Box>

                                        {/* Başlık ve Açıklama */}
                                        <Box className="w-full flex flex-col gap-3">
                                            {menu.parentBoxId == null &&
                                                <>
                                                    <TextField
                                                        fullWidth variant="outlined" size="small"
                                                        label="Ürün Başlığı"
                                                        value={updatedMenu.name}
                                                        onChange={(e) => handleInputChange("productTitle", e.target.value)}
                                                    />
                                                    <TextField
                                                        fullWidth multiline rows={2} variant="outlined" size="small"
                                                        label="Açıklama"
                                                        value={updatedMenu.productDescription}
                                                        onChange={(e) => handleInputChange("productDescription", e.target.value)}
                                                    />
                                                </>
                                            }

                                            {menu.parentBoxId != null && <Box>
                                                <Typography variant="subtitle2" sx={{ textWrap: "wrap", fontSize: "0.9rem" }}>
                                                    {updatedMenu.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    textWrap: "wrap",
                                                    fontSize: "0.8rem",
                                                    color: "text.secondary",
                                                }}>
                                                    {updatedMenu.productDescription}
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    textWrap: "nowrap",
                                                    fontSize: "0.8rem",
                                                    color: "text.secondary",
                                                }}>
                                                    {updatedMenu.price + " TL"}
                                                </Typography>
                                            </Box>
                                            }

                                        </Box>

                                        {menu.parentBoxId != null && <>

                                            <Box className="  flex flex-row  justify-end items-center gap-0 sm:gap-1 ">
                                                <Box className="flex justify-end items-center gap-0">
                                                    <IconButton
                                                        size="small">
                                                        <Add />
                                                    </IconButton>

                                                    <span> {menu.parent?.products?.filter(x => x.id === menu.parentBoxId).length || 0} </span>
                                                    <IconButton onClick={() => { handleRemoveProduct(menu) }} size="small">
                                                        <Remove />
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
                                            key={item.id}
                                            menu={item}

                                        />
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
                                                            {CategoryModel.getExamples().map((cat) => (
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
                                            <span>Products Price Sum : 20.00</span>
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



            <MyModal isOpen={isOpenImageSelectorModal} onCloseClicked={() => { setOpenImageSelectorModal(false) }} >

                <ImageSelectorComponent imageUrlList={repeatedImageUrlList}
                    onChooseButtonClicked={function (imageUrl: string): void {
                        handleInputChange("imageUrl", imageUrl);
                        setOpenImageSelectorModal(false);
                    }} />
            </MyModal>


            <MyModal isOpen={isOpenProductSelectorModal} onCloseClicked={() => { setOpenProductSelectorModal(false) }} >

                <ProductSelector products={ProductModel.getExamples()}
                    onChooseButtonClicked={function (selectedProduct: ProductModel): void {
                        handleAddProduct(selectedProduct);
                        setOpenProductSelectorModal(false);
                    }} ></ProductSelector>

            </MyModal>


        </Box>

    );
};

export default React.memo(AdminMenuItemAddOrUpdateComponent);
