import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  mainnet,
  Rpc,
  RpcSubscriptions,
  SolanaRpcApiMainnet,
  SolanaRpcSubscriptionsApi,
  Address,
} from "@solana/kit";
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
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { createContext, useContext, useMemo, useState } from "react";

interface ISolanaState {
  rpc: Connection;
  publicKey: PublicKey | null;
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

const InnerSolanaProvider: React.FC<
  IProps & {
    rpc: Connection;
  }
> = ({ children, rpc }) => {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [message, setMessage] = useState<string | null>(null);

  const connectWallet = () => {
    setVisible(true);
  };

  const getBalance = async () => {
    if (!publicKey) {
      setMessage("No wallet connected");
      return 0;
    }

    try {
      const balance = await rpc.getBalance(publicKey);
      console.log({ balance });
         if (!balance) {
          setMessage(`Balance not found`);
          return 0;
       }

      return Number(balance) / LAMPORTS_PER_SOL;
    } catch (error) {
      console.log({ error });
      const errorMessage = (error as Error).message;

      if (errorMessage.includes("8100002") || errorMessage.includes("403")) {
        setMessage(
          "RPC endpoint rate limit reached. Please try again later or use a different endpoint."
        );
      } else if (errorMessage.includes("timeout")) {
        setMessage("Request timeout. Please check your internet connection.");
      } else {
        setMessage(`Error fetching balance: ${errorMessage}`);
      }
      return 0;
    }
  };

  return (
    <SolanaContext.Provider
      value={{
        rpc,
        publicKey,
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
  const endpoint = clusterApiUrl("devnet");
  const connection = new Connection(endpoint, "confirmed");
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
        <WalletModalProvider>
          <InnerSolanaProvider rpc={connection}>{children}</InnerSolanaProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
