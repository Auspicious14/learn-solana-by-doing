import { INFT} from "./model"
import { ExternalLink, Eye, Sparkles } from "lucide-react"
import Link from "next/link"

export const NFTListItem = ({ nft }: { nft: INFT }) => {
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          {nft.image ? (
            <img 
              src={nft.image} 
              alt={nft.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="10" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Sparkles className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {nft.name || 'Unnamed NFT'}
          </h3>
          {nft.collection && (
            <p className="text-sm text-purple-600 dark:text-purple-400 truncate">
              {nft.collection}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {nft.attributes.length} traits
            </span>
            {nft.creators.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {nft.creators[0].address.slice(0, 8)}...
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          {nft.uri && (
            <Link 
              href={nft.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
