import React from 'react';
import { Wallet, LogOut, RefreshCw } from 'lucide-react';
import { useWalletState } from "@/provider/walletContext";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface WalletConnectionProps {
  onRefresh?: () => void;
  loading?: boolean;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ 
  onRefresh, 
  loading = false 
}) => {
  const { publicKey, connected, connecting, connectWallet, disconnect } = useWalletState();

  // Option 1: Using Wallet Adapter Button (Recommended)
  const WalletAdapterButton = () => (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !rounded-lg !font-semibold !transition-colors !shadow-sm" />
      {connected && onRefresh && (
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          title="Refresh NFTs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );

  // Option 2: Custom Wallet Button
  const CustomWalletButton = () => {
    if (connecting) {
      return (
        <button disabled className="w-full sm:w-auto px-4 py-3 bg-gray-400 text-white rounded-lg flex items-center justify-center gap-2 font-semibold">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Connecting...</span>
        </button>
      );
    }

    if (connected && publicKey) {
      return (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none bg-white dark:bg-gray-700 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600">
            <p className="text-xs text-gray-600 dark:text-gray-400">Connected</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white truncate max-w-32 sm:max-w-none">
              {`${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
            </p>
          </div>
          <button
            onClick={disconnect}
            className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
            title="Disconnect wallet"
          >
            <LogOut className="w-4 h-4" />
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              title="Refresh NFTs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={connectWallet}
        className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold shadow-sm"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  };

  // Return the wallet adapter button by default (recommended)
  return <WalletAdapterButton />;
  // Or use custom button: return <CustomWalletButton />;
};
