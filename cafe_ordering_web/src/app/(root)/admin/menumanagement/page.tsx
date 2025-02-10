'use client';

import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { ProductModel } from "@/domain/ProductModels";
import AdminMenuItemCardComponent from "./components/trash/AdminMenuItemCardComponent";
import { ProductService } from "@/application/services/product/ProductService";
import AdminMenuItemTableComponent from "./components/AdminMenuItemTableComponent";
import { Add } from "@mui/icons-material";
import MyModal from "@/shared/components/MyModal";
import { useRouter, useParams } from "next/navigation"; // Next.js 13 hook'ları
var productService = new ProductService();

const MenuManagementPage: React.FC = () => {
    const router = useRouter();
    // Top-level menülerin listesi
    const [menus, setMenus] = useState<ProductModel[]>(productService.products.filter(x => x.products != null));
    const [searchQuery, setSearchQuery] = useState('');
    // Arama işlemi
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    // Arama sorgusuna göre ürünleri filtrele
    const filteredProducts = menus.filter(product =>
        product.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) || product.productDescription.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
    );
    const [deleteRequestProductId, setDeleteRequestProductId] = useState<number>(0);

    const isDeleteModalShouldOpen = (): boolean => {
        return deleteRequestProductId != 0;
    }

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
                        onClick={() => { }}
                        size="medium"
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                    >
                        Add
                    </Button>
                </Box>
            </Box>


            {/* Eklenmiş Menüler */}
            <Box className=" grid  
             grid-cols-1  md:grid-cols-3 sm:grid-cols-2
             gap-2
             " >

                {filteredProducts.map((menu) => (
                    <AdminMenuItemTableComponent
                        key={menu.id} menu={menu}
                        showActions={true}
                        onUpdateButtonClicked={(id) => {
                            router.push(`menumanagement/${id}/update`);

                        }}
                        onDeleteButtonClicked={(id) => {
                            console.log(id);
                            setDeleteRequestProductId(id);
                        }}
                    />
                ))}
            </Box>
            <Box>
                <MyModal
                    isOpen={isDeleteModalShouldOpen()}
                    children={<>
                        <Box>
                            <AdminMenuItemTableComponent
                                showActions={false}
                                menu={menus.filter(x => x.id == deleteRequestProductId)[0]}
                            ></AdminMenuItemTableComponent>

                            <Typography sx={{ mt: 1 }} variant='subtitle2'>
                                Bu menüyü silmeyi onaylıyor musunuz?
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


export default React.memo(MenuManagementPage);
