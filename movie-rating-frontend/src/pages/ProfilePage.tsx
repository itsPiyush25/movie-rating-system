import React, { useState, useEffect } from 'react';
import { User, Star, Bookmark, Eye, Clock, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

// Types for user stats and activity
interface UserStats {
  totalRatings: number;
  watchlistCount: number;
  watchedCount: number;
  favoriteGenre: string;
  avgRating: number;
  totalWatchTimeMinutes: number;
  genreDistribution: Record<string, number>;
}

interface Activity {
  id: string | number;
  type: 'rating' | 'review' | 'watchlist' | 'watched';
  content: string;
  rating?: number;
  comment?: string;
  action?: string;
  date: string;
  rawDate: string; // Used for sorting
}

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch real stats
        const stats = await api.getUserStats(user.id);
        setUserStats({
          totalRatings: stats?.ratingCount || 0,
          watchlistCount: stats?.watchlistCount || 0,
          watchedCount: stats?.totalContentWatched || 0,
          favoriteGenre: stats?.favoriteGenre || 'None',
          avgRating: stats?.averageRating || 0,
          totalWatchTimeMinutes: stats?.totalWatchTimeMinutes || 0,
          genreDistribution: stats?.genreDistribution || {}
        });

        // Fetch recent activity
        const [ratings, history] = await Promise.all([
          api.getUserRatings(user.id).catch(() => []),
          api.getUserHistory(user.id).catch(() => [])
        ]);

        const activities: Activity[] = [
          ...(ratings || []).map(r => ({
            id: `r-${r.id}`,
            type: 'rating' as const,
            content: r.content?.title || 'Unknown Title',
            rating: r.score,
            comment: r.comment,
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Unknown date',
            rawDate: r.createdAt || ''
          })),
          ...(history || []).map(h => ({
            id: `h-${h.id}`,
            type: 'watched' as const,
            content: h.content?.title || 'Unknown Title',
            date: h.startedAt ? new Date(h.startedAt).toLocaleDateString() : 'Unknown date',
            rawDate: h.startedAt || ''
          }))
        ]
        .filter(a => a.rawDate)
        .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
        .slice(0, 10);

        setRecentActivity(activities);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        toast.error('Failed to load profile statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const updatedUser = await api.updateUser(user.id, { displayName, bio });
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-900" />
          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {user.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>
              </div>
              <div className="md:ml-8 mt-4 md:mt-0 flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="text-3xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none dark:text-white"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.displayName}</h1>
                    )}
                    <p className="text-gray-500">@{user.username}</p>
                  </div>
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                  >
                    {isEditing ? 'Save' : 'Edit Profile'}
                  </button>
                </div>
                <div className="mt-4">
                  {isEditing ? (
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-transparent dark:text-white"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{user.bio || 'No bio yet.'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Star className="text-yellow-500 mb-2" size={24} />
                <p className="text-2xl font-bold dark:text-white">{userStats?.totalRatings || 0}</p>
                <p className="text-sm text-gray-500">Ratings</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Bookmark className="text-primary-500 mb-2" size={24} />
                <p className="text-2xl font-bold dark:text-white">{userStats?.watchlistCount || 0}</p>
                <p className="text-sm text-gray-500">Watchlist</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Eye className="text-green-500 mb-2" size={24} />
                <p className="text-2xl font-bold dark:text-white">{userStats?.watchedCount || 0}</p>
                <p className="text-sm text-gray-500">Watched</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Clock className="text-blue-500 mb-2" size={24} />
                <p className="text-2xl font-bold dark:text-white">{Math.round((userStats?.totalWatchTimeMinutes || 0) / 60)}h</p>
                <p className="text-sm text-gray-500">Time Spent</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-6 dark:text-white">Recent Activity</h2>
              {recentActivity.length === 0 ? (
                <p className="text-gray-500">No recent activity yet.</p>
              ) : (
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className={`p-2 rounded-lg h-fit ${activity.type === 'rating' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                        {activity.type === 'rating' ? <Star size={20} className="text-yellow-500" /> : <Eye size={20} className="text-green-500" />}
                      </div>
                      <div>
                        <p className="dark:text-white">
                          <span className="font-semibold">{activity.type === 'rating' ? 'Rated' : 'Watched'}</span> {activity.content}
                          {activity.rating && <span className="ml-2 text-yellow-500">★ {activity.rating}</span>}
                        </p>
                        {activity.comment && <p className="text-sm text-gray-500 mt-1 italic">"{activity.comment}"</p>}
                        <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-4 dark:text-white">Genre Distribution</h3>
              <div className="space-y-4">
                {userStats?.genreDistribution && Object.entries(userStats.genreDistribution).length > 0 ? (
                  Object.entries(userStats.genreDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([genre, count]) => (
                      <div key={genre}>
                        <div className="flex justify-between text-sm mb-1 dark:text-gray-300">
                          <span>{genre}</span>
                          <span>{count} items</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full">
                          <div 
                            className="bg-primary-600 h-full rounded-full" 
                            style={{ width: `${userStats.watchedCount > 0 ? (count / userStats.watchedCount) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500">Not enough data yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-4 dark:text-white">Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Rating Given</span>
                  <span className="font-bold dark:text-white">{userStats?.avgRating?.toFixed(1) || 0}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Favorite Genre</span>
                  <span className="font-bold dark:text-white">{userStats?.favoriteGenre || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-bold dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;