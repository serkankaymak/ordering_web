import React from "react";
import DiscountItemProductComponent from "./components/DiscountItemProductComponent";
import { DiscountModel, DiscountType } from "@/domain/DiscountModels";
import DiscountProductBasedComponent from "./DiscountProductBasedComponent";
import DiscountSpecialBasedComponent from "./DiscountSpecialBasedComponent";
import { Box } from "@mui/material";
import DiscountCategoryBasedComponent from "./DiscountCategoryBasedComponent";




// Props tipi:
interface DiscountComponentProps {
  discount: DiscountModel;
}

export default function DiscountComponent({ discount }: DiscountComponentProps) {
  // Eğer discount.type ProductBasedDiscount ise DiscountItemProductComponent render edilir.
  if (discount.discountType === DiscountType.ProductBasedDiscount) {
    return <DiscountProductBasedComponent discount={discount} />;
  }
  if (discount.discountType === DiscountType.DynamicDiscount) {
    return <DiscountSpecialBasedComponent
      showUpdateActions={true}
      discount={discount}
    />;
  }
  if (discount.discountType === DiscountType.CategoryBasedDiscount) {
    return <DiscountCategoryBasedComponent showUpdateActions={true} discount={discount} />
  }
  throw new Error("discount tipi bulunamadı!!");
}
