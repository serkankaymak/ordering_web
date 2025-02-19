import AdminMenuItemTableComponent from "@/app/(pages)/admin/menumanagement/components/serverSideComponents/AdminMenuItemTableComponent";
import { IComponent } from "@/app/types/ViewTypes";
import { ProductModel } from "@/domain/ProductModels";
import useMyMediaQuery, { Breakpoints } from "@/shared/hooks/UseMediaQuery";
import { Delete, Update } from "@mui/icons-material";
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
} from "@mui/material";
import React, { useEffect } from "react";
import Slider from "react-slick";



interface ProductDetailCardHeaderComponentProps {
  menu: ProductModel;
}

const ProductDetailCardHeaderComponent: IComponent<ProductDetailCardHeaderComponentProps> = ({
  menu,
}) => {

  const isSmallScreen = useMyMediaQuery(Breakpoints.SMALL, 'max');


  useEffect(() => {

  }, [])

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
                {/* Resmi sol tarafa float ediyoruz */}
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

                    {
                      menu.parent && <Chip size="small" label={"Adet:" + menu.quantity} />
                    }

                    <Chip size="small" label={"Fiyat:" + menu.price + " TL"} />
                  </Box>

                </Box>

                {/* Ürün açıklaması; metin, resmin sağında başlayıp gerektiğinde altına geçecektir */}
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
                {/* Fiyat */}

              </Box>
            </TableCell>

          </TableRow>

          {/* Recursive: Alt Menü/Ürün Listeleme */}
          {menu.products && menu.products.length > 0 && (
            <TableRow>
              <TableCell padding="none" colSpan={3} sx={{ pl: 1 }}>
                {menu.products.map((item) => (
                  <ProductDetailCardHeaderComponent key={item.id} menu={item} />
                ))}
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {menu.parentBoxId == null && (
          <TableBody>
            <TableRow>

              <TableCell align="right">
                <Box className='flex justify-end'>
                  <Box className="text-xs" sx={{ display: "flex", flexDirection: "column" }}>

                    {menu.productsPrice && <span>   Toplam Ürün Fiyatı : {menu.productsPrice} TL</span>}
                    <span>   {menu.productsPrice ? "Menü" : "Ürün "} Fiyatı : {menu.price} TL </span>
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

export default React.memo(ProductDetailCardHeaderComponent);
