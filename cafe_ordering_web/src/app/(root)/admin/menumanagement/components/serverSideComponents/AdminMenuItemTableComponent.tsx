import { IComponent } from "@/app/types/ViewTypes";
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


interface AdminMenuItemTableComponentProps {
  menu: ProductModel;
  showActions: boolean;
  showCategories?: boolean;
  onUpdateButtonClicked?: (boxProductId: number) => void;
  onDeleteButtonClicked?: (boxProductId: number) => void;
}

const AdminMenuItemTableComponent: IComponent<AdminMenuItemTableComponentProps> = ({
  menu,
  onUpdateButtonClicked,
  onDeleteButtonClicked,
  showActions,
  showCategories
}) => {


  return (

    <Box>
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
                        menu.parent && <Chip size="small" label={"Adet : " + menu.quantity} />
                      }

                      <Chip size="small" label={"Price : " + menu.price + " TL"} />
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
                <TableCell sx={{ pl: 1 }}>
                  {menu.products.map((item) => (
                    <AdminMenuItemTableComponent key={item.id} menu={item} showActions={showActions} />
                  ))}
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableBody>
            {menu.parentBoxId == null && (
              <TableRow>

                <TableCell align="right">
                  <Box className='flex justify-between'>
                    {showCategories && <>
                      <Box className=' flex flex-wrap gap-1' >{menu.categories.map((c, i) =>
                        <Chip key={`${i}`} size="small" label={c.name}></Chip>
                      )}</Box>
                    </>}

                    <Box className="text-xs" sx={{ display: "flex", flexDirection: "column" }}>
                      <span>   Ürünlerin Toplam Fiyatı  :  {menu.productsPrice ?? 0}</span>
                      <span>   Menü Fiyatı : {menu.price} </span>
                    </Box>
                  </Box>

                </TableCell>
              </TableRow>
            )}
          </TableBody>


          <TableBody>
            {menu.parentBoxId == null && showActions && (
              <TableRow>
                <TableCell align="right">
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
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

  );
};

export default React.memo(AdminMenuItemTableComponent);
