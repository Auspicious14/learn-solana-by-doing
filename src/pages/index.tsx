import { Inter } from "next/font/google";
import { useState } from "react";
import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  generateKeyPairSigner,
} from "@solana/kit";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const rpc = createSolanaRpc("https://api.devnet.solana.com");
  const rpcSubscriptions = createSolanaRpcSubscriptions(
    "wss://api.devnet.solana.com"
  );
  const [balance, setBalance] = useState<string>("");

  const generateWallet = async () => {
    return await generateKeyPairSigner();
  };

  const handleWalletBalance = async () => {
    const wallet = await generateWallet();
    if (!wallet) {
      console.log("No wallet address");
      alert("No wallet address");
      return;
    }

    const balance = rpc.getBalance(wallet.address);
    if (!balance.send()) {
      console.log("No Balance found for this wallet");
      return;
    }
    // setBalance(balance)
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <input type="text" placeholder="Add a wallet address" />
    </main>
  );
}
