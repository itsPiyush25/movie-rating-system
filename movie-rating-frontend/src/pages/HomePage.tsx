import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Star, TrendingUp, Film, Tv, Users } from 'lucide-react'
import ContentCard from '../components/ContentCard'
import { useAuth } from '../contexts/AuthContext'
import { api, Content } from '../services/api'
import toast from 'react-hot-toast'

const HomePage = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [trending, setTrending] = useState<Content[]>([])
  const [globalStats, setGlobalStats] = useState<any>(null)
  const [featured, setFeatured] = useState<Content[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [trendingData, statsData, allContent] = await Promise.all([
          api.getTrendingContent(5),
          api.getGlobalStats(),
          api.searchContent('') // Remove second argument as it's not supported
        ])
        setTrending(trendingData)
        setGlobalStats(statsData)
        setFeatured(allContent)
      } catch (error) {
        console.error('Error fetching home data:', error)
        toast.error('Failed to load some dashboard content')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 p-8 md:p-12 lg:p-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Discover Your Next Favorite Movie
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Rate, review, and track movies and TV shows. Join our community of film enthusiasts.
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Play size={20} className="mr-2" />
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <div className="space-y-2">
                   <p className="text-white text-xl">Welcome back, <span className="font-bold text-primary-400">{user.displayName}</span>!</p>
                   <Link
                    to="/search"
                    className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center w-fit"
                  >
                    <Play size={20} className="mr-2" />
                    Browse Content
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <Star className="text-primary-600 dark:text-primary-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Ratings</p>
              <p className="text-2xl font-bold">{globalStats?.totalRatings || 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Film className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Movies</p>
              <p className="text-2xl font-bold">{globalStats?.totalMovies || 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Tv className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">TV Shows</p>
              <p className="text-2xl font-bold">{globalStats?.totalTvShows || 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold">{globalStats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Today</h2>
          <Link to="/search" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp size={24} className="text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
          </div>
          <Link to="/search" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            See more
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Year</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Rating</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Genre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {trending.map((content, index) => (
                <tr key={content.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <span className={`text-lg font-bold ${index < 3 ? 'text-primary-600' : 'text-gray-500'}`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/content/${content.id}`} className="font-medium hover:text-primary-600 dark:hover:text-primary-400">
                      {content.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{content.releaseYear}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold">{content.averageRating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {content.genres?.slice(0, 2).map((g: any) => (
                        <span key={g.id} className="px-2 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 rounded uppercase tracking-wider font-bold text-gray-500">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default HomePage