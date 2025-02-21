"use client";
import React, { useState } from 'react';
import DiscountAddOrUpdateComponent from '../components/addOrUpdate/DiscountAddOrUpdateCoponent';
import { DiscountModel } from '@/domain/DiscountModels';
import { IPageContent } from '@/app/types/ViewTypes';
import { DiscountService } from '@/application/services/discount/DiscountService';
import { CreateDiscountCommand } from '@/application/httpRequests/discount/CreateDiscountRequest';
import { CreateDiscountItemCommand } from '@/application/httpRequests/discount/CreateDiscountRequest';
import Toast from '@/shared/Toast';
import { Box } from '@mui/material';

interface AddDiscountPageContentProps { }
const discountService = new DiscountService();
// Fonksiyonel bileşen tanımı
const AddDiscountPageContent: IPageContent<AddDiscountPageContentProps> = ({ }) => {

    return (
        <Box className="flex flex-col justify-center items-center m-10">
            <DiscountAddOrUpdateComponent

                discount={DiscountModel.getEmptyInstance()}
                onSubmitClicked={
                    (updatedDiscount: DiscountModel, imageFile: File | null): void => {
                        const command = {
                            discountName: updatedDiscount.name,
                            discountType: updatedDiscount.discountType,
                            endDateAsUtc: updatedDiscount.getLocaleDate()?.toISOString(),
                            categoryId: updatedDiscount.categoryId ?? 0,
                            discountPercentage: updatedDiscount.discountPercentage,
                            maxApplicableTimes: updatedDiscount.maxApplicableTimes,

                            discountItems: updatedDiscount.discountItems.map(x => ({
                                requiredQuantity: x.requiredQuantity,
                                productId: x.productId
                            }))

                        } as CreateDiscountCommand;

                        console.log(command);
                        discountService.createDiscount(command).then(
                            response => {
                                if (response.isSuccess) { Toast.success() }
                                else { Toast.error() }
                            }
                        );

                    }
                }>
            </DiscountAddOrUpdateComponent>
        </Box>


    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(AddDiscountPageContent);
