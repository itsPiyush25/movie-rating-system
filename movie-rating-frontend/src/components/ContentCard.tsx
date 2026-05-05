import { Link } from 'react-router-dom'
import { Star, Clock, Play, Bookmark, Eye, Film } from 'lucide-react'
import { useState } from 'react'
import { Content } from '../services/api'

interface ContentCardProps {
  content: Content
  variant?: 'default' | 'compact' | 'featured'
}

const ContentCard = ({ content, variant = 'default' }: ContentCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // In a real app, this would call an API to update the watchlist
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/content/${content.id}`}
        className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {content.posterUrl && (
          <img
            src={content.posterUrl}
            alt={content.title}
            className="w-12 h-16 object-cover rounded-md mr-4"
          />
        )}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{content.title}</h4>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            {content.releaseYear && <span>{content.releaseYear} • </span>}
            <Star size={14} className="text-yellow-500 fill-current mr-1" />
            <span>{content.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <div
        className="relative rounded-xl overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content.posterUrl && (
          <img
            src={content.posterUrl}
            alt={content.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
                FEATURED
              </div>
              {content.releaseYear && (
                <span className="text-white/80 text-sm">{content.releaseYear}</span>
              )}
            </div>
            <button
              onClick={handleBookmark}
              className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <Bookmark
                size={20}
                className={isBookmarked ? 'text-primary-400 fill-current' : 'text-white'}
              />
            </button>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
          <p className="text-white/80 text-sm line-clamp-2 mb-3">{content.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 fill-current mr-1" />
                <span className="text-white font-semibold">{content.averageRating?.toFixed(1) || '0.0'}</span>
              </div>
              {content.durationMinutes && (
                <div className="flex items-center text-white/80">
                  <Clock size={14} className="mr-1" />
                  <span className="text-sm">{content.durationMinutes}m</span>
                </div>
              )}
            </div>
            <Link
              to={`/content/${content.id}`}
              className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center"
            >
              <Play size={16} className="mr-2" />
              Details
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <Link
      to={`/content/${content.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
        {/* Poster Image */}
        <div className="relative overflow-hidden">
          {content.posterUrl ? (
            <img
              src={content.posterUrl}
              alt={content.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Film size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
          )}
          
          {/* Overlay on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="flex space-x-4">
                <button
                  onClick={handleBookmark}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <Bookmark
                    size={20}
                    className={isBookmarked ? 'text-primary-400 fill-current' : 'text-white'}
                  />
                </button>
                <button className="p-3 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors">
                  <Play size={20} className="text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded flex items-center">
            <Star size={14} className="text-yellow-500 fill-current mr-1" />
            <span className="text-white font-semibold text-sm">{content.averageRating?.toFixed(1) || '0.0'}</span>
          </div>

          {/* View count */}
          {content.viewCount && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded flex items-center">
              <Eye size={14} className="text-white mr-1" />
              <span className="text-white text-sm">{content.viewCount.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {content.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
            {content.releaseYear && <span>{content.releaseYear}</span>}
            {content.durationMinutes && (
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{content.durationMinutes}m</span>
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1">
            {content.genres?.slice(0, 2).map((g) => (
              <span
                key={g.id}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {g.name}
              </span>
            ))}
            {content.genres && content.genres.length > 2 && (
              <span className="px-2 py-1 text-xs text-gray-500">+{content.genres.length - 2}</span>
            )}
          </div>

          {/* Description (only for larger cards) */}
          {content.description && variant === 'default' && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {content.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ContentCard