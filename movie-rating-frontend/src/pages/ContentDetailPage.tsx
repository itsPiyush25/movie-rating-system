import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Film, Bookmark, Eye, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { api, Watchlist } from '../services/api';

const ContentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [content, setContent] = useState<any>(null);
  const [userRating, setUserRating] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [contentRatings, setContentRatings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const contentData = await api.getContentById(parseInt(id));
        setContent(contentData);

        if (user) {
          const userWatchlists = await api.getUserWatchlists(user.id);
          setWatchlists(userWatchlists);
          
          // Check if bookmarked in any watchlist
          let bookmarked = false;
          for (const wl of userWatchlists) {
            const items = await api.getWatchlistItems(wl.id);
            if (items.some(item => item.content.id === parseInt(id))) {
              bookmarked = true;
              break;
            }
          }
          setIsBookmarked(bookmarked);
          
          const ratings = await api.getUserRatings(user.id);
          const currentRating = ratings.find(r => r.content.id === parseInt(id));
          if (currentRating) setUserRating(currentRating.score);

          const history = await api.getUserHistory(user.id);
          setIsWatched(history.some(log => log.content.id === parseInt(id)));
        }

        const ratings = await api.getContentRatings(parseInt(id));
        setContentRatings(ratings);
      } catch (error) {
        console.error('Error fetching content data:', error);
        toast.error('Failed to load content details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error('Please login to rate');
      return;
    }

    try {
      await api.rateContent(user.id, parseInt(id!), rating, reviewText);
      setUserRating(rating);
      
      // Update content ratings list
      const updatedRatings = await api.getContentRatings(parseInt(id!));
      setContentRatings(updatedRatings);
      
      // Update average rating in UI
      const updatedContent = await api.getContentById(parseInt(id!));
      setContent(updatedContent);

      toast.success(`Rated ${rating} / 10`);
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to add to watchlist');
      return;
    }

    try {
      let targetWatchlistId: number;
      
      if (watchlists.length === 0) {
        // Create default watchlist if none exists
        const newWl = await api.createWatchlist(user.id, { name: 'My Watchlist' });
        targetWatchlistId = newWl.id;
        setWatchlists([newWl]);
      } else {
        targetWatchlistId = watchlists[0].id;
      }

      if (isBookmarked) {
        // Find which watchlist it's in and remove it
        for (const wl of watchlists) {
          const items = await api.getWatchlistItems(wl.id);
          if (items.some(item => item.content.id === parseInt(id!))) {
            await api.removeFromWatchlist(wl.id, parseInt(id!));
          }
        }
        setIsBookmarked(false);
        toast.success('Removed from watchlist');
      } else {
        await api.addToWatchlist(targetWatchlistId, parseInt(id!));
        setIsBookmarked(true);
        toast.success('Added to watchlist');
      }
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  const handleMarkWatched = async () => {
    if (!user) {
      toast.error('Please login to mark as watched');
      return;
    }

    try {
      if (isWatched) {
        toast.error('Already in your history');
      } else {
        await api.logViewing(user.id, parseInt(id!), { 
          completionPercentage: 100,
          platform: 'WEB'
        });
        setIsWatched(true);
        toast.success('Marked as watched and added to history');
      }
    } catch (error) {
      toast.error('Failed to update history');
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (userRating === 0) {
      toast.error('Please provide a rating before submitting a review');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write some thoughts before submitting');
      return;
    }

    try {
      await api.rateContent(user.id, parseInt(id!), userRating, reviewText);
      
      // Update content ratings list
      const updatedRatings = await api.getContentRatings(parseInt(id!));
      setContentRatings(updatedRatings);
      
      toast.success('Review submitted successfully!');
      setReviewText('');
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (isLoading || !content) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Backdrop */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {content.backdropUrl && (
          <img
            src={content.backdropUrl}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <img
                src={content.posterUrl}
                alt={content.title}
                className="w-32 md:w-48 rounded-lg shadow-2xl"
              />
              <div className="text-white">
                <h1 className="text-3xl md:text-5xl font-bold">{content.title} <span className="text-gray-300">({content.releaseYear})</span></h1>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="text-yellow-500 fill-current mr-1" size={18} />
                    <span className="font-bold">{content.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-400 ml-1">/10</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock size={18} className="mr-2" />
                    {content.durationMinutes}m
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Film size={18} className="mr-2" />
                    {content.genres?.map((g: any) => g.name).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300">{content.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Directors</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {content.directors?.map((d: any) => d.name).join(', ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cast</h3>
                  <ul className="space-y-2">
                    {content.cast?.map((person: any, idx: number) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{person.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* User Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Interaction</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleBookmark()}
                  className={`flex items-center px-5 py-3 rounded-lg ${isBookmarked ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
                >
                  <Bookmark size={20} className="mr-2" />
                  {isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
                <button
                  onClick={() => handleMarkWatched()}
                  className={`flex items-center px-5 py-3 rounded-lg ${isWatched ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
                >
                  <Eye size={20} className="mr-2" />
                  {isWatched ? 'Watched' : 'Mark as Watched'}
                </button>
                <button className="flex items-center px-5 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                  <Share2 size={20} className="mr-2" />
                  Share
                </button>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rate this title</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        title={`${star} / 10`}
                      >
                        <Star 
                          size={24} 
                          className={`${star <= userRating ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="ml-4 text-gray-700 dark:text-gray-300 font-medium">
                    {userRating > 0 ? `You rated ${userRating}/10` : 'Click to rate'}
                  </span>
                </div>
              </div>

              {user && (
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full h-32 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Share your thoughts about this movie..."
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSubmitReview}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-md transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Reviews</h2>
              {contentRatings.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8 italic">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-6">
                  {contentRatings.map((rating, idx) => (
                    <div key={idx} className="pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold mr-3">
                            {rating.user.displayName?.charAt(0).toUpperCase() || rating.user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {rating.user.displayName || rating.user.username}
                              {rating.user.id === user?.id && <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">You</span>}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                          <Star size={14} className="text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{rating.score}/10</span>
                        </div>
                      </div>
                      {rating.comment ? (
                        <p className="text-gray-700 dark:text-gray-300 mt-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg italic">
                          "{rating.comment}"
                        </p>
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm">Rated without a comment</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Similar Content */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Discovery</h2>
              <div className="space-y-4">
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                  <h3 className="font-bold text-primary-900 dark:text-primary-100 mb-2">Quick Stats</h3>
                  <div className="space-y-2 text-sm text-primary-800 dark:text-primary-200">
                    <div className="flex justify-between">
                      <span>Total Views</span>
                      <span className="font-bold">{content.viewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating Count</span>
                      <span className="font-bold">{content.ratingCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;