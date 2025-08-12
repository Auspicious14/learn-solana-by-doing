import { Inter } from "next/font/google";
import { useState } from "react";
import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  generateKeyPairSigner,
  Address,
} from "@solana/kit";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const rpc = createSolanaRpc("https://api.mainnnet-beta.solana.com");
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    "wss://api.mainnet-beta.solana.com"
  );
  const [walletBalance, setWalletBalance] = useState<number>();
  const [message, setMessage] = useState<string>("")


  const generateWallet = async () => {
    return await generateKeyPairSigner();
  };

  const handleWalletBalance = async (address: Address) => {
    const wallet = await generateWallet();
    if (!wallet) {
      console.log("No wallet address");
      setMessage("No wallet address");
      return;
    }

    const balance = await rpc.getBalance(wallet.address).send();
    if (!balance.value) {
      setMessage("No Balance found for this wallet");
      return;
    }
    
    setWalletBalance(balance.value / 1_000_000_000)
    setMessage(`You have ${walletBalance} balance left.`)
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <input 
        type="text" 
        placeholder="Add a wallet address" 
        className="p-2 rounded-sm outline-none border border-gray-200 focus:ring-blue-500"
        onChange={(e) => handleWalletBalance(e.target.value)}
      />
      {message && (
       <div className="py-4 flex justify-center items-center">{message}</div>
      )}
    </main>
  );
}
