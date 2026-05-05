# Test Specifications for Movie Rating System

## Overview
This document provides detailed test specifications for each KPI in the Movie Rating System. Each test case follows the TDD methodology with clear preconditions, test steps, and expected results.

## 1. User Management Test Specifications

### 1.1 User Registration
**Test ID:** `UR-001`  
**Description:** User can create account with valid email and password  
**Preconditions:** No user exists with test email  
**Test Steps:**
1. Send POST request to `/api/users/register` with valid email and password
2. Verify response status is 201 Created
3. Verify response contains user ID and email (without password)
4. Verify user record exists in database
5. Verify password is hashed (not plain text)

**Expected Results:**
- User account created successfully
- Password securely hashed
- Email verification token generated (if required)

### 1.2 User Login
**Test ID:** `UL-002`  
**Description:** Registered users can log in securely  
**Preconditions:** User account exists with known credentials  
**Test Steps:**
1. Send POST request to `/api/users/login` with valid credentials
2. Verify response status is 200 OK
3. Verify response contains authentication token (JWT)
4. Verify token contains user ID and expiration
5. Verify subsequent authenticated requests work with token

**Expected Results:**
- Successful authentication
- Secure token generation
- Proper session establishment

### 1.3 Profile Management
**Test ID:** `PM-003`  
**Description:** Users can update preferences and viewing habits  
**Preconditions:** User is authenticated  
**Test Steps:**
1. Send GET request to `/api/users/profile` to fetch current profile
2. Send PUT request to `/api/users/profile` with updated preferences
3. Verify response status is 200 OK
4. Verify profile data is updated in database
5. Send GET request to verify changes persisted

**Expected Results:**
- Profile data can be retrieved and updated
- Validation of preference data
- Secure update (only own profile)

## 2. Content Catalog Test Specifications

### 2.1 Add Content
**Test ID:** `AC-004`  
**Description:** Manually add movies/TV shows with title, year, genre  
**Preconditions:** User is authenticated  
**Test Steps:**
1. Send POST request to `/api/content` with minimal required fields
2. Verify response status is 201 Created
3. Verify response contains content ID
4. Verify content exists in database with all provided fields
5. Test validation: missing title should return 400 Bad Request

**Expected Results:**
- Content created with required fields
- Proper validation of required fields
- Unique content ID generation

### 2.2 Content Details
**Test ID:** `CD-005`  
**Description:** Store director, cast, runtime, and synopsis  
**Preconditions:** Content exists in database  
**Test Steps:**
1. Create content with full details (director, cast, runtime, synopsis)
2. Send GET request to `/api/content/{id}` to retrieve content
3. Verify all details are stored and returned correctly
4. Test partial updates: update only director field
5. Verify partial update doesn't affect other fields

**Expected Results:**
- Complete content details storage and retrieval
- Partial updates work correctly
- Data integrity maintained

## 3. Watchlist Management Test Specifications

### 3.1 Add to Watchlist
**Test ID:** `AW-006`  
**Description:** Mark content as "Want to Watch"  
**Preconditions:** User authenticated, content exists  
**Test Steps:**
1. Send POST request to `/api/watchlists/{watchlistId}/items` with content ID
2. Verify response status is 201 Created
3. Verify watchlist item created with default status "Want to Watch"
4. Verify duplicate addition prevented or handled
5. Verify item appears in user's watchlist

**Expected Results:**
- Content successfully added to watchlist
- Default status set correctly
- Duplicate prevention logic works

### 3.2 Priority Levels
**Test ID:** `PL-007`  
**Description:** Set watch priority (High, Medium, Low)  
**Preconditions:** Item exists in watchlist  
**Test Steps:**
1. Send PUT request to `/api/watchlists/items/{itemId}/priority` with priority level
2. Verify priority updated in database
3. Test all valid priority levels (High, Medium, Low)
4. Test invalid priority returns validation error
5. Verify sorting by priority works correctly

**Expected Results:**
- Priority levels can be set and updated
- Validation of priority values
- Sorting functionality works

## 4. Viewing History Test Specifications

### 4.1 Log Viewing
**Test ID:** `LV-008`  
**Description:** Record when and where content was watched  
**Preconditions:** User authenticated, content exists  
**Test Steps:**
1. Send POST request to `/api/viewing-history` with viewing details
2. Include date, platform, location, companions
3. Verify response status is 201 Created
4. Verify viewing log created with all details
5. Verify automatic rating field initialized (null)

