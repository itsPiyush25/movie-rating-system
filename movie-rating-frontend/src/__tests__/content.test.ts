// Unit tests for content-related business logic used across pages

describe('Content display logic', () => {
  describe('Rating display formatting', () => {
    const formatRating = (rating: number, count: number): string => {
      if (count === 0) return 'No ratings yet';
      return `${rating.toFixed(1)}/10 (${count} ratings)`;
    };

    it('should show no ratings message when count is 0', () => {
      expect(formatRating(0, 0)).toBe('No ratings yet');
    });

    it('should format rating with one decimal place', () => {
      expect(formatRating(7.5, 10)).toBe('7.5/10 (10 ratings)');
    });

    it('should round rating display', () => {
      expect(formatRating(8.123, 5)).toBe('8.1/10 (5 ratings)');
    });
  });

  describe('Duration formatting', () => {
    const formatDuration = (minutes: number): string => {
      if (!minutes) return 'Unknown';
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      if (h === 0) return `${m}m`;
      return m === 0 ? `${h}h` : `${h}h ${m}m`;
    };

    it('should format hours and minutes', () => {
      expect(formatDuration(150)).toBe('2h 30m');
    });

    it('should format minutes only', () => {
      expect(formatDuration(45)).toBe('45m');
    });

    it('should format exact hours', () => {
      expect(formatDuration(120)).toBe('2h');
    });

    it('should return Unknown for falsy value', () => {
      expect(formatDuration(0)).toBe('Unknown');
    });
  });

  describe('Content type display', () => {
    const getContentTypeLabel = (type: string): string => {
      return type === 'TV_SHOW' ? 'TV Show' : 'Movie';
    };

    it('should display TV Show for TV_SHOW type', () => {
      expect(getContentTypeLabel('TV_SHOW')).toBe('TV Show');
    });

    it('should display Movie for MOVIE type', () => {
      expect(getContentTypeLabel('MOVIE')).toBe('Movie');
    });
  });

  describe('Poster URL fallback', () => {
    const getPosterUrl = (url: string | null | undefined): string => {
      return url || 'https://via.placeholder.com/500x750?text=No+Poster';
    };

    it('should return provided URL when available', () => {
      expect(getPosterUrl('https://example.com/poster.jpg'))
        .toBe('https://example.com/poster.jpg');
    });

    it('should return fallback for null', () => {
      expect(getPosterUrl(null)).toContain('placeholder');
    });

    it('should return fallback for empty string', () => {
      expect(getPosterUrl('')).toContain('placeholder');
    });
  });
});
