import { ProductModel } from '@/domain/ProductModels';
import MyMasonry from '@/shared/components/MyMasonary';
import React, { useState } from 'react';
import AdminMenuItemTableComponent from '../admin/menumanagement/components/AdminMenuItemTableComponent';
import AdminProductTableComponent from '../admin/productmanagement/components/AdminProductTableComponent';
import { Button, Box, TextField } from '@mui/material';
import { join } from 'path';

// Props için interface tanımı
interface ProductSelectorProps {
    products: ProductModel[];
    onChooseButtonClicked: (selectedProduct: ProductModel) => void;
}

const ProductSelectorComponent: React.FC<ProductSelectorProps> = ({ products, onChooseButtonClicked }) => {
    const defaultBreakpoints = { default: 3, 1100: 2, 700: 2, 500: 1, 300: 1 };
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Ürünleri filtreleme fonksiyonu
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productComments.map(x => x.comment).join(" ").toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categories.map(x => x.name).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Ürünleri oluşturma fonksiyonu
    const getContents = (products: ProductModel[]) => {
        return products.map((p) => (
            <Box
                key={p.id}
                sx={{
                    border: selectedProduct?.id === p.id ? "3px solid blue" : "2px solid transparent",
                    borderRadius: "8px",
                    transition: "border-color 0.3s",
                    cursor: "pointer",
                    padding: "8px"
                }}
                onClick={() => setSelectedProduct(p)}
            >
                {p.products == null ? (
                    <AdminProductTableComponent product={p} showActions={false} />
                ) : (
                    <AdminMenuItemTableComponent menu={p} showActions={false} />
                )}
            </Box>
        ));
    };

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 0, width: "100%"
        }}>
            {/* Search Bar */}
            <TextField
                sx={{ margin: 2, marginBottom: 0, padding: 0 }}
                fullWidth
                label="Search Products"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Masonry Grid */}
            <MyMasonry breakpointCols={defaultBreakpoints} items={getContents(filteredProducts)} />

            {/* En alttaki "Choose Selected Product" butonu */}
            <Button
                variant="contained"
                size="medium"
                disabled={!selectedProduct} // Eğer ürün seçili değilse butonu disable et
                onClick={() => selectedProduct && onChooseButtonClicked(selectedProduct)} // ✅ Sadece seçili ürünü gönder
            >
                Choose Selected Product
            </Button>
        </Box>
    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(ProductSelectorComponent);
