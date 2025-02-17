'use Client'

import React from "react";
import { DiscountModel, DiscountType } from "@/domain/DiscountModels";
import DiscountProductBasedComponent from "./DiscountProductBasedComponent";
import DiscountSpecialBasedComponent from "./DiscountSpecialBasedComponent";
import DiscountCategoryBasedComponent from "./DiscountCategoryBasedComponent";


// Props tipi:
interface DiscountComponentProps {
  discount: DiscountModel;
  onUpdateClicked?: (discountId: number) => void;
  onDeleteClicked?: (discountId: number) => void;
  showUpdateActions?: boolean;
  onAnyPropertyChanged?: (key: keyof DiscountModel, value: any) => void
  onSaveClicked?: () => void;
}

export default function DiscountComponent({
  discount, onDeleteClicked, onUpdateClicked,
  showUpdateActions = false,
  onAnyPropertyChanged, onSaveClicked
}: DiscountComponentProps) {
  // Eğer discount.type ProductBasedDiscount ise DiscountItemProductComponent render edilir.
  if (discount.discountType === DiscountType.ProductBasedDiscount) {
    return <DiscountProductBasedComponent
      onDeleteClicked={onDeleteClicked}
      onUpdateClicked={onUpdateClicked}
      showUpdateActions={showUpdateActions}
      discount={discount}
      onAnyPropertyChanged={onAnyPropertyChanged}
      onSaveClicked={onSaveClicked && onSaveClicked}
    />
  }
  if (discount.discountType === DiscountType.DynamicDiscount) {
    return <DiscountSpecialBasedComponent
      onDeleteClicked={onDeleteClicked}
      onUpdateClicked={onUpdateClicked}
      showUpdateActions={showUpdateActions}
      discount={discount}
      onAnyPropertyChanged={onAnyPropertyChanged}
      onSaveClicked={onSaveClicked && onSaveClicked}
    />;
  }
  if (discount.discountType === DiscountType.CategoryBasedDiscount) {
    return <DiscountCategoryBasedComponent
      onDeleteClicked={onDeleteClicked}
      onUpdateClicked={onUpdateClicked}
      showUpdateActions={showUpdateActions}
      discount={discount}
      onAnyPropertyChanged={onAnyPropertyChanged}
      onSaveClicked={onSaveClicked && onSaveClicked}
    />
  }
  throw new Error("discount tipi bulunamadı!!");
}
