import { IComponent } from "@/app/types/ViewTypes";
import { ProductModel } from "@/domain/ProductModels";
import { ArrowDownward, ArrowDownwardRounded, ArrowUpward, ArrowUpwardOutlined } from "@mui/icons-material";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Button,
  Chip,
  Collapse,
} from "@mui/material";
import React, { useState } from "react";

interface OrderCardOrderItemProductComponentProps {
  menu: ProductModel;
}

const OrderCardOrderItemProductComponent: IComponent<OrderCardOrderItemProductComponentProps> = ({ menu }) => {
  const [isShowingSubItems, setisShowingSubItems] = useState<boolean>(false);

  if (menu == null) return <></>

  return (
    <TableContainer
      className="border my-1"
      component={Paper}
      sx={{
        mb: 0,
        px: menu.parentBoxId == null ? 1 : 0,
        py: menu.parentBoxId == null ? 2 : 0,
      }}
    >
      <Table sx={{ "& td, & th": { borderBottom: "none" } }} size="small">
        <TableBody>
          <TableRow>
            {/* Görsel */}
            <TableCell>
              <Box sx={{ position: "relative", overflow: "hidden", clear: "both" }}>
                <img
                  src={menu.getImagePathForShow()}
                  alt={menu.name}
                  style={{
                    float: "left",
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginRight: "8px",
                  }}
                />
                {/* Ürün adı */}
                <Box className="flex-1 flex justify-between gap-2">
                  <Typography
                    variant="subtitle2"
                    sx={{
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                      fontSize: "0.9rem",
                    }}
                  >
                    {menu.name}
                  </Typography>
                  <Box className="flex gap-2">
                    {menu.parent && <Chip size="small" label={"Adet:" + menu.quantity} />}
                    <Chip size="small" label={"Fiyat:" + menu.price + " TL"} />
                  </Box>
                </Box>

                {/* Ürün açıklaması */}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                    fontSize: "0.8rem",
                    color: "text.secondary",
                  }}
                >
                  {menu.description}
                </Typography>
              </Box>
            </TableCell>
          </TableRow>

          {menu.products != null && menu.products.length > 0 && (
            <TableRow>
              <TableCell>

                {
                  true && <IconButton
                    color="secondary"
                    onClick={() => setisShowingSubItems(!isShowingSubItems)} >
                    {isShowingSubItems ? <ArrowUpwardOutlined /> : <ArrowDownwardRounded />}
                  </IconButton>
                }

                {false && <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => setisShowingSubItems(!isShowingSubItems)}
                  startIcon={
                    isShowingSubItems ? <ArrowUpward /> : <ArrowDownward />
                  }
                >
                  {isShowingSubItems ? "Hide" : "Show"}
                </Button>}


              </TableCell>
            </TableRow>
          )}

          {/* Recursive: Alt Menü/Ürün Listeleme */}
          {menu.products && menu.products.length > 0 && (

            <TableRow className="w-100" sx={{}}>
              <TableCell padding="none" colSpan={3} sx={{ pl: 1 }}>
                <Collapse className="w-100" in={isShowingSubItems}>
                  {menu.products.map((item) => (
                    <OrderCardOrderItemProductComponent key={item.id} menu={item} />
                  ))}
                </Collapse>
              </TableCell>
            </TableRow>


          )}
        </TableBody>

        {false && menu.parentBoxId == null && (
          <TableBody>
            <TableRow>
              <TableCell align="right">
                <Box className="flex justify-end">
                  <Box className="text-xs" sx={{ display: "flex", flexDirection: "column" }}>
                    {menu.productsPrice && <span>Toplam Ürün Fiyatı : {menu.productsPrice} TL</span>}
                    <span>{menu.productsPrice ? "Menü" : "Ürün "} Fiyatı : {menu.price} TL</span>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default React.memo(OrderCardOrderItemProductComponent);
