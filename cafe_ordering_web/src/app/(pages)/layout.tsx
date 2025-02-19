import { AppGlobalProviders } from "../providers/AppGlobalProviders";
import { ToastContainer } from 'react-toastify';
import './global.css'

//import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { Paper } from "@mui/material";
import SitePreferencesDrawerComponent from "./components/SitePreferencesDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en" suppressHydrationWarning={true}>
      <head>
        <title>Başlık Buraya</title>
      </head>
      <body style={{ overflow: 'hidden' }}
        className={` antialiased  `}
      >
        <AppGlobalProviders>
          <Paper className="px-2 md:px-0" elevation={4}>
            {children}
          </Paper>
          <ToastContainer aria-label={"toast-container"} />
          <SitePreferencesDrawerComponent></SitePreferencesDrawerComponent>
        </AppGlobalProviders>
      </body>
    </html>
  );
}
