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
import { OrderService } from "@/application/services/product/OrderService";
import { CreateOrderCommand } from "@/application/httpRequests/order/CreateOrderRequest";
import Toast from "@/shared/Toast";
import { useOrderEvents } from "@/app/providers/orderEvents.provider";

// Props arayüzü tanımı
interface CartButtonComponentProps {
  onViewClicked: (productId: number) => void;
}

// Ana Bileşen
const CartButtonComponent: IComponent<CartButtonComponentProps> = ({ onViewClicked }) => {
  const orderService = new OrderService();
  const { joinTable } = useOrderEvents();
  const { user } = useUserContext();
  const [cartOpen, setCartOpen] = useState(false);
  const { awaibleOrderDiscounts, awaibleDiscounts, orderedProducts, addProductToOrder, removeProductFromOrder, clearProductFromOrder, clearOrder } = useProductContext();
  const [isDiscountsSheetOpen, setisDiscountsSheetOpen] = useState<boolean>(false);
  const [selectedTableId, setselectedTableId] = useState<number>(0);
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

        onOrderClearClicked={clearOrder}
        onViewClicked={onViewClicked}
        onDiscountsButonClicked={() => { setisDiscountsSheetOpen(true) }}
        onTableSelectValueChanged={(tableId) => { setselectedTableId(tableId) }}
        onOrderSendClicked={async () => {

          if (selectedTableId == 0) {
            Toast.error("Masa Numarası seçmelisiniz.")
            return;
          }

          let command = {
            tableId: selectedTableId,
            userId: user ? user.id : 0,
            orderMenuItems: orderedProducts.map(x => ({ productId: x.productId, quantity: x.quantity }))
          } as CreateOrderCommand;

          try { await joinTable(selectedTableId); }
          catch (e: any) { console.log(e); }

          orderService.CreateOrder(command).then(response => {
            if (response.isSuccess) {
              clearOrder();
            }
            else {
              Toast.error();
            }
          })

        }}
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
