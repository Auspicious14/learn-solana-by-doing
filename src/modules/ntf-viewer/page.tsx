import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Search, 
  Grid, 
  List, 
  Plus, 
  Upload, 
  Eye, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Filter,
  SortAsc
} from 'lucide-react';
import { useNFTState } from "./context"
import { NFTCard } from "./components/card"
import { NFTListItem } from "./components/list"

export const NFTPortfolioViewer = () => {
  const { nfts, loading, fetchNFTs } = useNFTState()
  const [walletAddress, setWalletAddress] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [sortBy, setSortBy] = useState('name');

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

    
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchNFTs(walletAddress);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                NFT Portfolio
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover, view, and manage your Solana NFTs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center gap-2 font-semibold shadow-sm">
                <Plus className="w-4 h-4" />
                Create NFT
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center gap-2 font-semibold shadow-sm">
                <Upload className="w-4 h-4" />
                Mint NFT
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="flex-grow relative">
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter Solana wallet address..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={loading}
              />
            </div>
            <button
              onClick={fetchNFTs}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {nfts.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Collections</option>
                {collections.map(collection => (
                  <option key={collection} value={collection}>{collection}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="collection">Sort by Collection</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredNFTs.length} of {nfts.length} NFTs
              </span>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your NFTs...</p>
            </div>
          </div>
        ) : filteredNFTs.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredNFTs.map(nft => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNFTs.map(nft => (
                <NFTListItem key={nft.id} nft={nft} />
              ))}
            </div>
          )
        ) : nfts.length === 0 && !loading ? (
          <div className="text-center py-20">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to explore your NFTs?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Enter your Solana wallet address above to view your NFT collection, 
              or start by creating your first NFT.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
