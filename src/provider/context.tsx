import apiClient from "@/lib/api";

import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  useWalletModal,
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
import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface ISolanaState {
  publicKey: string | null;
  message: string | null;
  connectWallet: () => void;
  getBalance: () => Promise<number>;
}

const SolanaContext = createContext<ISolanaState | undefined>(undefined);

export const useSolanaState = () => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw Error("Solana Provider must be used within the app provider");
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

const InnerSolanaProvider: React.FC<IProps & {}> = ({ children }) => {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [message, setMessage] = useState<string | null>(null);

  const connectWallet = () => {
    setVisible(true);
  };

  const getBalance = async () => {
    const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
    if (!publicKey) {
      setMessage("No wallet connected");
      return 0;
    }
    let retries = 0;
    let maxRetries = 3;
    while (retries < maxRetries) {
      try {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
        }

        const response = await apiClient.post(`${endpoint}/get-balance`, {
          publicKey,
        });
        const result = response.data;
        if (result?.success) {
          const balance = result?.data;
          if (!balance) {
            setMessage(`Balance not found`);
            toast(`Balance not found`);
            return 0;
          }
        }
      } catch (error) {
        retries++;
        console.log({ error });
        const errorMessage = (error as Error).message;

        if (retries >= maxRetries) {
          if (
            errorMessage.includes("8100002") ||
            errorMessage.includes("403")
          ) {
            setMessage(
              "RPC endpoint rate limit reached. Please try again later or use a different endpoint."
            );
          } else if (errorMessage.includes("timeout")) {
            setMessage(
              "Request timeout. Please check your internet connection."
            );
          } else {
            setMessage(
              `Error fetching balance after ${maxRetries} attempts: ${errorMessage}. Try again in 5 mins`
            );
          }
          return 0;
        }
        setMessage(`Retrying balance fetch (${retries}/${maxRetries})...`);
      }
    }
    return 0;
  };

  return (
    <SolanaContext.Provider
      value={{
        publicKey: publicKey as any,
        message,
        connectWallet,
        getBalance,
      }}
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
