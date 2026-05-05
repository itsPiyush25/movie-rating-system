import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Film, Tv, Calendar, Clock, Image as ImageIcon, Star, Save } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const AddContentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'MOVIE',
    releaseYear: new Date().getFullYear(),
    durationMinutes: 120,
    description: '',
    posterUrl: '',
    initialRating: 0,
    initialComment: ''
  });

  const [genres, setGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'releaseYear' || name === 'durationMinutes' ? parseInt(value) : value
    }));
  };

  const addGenre = () => {
    if (genreInput.trim() && !genres.includes(genreInput.trim())) {
      setGenres([...genres, genreInput.trim()]);
      setGenreInput('');
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setGenres(genres.filter(g => g !== genreToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to add content');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the content
      const contentPayload = {
        title: formData.title,
        contentType: formData.contentType as 'MOVIE' | 'TV_SHOW',
        releaseYear: formData.releaseYear,
        durationMinutes: formData.durationMinutes,
        description: formData.description,
        posterUrl: formData.posterUrl || 'https://via.placeholder.com/500x750?text=No+Poster',
        genres: genres.map(name => ({ name })) as any
      };

      const createdContent = await api.createContent(contentPayload);

      // 2. Submit initial rating if provided
      if (formData.initialRating > 0) {
        await api.rateContent(user.id, createdContent.id, formData.initialRating, formData.initialComment);
      }

      toast.success('Content added successfully!');
      navigate(`/content/${createdContent.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-600 to-indigo-600">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Plus className="mr-2" /> Add New Content
          </h1>
          <p className="text-primary-100 mt-1">Share your favorite movies and shows with the community.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Film size={16} className="mr-2" /> Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Inception"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Tv size={16} className="mr-2" /> Content Type
              </label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              >
                <option value="MOVIE">Movie</option>
                <option value="TV_SHOW">TV Show</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Calendar size={16} className="mr-2" /> Release Year
              </label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 5}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Clock size={16} className="mr-2" /> Duration (minutes)
              </label>
              <input
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide a brief synopsis of the content..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Poster Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <ImageIcon size={16} className="mr-2" /> Poster URL
            </label>
            <input
              type="url"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/poster.jpg"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>

          {/* Genres Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Genres</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                placeholder="e.g. Action"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={addGenre}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <span
                  key={genre}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => removeGenre(genre)}
                    className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {genres.length === 0 && (
                <p className="text-sm text-gray-500 italic">No genres added yet.</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Star size={18} className="mr-2 text-yellow-500" /> Your Initial Rating
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {[...Array(10)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, initialRating: i + 1 }))}
                    className={`p-1 transition-transform hover:scale-110 ${
                      formData.initialRating > i ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    <Star size={24} fill={formData.initialRating > i ? 'currentColor' : 'none'} />
                  </button>
                ))}
                <span className="ml-4 text-xl font-bold text-primary-600">{formData.initialRating}/10</span>
              </div>
              <textarea
                name="initialComment"
                rows={3}
                value={formData.initialComment}
                onChange={handleInputChange}
                placeholder="Write your first review for this content..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center px-8 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-lg shadow-primary-500/30 transition-all ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" /> Save Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentPage;
