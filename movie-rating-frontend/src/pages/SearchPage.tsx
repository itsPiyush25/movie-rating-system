import React, { useState, useEffect } from 'react';
import { Search, Sliders, Grid, List, X } from 'lucide-react';
import ContentCard from '../components/ContentCard';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

// Mock data for demonstration
const mockResults: any[] = [
  { 
    id: 1, 
    title: 'The Shawshank Redemption', 
    releaseYear: 1994, 
    averageRating: 9.3, 
    durationMinutes: 142, 
    genres: [{ id: 1, name: 'Drama' }], 
    posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    contentType: 'MOVIE',
    status: 'ACTIVE'
  },
  { 
    id: 2, 
    title: 'The Godfather', 
    releaseYear: 1972, 
    averageRating: 9.2, 
    durationMinutes: 175, 
    genres: [{ id: 1, name: 'Crime' }, { id: 2, name: 'Drama' }], 
    posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    contentType: 'MOVIE',
    status: 'ACTIVE'
  },
  { 
    id: 3, 
    title: 'The Dark Knight', 
    releaseYear: 2008, 
    averageRating: 9.0, 
    durationMinutes: 152, 
    genres: [{ id: 3, name: 'Action' }, { id: 1, name: 'Crime' }, { id: 2, name: 'Drama' }], 
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    contentType: 'MOVIE',
    status: 'ACTIVE'
  },
  { 
    id: 4, 
    title: 'Pulp Fiction', 
    releaseYear: 1994, 
    averageRating: 8.9, 
    durationMinutes: 154, 
    genres: [{ id: 1, name: 'Crime' }, { id: 2, name: 'Drama' }], 
    posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    contentType: 'MOVIE',
    status: 'ACTIVE'
  },
  { 
    id: 5, 
    title: 'Forrest Gump', 
    releaseYear: 1994, 
    averageRating: 8.8, 
    durationMinutes: 142, 
    genres: [{ id: 2, name: 'Drama' }, { id: 4, name: 'Romance' }], 
    posterUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 
    description: 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    contentType: 'MOVIE',
    status: 'ACTIVE'
  },
  { 
    id: 6, 
    title: 'Inception', 
    releaseYear: 2010, 
    averageRating: 8.8, 
    durationMinutes: 148, 
    genres: [{ id: 3, name: 'Action' }, { id: 5, name: 'Sci-Fi' }, { id: 6, name: 'Thriller' }], 
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    contentType: 'MOVIE',
    status: 'ACTIVE'
  },
  { 
    id: 7, 
    title: 'The Matrix', 
    releaseYear: 1999, 
    averageRating: 8.7, 
    durationMinutes: 136, 
    genres: [{ id: 3, name: 'Action' }, { id: 5, name: 'Sci-Fi' }], 
    posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    contentType: 'MOVIE',
    status: 'ACTIVE'
  },
  { 
    id: 8, 
    title: 'Interstellar', 
    releaseYear: 2014, 
    averageRating: 8.6, 
    durationMinutes: 169, 
    genres: [{ id: 7, name: 'Adventure' }, { id: 2, name: 'Drama' }, { id: 5, name: 'Sci-Fi' }], 
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    contentType: 'MOVIE',
    status: 'ACTIVE'
  },
];

const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation'];
const years = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
const sortOptions = ['Relevance', 'Rating', 'Year', 'Title'];

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [sortBy, setSortBy] = useState('Relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState(mockResults);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  // Simulate search
  useEffect(() => {
    if (debouncedQuery || selectedGenres.length > 0 || selectedYear) {
      setIsLoading(true);
      // In a real app, this would be an API call
      const filtered = mockResults.filter(item => {
        const matchesQuery = !debouncedQuery || 
          item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          item.genres.some((g: any) => g.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
        const matchesGenre = selectedGenres.length === 0 || 
          selectedGenres.some(g => item.genres.some((ig: any) => ig.name === g));
        const matchesYear = !selectedYear || item.releaseYear === parseInt(selectedYear);
        return matchesQuery && matchesGenre && matchesYear;
      });

      // Sort
      let sorted = [...filtered];
      if (sortBy === 'Rating') {
        sorted.sort((a, b) => b.averageRating - a.averageRating);
      } else if (sortBy === 'Year') {
        sorted.sort((a, b) => b.releaseYear - a.releaseYear);
      } else if (sortBy === 'Title') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      }

      setTimeout(() => {
        setResults(sorted);
        setIsLoading(false);
      }, 300);
    } else {
      setResults(mockResults);
    }
  }, [debouncedQuery, selectedGenres, selectedYear, sortBy]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedYear('');
    setSortBy('Relevance');
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Discover Content</h1>
          <p className="text-gray-600 dark:text-gray-400">Search and filter movies & TV shows</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Search for movies, TV shows, genres, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <Sliders size={20} />
            </button>
          </div>
        </div>

        {/* Filters & Results */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              </div>

              {/* Genre Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Genre</h4>
                <div className="space-y-2">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleGenreToggle(genre)}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Release Year</h4>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Sort by</h4>
                <div className="space-y-2">
                  {sortOptions.map(option => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        checked={sortBy === option}
                        onChange={() => setSortBy(option)}
                        className="h-4 w-4 text-primary-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedGenres.length > 0 || selectedYear) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedGenres.map(genre => (
                    <span key={genre} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                      {genre}
                      <button
                        onClick={() => handleGenreToggle(genre)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {selectedYear && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                      Year: {selectedYear}
                      <button
                        onClick={() => setSelectedYear('')}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isLoading ? 'Searching...' : `${results.length} results found`}
                </h2>
                {query && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Results for "<span className="font-medium">{query}</span>"
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Results Grid/List */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map(content => (
                  <ContentCard key={content.id} content={content} variant="default" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {results.map(content => (
                  <ContentCard key={content.id} content={content} variant="compact" />
                ))}
              </div>
            )}

            {/* Pagination */}
            {results.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    3
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;