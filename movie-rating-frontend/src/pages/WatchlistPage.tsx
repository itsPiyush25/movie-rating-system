import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Trash2, CheckCircle, Clock, Star, Filter, ArrowUpDown, ChevronDown } from 'lucide-react'
import { api, WatchlistItem, Watchlist } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const WatchlistPage = () => {
  const { user } = useAuth()
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [currentWatchlist, setCurrentWatchlist] = useState<Watchlist | null>(null)
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<string>('addedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (user) {
      fetchWatchlists()
    }
  }, [user])

  const fetchWatchlists = async () => {
    try {
      setIsLoading(true)
      const data = await api.getUserWatchlists(user!.id)
      setWatchlists(data)
      if (data.length > 0) {
        setCurrentWatchlist(data[0])
        fetchItems(data[0].id)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error fetching watchlists:', error)
      toast.error('Failed to load watchlists')
      setIsLoading(false)
    }
  }

  const fetchItems = async (watchlistId: number) => {
    try {
      setIsLoading(true)
      const data = await api.getWatchlistItems(watchlistId)
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Failed to load items')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWatchlistChange = (watchlist: Watchlist) => {
    setCurrentWatchlist(watchlist)
    fetchItems(watchlist.id)
  }

  const handleRemove = async (contentId: number) => {
    if (!currentWatchlist) return
    try {
      await api.removeFromWatchlist(currentWatchlist.id, contentId)
      setItems(items.filter(item => item.content.id !== contentId))
      toast.success('Removed from watchlist')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleStatusChange = async (contentId: number, status: WatchlistItem['status']) => {
    if (!currentWatchlist) return
    try {
      await api.updateWatchlistItem(currentWatchlist.id, contentId, { status })
      setItems(items.map(item => 
        item.content.id === contentId ? { ...item, status } : item
      ))
      toast.success(`Marked as ${status.toLowerCase().replace('_', ' ')}`)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handlePriorityChange = async (contentId: number, priority: any) => {
    if (!currentWatchlist) return
    try {
      await api.updateWatchlistItem(currentWatchlist.id, contentId, { priority })
      setItems(items.map(item => 
        item.content.id === contentId ? { ...item, priority } : item
      ))
      toast.success('Priority updated')
    } catch (error) {
      toast.error('Failed to update priority')
    }
  }

  const filteredAndSortedItems = items
    .filter(item => filterStatus === 'ALL' || item.status === filterStatus)
    .sort((a, b) => {
      const fieldA = a[sortBy as keyof WatchlistItem] as any
      const fieldB = b[sortBy as keyof WatchlistItem] as any
      
      if (sortOrder === 'asc') {
        return fieldA > fieldB ? 1 : -1
      } else {
        return fieldA < fieldB ? 1 : -1
      }
    })

  if (isLoading && watchlists.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Bookmark className="mr-3 text-primary-600" size={32} />
              Watchlist
            </h1>
            
            {watchlists.length > 1 && (
              <div className="relative group">
                <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{currentWatchlist?.name}</span>
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl hidden group-hover:block z-50">
                  {watchlists.map(wl => (
                    <button
                      key={wl.id}
                      onClick={() => handleWatchlistChange(wl)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl ${currentWatchlist?.id === wl.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {wl.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {currentWatchlist?.description || 'Track and manage movies and TV shows you want to watch.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
            <Filter size={16} className="text-gray-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300"
            >
              <option value="ALL">All Status</option>
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WATCHED">Watched</option>
              <option value="ABANDONED">Abandoned</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
            <ArrowUpDown size={16} className="text-gray-500" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300"
            >
              <option value="addedAt">Date Added</option>
              <option value="priority">Priority</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="ml-1 text-primary-600 hover:text-primary-700"
            >
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading items...</div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
            <Bookmark size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Watchlist is empty</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            Find interesting movies and TV shows to add to your list.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Explore Content
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedItems.map((item) => (
            <div 
              key={item.id}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-64 sm:h-auto overflow-hidden">
                  <img 
                    src={item.content.posterUrl} 
                    alt={item.content.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md shadow-sm ${
                      item.status === 'WATCHED' ? 'bg-green-500 text-white' :
                      item.status === 'IN_PROGRESS' ? 'bg-blue-500 text-white' :
                      item.status === 'ABANDONED' ? 'bg-gray-500 text-white' :
                      'bg-primary-600 text-white'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link to={`/content/${item.content.id}`} className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          {item.content.title}
                        </Link>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{item.content.releaseYear}</span>
                          <span className="mx-2">•</span>
                          <Star size={14} className="text-yellow-500 fill-current mr-1" />
                          <span>{item.content.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-medium text-gray-500 mr-2 uppercase tracking-wider">Priority</span>
                          <select 
                            value={item.priority}
                            onChange={(e) => handlePriorityChange(item.content.id, e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm font-bold p-0 pr-6"
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                          </select>
                        </div>
                        <button 
                          onClick={() => handleRemove(item.content.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {item.content.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={14} className="mr-1" />
                        Added on {new Date(item.addedAt).toLocaleDateString()}
                      </div>

                      <div className="flex items-center space-x-2">
                        {item.status !== 'IN_PROGRESS' && item.status !== 'WATCHED' && (
                          <button 
                            onClick={() => handleStatusChange(item.content.id, 'IN_PROGRESS')}
                            className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg transition-colors"
                          >
                            Start Watching
                          </button>
                        )}
                        {item.status !== 'WATCHED' && (
                          <button 
                            onClick={() => handleStatusChange(item.content.id, 'WATCHED')}
                            className="flex items-center px-3 py-1.5 text-sm font-medium bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-lg transition-colors"
                          >
                            <CheckCircle size={16} className="mr-1.5" />
                            Mark as Watched
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WatchlistPage
