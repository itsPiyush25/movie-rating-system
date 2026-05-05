# Project Boundary Document
## Movie Rating & Review System

**Version**: 1.0 (Based on current codebase — 2026-05-05)
**Repository**: https://github.com/itsPiyush25/movie-rating-system.git

---

## 1. Project Overview

The **Movie Rating & Review System** is a full-stack web application that allows registered users to discover, rate, review, and manage their personal watchlists for movies and TV shows. It is built with a **Spring Boot 3** backend and a **React 18 + TypeScript** frontend.

---

## 2. Architecture Boundaries

### 2.1 Technology Stack

| Layer | Technology | Version | Port |
|---|---|---|---|
| Backend API | Spring Boot | 3.2.0 | **9090** |
| ORM | Spring Data JPA / Hibernate | - | - |
| DB Migration | Flyway | Built-in | - |
| Database | MySQL | 8.0 | 3306 |
| Auth | JWT (jjwt 0.11.5) | - | - |
| Frontend | React + TypeScript | 18 / 5 | **3000** |
| Frontend Build | Vite | 5.0 | - |
| Styling | Tailwind CSS | 3.3 | - |
| State | Zustand + React Query | - | - |
| API Client | Fetch (via ApiService class) | - | - |

### 2.2 Module Boundaries

```
movie-rating-system/
├── movie-rating-backend/       ← Spring Boot API
│   └── src/main/java/com/movierating/
│       ├── config/             ← Security, CORS config
│       ├── controller/         ← REST endpoints
│       ├── model/              ← JPA entities
│       ├── repository/         ← Spring Data repositories
│       ├── service/            ← Business logic
│       ├── security/           ← JWT filter, UserDetailsService
│       └── exception/          ← Error handling
│
├── movie-rating-frontend/      ← React SPA
│   └── src/
│       ├── pages/              ← Route-level components
│       ├── components/         ← Shared UI components
│       ├── services/api.ts     ← All API calls
│       ├── contexts/           ← Auth state (AuthContext)
│       └── __tests__/         ← Jest unit tests
│
└── movie-db/                   ← SQL schema documentation
    ├── schema.sql
    └── README.md
```

---

## 3. Domain Boundaries

### 3.1 Entities (Database Tables)

| Entity | Table | Description |
|---|---|---|
| `User` | `users` | Registered user accounts |
| `Content` | `contents` | Movies and TV shows |
| `Genre` | `genres` | Content genre taxonomy |
| `Person` | `persons` | Directors and cast members |
| `Rating` | `ratings` | User scores (1–10) with optional comments |
| `Review` | `reviews` | Detailed text reviews (separate from ratings) |
| `Watchlist` | `watchlists` | Named lists owned by users |
| `WatchlistItem` | `watchlist_items` | Items in a watchlist with status/priority |
| `ViewingLog` | `viewing_logs` | Watch history entries |

### 3.2 Junction Tables

| Table | Purpose |
|---|---|
| `content_genres` | Many-to-many: Content ↔ Genre |
| `content_directors` | Many-to-many: Content ↔ Person (director role) |
| `content_cast` | Many-to-many: Content ↔ Person (cast role) |

---

## 4. API Boundary (Implemented Endpoints)

**Base URL**: `http://localhost:9090/api`

### 4.1 Auth Endpoints (Public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/register` | Register a new user |
| `POST` | `/users/login` | Login and get JWT token |

### 4.2 User Endpoints (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users/{id}` | Get user profile by ID |
| `PUT` | `/users/{id}` | Update user profile |

### 4.3 Content Endpoints (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/contents` | List content with filters/pagination |
| `POST` | `/contents` | Create new content (any authenticated user) |
| `GET` | `/contents/{id}` | Get content detail |
| `GET` | `/contents/search?query=` | Search by title or description |
| `GET` | `/contents/trending?limit=` | Get trending content |
| `GET` | `/contents/recommendations/user/{userId}` | Get personalized recommendations |
| `GET` | `/contents/stats/global` | Global statistics |

