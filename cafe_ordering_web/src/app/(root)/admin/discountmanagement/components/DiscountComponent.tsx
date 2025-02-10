import React from "react";
import DiscountItemProductComponent from "./components/DiscountItemProductComponent";
import { Discount, DiscountType } from "@/domain/DiscountModels";
import DiscountProductBasedComponent from "./DiscountProductBasedComponent";
import DiscountSpecialBasedComponent from "./DiscountSpecialBasedComponent";



// Props tipi:
interface DiscountComponentProps {
  discount: Discount;
}

export default function DiscountComponent({ discount }: DiscountComponentProps) {
  // Eğer discount.type ProductBasedDiscount ise DiscountItemProductComponent render edilir.
  if (discount.discountType === DiscountType.ProductBasedDiscount) {
    return <DiscountProductBasedComponent discount={discount} />;
  }
  if (discount.discountType === DiscountType.DynamicDiscount) {
    return <DiscountSpecialBasedComponent discount={discount} />;
  }
  return null;
}
