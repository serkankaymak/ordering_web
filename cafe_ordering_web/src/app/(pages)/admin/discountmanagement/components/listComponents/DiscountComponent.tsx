'use client'

import React from "react";
import { DiscountModel, DiscountType } from "@/domain/DiscountModels";
import DiscountProductBasedComponent from "./components/discounttypes/DiscountProductBasedComponent";
import SpecialDayDiscountComponent from "./components/discounttypes/SpecialDayDiscountComponent";
import DiscountCategoryBasedComponent from "./components/discounttypes/DiscountCategoryBasedComponent";
import BirthdayDiscountComponent from "./components/discounttypes/BirthdayDiscountComponent";
import MilestoneDiscountComponent from "./components/discounttypes/MilestoneDiscountComponent";
import ThresholdDiscountComponent from "./components/discounttypes/ThresholdDiscountComponent";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

// Props tipi:
interface DiscountComponentProps {
  discount: DiscountModel;
  onUpdateClicked?: (discountId: number) => void;
  onDeleteClicked?: (discountId: number) => void;
  showUpdateActions?: boolean;
  onAnyPropertyChanged?: (key: keyof DiscountModel, value: any) => void;
  onSaveClicked?: () => void;
}

export default function DiscountComponent({
  discount,
  onDeleteClicked,
  onUpdateClicked,
  showUpdateActions = false,
  onAnyPropertyChanged,
  onSaveClicked,
}: DiscountComponentProps) {

  const getDiscountComponent = (discountType: DiscountType) => {
    switch (discountType) {
      case DiscountType.ProductBasedDiscount:
        return (
          <DiscountProductBasedComponent
            onDeleteClicked={onDeleteClicked}
            onUpdateClicked={onUpdateClicked}
            showUpdateActions={showUpdateActions}
            discount={discount}
            onAnyPropertyChanged={onAnyPropertyChanged}
            onSaveClicked={onSaveClicked}
          />
        );
      case DiscountType.SpecialDayDiscount:
        return (
          <SpecialDayDiscountComponent
            onDeleteClicked={onDeleteClicked}
            onUpdateClicked={onUpdateClicked}
            showUpdateActions={showUpdateActions}
            discount={discount}
            onAnyPropertyChanged={onAnyPropertyChanged}
            onSaveClicked={onSaveClicked}
          />
        );
      case DiscountType.CategoryBasedDiscount:
        return (
          <DiscountCategoryBasedComponent
            onDeleteClicked={onDeleteClicked}
            onUpdateClicked={onUpdateClicked}
            showUpdateActions={showUpdateActions}
            discount={discount}
            onAnyPropertyChanged={onAnyPropertyChanged}
            onSaveClicked={onSaveClicked}
          />
        );
      case DiscountType.BirthdayDiscount:
        return (
          <BirthdayDiscountComponent
            onDeleteClicked={onDeleteClicked}
            onUpdateClicked={onUpdateClicked}
            showUpdateActions={showUpdateActions}
            discount={discount}
            onAnyPropertyChanged={onAnyPropertyChanged}
            onSaveClicked={onSaveClicked}
          />
        );
      case DiscountType.MilestoneDiscount:
        return (
          <MilestoneDiscountComponent
            onDeleteClicked={onDeleteClicked}
            onUpdateClicked={onUpdateClicked}
            showUpdateActions={showUpdateActions}
            discount={discount}
            onAnyPropertyChanged={onAnyPropertyChanged}
            onSaveClicked={onSaveClicked}
          />
        );
      case DiscountType.ThresholdDiscount:
        return (
          <ThresholdDiscountComponent
            onDeleteClicked={onDeleteClicked}
            onUpdateClicked={onUpdateClicked}
            showUpdateActions={showUpdateActions}
            discount={discount}
            onAnyPropertyChanged={onAnyPropertyChanged}
            onSaveClicked={onSaveClicked}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card  className="border">

      <CardHeader title={discount.name??""} />
      <CardContent>
        {false && <h5>{DiscountType[discount.discountType]}</h5>}

        <Typography variant="body2">
          Indirim Oranı: {discount.discountPercentage}%
        </Typography>
        <Typography variant="body2">
          kaç kez uygulanabilir: {discount.maxApplicableTimes}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Başlama Tarihi:{" "}
          {discount.endDateUtc
            ? new Date(discount.endDateUtc).toLocaleDateString()
            : "Belirtilmemiş"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Sona Erme Tarihi:{" "}
          {discount.endDateUtc
            ? new Date(discount.endDateUtc).toLocaleDateString()
            : "Belirtilmemiş"}
        </Typography>
        {getDiscountComponent(discount.discountType)}
      </CardContent>
    </Card>
  );
}
