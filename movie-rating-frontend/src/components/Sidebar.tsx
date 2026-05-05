import { NavLink } from 'react-router-dom'
import { Home, Film, Tv, Star, Bookmark, User, Settings, TrendingUp, History } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const { user } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Movies', href: '/search?type=MOVIE', icon: Film },
    { name: 'TV Shows', href: '/search?type=TV_SHOW', icon: Tv },
    { name: 'Top Rated', href: '/search?sort=rating', icon: Star },
    { name: 'Trending', href: '/search?sort=trending', icon: TrendingUp },
    { name: 'Watchlist', href: '/watchlist', icon: Bookmark },
    { name: 'History', href: '/history', icon: History },
    { name: 'Statistics', href: '/stats', icon: TrendingUp },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const userStats = [
    { label: 'Ratings', value: '42' },
    { label: 'Reviews', value: '18' },
    { label: 'Watchlist', value: '56' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          {user?.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.displayName}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <User size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{user?.displayName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {userStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Filters */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Quick Filters
        </h4>
        <div className="space-y-2">
          {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'].map((genre) => (
            <NavLink
              key={genre}
              to={`/search?genre=${genre.toLowerCase()}`}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded transition-colors ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              {genre}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>Movie Rating System v1.0</p>
          <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar