"use client"; // Next.js client component

import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardMedia,
} from "@mui/material";
import { AddShoppingCart, Comment, Favorite } from "@mui/icons-material";
import Toast from "@/shared/Toast";
import MyBottomSheet from "@/shared/components/MyBottomSheet";
import { useProductContext } from "@/app/providers/product.provider";
import { ProductModel } from "@/domain/ProductModels";
import Slider from "react-slick";
import ProductDetailCardHeaderComponent from "../product/ProductDetailCardHeaderComponent";
import { IComponent } from "@/app/types/ViewTypes";
import { randomInt, randomUUID } from "node:crypto";


function getRandomInt(max: number = 10, min: number = 0) {
  // min ve max değerlerini dahil etmek için Math.floor ve Math.random kullanılır.
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


interface ProductDetailBottomSheetProps {
  isOpen: boolean;
  product: ProductModel;
  onCloseClicked?: () => void;
  onAddCommentClicked?: () => void;
}

const ProductDetailBottomSheet: IComponent<ProductDetailBottomSheetProps> = ({
  isOpen,
  product,
  onCloseClicked,
  onAddCommentClicked,
}) => {
  const theme = useTheme();
  const { orderedProducts, addProductToOrder, removeProductFromOrder } = useProductContext();

  //Bu ayar, sayfanın alt kısmındaki öğelere tıklarken, tıklama işleminin kaydırma hareketi olarak algılanmasını önlemeye yardımcı olacaktır.
  const drawerBleeding = 0; // Alt tabakanın her zaman görünür olacak kısmının yüksekliği

  const productFoundInBasket = orderedProducts.find(x => x?.productId === product?.id);
  const isProductInTheBasket = productFoundInBasket && productFoundInBasket.quantity != 0;


  useEffect(() => { console.log(product) }, [])

  const _productCardSection =
    <Card className="overflow-visible mb-2 p-2 border " sx={{ borderRadius: 2, boxShadow: 1, padding: 1, }} >
      <ProductDetailCardHeaderComponent menu={product} />
      <Box className="flex justify-end items-center">
        <IconButton
          style={{ display: !isProductInTheBasket ? '' : 'none' }}
          onClick={() => {
            addProductToOrder(product?.id!);
            Toast.success("added");
          }}
        >
          <AddShoppingCart className="" />
        </IconButton>

        {/* Miktar Kontrolü */}
        <Box className={'items-center'}
          sx={{ display: isProductInTheBasket ? 'flex' : 'none' }}
        >
          <IconButton
            disabled={orderedProducts.find(x => x.productId == product.id)?.quantity == 0}
            onClick={() => {
              removeProductFromOrder(product?.id!);
              Toast.success("removed");
            }}

          >
            <RemoveIcon />
          </IconButton>

          <Typography variant="body1" fontWeight="bold">
            {isProductInTheBasket && orderedProducts.find(x => x.productId == product.id)?.quantity}
          </Typography>

          <IconButton onClick={() => {
            addProductToOrder(product?.id!);
            Toast.success("added");
          }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <IconButton>
          <Favorite color="inherit" />
        </IconButton>

        <IconButton onClick={(e: any) => {
          if (onAddCommentClicked != null) onAddCommentClicked();
        }}>
          <Comment />
        </IconButton>

      </Box>
    </Card>

  const _commentsSection =
    <Box sx={{ marginTop: 1 }}>

      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Yorumlar
      </Typography>

      {product.productComments?.length == 0 && (
        <Typography variant="body2" color="text.secondary">
          Yorum bulunamadı.
        </Typography>
      )}

      {product.productComments?.length > 0 && (
        <List
          key={"commens_section"}
          className=" whitespace-nowrap 
            scrollbar-thin scrollbar-track-gray-200
            scrollbar-thumb-gray-500"
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            paddingRight: 1,
          }}
        >
          {product.productComments.map((comment, index) => (
            <React.Fragment key={`${comment.id}_${index}`}>
              <ListItem alignItems="flex-start" sx={{ paddingLeft: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      Kullanıcı {comment.userId}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {comment.comment}
                    </Typography>
                  }
                />
              </ListItem>
              {index <
                product.productComments.length - 1 && (
                  <Divider component="li" sx={{ marginY: 1 }} />
                )}
            </React.Fragment>
          ))}
        </List>
      )}

    </Box>

  return (
    <MyBottomSheet className='z-40' isOpen={isOpen} onCloseButtonClicked={function (): void {
      if (onCloseClicked != null) onCloseClicked();
    }} drawerBleeding={drawerBleeding} >

      <Box className="flex flex-col overflow-hidden p-1">
        {/* İçerik */}
        {_productCardSection}
        {/* Yorumlar Bölümü */}
        {_commentsSection}
      </Box>

    </MyBottomSheet>
  );
};

export default React.memo(ProductDetailBottomSheet);
