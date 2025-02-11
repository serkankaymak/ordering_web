import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { CardMedia, Typography, IconButton, Box } from "@mui/material";
import { AddShoppingCart, Description, Favorite } from "@mui/icons-material";

// react-slick'in düzgün çalışması için gerekli CSS dosyaları
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductModel } from "@/domain/ProductModels";

// Responsive ayarları kaldırarak, her zaman 1 slide gösteriyoruz
const settings = {
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1.06,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};
// Sol yön okunu gösteren özel bileşen
function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: 10,
        zIndex: 2,
      }}
      onClick={onClick}
    />
  );
}

// Sağ yön okunu gösteren özel bileşen
function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        right: 10,
        zIndex: 2,
      }}
      onClick={onClick}
    />
  );
}

// ProductComponent için Props arayüzü
interface ProductComponentProps {
  className?: string;
  product: ProductModel;
  onOrderClick?: (productId: number) => void;
  onInvestigateClick?: (productId: number) => void;
}

const ProductComponent: React.FC<ProductComponentProps> = ({
  className,
  product,
  onOrderClick,
  onInvestigateClick,
}) => {



  return (
    <Box className={`${className}`}>
      <Box className="relative group rounded-lg overflow-hidden shadow-md">
        {/* Eğer tek bir imageUrl varsa onu göster, yoksa slider ile çoklu görselleri göster */}
        {product.imagePath ? (
          <CardMedia
            component="img"
            image={product.imagePath}
            alt={product.name}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <Box className="w-full object-cover  ">
            <Slider {...settings}>
              {product.products &&
                product.products.map((prod: ProductModel, index) => (
                  <div key={prod.id || index}>
                    <CardMedia
                      component="img"
                      image={prod.imagePath!}
                      alt={prod.name}
                      className="w-full object-cover"
                    />
                  </div>
                ))}
            </Slider>
          </Box>
        )}

        {/* Hover Overlay */}
        <Box
          className="
            sm:p-2 p-1
            sm:ps-3 ps-2
            absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white 
            translate-y-full group-hover:translate-y-0 
            transition-transform duration-500 ease-in-out"
        >
          <Typography variant="h6" className="sm:text-sm text-xs font-bold">
            {product.name}
          </Typography>
          <Box className="flex flex-row gap-2">
            <Typography variant="subtitle1" className="sm:text-sm text-xs font-bold sm:mt-1 mt-0">
              ${product.price.toFixed(2)}
            </Typography>
          </Box>
          <Box className="flex sm:justify-between justify-between mt-1">
            <IconButton
              className="m-0 p-1"
              onClick={() => {
                (onOrderClick) && onOrderClick(product.id);
              }}
            >
              <AddShoppingCart sx={{ color: "whitesmoke" }} className="text-xl md:text-3xl" />
            </IconButton>
            <Box>
              <IconButton
                className="m-0 p-1"
                onClick={() => {
                  (onInvestigateClick) && onInvestigateClick(product.id);

                }}
              >
                <Description sx={{ color: "whitesmoke" }} className="text-xl md:text-3xl" />
              </IconButton>
              <IconButton className="mr-1 p-0">
                <Favorite sx={{ color: "grey" }} className="text-xl md:text-3xl" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(ProductComponent);
