'use client'
import React, { useEffect, useState } from 'react';
import DiscountComponent from '../../components/listComponents/DiscountComponent';
import { DiscountModel } from '@/domain/DiscountModels';
import { Box, Container } from '@mui/material';
import { useRouter, useParams } from "next/navigation";
import { DiscountService } from '@/application/services/discount/DiscountService';
import DiscountAddOrUpdateComponent from '../../components/addOrUpdate/DiscountAddOrUpdateCoponent';
import { UpdateDiscountCommand } from '@/application/httpRequests/discount/UpdateDiscountRequest';
import Toast from '@/shared/Toast';

const discountService = new DiscountService();
// Fonksiyonel bileşen tanımı
const UpdateDiscountPage: React.FC = ({ }) => {
    const [discount, setDiscount] = useState<DiscountModel | null>(null);

    const router = useRouter();
    const params = useParams();
    const discountId = params?.discountId;


    useEffect(() => {
        console.log(params);
        console.log(discountId);
        if (discount != null && discount.id == Number(discountId!)) return;
        if (discountId) {
            discountService.RequestDiscountById(Number(discountId!)).then(response => {
                if (response.isSuccess)
                    setDiscount(response.data!);
            })

        }
    }, [discountId])

    if (discount == null) return <></>
    if (discount.id == 0) return <></>
    return (

        <Container>
            <DiscountAddOrUpdateComponent
                discount={discount}
                onSubmitClicked={
                    (updatedDiscount: DiscountModel, imageFile: File | null): void => {

                        const command = {
                            discountId: updatedDiscount.id,
                            discountName: updatedDiscount.name,
                            discountType: updatedDiscount.discountType,
                            endDateAsUtc: updatedDiscount.getLocaleDate()?.toISOString() ,
                            categoryId: updatedDiscount.categoryId ?? 0,

                            discountPercentage: updatedDiscount.discountPercentage,
                            maxApplicableTimes: updatedDiscount.maxApplicableTimes,

                            discountItems: updatedDiscount.discountItems.map(x => ({
                                requiredQuantity: x.requiredQuantity,
                                productId: x.productId
                            }))

                        } as UpdateDiscountCommand;

                        console.log(command);
                        discountService.updateDiscount(command).then(
                            response => {
                                if (response.isSuccess) { Toast.success() }
                                else { Toast.error() }
                            }
                        );




                    }
                }>
            </DiscountAddOrUpdateComponent>
        </Container>
    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(UpdateDiscountPage);
