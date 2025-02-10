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
import AdminProductTableComponent from './components/AdminProductTableComponent';
import { useRouter } from 'next/navigation';
import MyModal from '@/shared/components/MyModal';
import AdminProductCard from './components/trash/AdminProductCard';
import { PageRoutes } from '@/app/roots/PageRoutes';


const productService = new ProductService();
const initialProducts = productService.products;

const ProductManagementPage: React.FC = () => {
  const router = useRouter();
  const [products] = useState<ProductModel[]>(initialProducts.filter(x => x.products == null));
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteRequestProductId, setDeleteRequestProductId] = useState<number>(0);

  const isDeleteModalShouldOpen = (): boolean => {
    return deleteRequestProductId != 0;
  }


  // Arama işlemi
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Arama sorgusuna göre ürünleri filtrele
  const filteredProducts = products.filter(product =>
    product.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) || product.productDescription.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  return (
    <Container className="flex flex-col gap-5">

      <Box className="flex-1">
        <Box className="flex flex-row items-center gap-3">
          {/* Arama Çubuğu */}
          <TextField
            color='secondary'
            size="small"
            label="Search Products"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
          />

          <Button
            onClick={() => { router.push(PageRoutes.ProductManagementAdd()) }}
            size="medium"
            variant="contained"
            color="primary"
            startIcon={<Add />}
          >
            Add
          </Button>
        </Box>
      </Box>


      <Box className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
        {
          filteredProducts.map(p => <>
            <AdminProductTableComponent key={p.id} showActions={true} product={p}
              onUpdateButtonClicked={(boxProductId: number): void => {
                router.push(`productmanagement/${boxProductId}/update`);
              }}
              onDeleteButtonClicked={function (boxProductId: number): void {
                setDeleteRequestProductId(boxProductId);
              }}              >
            </AdminProductTableComponent>
          </>)
        }
      </Box>

      <Box>
        <MyModal
          isOpen={isDeleteModalShouldOpen()}
          children={<>
            <Box>
              <AdminProductTableComponent
                showActions={false}
                product={ProductModel.getExample(deleteRequestProductId)}
              ></AdminProductTableComponent>

              <Typography sx={{ mt: 1 }} variant='subtitle2'>
                Bu ürünü silmeyi onaylıyor musunuz?
              </Typography>
              <Box sx={{
                display: 'flex', flexDirection: 'row', justifyContent: 'end', mt: 1
              }}>
                <Button color='success' onClick={() => { setDeleteRequestProductId(0) }}  >Cancel</Button>
                <Button color='error' onClick={() => { }} >Delete</Button>
              </Box>
            </Box>

          </>}
          onCloseClicked={() => {
            setDeleteRequestProductId(0);
          }}></MyModal>
      </Box>

    </Container>
  );
};

export default React.memo(ProductManagementPage);
