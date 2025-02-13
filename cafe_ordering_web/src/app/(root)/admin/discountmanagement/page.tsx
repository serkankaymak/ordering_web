'use client';

import React, { ReactNode, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/app/routes/PageRoutes';
import MyMasonry from '@/shared/components/MyMasonary';


const productService = new ProductService();

const DiscountManagementPage: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [discounts] = useState<Discount[]>(Discount.getExamples());
    // Arama işlemi
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    const defaultBreakpoints = { default: 3, 1100: 2, 700: 2, 500: 1, 300: 1 };

    const getContent = (): ReactNode[] => {
        return discounts.map((d, i) => (
            <DiscountComponent key={i} discount={d} />
        ));
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
                        onClick={() => { console.log("add..."); router.push(AppRoutes.DiscountManagementAdd()); }}
                        size="medium"
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                    >
                        Add
                    </Button>
                </Box>
            </Box>


            <Box className="w-full">
                <MyMasonry breakpointCols={defaultBreakpoints} items={getContent()}></MyMasonry>
            </Box>

           


        </Container>
    );
};

export default React.memo(DiscountManagementPage);
