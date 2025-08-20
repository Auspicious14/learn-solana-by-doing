import React from 'react';
import { Search, Filter, SortAsc, Grid, List } from 'lucide-react';

interface NFTFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCollection: string;
  onCollectionChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  collections: string[];
  totalNFTs: number;
  filteredNFTs: number;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const NFTFilters: React.FC<NFTFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCollection,
  onCollectionChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  collections,
  totalNFTs,
  filteredNFTs,
  showFilters,
  onToggleFilters
}) => {
  return (
    <div className="mb-6">
      {/* Mobile Filter Toggle */}
      <div className="sm:hidden mb-4">
        <button
          onClick={onToggleFilters}
          className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Filter className="w-4 h-4" />
            Filters & Search
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredNFTs} of {totalNFTs}
          </span>
        </button>
      </div>

      {/* Filters Content */}
      <div className={`${showFilters ? 'block' : 'hidden'} sm:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700`}>
        <div className="p-4 space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:max-w-xs pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3">
              {/* Collection Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500 hidden lg:block" />
                <select
                  value={selectedCollection}
                  onChange={(e) => onCollectionChange(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Collections</option>
                  {collections.map(collection => (
                    <option key={collection} value={collection}>{collection}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500 hidden lg:block" />
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="collection">Sort by Collection</option>
                </select>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 sm:hidden">
                {filteredNFTs} of {totalNFTs} NFTs
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {filteredNFTs} of {totalNFTs} NFTs
              </span>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
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
  );
};
