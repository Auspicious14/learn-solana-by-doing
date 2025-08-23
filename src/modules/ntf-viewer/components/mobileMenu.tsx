import React from "react";
import { Menu, X, Plus, Upload, RefreshCw } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  loading?: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  loading = false,
}) => {
  return (
    <>
      {isOpen && (
        <div className="sm:hidden mt-4 space-y-4">
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
