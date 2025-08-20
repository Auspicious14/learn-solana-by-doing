import React from 'react';
import { Plus, Upload, RefreshCw } from 'lucide-react';

interface ActionButtonsProps {
  connected: boolean;
  onRefresh?: () => void;
  loading?: boolean;
  onCreateNFT?: () => void;
  onMintNFT?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  connected,
  onRefresh,
  loading = false,
  onCreateNFT,
  onMintNFT
}) => {
  return (
    <div className="hidden sm:flex items-center justify-between">
      <div className="flex items-center gap-3">
        {connected && onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onCreateNFT}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center gap-2 font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create NFT
        </button>
        <button 
          onClick={onMintNFT}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center gap-2 font-semibold shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Mint NFT
        </button>
      </div>
    </div>
  );
};
