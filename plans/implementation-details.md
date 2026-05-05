# Technology-Specific Implementation Details
## Spring Boot + React.js + MySQL Stack

## Table of Contents
1. [Project Structure](#project-structure)
2. [Spring Boot Backend Implementation](#spring-boot-backend-implementation)
3. [React.js Frontend Implementation](#reactjs-frontend-implementation)
4. [MySQL Database Implementation](#mysql-database-implementation)
5. [Docker & Deployment](#docker--deployment)
6. [Testing Implementation](#testing-implementation)
7. [Security Implementation](#security-implementation)
8. [Performance Optimization](#performance-optimization)

## Project Structure

### Backend (Spring Boot)
```
movie-rating-backend/
├── src/main/java/com/movierating/
│   ├── config/                 # Configuration classes
│   │   ├── SecurityConfig.java
│   │   ├── DatabaseConfig.java
│   │   ├── RedisConfig.java
│   │   └── OpenApiConfig.java
│   ├── controller/            # REST controllers
│   │   ├── UserController.java
│   │   ├── ContentController.java
│   │   ├── WatchlistController.java
│   │   ├── ViewingHistoryController.java
│   │   ├── SearchController.java
│   │   ├── StatisticsController.java
│   │   ├── SocialController.java
│   │   └── PlatformController.java
│   ├── service/               # Business logic
│   │   ├── UserService.java
│   │   ├── ContentService.java
│   │   ├── WatchlistService.java
│   │   ├── ViewingHistoryService.java
│   │   ├── SearchService.java
│   │   ├── StatisticsService.java
│   │   ├── SocialService.java
│   │   └── PlatformService.java
│   ├── repository/            # Data access (JPA)
│   │   ├── UserRepository.java
│   │   ├── ContentRepository.java
│   │   ├── WatchlistRepository.java
│   │   ├── ViewingLogRepository.java
│   │   ├── FriendRepository.java
│   │   └── AvailabilityRepository.java
│   ├── model/                 # Entity classes
│   │   ├── User.java
│   │   ├── Profile.java
│   │   ├── Content.java
│   │   ├── Watchlist.java
│   │   ├── WatchlistItem.java
│   │   ├── ViewingLog.java
│   │   ├── Friend.java
│   │   └── Availability.java
│   ├── dto/                   # Data Transfer Objects
│   │   ├── request/          # Request DTOs
│   │   └── response/         # Response DTOs
│   ├── security/              # Security configuration
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   ├── exception/             # Custom exceptions
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   └── ValidationException.java
│   └── MovieRatingApplication.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── db/migration/         # Flyway migrations
│       ├── V1__Initial_schema.sql
│       ├── V2__Add_user_profile.sql
│       └── ...
├── src/test/java/            # Test classes
└── pom.xml                   # Maven configuration
```

### Frontend (React.js)
```
movie-rating-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Common components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── LoadingSpinner/
│   │   │   └── ErrorBoundary/
│   │   ├── layout/          # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── MainLayout/
│   │   └── features/        # Feature-specific components
│   │       ├── auth/
│   │       ├── content/
│   │       ├── watchlist/
│   │       ├── history/
│   │       ├── search/
│   │       ├── statistics/
│   │       ├── social/
│   │       └── platforms/
│   ├── pages/               # Page components
│   │   ├── LoginPage/
│   │   ├── RegisterPage/
│   │   ├── DashboardPage/
│   │   ├── ContentCatalogPage/
│   │   ├── WatchlistPage/
│   │   ├── ViewingHistoryPage/
│   │   ├── SearchPage/
│   │   ├── StatisticsPage/
│   │   ├── SocialPage/
│   │   └── SettingsPage/
│   ├── services/            # API service layer
│   │   ├── api/
│   │   │   ├── apiClient.js
│   │   │   ├── authApi.js
│   │   │   ├── userApi.js
│   │   │   ├── contentApi.js
│   │   │   └── ...
│   │   └── auth/
│   │       ├── authService.js
│   │       └── tokenService.js
│   ├── store/               # State management
│   │   ├── slices/         # Redux slices
│   │   │   ├── authSlice.js
│   │   │   ├── userSlice.js
│   │   │   ├── contentSlice.js
│   │   │   └── ...
│   │   └── store.js
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useContent.js
│   │   ├── useWatchlist.js
│   │   └── ...
│   ├── utils/               # Utility functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── styles/              # Global styles
│   │   ├── global.css
│   │   ├── theme.js
│   │   └── variables.css
│   ├── App.jsx              # Main App component
│   └── main.jsx             # Entry point
├── .env                     # Environment variables
├── .env.development
├── .env.production
├── vite.config.js           # Vite configuration
├── package.json
└── README.md
```

## Spring Boot Backend Implementation

### 1. Entity Classes
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    private String username;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    private boolean emailVerified;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Profile profile;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Watchlist> watchlists;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<ViewingLog> viewingLogs;
}

@Entity
@Table(name = "content")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Enumerated(EnumType.STRING)
    private MediaType mediaType;
    
    private Integer releaseYear;
    
    private String genre;
    
    @Column(length = 2000)
    private String synopsis;
    
    private Integer runtimeMinutes;
    
    private String director;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private List<String> cast;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL)
    private List<WatchlistItem> watchlistItems;
    
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL)
    private List<ViewingLog> viewingLogs;
}
```

### 2. Repository Interfaces
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:email%")
    Page<User> searchByEmail(@Param("email") String email, Pageable pageable);
}

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    Page<Content> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Content> findByGenre(String genre, Pageable pageable);
    Page<Content> findByReleaseYearBetween(Integer startYear, Integer endYear, Pageable pageable);
    
    @Query("SELECT c FROM Content c WHERE " +
           "MATCH(c.title, c.synopsis, c.director) AGAINST (:searchTerm IN BOOLEAN MODE)")
    Page<Content> fullTextSearch(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT c.genre, COUNT(v) as viewCount FROM Content c " +
           "JOIN c.viewingLogs v WHERE v.user.id = :userId " +
           "GROUP BY c.genre ORDER BY viewCount DESC")
    List<Object[]> findGenreDistributionByUserId(@Param("userId") Long userId);
}
```

### 3. Service Layer
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    public UserResponse register(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already registered");
        }
        
        User user = User.builder()
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .username(request.getUsername())
            .role(UserRole.USER)
            .emailVerified(false)
            .build();
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());
        
        return UserResponse.fromEntity(savedUser);
    }
    
    public AuthenticationResponse authenticate(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new AuthenticationException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthenticationException("Invalid credentials");
        }
        
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);
        
        return AuthenticationResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .email(user.getEmail())
            .role(user.getRole())
            .build();
    }
}
```

### 4. REST Controllers
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@Tag(name = "User Management", description = "User registration, authentication, and profile management")
public class UserController {
    private final UserService userService;
    
    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get tokens")
    public ResponseEntity<AuthenticationResponse> login(
            @Valid @RequestBody LoginRequest request) {
        AuthenticationResponse response = userService.authenticate(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/profile")
    @Operation(summary = "Get user profile")
    @PreAuthorize("hasRole('USER') and #id == principal.id")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Long id) {
        ProfileResponse response = userService.getProfile(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/profile")
    @Operation(summary = "Update user profile")
    @PreAuthorize("hasRole('USER') and #id == principal.id")
    public ResponseEntity<ProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody ProfileUpdateRequest request) {
        ProfileResponse response = userService.updateProfile(id, request);
        return ResponseEntity.ok(response);
    }
}
```

