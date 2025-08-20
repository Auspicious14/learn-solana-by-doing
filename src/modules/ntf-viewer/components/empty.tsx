import React from 'react';
import { Wallet, Sparkles, Search, Plus, Upload } from 'lucide-react';

interface EmptyStateProps {
  type: 'not-connected' | 'no-nfts' | 'no-results';
  onCreateNFT?: () => void;
  onMintNFT?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  onCreateNFT, 
  onMintNFT 
}) => {
  const configs = {
    'not-connected': {
      icon: <Wallet className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" />,
      title: "Connect Your Wallet",
      description: "Connect your Solana wallet to view your NFT collection and start managing your digital assets.",
      showActions: false
    },
    'no-nfts': {
      icon: <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" />,
      title: "No NFTs Found",
      description: "This wallet doesn't contain any NFTs yet. Start by creating or minting your first NFT!",
      showActions: true
    },
    'no-results': {
      icon: <Search className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" />,
      title: "No Results Found",
      description: "Try adjusting your search terms or filters to find what you're looking for.",
      showActions: false
    }
  };

  const config = configs[type];

  return (
    <div className="text-center py-12 sm:py-20">
      {config.icon}
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {config.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base px-4">
        {config.description}
      </p>
      {config.showActions && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          <button 
            onClick={onCreateNFT}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Plus className="w-4 h-4" />
            Create NFT
          </button>
          <button 
            onClick={onMintNFT}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Upload className="w-4 h-4" />
            Mint NFT
          </button>
        </div>
      )}
    </div>
  );
};
