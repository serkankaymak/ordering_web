import React, { useState } from "react";
import { IconButton, Badge, Box } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

import ArrayListStream from "@/shared/ArrayListStream";

// Sepet Paneli Bileşeni
import CartPanelBottomSheet from "../BottomSheets/CartPanelBottomSheet";
import { useProductContext } from "@/app/providers/product.provider";
import { IComponent } from "@/app/types/ViewTypes";
import DiscountsOfOrderBottomSheet from "../BottomSheets/DiscountsOfOrderBottomSheet";
import { useUserContext } from '../../../../../providers/global.providers/user.provider';

// Props arayüzü tanımı
interface CartButtonComponentProps {
  onViewClicked: (productId: number) => void;
}

// Ana Bileşen
const CartButtonComponent: IComponent<CartButtonComponentProps> = ({ onViewClicked }) => {
  const { user } = useUserContext();
  const [cartOpen, setCartOpen] = useState(false);
  const { awaibleOrderDiscounts, awaibleDiscounts, orderedProducts, addProductToOrder, removeProductFromOrder, clearProductFromOrder, clearOrder } = useProductContext();
  const [isDiscountsSheetOpen, setisDiscountsSheetOpen] = useState<boolean>(false);

  return (
    <>
      {/* Float Button */}
      <Box className="z-10">
        <IconButton className="z-10"
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
          onClick={() => setCartOpen(!cartOpen)}
        >
          <Badge
            badgeContent={ArrayListStream.fromList(orderedProducts).sum(x => x?.quantity!)}
            color="error"
          >
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Box>


      {/* Sepet Paneli */}
      <CartPanelBottomSheet

        open={cartOpen}
        onClose={() => setCartOpen(false)}
        orderItems={orderedProducts}
        onIncrease={(productId: number) => addProductToOrder(productId)}
        onDecrease={(productId: number) => removeProductFromOrder(productId)}
        onRemove={(productId: number) => clearProductFromOrder(productId)}
        onOrderSendClicked={() => { }}
        onOrderClearClicked={clearOrder}
        onViewClicked={onViewClicked}
        onDiscountsButonClicked={() => { setisDiscountsSheetOpen(true) }}
      />


      <DiscountsOfOrderBottomSheet
        currentUser={user}
        awaibleDiscounts={awaibleDiscounts}
        awaibleOrderDiscounts={awaibleOrderDiscounts}
        onCloseClicked={() => { setisDiscountsSheetOpen(false) }}
        isOpen={isDiscountsSheetOpen} ></DiscountsOfOrderBottomSheet>

    </>
  );
};

export default React.memo(CartButtonComponent);
