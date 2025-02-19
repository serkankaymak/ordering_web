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
            <TableCell padding="none" sx={{ minWidth: "40px", maxWidth: "80px" }}>
              <img
                src={menu.getImagePathForShow()}
                alt={menu.name}
                style={{
                  marginLeft: 3,
                  width: isSmallScreen ? "40px" : "80px",
                  height: isSmallScreen ? "40px" : "80px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </TableCell>

            {/* Başlık ve Açıklama */}
            <TableCell padding="normal">
              <Typography variant="subtitle2" sx={{ textWrap: "wrap", fontSize: "0.9rem" }}>
                {menu.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ textWrap: "wrap", fontSize: "0.8rem", color: "text.secondary" }}
              >
                {menu.description}
              </Typography>
            </TableCell>

            <TableCell align="right" padding="none" sx={{
              paddingRight: 2,
              maxWidth: "120px"
            }}>
              <Typography
                variant="body2"
                sx={{ textWrap: "nowrap", fontSize: "0.8rem", color: "text.secondary" }}
              >
                {menu.price + " TL"}
              </Typography>
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

              <TableCell colSpan={3} align="right">
                <Box className='flex justify-end'>
                  <Box className="text-xs" sx={{ display: "flex", flexDirection: "column" }}>
                    <span>   Products Price Sum : 20.00</span>
                    <span>   Menu Price : 20.00</span>
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
