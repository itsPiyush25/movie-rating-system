# Test Specifications for Movie Rating System
## Spring Boot + React.js + MySQL Stack

## Overview
This document provides detailed test specifications for each KPI in the Movie Rating System using Spring Boot (backend), React.js (frontend), and MySQL (database). Each test case follows the TDD methodology with clear preconditions, test steps, and expected results.

## Testing Strategy

### Backend Testing (Spring Boot)
- **Unit Tests**: JUnit 5 + Mockito for service layer
- **Integration Tests**: Spring Boot Test + TestContainers for database tests
- **API Tests**: MockMvc for controller testing
- **Security Tests**: Spring Security test utilities
- **Database Tests**: Flyway migrations + TestContainers

### Frontend Testing (React.js)
- **Unit Tests**: Jest + React Testing Library for components
- **Integration Tests**: Jest + MSW (Mock Service Worker)
- **E2E Tests**: Cypress for user flows
- **Visual Tests**: Storybook + Chromatic

### Database Testing (MySQL)
- **Schema Tests**: Flyway migration validation
- **Integration Tests**: TestContainers with MySQL
- **Performance Tests**: Query optimization and indexing

## 1. User Management Test Specifications

### 1.1 User Registration
**Test ID:** `UR-001`  
**Technology:** Spring Boot + React.js  
**Description:** User can create account with valid email and password  
**Preconditions:** No user exists with test email  
**Backend Test (Spring Boot):**
```java
@Test
void registerUser_withValidData_shouldCreateUser() {
    // Given
    UserRegistrationRequest request = new UserRegistrationRequest(
        "test@example.com", "password123", "Test User");
    
    // When
    UserResponse response = userService.register(request);
    
    // Then
    assertNotNull(response.getId());
    assertEquals("test@example.com", response.getEmail());
    verify(userRepository).save(any(User.class));
}
```

**Frontend Test (React.js):**
```javascript
test('registration form submits valid data', async () => {
    render(<RegistrationForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
        expect(mockRegisterAPI).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });
    });
});
```

**Expected Results:**
- User account created successfully in MySQL
- Password securely hashed with BCrypt
- Email verification token generated (if required)
- JWT token returned for immediate login

### 1.2 User Login
**Test ID:** `UL-002`  
**Technology:** Spring Boot + React.js  
**Description:** Registered users can log in securely  
**Preconditions:** User account exists with known credentials  
**Backend Test (Spring Boot):**
```java
@Test
void authenticateUser_withValidCredentials_shouldReturnToken() {
    // Given
    String email = "test@example.com";
    String password = "password123";
    User user = createTestUser(email, password);
    
    // When
    AuthenticationResponse response = authService.authenticate(
        new LoginRequest(email, password));
    
    // Then
    assertNotNull(response.getAccessToken());
    assertNotNull(response.getRefreshToken());
    assertEquals(email, response.getEmail());
}
```

**Frontend Test (React.js):**
```javascript
test('login form stores token on success', async () => {
    const mockToken = 'jwt.token.here';
    mockLoginAPI.mockResolvedValue({ token: mockToken });
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
        expect(localStorage.getItem('authToken')).toBe(mockToken);
    });
});
```

**Expected Results:**
- Successful authentication with JWT tokens
- Token stored securely (HttpOnly cookie)
- Session established with proper expiration
- Subsequent authenticated requests work with token

## 2. Content Catalog Test Specifications

### 2.1 Add Content
**Test ID:** `AC-003`  
**Technology:** Spring Boot + React.js  
**Description:** Manually add movies/TV shows with title, year, genre  
**Preconditions:** User is authenticated  
**Backend Test (Spring Boot):**
```java
@Test
@WithMockUser
void createContent_withValidData_shouldReturnContent() {
    // Given
    ContentRequest request = new ContentRequest(
        "Inception", 2010, "Sci-Fi", "A thief who steals corporate secrets");
    
    // When
    ContentResponse response = contentService.createContent(request);
    
    // Then
    assertNotNull(response.getId());
    assertEquals("Inception", response.getTitle());
    assertEquals(2010, response.getReleaseYear());
    verify(contentRepository).save(any(Content.class));
}
```

