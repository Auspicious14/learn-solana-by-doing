import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  AlphaWalletAdapter,
  BitgetWalletAdapter,
  CloverWalletAdapter,
  KeystoneWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import '@solana/wallet-adapter-react-ui/styles.css';

interface ISolanaProviderProps {
  children: React.ReactNode;
}

export const SolanaProvider: React.FC<ISolanaProviderProps> = ({ children }) => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL as string}/proxy`;

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BitgetWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new AlphaWalletAdapter(),
      new CloverWalletAdapter(),
      new KeystoneWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
