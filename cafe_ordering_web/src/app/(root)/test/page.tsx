"use client";
import React from 'react';
import { Box, Grid2 } from '@mui/material';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.snow.css';
import AdminProductCard from '../admin/productmanagement/components/trash/AdminProductCard';
import { CategoryModel, ProductModel } from '@/domain/ProductModels';
import AdminProductAddOrUpdateCard from '../admin/productmanagement/components/AdminProductAddOrUpdateCard';
import DiscountItemProductComponent from '../admin/discountmanagement/components/components/DiscountItemProductComponent';
import { Discount, DiscountItem } from '@/domain/DiscountModels';
import DiscountItemComponent from '../admin/discountmanagement/components/components/DiscountItemComponent';
import DiscountProductBasedComponent from '../admin/discountmanagement/components/DiscountProductBasedComponent';
import DiscountSpecialBasedComponent from '../admin/discountmanagement/components/DiscountSpecialBasedComponent';



const TestPage: React.FC = () => {
    React.useEffect(() => {

    }, []);


    return (
        <Box sx={{ overflow: 'scroll' }} className=" grid  
                   grid-cols-1  md:grid-cols-3 sm:grid-cols-2
                   gap-2
                   " >


            <DiscountProductBasedComponent discount={Discount.getProductBasedExample()}>

            </DiscountProductBasedComponent>

            <DiscountSpecialBasedComponent discount={Discount.getSpecialBasedExample()}>

            </DiscountSpecialBasedComponent>


        </Box>
    );
};

export default TestPage;