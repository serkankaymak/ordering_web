"use client"; // Next.js client component olarak işaretle

import React from "react";
import Slider from "react-slick";

import { Card, CardContent, Typography, Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HorizontalCarousel: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const cardData = [
    { title: "Card 1", content: "This is the content of card 1." },
    { title: "Card 2", content: "This is the content of card 2." },
    { title: "Card 3", content: "This is the content of card 3." },
    { title: "Card 4", content: "This is the content of card 4." },
    { title: "Card 5", content: "This is the content of card 5." },
  ];

  return (
    <Box sx={{ width: "80%", margin: "0 auto", padding: "20px" }}>
      <Slider {...settings}>
        {cardData.map((card, index) => (
          <Box key={index} sx={{ padding: "0 10px" }}>
            <Card sx={{ boxShadow: 3, borderRadius: "12px", padding: "16px" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {card.content}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HorizontalCarousel;
