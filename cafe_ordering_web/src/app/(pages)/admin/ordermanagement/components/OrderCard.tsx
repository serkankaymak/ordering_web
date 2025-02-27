import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  IconButton,
  Button,
  Collapse,
  Paper,
} from '@mui/material';
import { OrderItemModel, OrderModel } from '@/domain/OrderModels';
import { Add, Save, ArrowUpward, ArrowDownward, Reviews, ReviewsOutlined, Discount } from '@mui/icons-material';
import OrderCardOrderItemComponent from './OrderCard_OrderItemComponent';
import ArrayListStream from '@/shared/ArrayListStream';
import { OrderService } from '@/application/services/product/OrderService';
import { UpdateOrderCommand } from '@/application/httpRequests/order/UpdateOrderRequest';
import Toast from '@/shared/Toast';
import MyModal from '@/shared/components/MyModal';
import { DiscountService } from '@/application/services/discount/DiscountService';
import { GetOrderItemsHasDiscountsRequestPayload } from '@/application/httpRequests/discount/GetOrderItemsHasDiscountsRequest';
import { useUserContext } from '@/app/providers/global.providers/user.provider';
import { OrderCanHaveDiscountDto } from '@/application/dtos/OrderCanHaveDiscountDto';

interface OrderCardProps {
  order: OrderModel;
  onAddProductClicked: (order: OrderModel) => void;
  onOrderModified: (order: OrderModel) => void;
}
const orderService = new OrderService();
const discountService = new DiscountService();
const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAddProductClicked,
  onOrderModified,
}) => {

  const [orderHasDiscounts, setorderHasDiscounts] = useState<OrderCanHaveDiscountDto[]>();
  const { user } = useUserContext();
  const [isModified, setisModified] = useState<boolean>(false);
  const [showProducts, setShowProducts] = useState<boolean>(false);
  const [isOpendiscountModal, setisOpendiscountModal] = useState<boolean>(false);


  // Güncelleme işlemlerinde, props order üzerinden yeni bir kopya oluşturup parent'a gönderiyoruz.
  const handleCheckboxChange = (field: keyof OrderModel) => {
    const newOrder = order.copy({ [field]: !order[field] });
    onOrderModified(newOrder);
    setisModified(true);
  };

  const handleIncrease = (productId: number) => {
    const newOrder = order.copy({});
    const existingItem = newOrder.orderItems.find((x) => x.productId === productId);
    if (existingItem) {
      existingItem.increase();
    }
    onOrderModified(newOrder);
    setisModified(true);
  };

  const handleDecrease = (productId: number) => {
    const newOrder = order.copy({});
    const existingItem = newOrder.orderItems.find((x) => x.productId === productId);
    if (existingItem) {
      existingItem.decrease();
    }
    onOrderModified(newOrder);
    setisModified(true);
  };

  const handleRemove = (productId: number) => {
    const newOrder = order.copy({});
    newOrder.orderItems = newOrder.orderItems.filter((x) => x.productId !== productId);
    onOrderModified(newOrder);
    setisModified(true);
  };

  const handleSave = (): void => {
    const command = {
      orderId: order.id,
      tableId: order.tableId,
      isDelivered: order.isDelivered,
      isReady: order.isReady,
      isPayed: order.isPayed,
      orderMenuItems: order.orderItems.map((val) => ({
        productId: val.productId,
        quantity: val.quantity,
      })),
    } as UpdateOrderCommand;

    orderService.UpdateOrder(command).then((response) => {
      if (response.isSuccess) {
        Toast.success();
        onOrderModified(order);
        setisModified(false);
      } else {
        Toast.error();
      }
    });
  };

  return (
    <Card className={`shadow-lg rounded-lg border ${isModified ? "border-red-600" : ""}`}>
      <CardHeader
        title={`Masa ${order.tableId}`}
        className="text-center"
        titleTypographyProps={{ variant: 'h6', className: 'font-bold' }}
      />
      <Box className="flex justify-around items-center">

        <IconButton
          onClick={() => {
            setisOpendiscountModal(true);
            let payload = {} as GetOrderItemsHasDiscountsRequestPayload;
            payload.orderItems = [];
            order.orderItems.forEach(oi => {
              var item = { productId: oi.productId, quantity: oi.quantity };
              payload.orderItems.push(item);
            })
            payload.userId = user?.id;
            discountService.getOrderItemsHasDiscounts(payload).then(response => {
              setorderHasDiscounts(response.data!);
            })
          }}
        >
          <Discount />
        </IconButton>

        <h6 className='text-center'> Sipariş Numarası : {order.orderNumber}</h6>
        <div></div>


        <MyModal isOpen={isOpendiscountModal}
          onCloseClicked={() => { setisOpendiscountModal(false); }}
        >
          <Box className="grid  grid-cols-1 sm:grid-cols-2 gap-5">
            {orderHasDiscounts?.map((item, index) => (
              <Card
                elevation={10}
                variant='elevation'
                key={index}
                className="flex flex-col p-6  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 my-3"
              >
                <h3 className="font-bold text-xl my-4">{item.discount.name}</h3>
                <div className="space-y-2 ">
                  <p className="text-sm">
                    <span className="font-medium">İndirim Yüzdesi:</span>{" "}
                    <strong className="">{item.discount.discountPercentage}%</strong>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Sipariş Fiyatı:</span>{" "}
                    <strong className="">{order.price} TL</strong>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">İndirim Tutarı:</span>{" "}
                    <strong className="">{item.discountAmount} TL</strong>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Net Toplam:</span>{" "}
                    <strong className="">{item.netTotalPrice} TL</strong>
                  </p>
                </div>
              </Card>
            ))}
          </Box>
        </MyModal>


      </Box>
      <hr />
      <CardContent>
        <Typography variant="body1" className="mb-2">
          <strong>
            Price :{' '}
            {ArrayListStream.fromList(order.orderItems).sum(
              (x) => x?.quantity! * x?.product?.price!
            )}{' '}
            TL
          </strong>
        </Typography>

        <Box className="flex flex-row flex-wrap gap-0">
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                onChange={() => handleCheckboxChange('isDelivered')}
                checked={order.isDelivered ?? false}
                color="primary"
              />
            }
            label="Delivered"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                onChange={() => handleCheckboxChange('isPayed')}
                checked={order.isPayed ?? false}
                color="primary"
              />
            }
            label="Paid"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                onChange={() => handleCheckboxChange('isReady')}
                checked={order.isReady ?? false}
                color="primary"
              />
            }
            label="Ready"
          />
        </Box>

        <Box className="flex justify-between my-3">
          <Box className="flex gap-1">
            <IconButton onClick={() => onAddProductClicked(order)} color="secondary">
              <Add />
            </IconButton>
            <IconButton onClick={() => setShowProducts(!showProducts)} color="secondary">
              {showProducts ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </Box>

          <Button onClick={handleSave} color="secondary" variant="outlined" startIcon={<Save />}>
            Save
          </Button>
        </Box>

        <Collapse in={showProducts}>
          <Box>
            {order.orderItems.map((p) => (
              <Box key={p.productId}>
                <OrderCardOrderItemComponent
                  onIncreaseClicked={() => handleIncrease(p.productId)}
                  onDecreaseClicked={() => handleDecrease(p.productId)}
                  onRemoveClicked={() => handleRemove(p.productId)}
                  showActions={true}
                  orderItem={p}
                />
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default React.memo(OrderCard);
