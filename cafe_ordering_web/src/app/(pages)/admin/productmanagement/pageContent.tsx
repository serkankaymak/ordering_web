'use client';

import React, { useEffect, useState } from 'react';
import { ProductModel } from '@/domain/ProductModels';
import { Container, TextField, Typography, Box, Button, } from '@mui/material';
import { Add } from '@mui/icons-material';
import AdminProductTableComponent from './components/serverSideComponents/AdminProductTableComponent';
import { useRouter } from 'next/navigation';
import MyModal from '@/shared/components/MyModal';
import { AppRoutes } from '@/app/routes/PageRoutes';
import Toast from '@/shared/Toast';
import { IPageContent } from '@/app/types/ViewTypes';
import { ProductService } from '@/application/services/product/ProductService';


const productService = new ProductService();

interface ProductManagementPageContentProps {
    productsJsonOrProductList: ProductModel[] | any
}

const ProductManagementPageContent: IPageContent<ProductManagementPageContentProps> = ({ productsJsonOrProductList: productsJson }) => {

    const [products, setProducts] = useState<ProductModel[]>(() => {
        if (typeof productsJson === 'string') { return (JSON.parse(productsJson) as any[]).map(json => ProductModel.fromJson(json)); }
        else if (Array.isArray(productsJson)) { return productsJson.map(json => ProductModel.fromJson(json)); }
        return [];
    });

    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteRequestProductId, setDeleteRequestProductId] = useState<number>(0);

    useEffect(() => { }, [])

    // Filtrelenmiş ürünler
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Silme modalının açık olup olmadığını belirtiyoruz.
    const isDeleteModalShouldOpen = (): boolean => deleteRequestProductId !== 0;;
    // Arama sorgusu değiştiğinde çalışacak fonksiyon
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(event.target.value); };


    return (
        <Container className="flex flex-col gap-5">
            <Box className="flex-1">
                <Box className="flex flex-row items-center gap-3">

                    <TextField
                        color="secondary"
                        size="small"
                        label="ürünlerde ara"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearch}
                    />

                    <Button
                        onClick={() => {
                            router.push(AppRoutes.ProductManagementAdd());
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

            <Box>
                <MyModal
                    isOpen={isDeleteModalShouldOpen()}
                    onCloseClicked={() => {
                        setDeleteRequestProductId(0);
                    }}
                >
                    <Box>
                        <AdminProductTableComponent
                            showActions={false}
                            product={products.filter(x => x.id == deleteRequestProductId)[0] ?? ProductModel.getEmptyProductInstance()}
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
                                    productService.DeleteProductAsync(deleteRequestProductId).then(response => {
                                        if (response.isSuccess) {
                                            setProducts(products.filter(x => x.id != deleteRequestProductId))
                                            Toast.success();
                                        }
                                        else { Toast.error(response.errorMessage!); }
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


export default ProductManagementPageContent;
