import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
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
  SortAsc,
  Search,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useNFTState } from "./context";
import { NFTCard } from "./components/card";
import { NFTListItem } from "./components/list";
import { useWalletState } from "@/provider/walletContext";

export const NFTPortfolioViewer = () => {
  const { nfts, loading, fetchNFTs } = useNFTState();
  const { publicKey, connected, connecting, connectWallet, disconnect } = useWalletState();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);


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

  const WalletButton = () => {
    if (connecting) {
      return (
        <button disabled className="w-full sm:w-auto px-4 py-3 bg-gray-400 text-white rounded-lg flex items-center justify-center gap-2 font-semibold">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline">Connecting...</span>
          <span className="sm:hidden">Connecting...</span>
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
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="hidden sm:flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {connected && (
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              )}
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

          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:block`}>
            <div className="space-y-4">
              <WalletButton />
              
              <div className="sm:hidden grid grid-cols-1 gap-3">
                {connected && (
                  <button
                    onClick={handleRefresh}
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        

        {connected && nfts.length > 0 && (
          <div className="mb-6">
            <div className="sm:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <span className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Filter className="w-4 h-4" />
                  Filters & Search
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredNFTs.length} of {nfts.length}
                </span>
              </button>
            </div>

          
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700`}>
              <div className="p-4 space-y-4 sm:space-y-0">
          
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search NFTs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:max-w-xs pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3">

                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500 hidden lg:block" />
                      <select
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value)}
                        className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="all">All Collections</option>
                        {collections.map(collection => (
                          <option key={collection} value={collection}>{collection}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4 text-gray-500 hidden lg:block" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="name">Sort by Name</option>
                        <option value="collection">Sort by Collection</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 sm:hidden">
                      {filteredNFTs.length} of {nfts.length} NFTs
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
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
              </div>
            </div>
          </div>
        )}

        {!connected ? (
          <div className="text-center py-12 sm:py-20">
            <Wallet className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base px-4">
              Connect your Solana wallet to view your NFT collection and start managing your digital assets.
            </p>
          </div>
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
          <div className="text-center py-12 sm:py-20">
            <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No NFTs Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base px-4">
              This wallet doesn't contain any NFTs yet. Start by creating or minting your first NFT!
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2 font-semibold">
                <Plus className="w-4 h-4" />
                Create NFT
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold">
                <Upload className="w-4 h-4" />
                Mint NFT
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <Search className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No Results Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base px-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};        </div>
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
