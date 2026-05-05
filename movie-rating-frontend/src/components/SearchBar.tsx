import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const navigate = useNavigate()
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock suggestions - in a real app, this would come from an API
  const mockSuggestions = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Dark Knight',
    'Pulp Fiction',
    'Forrest Gump',
    'Inception',
    'The Matrix',
    'Interstellar',
    'Parasite',
    'Avengers: Endgame',
  ]

  useEffect(() => {
    if (debouncedQuery.trim()) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsFocused(false)
      setQuery('')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    navigate(`/search?q=${encodeURIComponent(suggestion)}`)
    setIsFocused(false)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search movies, TV shows, actors..."
            className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Suggestions dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-800 dark:text-gray-200">{suggestion}</span>
              <Search size={16} className="text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {/* Recent searches (mock data) */}
      {isFocused && !query && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Searches</h3>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Clear all
            </button>
          </div>
          <div className="space-y-2">
            {['Action movies', 'Christopher Nolan', 'Sci-fi 2023', 'Oscar winners'].map((search, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(search)}
                className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="text-gray-600 dark:text-gray-400">{search}</span>
                <Search size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar