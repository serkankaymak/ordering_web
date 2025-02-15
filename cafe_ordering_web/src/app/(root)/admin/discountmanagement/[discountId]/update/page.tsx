'use client'
import React, { useEffect, useState } from 'react';
import DiscountComponent from '../../components/listComponents/DiscountComponent';
import { DiscountModel } from '@/domain/DiscountModels';
import { Box, Container } from '@mui/material';
import { useRouter, useParams } from "next/navigation";
import { DiscountService } from '@/application/services/discount/DiscountService';

const discountService = new DiscountService();
// Fonksiyonel bileşen tanımı
const UpdateDiscountPage: React.FC = ({ }) => {
    const [discount, setDiscount] = useState<DiscountModel>(DiscountModel.getEmptyInstance());

    const router = useRouter();
    const params = useParams();
    const discountId = params?.discountId;


    useEffect(() => {
        console.log(params);
        console.log(discountId);
        if (discountId) {
            discountService.RequestDiscountById(Number(discountId!)).then(response => {
                setDiscount(response.data!);
            })
        }
    },[discountId])

    return (
        <Container>
            <DiscountComponent
                discount={discount}
                showUpdateActions={true}>
            </DiscountComponent>
        </Container>
    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(UpdateDiscountPage);
