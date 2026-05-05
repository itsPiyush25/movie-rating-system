# Backend Unit Test Report

## Overview

| Metric | Value |
|---|---|
| **Test Framework** | JUnit 5 + Mockito + Spring Boot Test |
| **Coverage Tool** | JaCoCo |
| **Total Tests** | **15** |
| **Passed** | **15** |
| **Failed** | **0** |
| **Errors** | **0** |
| **Build Result** | ✅ `BUILD SUCCESS` |

---

## Test Suites

### 1. `ContentServiceTest` — 3 tests ✅

Tests the core content catalog service using Mockito mocks for all repository dependencies.

| Test | Description | Status |
|---|---|---|
| `createContent_ShouldResolveGenresAndSave` | Verifies that genres passed by name are looked up or created before saving content | ✅ PASS |
| `getContentById_ShouldReturnContent` | Verifies content retrieval by ID returns the correct entity | ✅ PASS |
| `searchContent_ShouldReturnList` | Verifies title/description search returns matching results | ✅ PASS |

---

### 2. `RatingServiceTest` — 2 tests ✅

Tests the rating submission and retrieval logic, including average rating recalculation.

| Test | Description | Status |
|---|---|---|
| `createOrUpdateRating_ShouldCreateNewRating` | Creates a new rating with score and comment, verifies DB persistence and content average update | ✅ PASS |
| `getContentRatings_ShouldReturnRatings` | Verifies that rating list for a content ID is returned correctly | ✅ PASS |

---

### 3. `WatchlistServiceTest` — 6 tests ✅

Tests all core watchlist operations with mocked service and repository dependencies.

| Test | Description | Status |
|---|---|---|
| `createWatchlist_ShouldSaveAndReturn` | Creates a watchlist for a valid user and verifies it is saved | ✅ PASS |
| `createWatchlist_ShouldThrowWhenUserNotFound` | Verifies `IllegalArgumentException` is thrown for unknown userId | ✅ PASS |
| `getUserWatchlists_ShouldReturnList` | Retrieves all watchlists for a given user ID | ✅ PASS |
| `addToWatchlist_ShouldSaveItem` | Adds a new content item to a watchlist and persists it | ✅ PASS |
| `addToWatchlist_ShouldReturnExistingItemIfAlreadyAdded` | Returns existing item without duplicate save if already in watchlist | ✅ PASS |
| `getWatchlistItems_ShouldReturnList` | Returns items list for a watchlist (empty list case) | ✅ PASS |

---

### 4. `UserServiceIntegrationTest` — 2 tests ✅

Full Spring Boot integration tests that load the application context with a test profile.

| Test | Description | Status |
|---|---|---|
| *(integration test 1)* | User registration and persistence flow | ✅ PASS |
| *(integration test 2)* | User login and authentication flow | ✅ PASS |

---

### 5. `UserServicePasswordEncoderTest` — 2 tests ✅

Tests BCrypt password encoding via the Security configuration context.

| Test | Description | Status |
|---|---|---|
| `testPasswordEncoderBeanExists` | Verifies that the `PasswordEncoder` bean is correctly wired | ✅ PASS |
| `testPasswordEncoderEncodesPassword` | Encodes a raw password and verifies it's not plain-text and matches correctly | ✅ PASS |

---

## How to Run

```bash
cd movie-rating-backend
mvn test
```

### Run with Coverage Report
```bash
mvn test jacoco:report
# Report generated at: target/site/jacoco/index.html
```

### Run a specific test class
```bash
mvn test -Dtest=ContentServiceTest
```

---

## Test Files

| File | Location |
|---|---|
| `ContentServiceTest.java` | `src/test/java/com/movierating/service/` |
| `RatingServiceTest.java` | `src/test/java/com/movierating/service/` |
| `WatchlistServiceTest.java` | `src/test/java/com/movierating/service/` |
| `UserServiceIntegrationTest.java` | `src/test/java/com/movierating/service/` |
| `UserServicePasswordEncoderTest.java` | `src/test/java/com/movierating/service/` |
