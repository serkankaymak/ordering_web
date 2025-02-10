'use client';

import React, { useState } from 'react';
import { CategoryModel, ProductModel } from '@/domain/ProductModels';
import {
  Container,
  TextField,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { ProductService } from '@/application/services/product/ProductService';
import MyModal from '@/shared/components/MyModal';
import AdminProductAddOrUpdateCard from '../components/AdminProductAddOrUpdateCard';
import ProductListComponent from '../components/trash/ProductListComponents';
import AdminProductTableComponent from '../components/AdminProductTableComponent';



const productService = new ProductService();
const initialProducts = productService.products;
const exampleCategories = CategoryModel.getExamples();

const ProductManagementPage: React.FC = () => {
  const [products] = useState<ProductModel[]>(initialProducts.filter(x => x.products == null));
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(
    initialProducts.length > 0 ? initialProducts[0] : null
  );
  const [newProduct] = useState<ProductModel>(
    new ProductModel(0, "", "", 0, null)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductUpdateModalOpen, setProductUpdateModalOpen] = useState<boolean>(false);
  const [isProductAddModalOpen, setProductAddModalOpen] = useState<boolean>(false);

  // Arama işlemi
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Arama sorgusuna göre ürünleri filtrele
  const filteredProducts = products.filter(product =>
    product.productTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ürün kartına tıklandığında update modal'ını aç
  const handleOpenUpdateModal = (id: string | number) => {
    const product = products.find(x => x.id === id);
    if (product) {
      setSelectedProduct(product);
      setProductUpdateModalOpen(true);
    }
  };

  const handleUpdateSubmit = (updatedProduct: ProductModel) => {
    console.log('Güncellenmiş ürün:', updatedProduct);
    setProductUpdateModalOpen(false);
  };

  const handleAddSubmit = (addedProduct: ProductModel) => {
    console.log('Eklenecek ürün:', addedProduct);
    setProductAddModalOpen(false);
  };

  return (
    <Container className="flex flex-col">
      <Typography textAlign={'center'} variant="h4" gutterBottom>
        Product Management
      </Typography>

      <Box className="flex-1">
        <Box className="flex flex-row items-center gap-3">
          {/* Arama Çubuğu */}
          <TextField
            size="small"
            label="Search Products"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
          />

          <Button
            onClick={() => setProductAddModalOpen(true)}
            size="medium"
            variant="contained"
            color="primary"
            startIcon={<Add />}
          >
            Add
          </Button>
        </Box>

        {/* Ürün listelemesi: ProductListComponent içeride pagination ve grid işlemlerini yönetir */}
        <ProductListComponent
          products={filteredProducts}
          onProductClick={handleOpenUpdateModal}
        />


        <Box className='grid grid-cols-2 gap-2'>
          {

            products.map(p => <>
              <AdminProductTableComponent product={p} showActions={false}></AdminProductTableComponent>
            </>)
          }
        </Box>

      </Box>

      <Box>
        {/* Güncelleme Modal'ı */}
        <MyModal
          isOpen={isProductUpdateModalOpen}
          onCloseClicked={() => setProductUpdateModalOpen(false)}
        >
          {selectedProduct && (
            <AdminProductAddOrUpdateCard
              categories={exampleCategories}
              product={selectedProduct}
              onSaveClicked={handleUpdateSubmit}
            />
          )}
        </MyModal>

        {/* Ekleme Modal'ı */}
        <MyModal
          isOpen={isProductAddModalOpen}
          onCloseClicked={() => setProductAddModalOpen(false)}
        >
          <AdminProductAddOrUpdateCard
            categories={exampleCategories}
            product={newProduct}
            onSaveClicked={handleAddSubmit}
          />
        </MyModal>
      </Box>
    </Container>
  );
};

export default React.memo(ProductManagementPage);
