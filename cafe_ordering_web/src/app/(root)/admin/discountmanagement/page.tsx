'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
    Container,
    TextField,
    Typography,
    Box,
    Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { ProductService } from '@/application/services/product/ProductService';
import { DiscountModel } from '@/domain/DiscountModels';
import DiscountComponent from './components/listComponents/DiscountComponent';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/app/routes/PageRoutes';
import MyMasonry from '@/shared/components/MyMasonary';
import { DiscountService } from '@/application/services/discount/DiscountService';
import Toast from '@/shared/Toast';


const discountService = new DiscountService();

const DiscountManagementPage: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [discounts, setDiscounts] = useState<DiscountModel[]>([]);



    useEffect(() => {
        discountService.loadDiscounts().then(response => {
            console.log(response);
            if (response.isSuccess) { setDiscounts(discountService.discounts!) }

            else { Toast.error(); }
            console.log(discounts);
        })
    }, [discountService])





    // Arama işlemi
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    const defaultBreakpoints = { default: 3, 1100: 2, 700: 2, 500: 1, 300: 1 };
    const getContent = (): ReactNode[] => {
        return discounts.map((d, i) => (<DiscountComponent key={i} discount={d} />));
    };

    if (discounts.length == 0) return <> <Box className="text-white">discount yok</Box>  </>
    return (

        <Container className="flex flex-col gap-5 text-white">

            <Box className="flex-1">
                <Box className="flex flex-row items-center gap-3">
                    {/* Arama Çubuğu */}
                    <TextField
                        color='secondary'
                        size="small"
                        label="İndirimlerde ara"
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
                <MyMasonry breakpointCols={defaultBreakpoints}
                    items={getContent()}></MyMasonry>
            </Box>




        </Container>
    );
};

export default React.memo(DiscountManagementPage);
