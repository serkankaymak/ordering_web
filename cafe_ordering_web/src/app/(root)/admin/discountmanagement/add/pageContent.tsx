"use client";
import React, { useState } from 'react';
import DiscountAddOrUpdateComponent from '../components/addOrUpdate/DiscountAddOrUpdateCoponent';
import { DiscountModel } from '@/domain/DiscountModels';
import { IPageContent } from '@/app/types/ViewTypes';

interface AddDiscountPageContentProps { }

// Fonksiyonel bileşen tanımı
const AddDiscountPageContent: IPageContent<AddDiscountPageContentProps> = ({ }) => {

    return (
        <div>
            <DiscountAddOrUpdateComponent
                discount={DiscountModel.getEmptyInstance()}
                onSubmitClicked={
                    (menu: DiscountModel, imageFile: File | null): void => {
                    }
                }>
            </DiscountAddOrUpdateComponent>
        </div>
    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(AddDiscountPageContent);
