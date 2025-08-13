import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SolanaContextProvider } from '@/provider/context';
import "@solana/wallet-adapter-react-ui/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SolanaContextProvider>
     <Component {...pageProps} />
  </SolanaContextProvider>
  )
}
