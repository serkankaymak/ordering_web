import { ProductModel } from "@/domain/ProductModels";
import { Box, Typography, Grid } from "@mui/material";
import React from "react";

interface AdminMenuItemCardComponentProps {
  menu: ProductModel;
  onUpdate: (updatedMenu: ProductModel) => void;
}

const AdminMenuItemCardComponent: React.FC<AdminMenuItemCardComponentProps> = ({ menu, onUpdate }) => {
  return (
    <Box sx={{ border: "1px solid #ddd", p: 1, mb: 1, borderRadius: "4px" }}>
      {/* Görseller ve Metin Bilgileri */}
      <Grid container spacing={1} alignItems="center">
        {/* Görseller */}
        <Grid item xs={2}>
          {menu.imageUrl ? (
            <img
              src={menu.imageUrl}
              alt={menu.productTitle}
              style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
            />
          ) : (
            <Box className="flex flex-row">
              {menu.products &&
                menu.products.map(
                  (item) =>
                    item.imageUrl && (
                      <img
                        key={item.id}
                        src={item.imageUrl}
                        alt={item.productTitle}
                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", marginRight: "4px" }}
                      />
                    )
                )}
            </Box>

          )}
        </Grid>

        {/* Başlık ve Açıklama */}
        <Grid item xs={10}>
          <Typography variant="subtitle2" sx={{ textWrap: "wrap", fontSize: "0.9rem" }}>
            {menu.productTitle}
          </Typography>
          <Typography variant="body2" sx={{ textWrap: "wrap", fontSize: "0.8rem", color: "text.secondary" }}>
            {menu.productDescription}
          </Typography>
        </Grid>
      </Grid>

      {/* Recursive: Alt Menü/Ürün Listeleme */}
      {menu.products && menu.products.length > 0 && (
        <Box sx={{ mt: 1, pl: 2 }}>
          {menu.products.map((item) => (
            <AdminMenuItemCardComponent
              key={item.id}
              menu={item}
              onUpdate={(updatedItem) => {
                const updatedChildren = menu.products!.map((child) =>
                  child.id === updatedItem.id ? updatedItem : child
                );
                const updatedMenu: ProductModel = ProductModel.getExample(0);
                onUpdate(updatedMenu);
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(AdminMenuItemCardComponent);