"use client";
import { useState } from "react";
import { useBalanceState } from "./context";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletState } from "@/provider/walletContext"

export const BalanceChecker = () => {
  const { 
    publicKey, 
    connected,
    connectWallet, 
    disconnect 
  } = useWalletState();
  const { message, getBalance } = useBalanceState();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetBalance = async () => {
    setLoading(true);
    try {
      const balanceInSol = await getBalance();
      setBalance(balanceInSol);
    } catch (err) {
      console.log("Error getting balance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center flex-col mx-auto p-6 sm:p-12 md:p-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white border border-gray-700 rounded-lg shadow-lg">
      <h1 className="text-center text-3xl font-bold text-white mb-6">
        Wallet Balance Checker
      </h1>

      <div className="flex justify-center mb-6">
        <WalletMultiButton
          onClick={connectWallet}
          className="!bg-blue-600 !text-white !rounded-lg !px-6 !py-3 !font-semibold hover:!bg-blue-700 transition-colors duration-200"
        />
      </div>

      {publicKey && (
        <p className="text-center text-sm text-gray-300 mb-6 break-all">
          Connected:{" "}
          <span className="font-mono text-blue-400">
            {publicKey?.toBase58()}
          </span>
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

      {/* {message && (
        <div className="mt-6">
          <div className="py-3 px-4 bg-red-900/50 border border-red-700 text-red-200 text-center rounded-lg text-sm break-words overflow-hidden">
            {message}
          </div>
        </div>
      )} */}
    </div>
  );
}
