import React, { useState, useEffect } from 'react';
import { Wallet, RefreshCw } from 'lucide-react';
import { useNFTState } from "./context";
import { NFTCard } from "./components/card";
import { NFTListItem } from "./components/list";
import { useWalletState } from "@/provider/walletContext";
import { WalletConnection } from './components/walletConnection';
import { MobileMenu } from './components/mobileMenu';
import { ActionButtons } from './components/actionButtons';
import { NFTFilters } from './components/filters';
import { EmptyState } from './components/empty';

export const NFTPortfolioViewer: React.FC = () => {
  const { nfts, loading, fetchNFTs } = useNFTState();
  const { publicKey, connected } = useWalletState();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Derived state
  const collections = Array.from(new Set(nfts.map(nft => nft.collection).filter(Boolean)));
  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = selectedCollection === 'all' || nft.collection === selectedCollection;
    return matchesSearch && matchesCollection;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'collection') return (a.collection || '').localeCompare(b.collection || '');
    return 0;
  });

  // Auto-fetch NFTs when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs(publicKey.toBase58());
    }
  }, [connected, publicKey, fetchNFTs]);

  const handleRefresh = () => {
    if (connected && publicKey) {
      fetchNFTs(publicKey.toBase58());
    }
  };

  const handleCreateNFT = () => {
    console.log('Create NFT clicked');
    // Add your create NFT logic here
  };

  const handleMintNFT = () => {
    console.log('Mint NFT clicked');
    // Add your mint NFT logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  NFT Portfolio
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block mt-1">
                  Discover, view, and manage your Solana NFTs
                </p>
              </div>
            </div>
            
            <MobileMenu
              isOpen={mobileMenuOpen}
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              connected={connected}
              onRefresh={handleRefresh}
              loading={loading}
            />
          </div>

          <ActionButtons
            connected={connected}
            onRefresh={handleRefresh}
            loading={loading}
            onCreateNFT={handleCreateNFT}
            onMintNFT={handleMintNFT}
          />

          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:block mt-4`}>
            <WalletConnection onRefresh={handleRefresh} loading={loading} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {connected && nfts.length > 0 && (
          <NFTFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCollection={selectedCollection}
            onCollectionChange={setSelectedCollection}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            collections={collections}
            totalNFTs={nfts.length}
            filteredNFTs={filteredNFTs.length}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        )}
        
        {!connected ? (
          <EmptyState 
            type="not-connected" 
            onCreateNFT={handleCreateNFT}
            onMintNFT={handleMintNFT}
          />
        ) : loading ? (
          <div className="flex items-center justify-center py-12 sm:py-20">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading your NFTs...</p>
      </div>
    </div>
        ) : filteredNFTs.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredNFTs.map(nft => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredNFTs.map(nft => (
                <NFTListItem key={nft.id} nft={nft} />
              ))}
            </div>
          )
        ) : nfts.length === 0 ? (
          <EmptyState 
            type="no-nfts" 
            onCreateNFT={handleCreateNFT}
            onMintNFT={handleMintNFT}
          />
        ) : (
          <EmptyState 
            type="no-results" 
            onCreateNFT={handleCreateNFT}
            onMintNFT={handleMintNFT}
          />
        )}
      </div>
    </div>
  );
};
