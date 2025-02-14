import { AppGlobalProviders } from "../providers/AppGlobalProviders";
import { ToastContainer } from 'react-toastify';
import './global.css'

//import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body style={{ overflow: 'hidden' }}
        className={` antialiased  `}
      >
        <AppGlobalProviders>
          {children}
          <ToastContainer aria-label={"toast-container"} />
        </AppGlobalProviders>
      </body>
    </html>
  );
}
