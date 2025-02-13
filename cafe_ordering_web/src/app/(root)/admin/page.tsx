'use client';

import React from 'react';
import { CategoryModel } from '@/domain/ProductModels';
import {
  Container,
  Typography,
} from '@mui/material';
import { ProductService } from '@/application/services/product/ProductService';
import { IPage } from '@/app/types/ViewTypes';


const productService = new ProductService();
const AdminPage: IPage = () => {
  return (
    <Container className="flex flex-col">
      <Typography textAlign={'center'} variant="h4" gutterBottom>
        Some Analyses...
      </Typography>
    </Container>
  );
};

export default React.memo(AdminPage);
