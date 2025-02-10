import { ProductModel } from "@/domain/ProductModels";
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
import React from "react";
import Slider from "react-slick";


interface AdminMenuItemTableComponentProps {
  menu: ProductModel;
  showActions: boolean;
  showCategories?: boolean;
  onUpdateButtonClicked?: (boxProductId: number) => void;
  onDeleteButtonClicked?: (boxProductId: number) => void;
}

const AdminMenuItemTableComponent: React.FC<AdminMenuItemTableComponentProps> = ({
  menu,
  onUpdateButtonClicked,
  onDeleteButtonClicked,
  showActions,
  showCategories
}) => {


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
            <TableCell sx={{ padding: 0, width: "40px" }}>

              <img
                src={menu.imageUrl ?? `/images/image_not_found.png`}
                alt={menu.productTitle}
                style={{
                  marginLeft: 3,
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </TableCell>

            {/* Başlık ve Açıklama */}
            <TableCell>
              <Typography variant="subtitle2" sx={{ textWrap: "wrap", fontSize: "0.9rem" }}>
                {menu.productTitle}
              </Typography>
              <Typography
                variant="body2"
                sx={{ textWrap: "wrap", fontSize: "0.7rem", color: "text.secondary" }}
              >
                {menu.productDescription}
              </Typography>
            </TableCell>

            <TableCell sx={{ maxWidth: "70px" }}>
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
              <TableCell colSpan={3} sx={{ pl: 1 }}>
                {menu.products.map((item) => (
                  <AdminMenuItemTableComponent key={item.id} menu={item} showActions={showActions} />
                ))}
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {menu.parentBoxId == null && (
          <TableRow>

            <TableCell colSpan={3} align="right">
              <Box className='flex justify-end'>
                {showCategories && <>
                  <Box className=' flex flex-wrap gap-1' >{menu.categories.map((c, i) => <>
                    <Chip size="small" label={c.name}></Chip>
                  </>)}</Box>
                </>}

                <Box className="text-xs" sx={{ display: "flex", flexDirection: "column" }}>
                  <span>   Products Price Sum : 20.00</span>
                  <span>   Menu Price : 20.00</span>
                </Box>
              </Box>

            </TableCell>
          </TableRow>
        )}

        {menu.parentBoxId == null && showActions && (
          <TableRow>
            <TableCell colSpan={3} align="right">
              <Box className="text-xs" sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
                {false ? (
                  <>
                    <Button sx={{ width: "auto" }} endIcon={<Update />}></Button>
                    <Button sx={{ width: "auto" }} endIcon={<Delete />}></Button>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => onUpdateButtonClicked && onUpdateButtonClicked(menu.id)}>
                      <Update />
                    </IconButton>
                    <IconButton onClick={() => onDeleteButtonClicked && onDeleteButtonClicked(menu.id)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </Box>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </TableContainer>
  );
};

export default React.memo(AdminMenuItemTableComponent);
