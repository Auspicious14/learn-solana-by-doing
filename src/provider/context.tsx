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
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { createContext, useContext, useMemo } from "react";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletReadyState } from "@solana/wallet-adapter-base";

interface ISolanaState {
  rpc: Rpc<SolanaRpcApiMainnet>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
  publicKey: string | null
  message: string | null
  selectedWallet: string | null
  connectWallet: () => void
  selectWallet: (walletName: string) => void
  getBalance: () => number
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
  const rpcSubscriptions = createSolanaRpcSubscriptions(endpoint.replace("https", "wss"));
  const { wallets: adapters, select, publicKey, connect} = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
 // const [publicKey, setPublicKey] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  const wallets = useMemo( () => 
  [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []
  );

  const selectWallet = (walletName: string) => {
    
    if (adapters.length === 0) {
     // throw Error("No wallets found")
      setMessage("No Wallets found")
      return
    }
   setSelectedWallet(walletName)
   select(walletName)
    
  }

  const connectWallet = async () => {
    const walletToBeConnected = adapters.find((wallet) => wallet.adapter.name === selectedWallet)

    if (!walletToBeConnected) {
      setMessage("Selected wallet doesn't Match selected Wallect. Try again")
      return
    } 
    if (walletToBeConnected.readyState() !== WalletReadyState.Installed ) {
      // install wallet if not already installed
      setMessage("Wallet not found, install wallet")
      return
    }
    
    await connect(walletToBeConnected)
    //setPublicKey(publicKey.toBase58())
    
  }

  const getBalance = async () => {
    const balance = await rpc.getBalance(publicKey as Address).send()

    if (!balance.value) {
      setMessage(`Balance for ${selectedWallet} not found`)
      return
    }
   
    return Number(balance.value) / 1_000_000_000

  }
  
  return (
    <SolanaContext.Provider 
      value={{ 
        rpc, 
        rpcSubscriptions, 
        connectWallet, 
        selectWallet, 
        publicKey: publicKey ? publicKey.toBase58 : null, 
        message, 
        selectedWallet, 
        getBalance 
      }}
      >
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </SolanaContext.Provider>
  );
};
