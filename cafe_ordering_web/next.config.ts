process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_HOST_URL: "https://localhost:7106",
  },
  // Diğer yapılandırma seçenekleri...
};
export default nextConfig;
