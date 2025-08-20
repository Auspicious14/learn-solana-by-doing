import { createContext, useContext, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";

interface IBalanceState {
  balance: number | null;
  loading: boolean;
  message: string | null;
  getBalance: () => Promise<number>;
  refreshBalance: () => Promise<void>;
  clearMessage: () => void;
}

const BalanceContext = createContext<IBalanceState | undefined>(undefined);

export const useBalanceState = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within BalanceProvider");
  }
  return context;
};

interface IBalanceProviderProps {
  children: React.ReactNode;
}

export const BalanceProvider: React.FC<IBalanceProviderProps> = ({ 
  children 
}) => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const clearMessage = () => {
    setMessage(null);
  };

  const getBalance = useCallback(async (): Promise<number> => {
    const endpoint = process.env.NEXT_PUBLIC_API_URL as string;
    
    if (!publicKey) {
      setMessage("No wallet connected");
      return 0;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response: any = await apiClient.post(`${endpoint}/get-balance`, {
        publicKey: publicKey.toBase58(),
      });
      
      if (response?.success) {
        const balanceValue = response?.data;
        if (balanceValue === undefined || balanceValue === null) {
          setMessage("Balance not found");
          toast("Balance not found");
          setBalance(0);
          return 0;
        }
        setBalance(balanceValue);
        return balanceValue;
      } else {
        setMessage("Failed to fetch balance");
        toast.error("Failed to fetch balance");
        return 0;
      }
    } catch (error) {
      console.error("Balance fetch error:", error);
      const errorMessage = (error as Error).message;

      let userMessage = "";
      if (errorMessage.includes("8100002") || errorMessage.includes("403")) {
        userMessage = "RPC endpoint rate limit reached. Please try again later.";
      } else if (errorMessage.includes("timeout")) {
        userMessage = "Request timeout. Please check your internet connection.";
      } else {
        userMessage = `Error fetching balance: ${errorMessage}. Try again`;
      }

      setMessage(userMessage);
      toast.error(userMessage);
      setBalance(0);
      return 0;
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  const refreshBalance = useCallback(async () => {
    await getBalance();
  }, [getBalance]);

  return (
    <BalanceContext.Provider
      value={{
        balance,
        loading,
        message,
        getBalance,
        refreshBalance,
        clearMessage,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
