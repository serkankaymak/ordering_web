'use client';

import {
    Toolbar,
    Box,
} from "@mui/material";
import { useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import useMyMediaQuery, { Breakpoints } from "@/shared/hooks/UseMediaQuery";
import ScrollToTopButton from "@/shared/components/ScrollToTopButton";
import AdminHeaderComponent from "./components/AdminHeader";
import { OrderEventsProvider } from "@/app/providers/orderEvents.provider";
import AdminLayoutContent from './layoutContent';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isSmallScreen = useMyMediaQuery(Breakpoints.SMALL, "max");
    const scrollableDivRef = useRef<HTMLDivElement>(null);

    return (
        <OrderEventsProvider>
            <AdminLayoutContent>
                <Box>
                    {/* Renk şemasını ayarlayan script */}
                    {/**      <InitColorSchemeScript attribute="class" />  */}


                    {/* Üstte AppBar: Navigasyon linkleri ve tema değiştirme butonu */}
                    <AdminHeaderComponent></AdminHeaderComponent>

                    {/* AppBar yüksekliğini telafi etmek için boş bir Toolbar */}
                    <Toolbar />

                    {/* İçerik Alanı */}
                    <Box
                        ref={scrollableDivRef}
                        sx={{
                            p: 2,
                            height: isSmallScreen ? '95vh' : '100vh',
                            maxHeight: "calc(100vh - 65px)",
                            overflowY: "auto",
                        }}
                        className="whitespace-nowrap scrollbar-none sm:scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-500"
                    >
                        {children}
                        {/* Scroll To Top Butonu */}
                        <ScrollToTopButton scrollableRef={scrollableDivRef} />
                    </Box>


                </Box>
            </AdminLayoutContent>

        </OrderEventsProvider>

    );
}
