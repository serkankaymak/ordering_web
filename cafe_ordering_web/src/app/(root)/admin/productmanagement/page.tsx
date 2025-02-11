'use client';

import React, { useEffect, useState } from 'react';
import { ProductModel } from '@/domain/ProductModels';
import {
  Container,
  TextField,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { ProductService } from '@/application/services/product/ProductService';
import AdminProductTableComponent from './components/AdminProductTableComponent';
import { useRouter } from 'next/navigation';
import MyModal from '@/shared/components/MyModal';
import { PageRoutes } from '@/app/roots/PageRoutes';
import { GetProductsRequest } from '@/application/httpRequests/GetProductsRequest';
import DataLoadingComponent from '../../components/DataLoadingComponent';
import { error } from 'console';
import Toast from '@/shared/Toast';

const productService = new ProductService();

const ProductManagementPage: React.FC = () => {
  const router = useRouter();

  // Tüm state'leri bileşenin en üstünde tanımlayalım.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteRequestProductId, setDeleteRequestProductId] = useState<number>(0);

  // Veri çekme işlemi: useEffect
  useEffect(() => {
    productService.loadProducts()
      .then(() => {
        setProducts(productService.products.filter(x => x.products == null || x.products.length == 0));
      })
      .catch((error) => { console.error(error); })
      .finally(() => { setIsLoading(false); });
  }, []);

  // Eğer yükleniyorsa, DataLoadingComponent gösterelim
  if (isLoading) {
    return <DataLoadingComponent message="Loading products..." />;
  }

  // Silme modalının açık olup olmadığını belirtiyoruz.
  const isDeleteModalShouldOpen = (): boolean => deleteRequestProductId !== 0;;

  // Arama sorgusu değiştiğinde çalışacak fonksiyon
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filtrelenmiş ürünler
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Container className="flex flex-col gap-5">
      <Box className="flex-1">
        <Box className="flex flex-row items-center gap-3">
          {/* Arama Çubuğu */}
          <TextField
            color="secondary"
            size="small"
            label="Search Products"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
          />

          <Button
            onClick={() => {
              router.push(PageRoutes.ProductManagementAdd());
            }}
            size="medium"
            variant="contained"
            color="primary"
            startIcon={<Add />}
          >
            Add
          </Button>
        </Box>
      </Box>

      {/* Ürün Listesi */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredProducts.map((p) => (
          <AdminProductTableComponent
            key={p.id}
            product={p}
            showActions={true}
            onUpdateButtonClicked={(productId: number) => {
              router.push(`productmanagement/${productId}/update`);
            }}
            onDeleteButtonClicked={(productId: number) => {
              setDeleteRequestProductId(productId);
              console.log(productId);
            }}
          />
        ))}
      </Box>

      {/* Silme Onay Modalı */}
      <Box>
        <MyModal
          isOpen={isDeleteModalShouldOpen()}
          onCloseClicked={() => {
            setDeleteRequestProductId(0);
          }}
        >
          <Box>
            {/* Silinecek ürünü örnek olarak gösteriyoruz */}
            <AdminProductTableComponent
              showActions={false}
              product={products.filter(x => x.id == deleteRequestProductId)[0] ?? ProductModel.getEmptyInstance()}
            />

            <Typography sx={{ mt: 1 }} variant="subtitle2">
              Bu ürünü silmeyi onaylıyor musunuz?
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
                mt: 1,
              }}
            >
              <Button
                color="success"
                onClick={() => {
                  setDeleteRequestProductId(0);
                }}
              >
                Cancel
              </Button>
              <Button
                color="error"
                onClick={() => {
                  productService.DeleteProductAsync(deleteRequestProductId).then(isSuccess => {
                    if (isSuccess) { 
                      setProducts(products.filter(x=>x.id!=deleteRequestProductId))
                      Toast.success(); 
                    }
                    else { Toast.error(); }
                    setDeleteRequestProductId(0);
                  })
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </MyModal>
      </Box>
    </Container>
  );
};

// React.memo yerine normal export edebilirsiniz.
// Performans ihtiyacı varsa, alt bileşenlerde veya farklı yerlerde optimize kullanın.
export default ProductManagementPage;
