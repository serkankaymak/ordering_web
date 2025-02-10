'use client';

import React, { useState, useEffect, useRef } from "react";
import { Save } from "@mui/icons-material";
import {
    CardMedia,
    TextField,
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
    Paper,
    Button,
} from "@mui/material";
import { CategoryModel, ProductModel } from "@/domain/ProductModels";

interface AdminProductAddOrUpdateCardProps {
    categories: CategoryModel[];
    product: ProductModel;
    /**
     * Güncellenmiş ürün bilgisinin yanı sıra seçilen görsel dosyasını (varsa) da gönderir.
     */
    onSaveClicked: (product: ProductModel, imageFile?: File) => void;
}

const AdminProductAddOrUpdateCard: React.FC<AdminProductAddOrUpdateCardProps> = ({
    categories: availableCategories,
    product,
    onSaveClicked,
}) => {
    // Ürün alanları için yerel state'ler
    const [productTitle, setProductTitle] = useState(product.productTitle);
    const [productDescription, setProductDescription] = useState(
        product.productDescription
    );
    const [productPrice, setProductPrice] = useState(product.price);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
        product.categories.map((cat) => cat.id)
    );

    // Görsel dosya yükleme ve önizleme için state'ler
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(product.imageUrl ?? `/images/image_not_found.png`);

    // Dosya inputuna erişim için referans (ref)
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Ürün bilgileri değiştiğinde state'leri güncelle
    useEffect(() => {
        setProductTitle(product.productTitle);
        setProductDescription(product.productDescription);
        setProductPrice(product.price);
        setSelectedCategoryIds(product.categories.map((cat) => cat.id));
        setImagePreview(product.imageUrl ?? `/images/image_not_found.png`);
        setImageFile(null);
    }, [product]);

    // Kategori seçimini toggle eden fonksiyon
    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Dosya seçimi gerçekleştiğinde dosya okunup önizleme güncellenir
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Form gönderimi
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedProduct: ProductModel = {
            ...product,
            productTitle,
            productDescription,
            price: productPrice,
            categories: availableCategories.filter((cat) => selectedCategoryIds.includes(cat.id)
            ),
            // Görsel URL'si, önizleme üzerinden güncelleniyor.
            imageUrl: imagePreview,
            isModelValid: function (): boolean {
                throw new Error("Function not implemented.");
            }
        };

        onSaveClicked(updatedProduct, imageFile || undefined);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: "auto" }}>
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{ display: "flex", alignItems: "inherit", flexDirection: { xs: "column", md: "row" }, gap: 3, }}
                >
                    {/* Görsel Bölümü */}
                    <Box sx={{ flex: 0.7 }}>
                        <CardMedia className="flex justify-center">
                            <img
                                src={imagePreview}
                                alt={product.productTitle}
                                style={{ maxHeight: 200, maxWidth: 250, width: "100%", height: "auto", borderRadius: 8, cursor: "pointer", }}
                                onClick={() => fileInputRef.current?.click()}
                            />
                        </CardMedia>
                        {/* Gizli dosya inputu */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        {/* Alternatif olarak buton ile de yükleme yapılabilir */}
                        <Box display={'none'} mt={2}>
                            <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
                                Upload Image
                            </Button>
                        </Box>
                    </Box>

                    {/* Form Bölümü */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Ürün Başlığı"
                            variant="outlined"
                            fullWidth
                            value={productTitle}
                            onChange={(e) => setProductTitle(e.target.value)}
                        />
                        <TextField
                            label="Ürün Açıklaması"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                        />
                        <TextField
                            label="Ürün Fiyatı"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                        />
                    </Box>
                </Box>

                {/* Kategoriler Bölümü */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Kategoriler
                    </Typography>
                    <FormGroup>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                            {availableCategories.map((cat) => (
                                <FormControlLabel
                                    key={cat.id}
                                    control={
                                        <Checkbox
                                            checked={selectedCategoryIds.includes(cat.id)}
                                            onChange={() => handleCategoryToggle(cat.id)}
                                        />
                                    }
                                    label={cat.name}
                                />
                            ))}
                        </Box>
                    </FormGroup>
                </Box>

                {/* Gönder Butonu */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<Save />}
                    >
                        {product.id !== 0 ? "Güncelle" : "Ekle"}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default React.memo(AdminProductAddOrUpdateCard);
