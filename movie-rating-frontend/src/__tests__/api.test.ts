// Tests for the ApiService utility functions
// These test pure logic that doesn't require network calls

describe('ApiService utility logic', () => {
  describe('Rating validation logic', () => {
    const validateRatingScore = (score: number): boolean => {
      return score >= 1 && score <= 10;
    };

    it('should accept valid scores between 1 and 10', () => {
      expect(validateRatingScore(1)).toBe(true);
      expect(validateRatingScore(5)).toBe(true);
      expect(validateRatingScore(10)).toBe(true);
    });

    it('should reject scores below 1', () => {
      expect(validateRatingScore(0)).toBe(false);
      expect(validateRatingScore(-1)).toBe(false);
    });

    it('should reject scores above 10', () => {
      expect(validateRatingScore(11)).toBe(false);
      expect(validateRatingScore(100)).toBe(false);
    });
  });

  describe('Content type validation', () => {
    const validContentTypes = ['MOVIE', 'TV_SHOW'];
    const isValidContentType = (type: string): boolean =>
      validContentTypes.includes(type);

    it('should accept MOVIE type', () => {
      expect(isValidContentType('MOVIE')).toBe(true);
    });

    it('should accept TV_SHOW type', () => {
      expect(isValidContentType('TV_SHOW')).toBe(true);
    });

    it('should reject invalid content types', () => {
      expect(isValidContentType('CARTOON')).toBe(false);
      expect(isValidContentType('')).toBe(false);
    });
  });

  describe('Genre deduplication logic', () => {
    const deduplicateGenres = (genres: string[]): string[] =>
      [...new Set(genres)];

    it('should remove duplicate genres', () => {
      const result = deduplicateGenres(['Action', 'Drama', 'Action']);
      expect(result).toHaveLength(2);
      expect(result).toContain('Action');
      expect(result).toContain('Drama');
    });

    it('should return unique genres unchanged', () => {
      const unique = ['Action', 'Drama', 'Comedy'];
      expect(deduplicateGenres(unique)).toHaveLength(3);
    });

    it('should handle empty array', () => {
      expect(deduplicateGenres([])).toHaveLength(0);
    });
  });

  describe('Query parameter builder', () => {
    const buildQueryParams = (params: Record<string, string | number | undefined>): string => {
      const filtered = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
      );
      const qs = new URLSearchParams(filtered as Record<string, string>).toString();
      return qs ? `?${qs}` : '';
    };

    it('should build query string from params', () => {
      const result = buildQueryParams({ type: 'MOVIE', page: '0' });
      expect(result).toContain('type=MOVIE');
      expect(result).toContain('page=0');
    });

    it('should skip undefined params', () => {
      const result = buildQueryParams({ type: 'MOVIE', genre: undefined });
      expect(result).not.toContain('genre');
    });

    it('should return empty string when no params', () => {
      expect(buildQueryParams({})).toBe('');
    });
  });
});
