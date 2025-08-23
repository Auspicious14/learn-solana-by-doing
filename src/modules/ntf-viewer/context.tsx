import React, { useState, useContext, createContext, useCallback } from "react";
import toast from "react-hot-toast";
import { INFT } from "./model";
import apiClient from "@/lib/api";

interface INFTState {
  loading: boolean;
  nfts: INFT[];
  fetchNFTs: (publicKey: string) => Promise<void>;
}

const NFTContext = createContext<INFTState | undefined>(undefined);

export const useNFTState = () => {
  const context = useContext(NFTContext);
  if (!context)
    throw new Error("NFTProvider must be used within the global app provider");
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const NFTContextProvider: React.FC<IProps> = ({ children }) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const endpoint = process.env.NEXT_PUBLIC_API_URL as string;

  const fetchNFTs = useCallback(
    async (walletAddress: string) => {
      if (!walletAddress.trim()) {
        toast.error("Please enter a wallet address");
        return;
      }

      setLoading(true);

      try {
        const response: any = await apiClient.post(
          `${endpoint}/nfts/get-by-owner`,
          {
            publicKey: walletAddress.trim(),
          }
        );

        const data: any = response.data;
        console.log(data, "dataaa");
        if (response.success) {
          setNfts(data || []);
          if ((response.count || 0) === 0) {
            toast.error("No NFTs found in this wallet");
          }
        } else {
          toast.error(data.message || "Failed to fetch NFTs");
        }
      } catch (err: any) {
        console.error("Error fetching NFTs:", err);
        toast.error(err.message || "Failed to connect to the server");
      } finally {
        setLoading(false);
      }
    },
    [endpoint, apiClient]
  );

  return (
    <NFTContext.Provider
      value={{
        loading,
        nfts,
        fetchNFTs,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
