"use client";
import React, { useState } from 'react';
import DiscountAddOrUpdateComponent from '../components/addOrUpdate/DiscountAddOrUpdateCoponent';
import { DiscountModel } from '@/domain/DiscountModels';



// Fonksiyonel bileşen tanımı
const AddDiscountPage: React.FC = ({ }) => {


    return (
        <div>
            <DiscountAddOrUpdateComponent
                onSubmitClicked={(menu: DiscountModel, imageFile: File | null): void => {
                }}></DiscountAddOrUpdateComponent>
        </div>
    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(AddDiscountPage);
