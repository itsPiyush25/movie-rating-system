import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts'
import { TrendingUp, Clock, Star, Film, Award, Calendar } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

const StatsPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const data = await api.getUserStats(user!.id)
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load statistics')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>
    )
  }

  const genreData = stats?.genreDistribution 
    ? Object.entries(stats.genreDistribution).map(([name, value]) => ({ name, value }))
    : []

  const totalWatchTimeHours = Math.round((stats?.totalWatchTimeMinutes || 0) / 60)
  const totalWatchTimeDays = ((stats?.totalWatchTimeMinutes || 0) / (60 * 24)).toFixed(1)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="mr-3 text-primary-600" size={32} />
          Your Viewing Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          A detailed breakdown of your movie and TV show consumption habits.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Watch Time</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalWatchTimeHours}</h3>
            <span className="text-sm text-gray-500">hours</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">≈ {totalWatchTimeDays} days of content</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Film size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Titles Watched</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats?.totalContentWatched || 0}</h3>
          <p className="text-xs text-gray-400 mt-2">Across movies & TV shows</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
              <Star size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Ratings</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats?.ratingCount || 0}</h3>
          <p className="text-xs text-gray-400 mt-2">Shared with the community</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Award size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Watch Streak</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</h3>
          <span className="text-sm text-gray-500">days</span>
          <p className="text-xs text-green-500 mt-2">New personal best!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Star className="mr-2 text-yellow-500" size={20} />
            Genre Breakdown
          </h3>
          <div className="h-80">
            {genreData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genreData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Not enough data yet
              </div>
            )}
          </div>
        </div>

        {/* Watch Time Trend (Mock for now) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="mr-2 text-primary-500" size={20} />
            Watch Time Trend (Last 7 Days)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Mon', minutes: 120 },
                { day: 'Tue', minutes: 80 },
                { day: 'Wed', minutes: 150 },
                { day: 'Thu', minutes: 45 },
                { day: 'Fri', minutes: 210 },
                { day: 'Sat', minutes: 320 },
                { day: 'Sun', minutes: 180 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Discovery Insights */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Award className="mr-2 text-yellow-400" size={24} />
          Discovery Channel
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl">
          You tend to discover movies through <strong>Trending Now</strong> and <strong>Top Rated</strong> lists. 
          80% of your watched content was added to your watchlist first.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Top Genre</p>
            <p className="text-lg font-bold">Science Fiction</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Favorite Actor</p>
            <p className="text-lg font-bold">Leonardo DiCaprio</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Binge Habit</p>
            <p className="text-lg font-bold">Saturday Nights</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage
