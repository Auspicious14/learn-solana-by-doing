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

  const getBalance = async () => {
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
  const endpoint = "https://api.mainnet-beta.solana.com";
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
