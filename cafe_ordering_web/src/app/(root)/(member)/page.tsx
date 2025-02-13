
'use client'

import { IPage } from "@/app/types/ViewTypes";
import { Box } from "@mui/material";
import React from "react";



const HomePage: IPage = () => {
  return (
    <Box
      style={{
        width: "100%", // Genişlik %100 olarak düzeltildi
        position: "relative", // Relative konumlandırma eklendi
      }}
    >
      <Box style={{ height: '1500px' }} className="bg-slate-500">
        sdfasdf
      </Box>
    </Box>
  );
};

export default React.memo(HomePage);