**Expected Results:**
- Viewing session logged with all details
- Timestamp recorded automatically
- Relationship to content established

### 4.2 Rating System
**Test ID:** `RS-009`  
**Description:** Rate content on 1-5 star scale with optional reviews  
**Preconditions:** Viewing log exists  
**Test Steps:**
1. Send PUT request to `/api/viewing-history/{logId}/rating` with rating 1-5
2. Verify rating saved in database
3. Test boundary values: 1, 3, 5 stars
4. Test invalid values: 0, 6, non-integer (should fail)
5. Add optional review text and verify storage

**Expected Results:**
- 1-5 star rating validation
- Optional review text support
- Rating average calculations work

## 5. Search & Discovery Test Specifications

### 5.1 Search Content
**Test ID:** `SC-010`  
**Description:** Find content by title, genre, director, or actor  
**Preconditions:** Multiple content items in database  
**Test Steps:**
1. Send GET request to `/api/search?q=searchTerm`
2. Test search by title (partial match)
3. Test search by genre (exact match)
4. Test search by director/actor (partial match)
5. Verify results ranked by relevance
6. Test empty search returns all content (paginated)

**Expected Results:**
- Search returns relevant results
- Multiple search fields supported
- Pagination implemented

### 5.2 Advanced Filters
**Test ID:** `AF-011`  
**Description:** Filter by year, genre, rating, runtime, etc.  
**Preconditions:** Content with varied attributes exists  
**Test Steps:**
1. Send GET request with multiple filter parameters
2. Test year range filter (minYear, maxYear)
3. Test genre filter (single and multiple)
4. Test rating filter (minRating)
5. Test runtime filter (maxRuntime)
6. Test combined filters (year + genre + rating)

**Expected Results:**
- Individual filters work correctly
- Combined filters apply AND logic
- Empty result set when no matches

## 6. Personal Statistics Test Specifications

### 6.1 Viewing Analytics
**Test ID:** `VA-012`  
**Description:** Charts showing viewing habits over time  
**Preconditions:** User has viewing history  
**Test Steps:**
1. Send GET request to `/api/statistics/viewing-timeline`
2. Verify response contains data points for time periods
3. Test different time ranges (week, month, year)
4. Verify calculations: total watch time, average per period
5. Test empty history returns appropriate empty state

**Expected Results:**
- Timeline data structured correctly
- Calculations accurate
- Empty state handled gracefully

### 6.2 Genre Distribution
**Test ID:** `GD-013`  
**Description:** Visual breakdown of most-watched genres  
**Preconditions:** User has watched content across genres  
**Test Steps:**
1. Send GET request to `/api/statistics/genre-distribution`
2. Verify response contains genre percentages
3. Verify percentages sum to 100% (or close with rounding)
4. Test with single genre content
5. Test with no viewing history

**Expected Results:**
- Genre percentages calculated correctly
- Data format suitable for charting
- Edge cases handled

## 7. Social Features Test Specifications

### 7.1 Friend System
**Test ID:** `FS-014`  
**Description:** Connect with other users and see their activity  
**Preconditions:** Two user accounts exist  
**Test Steps:**
1. User A sends friend request to User B
2. Verify request appears in User B's pending requests
3. User B accepts friend request
4. Verify friendship established in database
5. User A fetches friend's activity feed
6. Verify only accepted friends' activity visible

**Expected Results:**
- Friend request workflow complete
- Activity privacy respected
- Friendship status properly tracked

### 7.2 Shared Watchlists
**Test ID:** `SW-015`  
**Description:** Create and collaborate on watchlists with friends  
**Preconditions:** Two users are friends  
**Test Steps:**
1. User A creates shared watchlist
2. User A invites User B to collaborate
3. User B accepts invitation
4. Both users add items to shared watchlist
5. Verify both users can see all items
6. Test permission levels (view vs edit)

**Expected Results:**
- Shared watchlist creation and collaboration
- Permission system works
- Real-time updates (if implemented)

## 8. Platform Integration Test Specifications

### 8.1 Streaming Links
**Test ID:** `SL-016`  
**Description:** Manually add links to streaming platforms  
**Preconditions:** Content exists  
**Test Steps:**
1. Send POST request to `/api/content/{id}/platforms` with platform link
2. Verify link stored with platform metadata
3. Test multiple platforms for same content
4. Test link validation (URL format)
5. Verify links retrievable with content

**Expected Results:**
- Streaming links stored and retrieved
- URL validation works
- Multiple platforms supported

