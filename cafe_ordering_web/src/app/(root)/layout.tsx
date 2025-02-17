import { AppGlobalProviders } from "../providers/AppGlobalProviders";
import { ToastContainer } from 'react-toastify';
import './global.css'

//import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { Paper } from "@mui/material";

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
          <Paper elevation={4}>
            {children}
          </Paper>

          <ToastContainer aria-label={"toast-container"} />
        </AppGlobalProviders>
      </body>
    </html>
  );
}
