import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  mainnet,
  Rpc,
  RpcSubscriptions,
  SolanaRpcApiMainnet,
  SolanaRpcSubscriptionsApi,
} from "@solana/kit";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { createContext, useContext, useMemo } from "react";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

interface ISolanaState {
  rpc: Rpc<SolanaRpcApiMainnet>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
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

export const SolanaContextProvider: React.FC<IProps> =  ({ children }) => {
  const endpoint = "https://api.mainnet-beta.solana.com"
  const rpc = createSolanaRpc(mainnet(endpoint));
  const rpcSubscriptions = createSolanaRpcSubscriptions(endpoint.replace("https, wss"));
  
const wallets = useMemo( () => 
  [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []
  );
  
  return (
    <SolanaContext.Provider value={{ rpc, rpcSubscriptions }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </SolanaContext.Provider>
  );
};
