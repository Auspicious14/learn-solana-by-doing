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
import { createContext, useContext } from "react";

interface ISolanaState {
  rpc: Rpc<SolanaRpcApiMainnet>; // Limit the API to only those methods found on Mainnet (ie. not `requestAirdrop`)
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
}

const SolanaContext = createContext<ISolanaState | undefined>(undefined);

export const useSolanaState = () => {
  const context = useContext(SolanaContext);
  if (!context || context === undefined) {
    throw Error("Solana Provider must be used within the app provider");
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const SolanaContextProvider: React.FC<IProps> = async ({ children }) => {
  const rpc = createSolanaRpc(mainnet("https://api.mainnnet-beta.solana.com"));
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    "wss://api.mainnet-beta.solana.com"
  );

  return (
    <SolanaContext.Provider value={{ rpc, rpcSubscriptions }}>
      <ConnectionProvider endpoint={""}>
        <WalletProvider wallets={[]}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </SolanaContext.Provider>
  );
};
