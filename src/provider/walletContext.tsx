import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { createContext, useContext } from "react";

interface IWalletState {
  publicKey: any;
  connectWallet: () => void;
  disconnect: () => Promise<void>;
  connected: boolean;
  connecting: boolean;
}

const WalletContext = createContext<IWalletState | undefined>(undefined);

export const useWalletState = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletState must be used within WalletProvider");
  }
  return context;
};

interface IWalletProviderProps {
  children: React.ReactNode;
}

export const WalletContextProvider: React.FC<IWalletProviderProps> = ({ 
  children 
}) => {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const connectWallet = () => {
    setVisible(true);
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey: publicKey as any,
        connectWallet,
        disconnect,
        connected,
        connecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