**Database Test (MySQL):**
```sql
-- Verify content table structure
DESCRIBE content;

-- Test data insertion
INSERT INTO content (title, release_year, genre, synopsis) 
VALUES ('Inception', 2010, 'Sci-Fi', 'A thief who steals corporate secrets');

-- Verify data persistence
SELECT * FROM content WHERE title = 'Inception';
```

**Expected Results:**
- Content created with required fields in MySQL
- Proper validation of required fields (title, year, genre)
- Unique content ID generation
- Audit fields (created_at, updated_at) populated

## 3. Watchlist Management Test Specifications

### 3.1 Add to Watchlist
**Test ID:** `AW-004`  
**Technology:** Spring Boot + React.js  
**Description:** Mark content as "Want to Watch"  
**Preconditions:** User authenticated, content exists  
**Backend Test (Spring Boot):**
```java
@Test
@WithMockUser
void addToWatchlist_withValidContent_shouldCreateWatchlistItem() {
    // Given
    Long contentId = 1L;
    Long watchlistId = 1L;
    
    // When
    WatchlistItemResponse response = watchlistService.addToWatchlist(
        watchlistId, contentId, "Want to Watch");
    
    // Then
    assertNotNull(response.getId());
    assertEquals("Want to Watch", response.getStatus());
    verify(watchlistItemRepository).save(any(WatchlistItem.class));
}
```

**Frontend Test (React.js):**
```javascript
test('add to watchlist button calls API', async () => {
    const mockAddToWatchlist = jest.fn();
    render(<ContentCard content={mockContent} onAddToWatchlist={mockAddToWatchlist} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add to watchlist/i }));
    
    await waitFor(() => {
        expect(mockAddToWatchlist).toHaveBeenCalledWith(mockContent.id);
    });
});
```

**Expected Results:**
- Content successfully added to watchlist in MySQL
- Default status set to "Want to Watch"
- Duplicate addition prevented or handled gracefully
- Item appears in user's watchlist with proper relationships

## 4. Viewing History Test Specifications

### 4.1 Log Viewing
**Test ID:** `LV-005`  
**Technology:** Spring Boot + React.js  
**Description:** Record when and where content was watched  
**Preconditions:** User authenticated, content exists  
**Backend Test (Spring Boot):**
```java
@Test
@WithMockUser
void logViewing_withValidData_shouldCreateViewingLog() {
    // Given
    ViewingLogRequest request = new ViewingLogRequest(
        1L, LocalDateTime.now(), "Netflix", "Home", 5, "Great movie!");
    
    // When
    ViewingLogResponse response = viewingLogService.logViewing(request);
    
    // Then
    assertNotNull(response.getId());
    assertEquals("Netflix", response.getPlatform());
    assertEquals(5, response.getRating());
    verify(viewingLogRepository).save(any(ViewingLog.class));
}
```

**Database Test (MySQL):**
```sql
-- Verify viewing_log table structure
DESCRIBE viewing_log;

-- Test foreign key constraints
INSERT INTO viewing_log (user_id, content_id, watched_at, platform, rating)
VALUES (1, 1, NOW(), 'Netflix', 5);

-- Verify data integrity
SELECT * FROM viewing_log WHERE user_id = 1 AND content_id = 1;
```

**Expected Results:**
- Viewing session logged with all details in MySQL
- Timestamp recorded automatically
- Relationship to content and user established via foreign keys
- Rating field initialized (null allowed for unrated viewings)

## 5. Search & Discovery Test Specifications

