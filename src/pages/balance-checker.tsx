import { useState } from "react";
import { useSolanaState } from "@/provider/context";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function BalanceChecker() {
  const { message, getBalance, publicKey, connectWallet } = useSolanaState();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetBalance = async () => {
    if (!publicKey) {
      alert("Please connect a wallet first.");
      return;
    }

    setLoading(true);
    try {
      const balanceInSol = await getBalance();
      setBalance(balanceInSol);
    } catch (err) {
      console.error("Error getting balance:", err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h1 className="text-center font-bold text-xl mb-4">
        Wallet Balance Checker
      </h1>

      {/* Connect Wallet button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {publicKey ? "Change Wallet" : "Connect Wallet"}
        </button>
        {/* Keep WalletMultiButton as an alternative, but you can choose one */}
        {/* <WalletMultiButton /> */}
      </div>

      {/* Show connected public key */}
      {publicKey && (
        <p className="text-center text-sm mb-4 break-all">
          Connected: <span className="font-mono">{publicKey}</span>
        </p>
      )}

      {/* Get Balance Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGetBalance}
          disabled={!publicKey || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Get Balance"}
        </button>
      </div>

      {/* Show balance */}
      {balance !== null && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">{balance} SOL</p>
        </div>
      )}

      {/* Message from context */}
      {message && (
        <div className="mt-4 py-2 px-3 bg-gray-100 text-center rounded">
          {message}
        </div>
      )}
    </div>
  );
}
