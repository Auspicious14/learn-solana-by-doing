import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SolanaContextProvider } from "@/provider/context";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SolanaContextProvider>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid #ffd700",
          },
          success: {
            iconTheme: {
              primary: "#ffd700",
              secondary: "#1a1a2e",
            },
          },
          error: {
            iconTheme: {
              primary: "#e94560",
              secondary: "#1a1a2e",
            },
          },
        }}
      />
    </SolanaContextProvider>
  );
}
