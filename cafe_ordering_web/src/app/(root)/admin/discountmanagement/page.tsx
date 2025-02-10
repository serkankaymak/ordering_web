'use client';

import React, { useState } from 'react';
import {
    Container,
    TextField,
    Typography,
    Box,
    Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { ProductService } from '@/application/services/product/ProductService';
import { Discount } from '@/domain/DiscountModels';
import DiscountComponent from './components/DiscountComponent';


const productService = new ProductService();

const DiscountManagementPage: React.FC = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [discounts] = useState<Discount[]>(Discount.getExamples());
    // Arama işlemi
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };


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
                        onClick={() => () => { }}
                        size="medium"
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                    >
                        Add
                    </Button>
                </Box>
            </Box>

            <Box className=" grid  
             grid-cols-1  md:grid-cols-3 sm:grid-cols-2
             gap-2
             " >
                {discounts.map((d, i) => <>
                    <DiscountComponent discount={d}></DiscountComponent>
                </>)}

            </Box>


        </Container>
    );
};

export default React.memo(DiscountManagementPage);
