"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useEffect, useState } from "react";
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import { Box } from "@mui/material";
import { IComponent } from "@/app/types/ViewTypes";
import { DiscountModel } from "@/domain/DiscountModels";


interface DiscountAddOrUpdateComponentContentProps {
    discount: DiscountModel
    onSubmitClicked: (menu: DiscountModel, imageFile: File | null) => void
}

const DiscountAddOrUpdateComponentContent: IComponent<DiscountAddOrUpdateComponentContentProps> = ({
    discount,
    onSubmitClicked
}) => {




    return (
        <Box className="flex flex-col items-center justify-center">
            {false && <Box className="text-white">  {discount.id} </Box>}
            <Box className="w-[100%] md:w-[70%] text-white">
                sdfasdfsd
            </Box>
        </Box>
    );
};

export default DiscountAddOrUpdateComponentContent;