### 4.4 Rating Endpoints (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ratings/{userId}/rate/{contentId}` | Create or update a rating (1–10 + comment) |
| `GET` | `/ratings/user/{userId}` | Get all ratings by a user |
| `GET` | `/ratings/content/{contentId}` | Get all ratings for a content item |
| `GET` | `/ratings/content/{contentId}/distribution` | Rating score distribution |
| `DELETE` | `/ratings/{userId}/remove/{contentId}` | Delete a rating |

### 4.5 Watchlist Endpoints (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/watchlist/user/{userId}` | Create a new watchlist |
| `GET` | `/watchlist/user/{userId}` | Get all watchlists for a user |
| `GET` | `/watchlist/{watchlistId}` | Get items in a watchlist |
| `POST` | `/watchlist/{watchlistId}/add/{contentId}` | Add content to watchlist |
| `DELETE` | `/watchlist/{watchlistId}/remove/{contentId}` | Remove content from watchlist |
| `PUT` | `/watchlist/{watchlistId}/update/{contentId}` | Update watchlist item (status/priority) |
| `POST` | `/watchlist/{watchlistId}/watched/{contentId}` | Mark item as watched |
| `GET` | `/watchlist/{watchlistId}/random` | Get a random item from watchlist |

### 4.6 History Endpoints (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/history/{userId}/log/{contentId}` | Log a viewing session |
| `GET` | `/history/{userId}` | Get user watch history |
| `DELETE` | `/history/{userId}` | Clear all history |

### 4.7 Statistics Endpoints (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats/user/{userId}` | Get user-specific statistics |

### 4.8 Import Endpoints (Authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/import/content/csv` | Bulk import content via CSV file (multipart) |

---

## 5. Frontend Boundary (Implemented Pages)

| Page | Route | Auth Required | Description |
|---|---|---|---|
| `HomePage` | `/` | No | Browse trending & featured content |
| `LoginPage` | `/login` | No | User sign in |
| `RegisterPage` | `/register` | No | New user registration |
| `ContentDetailPage` | `/content/:id` | Yes | Movie/TV detail, ratings, reviews |
| `AddContentPage` | `/add-content` | Yes | Manually add a new movie or TV show |
| `SearchPage` | `/search` | Yes | Filter and search content |
| `WatchlistPage` | `/watchlist` | Yes | Manage personal watchlists |
| `HistoryPage` | `/history` | Yes | View watch history |
| `ProfilePage` | `/profile` | Yes | User profile and activity |
| `StatsPage` | `/stats` | Yes | Platform and personal statistics |

### 5.1 Shared Components

| Component | Description |
|---|---|
| `Header` | Top navigation with auth-aware links |
| `Sidebar` | Left navigation panel |
| `Layout` | Page shell wrapping Sidebar + Header |
| `ContentCard` | Reusable card for movie/TV display |
| `SearchBar` | Debounced search input component |

### 5.2 Services & State

| File | Description |
|---|---|
| `api.ts` | Central `ApiService` class — all HTTP calls |
| `AuthContext.tsx` | JWT token + user state via React Context |
| `useDebounce.ts` | Debounce hook for search inputs |

---

## 6. Security Boundary

| Area | Implementation |
|---|---|
| Auth mechanism | JWT (Bearer token in `Authorization` header) |
| Token storage | `localStorage` (key: `token`) |
| Password hashing | BCrypt via Spring Security |
| Public routes | `/api/users/register`, `/api/users/login` |
| Protected routes | All other `/api/**` endpoints |
| CORS allowed origin | `http://localhost:3000` only |
| Session type | Stateless (no server-side session) |
| Role-based access | Roles: `USER`, `ADMIN` (defined on User entity) |

---

## 7. Data Validation Boundary

### Backend (Spring Boot)
| Rule | Where Enforced |
|---|---|
| Content title required | `ContentService.createContent()` |
| Rating score 1–10 | `RatingService` (business logic) |
| Unique user per content per rating | DB unique constraint + service check |
| User not found → 404 | `GlobalExceptionHandler` / service throws |
| Watchlist not found → 400 | Service throws `IllegalArgumentException` |