### 8.2 Availability Tracking
**Test ID:** `AT-017`  
**Description:** Track which platforms have content available  
**Preconditions:** Content with platform links exists  
**Test Steps:**
1. Mark content as available on specific platform
2. Update availability status (available, leaving soon, removed)
3. Query content by availability status
4. Test notifications for availability changes
5. Verify historical availability tracking

**Expected Results:**
- Availability status tracking
- Query by availability works
- Change history maintained

## 9. Responsive Design Test Specifications

### 9.1 Mobile Compatibility
**Test ID:** `MC-018`  
**Description:** Application works on smartphones (320px+ width)  
**Test Type:** Visual/Functional  
**Test Steps:**
1. Render application at 320px width
2. Verify no horizontal scrolling required
3. Test touch targets minimum 44px
4. Verify font sizes readable without zoom
5. Test navigation accessible on small screen
6. Verify forms usable on mobile

**Expected Results:**
- Fully functional at 320px width
- Touch-friendly interface
- Readable text and controls

### 9.2 Dark Mode
**Test ID:** `DM-019`  
**Description:** Cinema-friendly dark theme for viewing sessions  
**Test Type:** Visual/Functional  
**Test Steps:**
1. Toggle dark mode switch
2. Verify theme changes apply globally
3. Verify color contrast meets accessibility standards
4. Test persistence across page reloads
5. Verify no flashing or layout shifts
6. Test printing in both themes

**Expected Results:**
- Smooth theme switching
- Accessible color contrast
- Persistent theme preference

## 10. Docker & Deployment Test Specifications

### 10.1 Docker Container
**Test ID:** `DC-020`  
**Description:** Application runs in a Docker container  
**Test Type:** Infrastructure  
**Test Steps:**
1. Build Docker image from Dockerfile
2. Verify build succeeds without errors
3. Run container from built image
4. Verify application starts successfully
5. Test health check endpoint responds
6. Verify container logs show proper startup

**Expected Results:**
- Docker image builds successfully
- Container runs application
- Health checks pass

### 10.2 Environment Configuration
**Test ID:** `EC-021`  
**Description:** Configurable via environment variables  
**Test Type:** Infrastructure  
**Test Steps:**
1. Set required environment variables
2. Start application with different configurations
3. Test database connection with different credentials
4. Test feature flags via environment variables
5. Verify sensitive data not logged
6. Test configuration validation

**Expected Results:**
- Application configurable via environment
- Validation of required variables
- Secure handling of sensitive data

## 11. Testing & Documentation Test Specifications

### 11.1 Unit Tests
**Test ID:** `UT-022`  
**Description:** Core business logic has unit test coverage  
**Test Type:** Quality Assurance  
**Test Steps:**
1. Run test coverage report
2. Verify core business logic files have >80% coverage
3. Test edge cases and error conditions
4. Verify tests are isolated (no external dependencies)
5. Check test execution time within limits
6. Verify test documentation exists

**Expected Results:**
- Minimum coverage requirements met
- Tests are fast and isolated
- Comprehensive test cases

### 11.2 API Documentation
**Test ID:** `AD-023`  
**Description:** REST API documented with OpenAPI/Swagger  
**Test Type:** Documentation  
**Test Steps:**
1. Generate OpenAPI specification
2. Verify all endpoints documented
3. Test request/response examples
4. Verify authentication requirements documented
5. Test interactive API documentation (Swagger UI)
6. Verify documentation matches implementation

**Expected Results:**
- Complete API documentation
- Interactive documentation available
- Documentation matches actual API

## Test Execution Strategy

### Test Categories
1. **Unit Tests**: Run on every code change (CI pipeline)
2. **Integration Tests**: Run on pull request merge
3. **E2E Tests**: Run nightly or on deployment
4. **Performance Tests**: Run weekly or on major changes
5. **Security Tests**: Run monthly or on security updates

### Test Environment Requirements
- **Development**: Local Docker containers
- **Staging**: Mirrors production environment
- **Production**: Read-only tests, no data modification

### Test Data Management
- Use factory patterns for test data creation
- Clean up test data after each test
- Use database transactions for isolation
- Maintain reference data sets for consistency

## Success Criteria
- All test cases pass consistently
- Test coverage meets or exceeds targets
- Tests run within acceptable time limits
- No flaky tests in the suite
- Tests provide clear failure messages
- Test documentation is complete and up-to-date

This test specification document provides the foundation for implementing TDD for the Movie Rating System, ensuring all KPIs are thoroughly tested and validated.