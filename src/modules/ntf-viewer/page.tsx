"use client";
import React, { useState, useEffect } from "react";
import { Wallet, RefreshCw, Menu, X } from "lucide-react";
import { useNFTState } from "./context";
import { NFTCard } from "./components/card";
import { NFTListItem } from "./components/list";
import { useWalletState } from "@/provider/walletContext";
import { WalletConnection } from "./components/walletConnection";
import { MobileMenu } from "./components/mobileMenu";
import { ActionButtons } from "./components/actionButtons";
import { NFTFilters } from "./components/filters";
import { EmptyState } from "./components/empty";

export const NFTPortfolioViewerPage: React.FC = () => {
  const { nfts, loading, fetchNFTs } = useNFTState();
  const { publicKey, connected } = useWalletState();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const collections = Array.from(
    new Set(nfts.map((nft) => nft.collection).filter(Boolean))
  );
  const filteredNFTs = nfts
    .filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        nft.description
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      const matchesCollection =
        selectedCollection === "all" || nft.collection === selectedCollection;
      return matchesSearch && matchesCollection;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "collection")
        return (a.collection || "").localeCompare(b.collection || "");
      return 0;
    });

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs(publicKey.toBase58());
    }
  }, [connected, publicKey?.toBase58(), fetchNFTs]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const handleCreateNFT = () => {
    console.log("Create NFT clicked");
    // Add your create NFT logic here
  };

  const handleMintNFT = () => {
    console.log("Mint NFT clicked");
    // Add your mint NFT logic here
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 rounded-2xl shadow-lg">
                <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">
                  NFT Portfolio
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block mt-1 font-medium">
                  Discover, view, and manage your Solana NFTs
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <ActionButtons
            connected={connected}
            onRefresh={() => fetchNFTs(publicKey!.toBase58())}
            loading={loading}
            onCreateNFT={handleCreateNFT}
            onMintNFT={handleMintNFT}
          />

          <div
            className={`${
              mobileMenuOpen ? "block" : "hidden"
            } sm:block transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "animate-in slide-in-from-top-2" : ""
            }`}
          >
            <div className="bg-gray-50/80 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
              <WalletConnection
                onRefresh={() => fetchNFTs(publicKey!.toBase58())}
                loading={loading}
              />
              <MobileMenu isOpen={mobileMenuOpen} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
            collections={collections as string[]}
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
          <div className="flex items-center justify-center py-16 sm:py-24">
            <div className="text-center">
              <div className="relative">
                <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-6 drop-shadow-sm" />
                <div className="absolute inset-0 w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Loading your NFTs...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                This may take a few moments
              </p>
            </div>
          </div>
        ) : filteredNFTs.length > 0 ? (
          <div className="animate-in fade-in-0 duration-500">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredNFTs.map((nft, index) => (
                  <div
                    key={nft.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <NFTCard nft={nft} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredNFTs.map((nft, index) => (
                  <div
                    key={nft.id}
                    className="animate-in fade-in-0 slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <NFTListItem nft={nft} />
                  </div>
                ))}
              </div>
            )}
          </div>
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

      {/* {connected && (
        <div className="fixed bottom-6 right-6 sm:hidden z-40">
          <button
            onClick={() => fetchNFTs(publicKey!.toBase58())}
            disabled={loading}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 hover:scale-110"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      )} */}
    </div>
  );
};