### 5.1 Search Content
**Test ID:** `SC-006`  
**Technology:** Spring Boot + React.js + MySQL  
**Description:** Find content by title, genre, director, or actor  
**Preconditions:** Multiple content items in database  
**Backend Test (Spring Boot):**
```java
@Test
void searchContent_byTitle_shouldReturnResults() {
    // Given
    String searchTerm = "Inception";
    createTestContent("Inception", 2010, "Sci-Fi");
    createTestContent("Interstellar", 2014, "Sci-Fi");
    
    // When
    Page<ContentResponse> results = searchService.search(
        searchTerm, null, null, PageRequest.of(0, 10));
    
    // Then
    assertEquals(1, results.getTotalElements());
    assertEquals("Inception", results.getContent().get(0).getTitle());
}

@Test
void searchContent_withFullTextSearch_shouldUseMySQLIndex() {
    // Given - Ensure full-text index exists
    // When - Execute search query
    // Then - Verify index usage via EXPLAIN
}
```

**MySQL Full-Text Search Test:**
```sql
-- Create full-text index
CREATE FULLTEXT INDEX idx_content_search ON content(title, synopsis, director, cast);

-- Test search query
SELECT * FROM content 
WHERE MATCH(title, synopsis, director, cast) 
AGAINST('inception' IN NATURAL LANGUAGE MODE);

-- Verify index usage
EXPLAIN SELECT * FROM content 
WHERE MATCH(title, synopsis, director, cast) 
AGAINST('inception' IN NATURAL LANGUAGE MODE);
```

**Expected Results:**
- Search returns relevant results from MySQL
- Full-text indexing improves performance
- Multiple search fields supported (title, genre, director, actor)
- Pagination implemented with Spring Data Pageable

## 6. Personal Statistics Test Specifications

### 6.1 Viewing Analytics
**Test ID:** `VA-007`  
**Technology:** Spring Boot + React.js  
**Description:** Charts showing viewing habits over time  
**Preconditions:** User has viewing history  
**Backend Test (Spring Boot):**
```java
@Test
@WithMockUser
void getViewingAnalytics_shouldReturnCorrectData() {
    // Given
    createViewingLogsForLastMonth(10);
    
    // When
    ViewingAnalyticsResponse analytics = statisticsService.getViewingAnalytics(
        LocalDate.now().minusMonths(1), LocalDate.now());
    
    // Then
    assertNotNull(analytics.getTotalWatchTime());
    assertNotNull(analytics.getDailyAverages());
    assertEquals(10, analytics.getTotalViewings());
}
```

**MySQL Aggregation Test:**
```sql
-- Test analytics query
SELECT 
    DATE(watched_at) as view_date,
    COUNT(*) as view_count,
    AVG(rating) as avg_rating
FROM viewing_log 
WHERE user_id = 1 
    AND watched_at BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY DATE(watched_at)
ORDER BY view_date;

-- Verify query performance with EXPLAIN
EXPLAIN SELECT ...;
```

**Frontend Test (React.js):**
```javascript
test('analytics chart renders with data', async () => {
    const mockAnalytics = {
        totalWatchTime: 1500,
        dailyAverages: [...],
        genreDistribution: {...}
    };
    
    render(<AnalyticsChart data={mockAnalytics} />);
    
    expect(screen.getByText(/total watch time/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /chart/i })).toBeInTheDocument();
});
```

**Expected Results:**
- Analytics data calculated correctly using MySQL aggregations
- Chart components render with data in React
- Performance optimized with proper database indexes
- Empty state handled gracefully

## 7. Social Features Test Specifications

### 7.1 Friend System
**Test ID:** `FS-008`  
**Technology:** Spring Boot + React.js  
**Description:** Connect with other users and see their activity  
**Preconditions:** Two user accounts exist  
**Backend Test (Spring Boot):**
```java
@Test
@WithMockUser
void sendFriendRequest_shouldCreatePendingFriendship() {
    // Given
    Long friendId = 2L;
    
    // When
    FriendRequestResponse response = friendService.sendFriendRequest(friendId);
    
    // Then
    assertEquals(FriendStatus.PENDING, response.getStatus());
    verify(friendRepository).save(any(Friend.class));
}

@Test
@WithMockUser
void getFriendActivity_shouldReturnOnlyAcceptedFriends() {
    // Given
    createAcceptedFriend(2L);
    createPendingFriend(3L);
    createFriendActivity(2L, "watched Inception");
    
    // When
    List<ActivityResponse> activities = friendService.getFriendActivity();
    
    // Then
    assertEquals(1, activities.size());
    assertEquals("watched Inception", activities.get(0).getDescription());
}
```

