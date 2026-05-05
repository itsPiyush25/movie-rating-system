# Movie & TV Show Watchlist System

A comprehensive platform for film enthusiasts to discover, track, and rate content. Built with **Spring Boot** (Backend) and **React** (Frontend).

## 🚀 Features

- **User Ecosystem**: Secure registration, login, and profile management.
- **Content Catalog**: Support for Movies and TV shows with rich metadata (director, cast, genres).
- **Rating System**: 1-10 star scale with detailed text reviews.
- **Watchlist Engine**: Multiple personal watchlists with priority and status tracking.
- **Viewing Intelligence**: Personal analytics and genre distribution charts.
- **Search & Discovery**: Advanced filtering by year, genre, and rating.
- **Responsive Design**: Modern UI with dark/light mode support.

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3, Spring Security (JWT), Hibernate JPA, MySQL.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (Vanilla CSS), Lucide Icons.
- **Infrastructure**: Docker, Docker Compose.

## 📦 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Docker (Optional)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Backend Setup**:
   - Navigate to `movie-rating-backend`
   - Update `src/main/resources/application.yml` with your database credentials.
   - Run the application:
     ```bash
     mvn spring-boot:run
     ```

3. **Frontend Setup**:
   - Navigate to `movie-rating-frontend`
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

## 🐳 Docker Deployment

The entire system can be started using Docker Compose:
```bash
docker-compose up -d
```

## 📖 Documentation
- [User Guide](feature_user_guide.md)
- [Backend TDD Plan](plans/tdd-development-plan-spring-react.md)
- [Product Requirements (PRD)](PRD.md)

## ⚖️ License
MIT License
