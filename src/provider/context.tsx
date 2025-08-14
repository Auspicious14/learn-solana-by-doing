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
} from "@solana/wallet-adapter-wallets";
import { createContext, useContext, useMemo, useState } from "react";

interface ISolanaState {
  rpc: Rpc<SolanaRpcApiMainnet>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
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

const InnerSolanaProvider: React.FC<
  IProps & {
    rpc: Rpc<SolanaRpcApiMainnet>;
    rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
  }
> = ({ children, rpc, rpcSubscriptions }) => {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [message, setMessage] = useState<string | null>(null);

  const connectWallet = () => {
    setVisible(true);
  };

  /* const getBalance = async () => {
    if (!publicKey) {
      setMessage("No wallet connected");
      return 0;
    }

    try {
      const address = publicKey.toBase58() as Address;
      const balance = await rpc.getBalance(address).send();

      if (!balance.value) {
        setMessage(`Balance not found`);
        return 0;
      }

      return Number(balance.value) / 1_000_000_000;
    } catch (error) {
      setMessage(`Error fetching balance: ${(error as Error).message}`);
      return 0;
    }
  };
  */

  const getBalance = async (): Promise<number> => {
  if (!publicKey) {
    setMessage("No wallet connected");
    return 0;
  }

  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const address = publicKey.toBase58() as Address;
      
      // Add a small delay between retries
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }

      const balance = await rpc.getBalance(address).send();

      if (balance.value === undefined || balance.value === null) {
        setMessage(`Balance not found for address: ${address}`);
        return 0;
      }

      setMessage(null); // Clear any previous error messages
      return Number(balance.value) / 1_000_000_000; // Convert lamports to SOL

    } catch (error) {
      retries++;
      const errorMessage = (error as Error).message;
      
      console.error(`Balance fetch attempt ${retries} failed:`, error);
      
      if (retries >= maxRetries) {
        // Check for specific error types
        if (errorMessage.includes('8100002') || errorMessage.includes('403')) {
          setMessage("RPC endpoint rate limit reached. Please try again later or use a different endpoint.");
        } else if (errorMessage.includes('timeout')) {
          setMessage("Request timeout. Please check your internet connection.");
        } else {
          setMessage(`Error fetching balance after ${maxRetries} attempts: ${errorMessage}`);
        }
        return 0;
      }
      
      // Continue to next retry
      setMessage(`Retrying balance fetch (${retries}/${maxRetries})...`);
    }
  }

  return 0;
};

  return (
    <SolanaContext.Provider
      value={{
        rpc,
        rpcSubscriptions,
        publicKey: publicKey ? publicKey.toBase58() : null,
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
  const endpoint = "https://solana-api.projectserum.com";
  const rpc = createSolanaRpc(mainnet(endpoint));
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    endpoint.replace("https", "wss")
  );

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <InnerSolanaProvider rpc={rpc} rpcSubscriptions={rpcSubscriptions}>
            {children}
          </InnerSolanaProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
