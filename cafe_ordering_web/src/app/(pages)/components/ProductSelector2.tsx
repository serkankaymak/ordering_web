import { ProductModel } from '@/domain/ProductModels';
import MyMasonry from '@/shared/components/MyMasonary';
import React, { useState } from 'react';
import AdminMenuItemTableComponent from '../admin/menumanagement/components/serverSideComponents/AdminMenuItemTableComponent';
import AdminProductTableComponent from '../admin/productmanagement/components/serverSideComponents/AdminProductTableComponent';
import { Button, Box, TextField, Pagination } from '@mui/material';
import { IComponent } from '@/app/types/ViewTypes';

interface ProductSelector2Props {
    pageSize?: number;
    products: ProductModel[];
    onChooseButtonClicked: (selectedProduct: ProductModel) => void;
}

const ProductSelector2Component: IComponent<ProductSelector2Props> = ({ products, onChooseButtonClicked, pageSize = 9 }) => {

    const defaultBreakpoints = { default: 3, 1100: 2, 700: 2, 500: 1, 300: 1 };
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    // Sayfa başına gösterilecek ürün sayısı

    // Ürünleri filtreleme fonksiyonu
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productComments.map(x => x.comment).join(" ").toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categories.map(x => x.name).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Toplam sayfa sayısı
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    // Mevcut sayfaya ait ürünler
    const currentProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Sayfa değiştirme işlemi
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: "100%" }}>
            {/* Search Bar */}
            <TextField
                sx={{ margin: 2, marginBottom: 0, padding: 0 }}
                fullWidth
                label="Search Products"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
                }}
            />

            {/* Masonry Grid */}
            <MyMasonry breakpointCols={defaultBreakpoints} items={getContents(currentProducts)} />

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{ marginTop: 2 }}
                />
            )}

            {/* Choose Selected Product Button */}
            <Button
                variant="contained"
                size="medium"
                disabled={!selectedProduct}
                onClick={() => selectedProduct && onChooseButtonClicked(selectedProduct)}
            >
                Choose Selected Product
            </Button>
        </Box>
    );
};

export default React.memo(ProductSelector2Component);
