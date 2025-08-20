import { INFT } from "../model"
import { Eye, ExternalLink, Sparkles } from "lucide-react"

export const NFTCard = ({ nft }: { nft: INFT }) => {
  
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
        {nft.image ? (
          <>
            <img 
              src={nft.image} 
              alt={nft.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4 text-gray-700" />
                </button>
                {nft.uri && (
                  <a 
                    href={nft.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-700" />
                  </a>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Sparkles className="w-12 h-12" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
          {nft.name || 'Unnamed NFT'}
        </h3>
        {nft.collection && (
          <p className="text-sm text-purple-600 dark:text-purple-400 truncate mb-2">
            {nft.collection}
          </p>
        )}
        {nft.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {nft.description}
          </p>
        )}
        {nft.attributes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {nft.attributes.slice(0, 2).map((attr, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md text-gray-600 dark:text-gray-300"
              >
                {attr.trait_type}: {attr.value}
              </span>
            ))}
            {nft.attributes.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md text-gray-600 dark:text-gray-300">
                +{nft.attributes.length - 2} more
              </span>
            )}
          </div>
        )}
        {nft.creators.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Creator:</span>
            <span className="font-mono truncate">
              {nft.creators[0].address.slice(0, 4)}...{nft.creators[0].address.slice(-4)}
            </span>
            {nft.creators[0].verified && (
              <span className="text-green-500">✓</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
