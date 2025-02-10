import React, { useState } from "react";
import { IconButton, Badge, Box } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

import ArrayListStream from "@/shared/ArrayListStream";

// Sepet Paneli Bileşeni
import CartPanelBottomSheet from "../BottomSheets/CartPanelBottomSheet";
import { useProductContext } from "@/app/providers/product.provider";

// Props arayüzü tanımı
interface CartButtonComponentProps {
  onViewClicked: (productId: number) => void;
}

// Ana Bileşen
const CartButtonComponent: React.FC<CartButtonComponentProps> = ({ onViewClicked }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const { orderedProducts, addProductToOrder, removeProductFromOrder, clearProductFromOrder, clearOrder } = useProductContext();

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
        onPayed={clearOrder}
        onViewClicked={onViewClicked}
      />
    </>
  );
};

export default React.memo(CartButtonComponent);
