import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { CardMedia, Typography, IconButton, Box } from "@mui/material";
import { AddShoppingCart, Description, Favorite } from "@mui/icons-material";

// react-slick'in düzgün çalışması için gerekli CSS dosyaları
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductModel } from "@/domain/ProductModels";
import { IComponent } from "@/app/types/ViewTypes";
import { useSitePreferencesContext } from "@/app/providers/global.providers/sitePreferences.provider";

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

const ProductComponent: IComponent<ProductComponentProps> = ({
  className,
  product,
  onOrderClick,
  onInvestigateClick,
}) => {


  const { sitePreferences } = useSitePreferencesContext();
  const useTransition = sitePreferences?.useTransitionableProductCard;

  return (
    <Box className={`${className}`}>
      <Box className="relative group rounded-lg overflow-hidden shadow-md">
        {/* Eğer tek bir imageUrl varsa onu göster, yoksa slider ile çoklu görselleri göster */}
        {product.imagePath ? (
          <CardMedia
            component="img"
            image={product.getImagePathForShow()}
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
                      image={prod.getImagePathForShow()!}
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
          className={
            useTransition
              ? `
          sm:px-2 px-1
          absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white 
          translate-y-full group-hover:translate-y-0 
          transition-transform duration-500 ease-in-out
        `
              : `
          sm:px-2 px-1
          absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white 
        `
          }
        >


          {sitePreferences?.showNameAndPriceOnProductCard && <>
            <Box className="hidden sm:inline-block">
              <Typography variant="body2" className="text-sm font-bold  whitespace-normal">
                {product.name}
              </Typography>
              <Typography
                variant="subtitle2"
                className="text-sm whitespace-normal font-bold sm:mt-1 mt-0"
              >
         
               {product.currency.symbol}  {product.price.toFixed(2)}
              </Typography>
            </Box>
          </>}




          <Box className="flex sm:justify-between justify-between mt-1">
            <IconButton
              className="m-0 p-1"
              onClick={() => {
                (onOrderClick) && onOrderClick(product.id);
              }}
            >
              <AddShoppingCart sx={{ color: "whitesmoke" }} className="text-xl md:text-2xl" />
            </IconButton>
            <Box>
              <IconButton
                className="m-0 p-1"
                onClick={() => {
                  (onInvestigateClick) && onInvestigateClick(product.id);
                }}
              >
                <Description sx={{ color: "whitesmoke" }} className="text-xl md:text-2xl" />
              </IconButton>
              <IconButton className="mr-1 p-0">
                <Favorite sx={{ color: "grey" }} className="text-xl md:text-2xl" />
              </IconButton>
            </Box>
          </Box>


        </Box>




      </Box>
    </Box>
  );
};

export default React.memo(ProductComponent);
