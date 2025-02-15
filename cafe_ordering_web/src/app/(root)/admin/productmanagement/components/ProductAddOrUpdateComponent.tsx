import { IComponent } from "@/app/types/ViewTypes";
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import ImageSelectorComponent from "@/shared/components/ImageSelectorComponent";
import MyModal from "@/shared/components/MyModal";
import { Save } from "@mui/icons-material";
import {
    Box, Table, TableBody, TableCell, TableRow, TableContainer, Paper,
    TextField, Button, FormGroup,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import React, { ChangeEvent, useState, useRef, useEffect } from "react";

interface AdminProductAddOrUpdateComponentProps {
    categories: CategoryModel[];
    product?: ProductModel;
    imageUrlList: string[],
    onSubmitClicked?: (updatedProduct: ProductModel, formFile: File | null) => void;

}

const AdminProductAddOrUpdateComponent: IComponent<AdminProductAddOrUpdateComponentProps> = ({
    product = ProductModel.getEmptyInstance(), onSubmitClicked, imageUrlList, categories
}) => {

    useEffect(() => { }, [])

    const [isOpenImageSelectorModal, setOpenImageSelectorModal] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null); // Kullanıcının yüklediği dosyayı saklar
    const [updatedProduct, setUpdatedProduct] = useState<ProductModel>(product);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imagePreviewPath, setImagePreviewPath] = useState<string>(product.getImagePathForShow())

    // Ürün Bilgilerini Güncelleme
    const handleInputChange = (key: keyof ProductModel, value: any) => {
        setUpdatedProduct(prevState => prevState.copy({ [key]: value }));
    };

    // Kullanıcının Görsel Yüklemesi
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setUploadedFile(file); // Form dosyasını sakla
            const imageUrl = URL.createObjectURL(file);
            setImagePreviewPath(imageUrl);
            handleInputChange("imagePath", null);
        }
    };

    // Kategori Seçme / Kaldırma
    const handleCategoryToggle = (category: CategoryModel) => {
        setUpdatedProduct(prevState => {
            const isSelected = prevState.categories.some(c => c.id === category.id);
            const updatedCategories = isSelected
                ? prevState.categories.filter(c => c.id !== category.id) // Kategoriyi kaldır
                : [...prevState.categories, category]; // Kategoriyi ekle

            return prevState.copy({ categories: updatedCategories });
        });
    };

    return (
        <Box>
            <TableContainer className='border' component={Paper} sx={{ mb: 2, p: 2 }}>
                <Table padding='none' sx={{ "& td, & th": { borderBottom: "none" } }} size="small">
                    <TableBody>
                        {/* Ürün Görseli */}
                        <TableRow>
                            <TableCell>
                                <FormGroup>
                                    <Box className="flex flex-col sm:flex-row gap-3">
                                        <Box className='flex flex-col items-center gap-1'>
                                            <img
                                                src={imagePreviewPath}
                                                alt="Ürün Resmi"
                                                style={{
                                                    width: "80px", height: "80px",
                                                    objectFit: "cover", borderRadius: "6px"
                                                }}
                                            />
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleImageUpload}
                                            />
                                            <Box>
                                                <Button
                                                    onClick={() => { setOpenImageSelectorModal(true) }}
                                                    size="small"
                                                    variant="outlined"
                                                >
                                                    Choose
                                                </Button>
                                                <Button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    size="small"
                                                    variant="outlined"
                                                >
                                                    Upload
                                                </Button>
                                            </Box>
                                        </Box>

                                        {/* Başlık ve Açıklama */}
                                        <Box className="w-full flex flex-col gap-3">
                                            <TextField
                                                fullWidth variant="outlined" size="small"
                                                label="Ürün Başlığı"
                                                value={updatedProduct.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                            />
                                            <TextField
                                                fullWidth multiline rows={2} variant="outlined" size="small"
                                                label="Açıklama"
                                                value={updatedProduct.description}
                                                onChange={(e) => handleInputChange("description", e.target.value)}
                                            />
                                        </Box>
                                    </Box>
                                </FormGroup>
                            </TableCell>
                        </TableRow>

                        {/* Kategori Seçimi */}
                        <TableRow>
                            <TableCell>
                                <Box className="flex items-center justify-between mt-3 mb-3">
                                    <Box sx={{ mt: 0 }}>
                                        <h3>Categoriler</h3>
                                        <FormGroup>
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                                                {categories.map((cat) => (
                                                    <FormControlLabel
                                                        key={cat.id}
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={updatedProduct.categories.some(c => c.id === cat.id)}
                                                                onChange={() => handleCategoryToggle(cat)}
                                                            />
                                                        }
                                                        label={cat.name}
                                                    />
                                                ))}
                                            </Box>
                                        </FormGroup>
                                    </Box>
                                    <Box>
                                        <TextField
                                            variant="outlined" size="small"
                                            label="Fiyat (TL)"
                                            type="number"
                                            value={updatedProduct.price}
                                            onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                                            sx={{ width: "120px" }}
                                        />
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>

                        {/* Kaydet Butonu */}
                        <TableRow>
                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save />}
                                    onClick={() => onSubmitClicked && onSubmitClicked(updatedProduct, uploadedFile)}
                                >
                                    Kaydet
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Görsel Seçme Modal */}
            <MyModal isOpen={isOpenImageSelectorModal} onCloseClicked={() => { setOpenImageSelectorModal(false) }} >
                <ImageSelectorComponent
                    imageUrlList={imageUrlList}
                    onChooseButtonClicked={function (imageUrl: string): void {
                        handleInputChange("imagePath", imageUrl);
                        setImagePreviewPath(imageUrl);
                        setUploadedFile(null); // Varolan görsellerden seçildiği için dosyayı null yap
                        setOpenImageSelectorModal(false);
                    }}
                />
            </MyModal>
        </Box>
    );
};

export default React.memo(AdminProductAddOrUpdateComponent);
