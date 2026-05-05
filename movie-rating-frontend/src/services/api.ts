// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:9090/api';

export interface User {
  id: number;
  email: string;
  username: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  isActive: boolean;
  bio?: string;
  profilePictureUrl?: string;
  preferences?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  role: string;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  releaseDate: string;
  contentType: 'MOVIE' | 'TV_SHOW';
  status: 'ACTIVE' | 'DELETED';
  durationMinutes: number;
  imdbId?: string;
  tmdbId?: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  genres: Genre[];
  directors: Person[];
  cast: Person[];
}

export type WatchlistPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Watchlist {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  items?: WatchlistItem[];
}

export interface WatchlistItem {
  id: number;
  content: Content;
  status: 'PLANNED' | 'WATCHED' | 'ABANDONED' | 'IN_PROGRESS';
  addedAt: string;
  priority: WatchlistPriority;
  notes?: string;
  plannedWatchDate?: string;
  watchedAt?: string;
}

export interface Rating {
  id: number;
  score: number;
  comment?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  content: Content;
}

export interface ViewingLog {
  id: number;
  startedAt: string;
  finishedAt?: string;
  watchDurationMinutes?: number;
  completionPercentage?: number;
  platform: 'WEB' | 'MOBILE' | 'TV' | 'TABLET' | 'DESKTOP_APP' | 'OTHER';
  deviceInfo?: string;
  watchCompanions?: string;
  content: Content;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<User> {
    return this.request<User>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  // Content endpoints
  async getContent(params?: any): Promise<{ content: Content[], totalElements: number }> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/contents${queryParams}`);
  }

  async getContentById(id: number): Promise<Content> {
    return this.request(`/contents/${id}`);
  }

  async searchContent(query: string): Promise<Content[]> {
    return this.request(`/contents/search?query=${encodeURIComponent(query)}`);
  }

  async getTrendingContent(limit: number = 10): Promise<Content[]> {
    return this.request(`/contents/trending?limit=${limit}`);
  }

  async getRecommendations(userId: number): Promise<Content[]> {
    return this.request(`/contents/recommendations/user/${userId}`);
  }

  // Watchlist endpoints
  async createWatchlist(userId: number, data: { name: string, description?: string, isPublic?: boolean }): Promise<Watchlist> {
    return this.request<Watchlist>(`/watchlist/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserWatchlists(userId: number): Promise<Watchlist[]> {
    return this.request<Watchlist[]>(`/watchlist/user/${userId}`);
  }

  async getWatchlistItems(watchlistId: number): Promise<WatchlistItem[]> {
    return this.request<WatchlistItem[]>(`/watchlist/${watchlistId}`);
  }

  async addToWatchlist(watchlistId: number, contentId: number): Promise<WatchlistItem> {
    return this.request<WatchlistItem>(`/watchlist/${watchlistId}/add/${contentId}`, {
      method: 'POST',
    });
  }

  async removeFromWatchlist(watchlistId: number, contentId: number): Promise<void> {
    return this.request<void>(`/watchlist/${watchlistId}/remove/${contentId}`, {
      method: 'DELETE',
    });
  }

  async updateWatchlistItem(watchlistId: number, contentId: number, updates: Partial<WatchlistItem>): Promise<WatchlistItem> {
    return this.request<WatchlistItem>(`/watchlist/${watchlistId}/update/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async markAsWatched(watchlistId: number, contentId: number): Promise<WatchlistItem> {
    return this.request<WatchlistItem>(`/watchlist/${watchlistId}/watched/${contentId}`, {
      method: 'POST',
    });
  }

  async getRandomWatchlistItem(watchlistId: number): Promise<WatchlistItem> {
    return this.request<WatchlistItem>(`/watchlist/${watchlistId}/random`);
  }

  // History endpoints
  async logViewing(userId: number, contentId: number, logData?: Partial<ViewingLog>): Promise<ViewingLog> {
    return this.request(`/history/${userId}/log/${contentId}`, {
      method: 'POST',
      body: JSON.stringify(logData || {}),
    });
  }

  async getUserHistory(userId: number): Promise<ViewingLog[]> {
    return this.request(`/history/${userId}`);
  }

  async clearHistory(userId: number): Promise<void> {
    return this.request<void>(`/history/${userId}`, {
      method: 'DELETE',
    });
  }

  // Statistics endpoints
  async getUserStats(userId: number): Promise<any> {
    return this.request(`/stats/user/${userId}`);
  }

  async getGlobalStats(): Promise<any> {
    return this.request('/contents/stats/global');
  }

  async updateUser(userId: number, data: any): Promise<User> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Rating endpoints
  async rateContent(userId: number, contentId: number, score: number, comment?: string): Promise<Rating> {
    return this.request<Rating>(`/ratings/${userId}/rate/${contentId}`, {
      method: 'POST',
      body: JSON.stringify({ score, comment }),
    });
  }

  async getUserRatings(userId: number): Promise<Rating[]> {
    return this.request<Rating[]>(`/ratings/user/${userId}`);
  }

  async getContentRatings(contentId: number): Promise<Rating[]> {
    return this.request<Rating[]>(`/ratings/content/${contentId}`);
  }

  async getRatingDistribution(contentId: number): Promise<any> {
    return this.request(`/ratings/content/${contentId}/distribution`);
  }

  async deleteRating(userId: number, contentId: number): Promise<void> {
    return this.request<void>(`/ratings/${userId}/remove/${contentId}`, {
      method: 'DELETE',
    });
  }

  // Import
  async importContentCsv(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/import/content/csv`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) throw new Error('Import failed');
    return response.json();
  }
}

export const api = new ApiService();