## React.js Frontend Implementation

### 1. Component Implementation
```jsx
// src/components/features/content/ContentCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Rating,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAddToWatchlist } from '../../../hooks/useWatchlist';
import { formatRuntime, getYear } from '../../../utils/formatters';

const ContentCard = ({ content, onViewDetails }) => {
  const { addToWatchlist, isLoading } = useAddToWatchlist();
  
  const handleAddToWatchlist = async () => {
    try {
      await addToWatchlist(content.id);
      // Show success notification
    } catch (error) {
      // Show error notification
    }
  };
  
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={content.posterUrl || '/default-poster.jpg'}
        alt={content.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {content.title} ({getYear(content.releaseYear)})
        </Typography>
        
        <div style={{ marginBottom: '12px' }}>
          <Chip label={content.genre} size="small" sx={{ mr: 1 }} />
          <Chip label={content.mediaType} size="small" variant="outlined" />
        </div>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {content.synopsis?.substring(0, 150)}...
        </Typography>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <Rating value={content.averageRating || 0} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({content.ratingCount || 0} ratings)
          </Typography>
        </div>
        
        <Typography variant="body2" color="text.secondary">
          Runtime: {formatRuntime(content.runtimeMinutes)} • Director: {content.director}
        </Typography>
      </CardContent>
      
      <div style={{ padding: '16px', paddingTop: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddToWatchlist}
          disabled={isLoading}
        >
          Add to Watchlist
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={() => onViewDetails(content)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default ContentCard;
```

### 2. Custom Hooks
```javascript
// src/hooks/useWatchlist.js
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { watchlistApi } from '../services/api/watchlistApi';
import { addWatchlistItem } from '../store/slices/watchlistSlice';

export const useAddToWatchlist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { watchlistId } = useSelector(state => state.watchlist.activeWatchlist);
  
  const addToWatchlist = useCallback(async (contentId, priority = 'MEDIUM') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await watchlistApi.addItem(watchlistId, {
        contentId,
        priority,
        status: 'WANT_TO_WATCH'
      });
      
      dispatch(addWatchlistItem(response));
      return response;
    } catch (err) {
      setError(err.message || 'Failed to add to watchlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [watchlistId, dispatch]);
  
  return { addToWatchlist, isLoading, error };
};

// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../services/api/authApi';
import { setCredentials, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
