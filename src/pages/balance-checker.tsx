import { useState } from "react";
import { useSolanaState } from "@/provider/context";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function BalanceChecker() {
  const { message, getBalance, publicKey } = useSolanaState();
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
    <div className="min-h-screen flex justify-center items-center flex-col mx-auto p-6 sm:p-12 md:p-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white border border-gray-700 rounded-lg shadow-lg">
      <h1 className="text-center text-3xl font-bold text-white mb-6">
        Wallet Balance Checker
      </h1>

      <div className="flex justify-center mb-6">
        <WalletMultiButton
          className="!bg-blue-600 !text-white !rounded-lg !px-6 !py-3 !font-semibold hover:!bg-blue-700 transition-colors duration-200"
        />
      </div>

      {publicKey && (
        <p className="text-center text-sm text-gray-300 mb-6 break-all">
          Connected: <span className="font-mono text-blue-400">{publicKey}</span>
        </p>
      )}

      {publicKey && (
        <div className="flex justify-center">
          <button
            onClick={handleGetBalance}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Fetching..." : "Get Balance"}
          </button>
        </div>
      )}

      {balance !== null && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-white">
            Balance: <span className="text-blue-400">{balance} SOL</span>
          </p>
        </div>
      )}

      {message && (
        <div className="mt-6 py-3 px-4 bg-gray-800 text-gray-300 text-center rounded-lg">
          {message}
        </div>
      )}
    </div>
  );
}
