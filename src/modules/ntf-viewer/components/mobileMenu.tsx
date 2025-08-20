import React from 'react';
import { Menu, X, Plus, Upload, RefreshCw } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  connected: boolean;
  onRefresh?: () => void;
  loading?: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onToggle,
  connected,
  onRefresh,
  loading = false
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="sm:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu content */}
      {isOpen && (
        <div className="sm:hidden mt-4 space-y-4">
          {connected && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh NFTs
            </button>
          )}
          <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2 font-semibold">
            <Plus className="w-4 h-4" />
            Create NFT
          </button>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold">
            <Upload className="w-4 h-4" />
            Mint NFT
          </button>
        </div>
      )}
    </>
  );
};
