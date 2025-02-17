import React from 'react';

import { Box, Card, CardContent } from '@mui/material';
import ProductComponent from './ProductComponent';
import { ProductModel } from '@/domain/ProductModels';
import { IComponent } from '@/app/types/ViewTypes';

// Props için interface tanımı
interface ProductListProps {
    onAnyOrderClick: (productId: number) => void,
    onAnyInvestigateClick: (productId: number) => void,
    title: string,
    sectionId: string,
    products: ProductModel[] | null
}

// Fonksiyonel bileşen tanımı
const ProductListSection: IComponent<ProductListProps> = ({ title, sectionId, products: products, onAnyInvestigateClick, onAnyOrderClick }) => {
    // State tanımı
    return (

        <Box className="pt-10">
            <Card className=' p-2  border m-2'>
                <Box className="border rounded mt-1 mx-3">
                    <h2 className='text-center  uppercase font-serif'>{title}</h2>
                </Box>
                <section className='   ' id={sectionId}>

                    <CardContent>
                        <Box className=" 
                            grid
                            grid-cols-2
                            sm:grid-cols-3
                            md:grid-cols-3
                            lg:grid-cols-4
                            
                            sm:gap-4 gap-2 p-2
                        "
                        >
                            {products!.map((item, index) => {
                                return <Card key={index} className='border rounded-xl'> <ProductComponent
                                    onOrderClick={(productId) => { if (onAnyOrderClick != null) onAnyOrderClick(productId) }}
                                    onInvestigateClick={(productId) => {
                                        onAnyInvestigateClick &&
                                            onAnyInvestigateClick(productId);
                                    }}
                                    key={index} product={item}>
                                </ProductComponent> </Card>
                            })}

                        </Box>
                    </CardContent>
                </section>
            </Card>
        </Box>



    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(ProductListSection);
