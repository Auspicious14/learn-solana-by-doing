import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
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
import { useMemo } from "react";

interface ISolanaProviderProps {
  children: React.ReactNode;
}

export const SolanaProvider: React.FC<ISolanaProviderProps> = ({ children }) => {
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

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
    <ConnectionProvider endpoint={`${endpoint as string}/proxy`}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};

export const SolanaContextProvider: React.FC<IProps> = ({ children }) => {
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

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
    <ConnectionProvider endpoint={`${endpoint as string}/proxy`}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <InnerSolanaProvider>{children}</InnerSolanaProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
