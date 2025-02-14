"use client"; // Bileşeni client bileşeni olarak işaretliyoruz

import React, { useEffect, useState } from "react";
import { CategoryModel, ProductModel } from "@/domain/ProductModels";
import { Box } from "@mui/material";
import { IComponent } from "@/app/types/ViewTypes";
import { DiscountModel } from "@/domain/DiscountModels";
import DiscountAddOrUpdateComponentContent from "./DiscountAddOrUpdateCoponentContent";


interface DiscountAddOrUpdateComponentProps {
    discount?: DiscountModel
    onSubmitClicked: (menu: DiscountModel, imageFile: File | null) => void
}

const DiscountAddOrUpdateComponent: IComponent<DiscountAddOrUpdateComponentProps> = ({
    discount = DiscountModel.getProductBasedExample(),
    onSubmitClicked
}) => {




    return (
        <Box className="flex flex-col items-center justify-center">
            {false && <Box className="text-white">  {discount.id} </Box>}
            <Box className="w-[100%] md:w-[70%]">
                sdfasdf
                <DiscountAddOrUpdateComponentContent discount={discount}
                    onSubmitClicked={function (menu: DiscountModel, imageFile: File | null): void {
                        throw new Error("Function not implemented.");
                    }} ></DiscountAddOrUpdateComponentContent>
            </Box>
        </Box>
    );
};

export default DiscountAddOrUpdateComponent;
