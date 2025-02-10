'use client';

import {
    Toolbar,
    Box,
    useTheme,
} from "@mui/material";
import { useRef } from "react";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import "react-toastify/dist/ReactToastify.css";
import useMyMediaQuery, { Breakpoints } from "@/shared/hooks/UseMediaQuery";
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import { ToastContainer } from "react-toastify";
import { useMyTheme } from "@/app/providers/global.providers/theme/theme.provider";
import AdminHeaderComponent from "./components/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { themeMode, toggleTheme } = useMyTheme();
    const theme = useTheme();
    const isSmallScreen = useMyMediaQuery(Breakpoints.SMALL, "max");
    const scrollableDivRef = useRef<HTMLDivElement>(null);

    return (
        <Box>
            {/* Renk şemasını ayarlayan script */}
            <InitColorSchemeScript attribute="class" />

            {/* Üstte AppBar: Navigasyon linkleri ve tema değiştirme butonu */}
           <AdminHeaderComponent></AdminHeaderComponent>

            {/* AppBar yüksekliğini telafi etmek için boş bir Toolbar */}
            <Toolbar />

            {/* İçerik Alanı */}
            <Box
                ref={scrollableDivRef}
                sx={{
                    p: 2,
                    height: isSmallScreen ? '95vh' : '100vh' ,
                    maxHeight: "calc(100vh - 65px)",
                    overflowY: "auto",
                }}
                className="whitespace-nowrap scrollbar-none sm:scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-500"
            >
                {children}

                {/* Toast Bildirimleri */}
                <ToastContainer />

                {/* Scroll To Top Butonu */}
                <ScrollToTopButton scrollableRef={scrollableDivRef} />
            </Box>
        </Box>
    );
}
