# Frontend Unit Test Report

## Overview

| Metric | Value |
|---|---|
| **Test Framework** | Jest 29 + Babel |
| **Test Environment** | jsdom |
| **Total Test Suites** | **3** |
| **Total Tests** | **39** |
| **Passed** | **39** |
| **Failed** | **0** |
| **Time** | ~16s |
| **Build Result** | ✅ All suites passed |

---

## Test Suites

### 1. `api.test.ts` — 16 tests ✅

Tests pure utility logic used by the `ApiService` — no network calls, all functions are tested in isolation.

| Group | Test | Status |
|---|---|---|
| **Rating Validation** | Should accept valid scores 1–10 | ✅ PASS |
| **Rating Validation** | Should reject scores below 1 | ✅ PASS |
| **Rating Validation** | Should reject scores above 10 | ✅ PASS |
| **Content Type** | Should accept MOVIE type | ✅ PASS |
| **Content Type** | Should accept TV_SHOW type | ✅ PASS |
| **Content Type** | Should reject invalid types | ✅ PASS |
| **Genre Dedup** | Should remove duplicate genres | ✅ PASS |
| **Genre Dedup** | Should return unique genres unchanged | ✅ PASS |
| **Genre Dedup** | Should handle empty array | ✅ PASS |
| **Query Params** | Should build query string from params | ✅ PASS |
| **Query Params** | Should skip undefined params | ✅ PASS |
| **Query Params** | Should return empty string with no params | ✅ PASS |

---

### 2. `AddContentPage.test.ts` — 14 tests ✅

Tests the form logic and business rules used in the Add Content page.

| Group | Test | Status |
|---|---|---|
| **Genre Management** | Should add a new genre | ✅ PASS |
| **Genre Management** | Should not add duplicate genres | ✅ PASS |
| **Genre Management** | Should trim whitespace from genre names | ✅ PASS |
| **Genre Management** | Should not add empty genre | ✅ PASS |
| **Genre Management** | Should remove an existing genre | ✅ PASS |
| **Genre Management** | Should handle removing non-existent genre | ✅ PASS |
| **Form Validation** | Should reject empty title | ✅ PASS |
| **Form Validation** | Should accept valid title | ✅ PASS |
| **Form Validation** | Should reject years below 1900 | ✅ PASS |
| **Form Validation** | Should accept current year | ✅ PASS |
| **Form Validation** | Should reject zero or negative duration | ✅ PASS |
| **Form Validation** | Should accept valid duration | ✅ PASS |
| **Rating Logic** | Rating 0 means no rating provided | ✅ PASS |
| **Rating Logic** | Rating > 0 means rating is provided | ✅ PASS |
| **Rating Logic** | Should validate rating is within bounds (1–10) | ✅ PASS |

---

### 3. `content.test.ts` — 9 tests ✅

Tests display utility logic used across content listing and detail pages.

| Group | Test | Status |
|---|---|---|
| **Rating Display** | Should show no ratings message when count is 0 | ✅ PASS |
| **Rating Display** | Should format rating with one decimal place | ✅ PASS |
| **Rating Display** | Should round rating display correctly | ✅ PASS |
| **Duration** | Should format hours and minutes | ✅ PASS |
| **Duration** | Should format minutes only | ✅ PASS |
| **Duration** | Should format exact hours | ✅ PASS |
| **Duration** | Should return "Unknown" for falsy value | ✅ PASS |
| **Content Type** | Should display TV Show for TV_SHOW | ✅ PASS |
| **Content Type** | Should display Movie for MOVIE | ✅ PASS |
| **Poster URL** | Should return provided URL when available | ✅ PASS |
| **Poster URL** | Should return placeholder for null | ✅ PASS |
| **Poster URL** | Should return placeholder for empty string | ✅ PASS |

---

## How to Run

```bash
cd movie-rating-frontend
npm test
```

### Run with Coverage
```bash
npm run test:coverage
# Report at: coverage/lcov-report/index.html
```

### Run in Watch Mode
```bash
npm run test:watch
```

---

## Configuration

| File | Purpose |
|---|---|
| `jest.config.cjs` | Jest configuration — transforms, module mappers, test match patterns |
| `src/__tests__/setup.ts` | Global test setup — imports `@testing-library/jest-dom` matchers |
| `src/__tests__/__mocks__/fileMock.cjs` | Stubs for static file imports (CSS, images, SVG) |

---

## Test Files

| File | Location | Tests |
|---|---|---|
| `api.test.ts` | `src/__tests__/` | 16 |
| `AddContentPage.test.ts` | `src/__tests__/` | 14 |
| `content.test.ts` | `src/__tests__/` | 9 |
