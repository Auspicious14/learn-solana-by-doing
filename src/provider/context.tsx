import React from "react";
import { SolanaProvider } from "./solanaContext";
import { WalletContextProvider } from "./walletContext";
import { BalanceProvider } from "@modules/wallet-balance/context";

interface IAppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<IAppProviderProps> = ({ children }) => {
  return (
    <SolanaProvider>
      <WalletContextProvider>
        <BalanceProvider>
          {children}
        </BalanceProvider>
      </WalletContextProvider>
    </SolanaProvider>
  );
};
