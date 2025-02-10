'use client';

import { Box, useTheme } from "@mui/material";
import HeaderComponent from "./components/HeaderComponent";
import BottomNavigationComponent from "./components/BottomNavigationComponent";
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import { useRef } from "react";
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import useMyMediaQuery, { Breakpoints } from "@/shared/hooks/UseMediaQuery";


export default function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useTheme();
  const isSmallScreen = useMyMediaQuery(Breakpoints.SMALL, 'max');
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  return (
    <Box>
      <Box
        ref={scrollableDivRef}
        sx={{
          maxHeight: "calc(100vh - 65px)",
          height: isSmallScreen ? '92vh' : '100vh'
        }}
        className=" 
            flex flex-col overflow-auto 
            whitespace-nowrap  scrollbar-none sm:scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-500"
      >
        <InitColorSchemeScript attribute="class" />
        <HeaderComponent className="z-10 sticky" />
        <Box>
          {children}
          <ScrollToTopButton scrollableRef={scrollableDivRef} />
        </Box>
      </Box>
      <BottomNavigationComponent className="z-10 sm:hidden block fixed bottom-0 w-full" />
    </Box>

  );
}