**Database Relationship Test:**
```sql
-- Verify friend table structure
DESCRIBE friend;

-- Test friend relationship
INSERT INTO friend (user_id, friend_id, status, created_at) 
VALUES (1, 2, 'ACCEPTED', NOW());

-- Verify activity feed query
SELECT a.* FROM activity a
JOIN friend f ON a.user_id = f.friend_id
WHERE f.user_id = 1 AND f.status = 'ACCEPTED'
ORDER BY a.created_at DESC
LIMIT 20;
```

**Expected Results:**
- Friend request workflow complete with proper status tracking
- Activity privacy respected (only accepted friends)
- Database relationships properly enforced with foreign keys
- Real-time updates via WebSocket (if implemented)

## 8. Platform Integration Test Specifications

### 8.1 Streaming Links
**Test ID:** `SL-009`  
**Technology:** Spring Boot + React.js  
**Description:** Manually add links to streaming platforms  
**Preconditions:** Content exists  
**Backend Test (Spring Boot):**
```java
@Test
@WithMockUser
void addStreamingLink_withValidUrl_shouldCreateAvailability() {
    // Given
    Long contentId = 1L;
    StreamingLinkRequest request = new StreamingLinkRequest(
        "Netflix", "https://netflix.com/watch/123", "AVAILABLE");
    
    // When
    AvailabilityResponse response = platformService.addStreamingLink(
        contentId, request);
    
    // Then
    assertNotNull(response.getId());
    assertEquals("Netflix", response.getPlatformName());
    assertEquals("AVAILABLE", response.getStatus());
    verify(availabilityRepository).save(any(Availability.class));
}
```

**Frontend Test (React.js):**
```javascript
test('streaming link form validates URLs', () => {
    render(<StreamingLinkForm />);
    
    const urlInput = screen.getByLabelText(/streaming url/i);
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
    
    fireEvent.click(screen.getByRole('button', { name: /add link/i }));
    
    expect(screen.getByText(/valid url required/i)).toBeInTheDocument();
});
```

**Expected Results:**
- Streaming links stored and retrieved from MySQL
- URL validation with Spring Validation annotations
- Multiple platforms supported per content
- Availability status tracking (available, leaving soon, removed)

## 9. Responsive Design Test Specifications

### 9.1 Mobile Compatibility
**Test ID:** `MC-010`  
**Technology:** React.js + CSS  
**Description:** Application works on smartphones (320px+ width)  
**Test Type:** Visual/Functional  
**React Component Test:**
```javascript
test('component is responsive on mobile', () => {
    // Set viewport to mobile size
    window.innerWidth = 320;
    window.dispatchEvent(new Event('resize'));
    
    render(<ResponsiveLayout />);
    
    // Check mobile-specific rendering
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-sidebar')).not.toBeInTheDocument();
});

// CSS Media Query Test
test('media queries apply correctly', () => {
    const { container } = render(<ResponsiveComponent />);
    
    // Test at mobile breakpoint
    global.matchMedia = jest.fn().mockReturnValue({ matches: true });
    
    // Force re-render
    fireEvent(window, new Event('resize'));
    
    expect(container.firstChild).toHaveStyle('flex-direction: column');
});
```

**Cypress E2E Test:**
```javascript
describe('Mobile Compatibility', () => {
    it('works on 320px width', () => {
        cy.viewport(320, 568);
        cy.visit('/');
        cy.get('nav').should('be.visible');
        cy.get('button').should('have.css', 'min-height', '44px');
    });
});
```

**Expected Results:**
- Fully functional at 320px width
- Touch-friendly interface with 44px minimum touch targets
- Readable text without zoom
- Navigation accessible on small screen
- Forms usable on mobile

## 10. Docker & Deployment Test Specifications

### 10.1 Docker Container
**Test ID:** `DC-011`  
**Technology:** Docker + Spring Boot + React.js  
**Description:** Application runs in a