'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
    Container,
    TextField,
    Box,
    Button,
    Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { DiscountModel } from '@/domain/DiscountModels';
import DiscountComponent from './components/listComponents/DiscountComponent';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/app/routes/PageRoutes';
import MyMasonry from '@/shared/components/MyMasonary';
import { DiscountService } from '@/application/services/discount/DiscountService';
import Toast from '@/shared/Toast';
import { IPageContent } from '@/app/types/ViewTypes';
import { ProductModel } from '@/domain/ProductModels';
import MyModal from '@/shared/components/MyModal';
import AdminProductTableComponent from '../productmanagement/components/serverSideComponents/AdminProductTableComponent';

interface DiscountManagementPageContentPros { }

const DiscountManagementPageContent: IPageContent<DiscountManagementPageContentPros> = ({ }) => {
    const discountService = new DiscountService();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [discounts, setDiscounts] = useState<DiscountModel[]>([]);
    const [deleteRequestDiscountId, setDeleteRequestDiscountId] = useState<number>(0);
    // Silme modalının açık olup olmadığını belirtiyoruz.
    const isDeleteModalShouldOpen = (): boolean => deleteRequestDiscountId !== 0;
    useEffect(() => {
        discountService.loadDiscounts().then(response => {
            if (response.isSuccess) {
                setDiscounts(discountService.discounts!);
            } else {
                Toast.error();
            }
            console.log(discounts);
        });
    }, []);

    // Arama işlemi
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const defaultBreakpoints = { default: 3, 1100: 2, 700: 2, 500: 1, 300: 1 };

    if (discounts.length === 0) {
        return (
            <Box className="text-white">discount yok</Box>
        );
    }

    return (
        <Container className="flex flex-col gap-5 text-white">
            <Box className="flex-1">
                <Box className="flex flex-row items-center gap-3">
                    {/* Arama Çubuğu */}
                    <TextField
                        color="secondary"
                        size="small"
                        label="İndirimlerde ara"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <Button
                        onClick={() => {
                            console.log("add...");
                            router.push(AppRoutes.DiscountManagementAdd());
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

            <Box className="w-full">
                <MyMasonry
                    breakpointCols={defaultBreakpoints}
                    items={discounts.map((d, i) => (
                        <DiscountComponent
                            onUpdateClicked={(id: number) => {
                                router.push(`discountmanagement/${id}/update`);
                            }}
                            onDeleteClicked={(id: number) => {
                                setDeleteRequestDiscountId(id);
                                console.log(id);
                            }}
                            key={i} discount={d} />
                    ))}
                />
            </Box>



            {/* Silme Onay Modalı */}
            <Box >
                <MyModal
                    className="w-[100%] md:w-[70%]"
                    isOpen={isDeleteModalShouldOpen()}
                    onCloseClicked={() => {
                        setDeleteRequestDiscountId(0);
                    }}
                >
                    <Box>

                        <DiscountComponent discount={discounts.filter(x => x.id == deleteRequestDiscountId)[0]}></DiscountComponent>
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
                                    setDeleteRequestDiscountId(0);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="error"
                                onClick={() => {

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

export default React.memo(DiscountManagementPageContent);
