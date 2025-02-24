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
} from '@mui/material';
import { OrderItemModel, OrderModel } from '@/domain/OrderModels';
import { Add, Save, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import OrderCardOrderItemComponent from './OrderCard_OrderItemComponent';
import ArrayListStream from '@/shared/ArrayListStream';
import { OrderService } from '@/application/services/product/OrderService';
import { UpdateOrderCommand } from '@/application/httpRequests/order/UpdateOrderRequest';
import Toast from '@/shared/Toast';

interface OrderCardProps {
  order: OrderModel;
  onAddProductClicked: (order: OrderModel) => void;
  onOrderModified: (order: OrderModel) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAddProductClicked,
  onOrderModified,
}) => {

  const [isModified, setisModified] = useState<boolean>(false);
  const [showProducts, setShowProducts] = useState<boolean>(false);
  const orderService = new OrderService();

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
      <h6 className='text-center'> Sipariş Numarası : {order.orderNumber}</h6>
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
                checked={order.isDelivered}
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
                checked={order.isPayed}
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
                checked={order.isReady}
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
