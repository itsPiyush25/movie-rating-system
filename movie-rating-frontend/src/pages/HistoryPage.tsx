import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { History, Trash2, Clock, Calendar, Film, Tv, Star, MoreVertical } from 'lucide-react'
import { api, ViewingLog } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const HistoryPage = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState<ViewingLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user])

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const data = await api.getUserHistory(user!.id)
      setHistory(data)
    } catch (error) {
      console.error('Error fetching history:', error)
      toast.error('Failed to load viewing history')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire viewing history? This cannot be undone.')) {
      try {
        await api.clearHistory(user!.id)
        setHistory([])
        toast.success('History cleared')
      } catch (error) {
        toast.error('Failed to clear history')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <History className="mr-3 text-primary-600" size={32} />
            Viewing History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Keep track of everything you've watched.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg transition-colors"
          >
            <Trash2 size={18} className="mr-2" />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
            <History size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No history yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            Your viewing history will appear here once you start watching movies and TV shows.
          </p>
          <Link
            to="/search"
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Discover Content
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {history.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0 w-16 h-24 overflow-hidden rounded-lg shadow-sm">
                    {log.content.posterUrl ? (
                      <img 
                        src={log.content.posterUrl} 
                        alt={log.content.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                        <Film size={24} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          to={`/content/${log.content.id}`}
                          className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors truncate block"
                        >
                          {log.content.title}
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                          <span className="flex items-center">
                            {log.content.contentType === 'MOVIE' ? <Film size={14} className="mr-1" /> : <Tv size={14} className="mr-1" />}
                            {log.content.contentType.replace('_', ' ')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Star size={14} className="text-yellow-500 fill-current mr-1" />
                            {log.content.averageRating}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                          <Calendar size={14} className="mr-1 text-gray-400" />
                          {new Date(log.startedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                          <Clock size={12} className="mr-1" />
                          {new Date(log.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-48 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${log.completionPercentage || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                          {log.completionPercentage || 0}% watched
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded uppercase tracking-wider">
                          {log.platform}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
