'use client'
import React, { useEffect, useState } from 'react';
import OrderPageContent from './pageContent';
import { Container } from '@mui/material';
import { IPage } from '@/app/types/ViewTypes';
import { OrderService } from '@/application/services/product/OrderService';
import { OrderModel } from '@/domain/OrderModels';


const orderService = new OrderService();

const OrderPage: IPage =  () => {



  return (
    <Container className="flex flex-col">
      <OrderPageContent  />
    </Container>
  );
};

export default OrderPage;
