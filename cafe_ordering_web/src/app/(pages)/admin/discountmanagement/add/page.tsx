"use client";
import React, { useState } from 'react';

import { IPage, IPageContent } from '@/app/types/ViewTypes';

import AddDiscountPageContent from './pageContent';


// Fonksiyonel bileşen tanımı
const AddDiscountPage: IPage = ({ }) => {

    return (
        <AddDiscountPageContent></AddDiscountPageContent>
    );
};

// React.memo ile bileşeni sarmalayarak performans optimizasyonu
export default React.memo(AddDiscountPage);
