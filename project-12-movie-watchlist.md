# Project: Movie & TV Show Watchlist

## Project Description
A web application for tracking movies and TV shows to watch, rating viewed content, and discovering new entertainment. Users can create personalized watchlists, log viewing history, rate content, and get recommendations based on their preferences.

## Key Performance Indicators (KPIs)

### 1. User Management
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| User Registration | Users can create accounts with email and password | Pass |
| User Login | Registered users can log in securely | Pass |
| Profile Management | Users can update preferences and viewing habits | Pass |
| Password Reset | Users can reset forgotten passwords via email | Pass |
| Session Management | User sessions are properly maintained and secured | Pass |

### 2. Content Catalog
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Add Content | Manually add movies/TV shows with title, year, genre | Pass |
| Content Details | Store director, cast, runtime, and synopsis | Pass |
| Media Types | Support for movies, TV series, documentaries, etc. | Pass |
| Edit Content | Modify content details and metadata | Pass |
| Bulk Import | Import watchlists from CSV or other formats | Pass |

### 3. Watchlist Management
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Add to Watchlist | Mark content as "Want to Watch" | Pass |
| Priority Levels | Set watch priority (High, Medium, Low) | Pass |
| Watchlist Organization | Create multiple watchlists (e.g., "Date Night", "Action") | Pass |
| Remove from Watchlist | Move items from watchlist to watched history | Pass |
| Watchlist Sorting | Sort by priority, added date, or title | Pass |

### 4. Viewing History
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Log Viewing | Record when and where content was watched | Pass |
| Rating System | Rate content on 1-5 star scale with optional reviews | Pass |
| Viewing Details | Track viewing date, platform, and watch companions | Pass |
| Edit History | Modify viewing details and ratings | Pass |
| Rewatch Tracking | Log multiple viewings of the same content | Pass |

### 5. Search & Discovery
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Search Content | Find content by title, genre, director, or actor | Pass |
| Advanced Filters | Filter by year, genre, rating, runtime, etc. | Pass |
| Discovery Features | Suggest content based on viewing history | Pass |
| Trending Section | Highlight popular content among all users | Pass |
| Random Pick | Randomly select content from watchlist for indecisive moments | Pass |

### 6. Personal Statistics
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Viewing Analytics | Charts showing viewing habits over time | Pass |
| Genre Distribution | Visual breakdown of most-watched genres | Pass |
| Rating Distribution | Analysis of rating patterns and averages | Pass |
| Monthly/Yearly Reports | Summary of viewing activity by period | Pass |
| Achievement Badges | Fun badges for milestones (100 movies, etc.) | Pass |

### 7. Social Features
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Friend System | Connect with other users and see their activity | Pass |
| Shared Watchlists | Create and collaborate on watchlists with friends | Pass |
| Review Sharing | Share ratings and reviews with the community | Pass |
| Recommendation Exchange | Send content recommendations to friends | Pass |
| Activity Feed | See friends' recent watches and ratings | Pass |

### 8. Platform Integration
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Streaming Links | Manually add links to streaming platforms | Pass |
| Availability Tracking | Track which platforms have content available | Pass |
| Watch Status | Mark content as available on specific services | Pass |
| Platform Preferences | Set preferred streaming services for recommendations | Pass |
| Export to Calendar | Schedule watch sessions in calendar apps | Pass |

### 9. Responsive Design
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Mobile Compatibility | Application works on smartphones (320px+ width) | Pass |
| Tablet Compatibility | Application works on tablets (768px+ width) | Pass |
| Desktop Compatibility | Application works on desktop (1024px+ width) | Pass |
| Touch Interactions | Touch-friendly buttons and controls on mobile | Pass |
| Dark Mode | Cinema-friendly dark theme for viewing sessions | Pass |

### 10. Docker & Deployment
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Docker Container | Application runs in a Docker container | Pass |
| Docker Compose | Multi-container setup with database | Pass |
| Environment Configuration | Configurable via environment variables | Pass |
| Database Persistence | Data persists across container restarts | Pass |
| Production Readiness | Secure configuration for production deployment | Pass |

### 11. Testing & Documentation
| KPI | Description | Pass/Fail |
|-----|-------------|-----------|
| Unit Tests | Core business logic has unit test coverage | Pass |
| Integration Tests | API endpoints and database operations tested | Pass |
| UI Tests | Critical user flows have automated UI tests | Pass |
| API Documentation | REST API documented with OpenAPI/Swagger | Pass |
| User Guide | Comprehensive user documentation available | Pass |
| Code Comments | Source code includes meaningful comments | Pass |

## Technical Stack
- **Frontend**: React.js with TypeScript and Chart.js
- **Backend**: Java with spring boot
- **Database**: MySQL 
- **Authentication**: JWT with bcrypt password hashing
- **Image Storage**: Local filesystem for poster images
- **Containerization**: Docker with docker-compose
- **Testing**: Mockito, React Testing Library, Supertest

## Development Timeline
- **Day 1**: Project setup, database design, user authentication
- **Day 2**: Content catalog, watchlist management
- **Day 3**: Viewing history, rating system, search functionality
- **Day 4**: Statistics, social features, responsive design
- **Day 5**: Testing, documentation, deployment configuration

## Success Criteria
- Users can effectively track movies and TV shows they want to watch
- Rating system provides meaningful insights into viewing preferences
- Discovery features help users find new content to enjoy
- Social features enhance the community aspect of media consumption
- All data is stored locally without external API dependencies
- Complete test coverage for critical functionality