### Frontend (React)
| Rule | Where Enforced |
|---|---|
| Title not empty | `AddContentPage` form validation |
| Release year 1900–current+5 | `AddContentPage` form validation |
| Duration > 0 | `AddContentPage` form validation |
| Rating 1–10 | `ContentDetailPage` UI (star selector) |
| Genre deduplication | `AddContentPage` genre state logic |

---

## 8. Test Boundary

### Backend Tests (JUnit 5 + Mockito)

| Test File | Tests | Coverage Area |
|---|---|---|
| `ContentServiceTest` | 3 | Content CRUD, genre resolution |
| `RatingServiceTest` | 2 | Rating creation, average update |
| `WatchlistServiceTest` | 6 | Watchlist create/read/add/duplicate prevention |
| `UserServiceIntegrationTest` | 2 | Full Spring Boot integration (register + login) |
| `UserServicePasswordEncoderTest` | 2 | BCrypt encoder bean wiring |
| **Total** | **15** | — |

**Run**: `cd movie-rating-backend && mvn test`

### Frontend Tests (Jest 29 + Babel)

| Test File | Tests | Coverage Area |
|---|---|---|
| `api.test.ts` | 16 | Rating validation, type checks, query params, genre dedup |
| `AddContentPage.test.ts` | 14 | Genre management, form validation, rating logic |
| `content.test.ts` | 9 | Display formatting, duration, poster fallback |
| **Total** | **39** | — |

**Run**: `cd movie-rating-frontend && npx jest --config jest.config.cjs`

---

## 9. Out-of-Scope Boundaries (Not Implemented)

| Feature | Status | Notes |
|---|---|---|
| Admin panel / moderation | ❌ Not implemented | Role exists in DB but no admin UI |
| Email verification | ❌ Not implemented | `emailVerified` field exists |
| Password reset flow | ❌ Not implemented | No endpoint exists yet |
| Social login (OAuth) | ❌ Not implemented | — |
| TMDB / IMDB API integration | ❌ Not implemented | Fields exist (`tmdbId`, `imdbId`) |
| Real-time notifications | ❌ Not implemented | — |
| Production deployment | ❌ Not configured | Docker Compose exists but not CI/CD |
| Review (text-only) module | ⚠️ Partial | `Review` entity exists; no separate UI from Rating |
| ADMIN-only content edit/delete | ⚠️ Partial | Content creation is open to all users |
| Recommendation engine | ⚠️ Basic | Returns random content; no ML logic |

---

## 10. Infrastructure Boundary

| Component | Status |
|---|---|
| Docker Compose | ✅ Exists (`docker-compose.yml`) |
| MySQL container | ✅ Defined in Docker Compose |
| Backend Dockerfile | ✅ Exists |
| Frontend Dockerfile | ✅ Exists |
| CI/CD pipeline | ❌ Not configured |
| Environment variables | ❌ Hardcoded in `application.yml` (dev only) |
| Production build | ✅ `npm run build` produces Vite dist |

---

## 11. Version & Dependency Boundary

### Backend Key Dependencies
| Dependency | Version |
|---|---|
| Spring Boot | 3.2.0 |
| Java | 17 |
| MySQL Connector | 8.0.33 |
| JJWT | 0.11.5 |
| Lombok | Latest |
| Springdoc OpenAPI | 2.3.0 |
| JaCoCo | 0.8.10 |

### Frontend Key Dependencies
| Dependency | Version |
|---|---|
| React | 18.2.0 |
| TypeScript | 5.2.2 |
| Vite | 5.0.8 |
| Tailwind CSS | 3.3.6 |
| Zustand | 4.4.7 |
| React Query | 3.39.3 |
| Recharts | 2.10.3 |
| Lucide React | 0.309.0 |
| Jest | 29.7.0 |
| Axios | 1.6.2 |
