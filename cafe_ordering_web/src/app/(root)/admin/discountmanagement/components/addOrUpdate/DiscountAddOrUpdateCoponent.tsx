"use client";

import React, { useEffect, useState } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Paper } from "@mui/material";
import { IComponent } from "@/app/types/ViewTypes";
import { DiscountModel, DiscountType } from "@/domain/DiscountModels";
import DiscountComponent from "../listComponents/DiscountComponent";

interface DiscountAddOrUpdateComponentProps {
    discount?: DiscountModel;
    onSubmitClicked: (discount: DiscountModel, imageFile: File | null) => void;
}

const DiscountAddOrUpdateComponent: IComponent<DiscountAddOrUpdateComponentProps> = ({
    discount = DiscountModel.getEmptyInstance(),
    onSubmitClicked,
}) => {
    const [isAddMode, setIsAddMode] = useState<boolean>(false);
    const [updatedDiscount, setUpdatedDiscount] = useState<DiscountModel>(discount);
    const [discountTypeForAdd, setDiscountTypeForAdd] = useState<DiscountType>(DiscountType.ProductBasedDiscount);

    useEffect(() => {
        setIsAddMode(discount.id === 0);
    }, [discount]);

    const handleDiscountTypeSelectValueChanged = (event: SelectChangeEvent) => {
        const type = Number(event.target.value) as DiscountType;
        setDiscountTypeForAdd(type);
        // updatedDiscount.copy() methodu mevcut discount değerlerini kopyalayıp güncellenen alanları ekliyor.
        setUpdatedDiscount(new DiscountModel({ discountType: type }));
    };

    return (
        <Paper className=" p-5 flex flex-col items-center justify-center">
            {isAddMode && (
                <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2 }}>
                    <InputLabel id="discount-type-select-label">Discount Type</InputLabel>
                    <Select
                        labelId="discount-type-select-label"
                        value={discountTypeForAdd.toString()}
                        onChange={handleDiscountTypeSelectValueChanged}
                        label="Discount Type"
                    >
                        <MenuItem value={DiscountType.ProductBasedDiscount}>
                            Ürün bazlı indirim
                        </MenuItem>
                        <MenuItem value={DiscountType.DynamicDiscount}>
                            Özel indirim
                        </MenuItem>
                        <MenuItem value={DiscountType.CategoryBasedDiscount}>
                            Ürün kategorisi bazlı indirim
                        </MenuItem>
                    </Select>
                </FormControl>
            )}

            <DiscountComponent

                onSaveClicked={() => { onSubmitClicked && onSubmitClicked(updatedDiscount, null) }}

                onAnyPropertyChanged={(key, value) => {
                    if (key == "maxApplicableTimes" && value == 0) return;
                    const newDiscount = updatedDiscount.copy({ [key]: value });
                    newDiscount.discountItems = newDiscount.discountItems.sort((x1, x2) => x1.requiredQuantity >= x2.requiredQuantity ? 1 : 0);
                    console.log(key);
                    if (key == "endDateUtc") {
                        console.log(value);
                    }
                    setUpdatedDiscount(newDiscount);
                }}
                showUpdateActions={true}
                discount={updatedDiscount}
            />
        </Paper>
    );
};

export default DiscountAddOrUpdateComponent;
