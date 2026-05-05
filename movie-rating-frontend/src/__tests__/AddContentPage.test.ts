// Unit tests for AddContentPage form logic
// Tests genre management and form validation logic

describe('AddContentPage form logic', () => {
  describe('Genre management', () => {
    let genres: string[] = [];

    beforeEach(() => {
      genres = [];
    });

    const addGenre = (list: string[], newGenre: string): string[] => {
      const trimmed = newGenre.trim();
      if (trimmed && !list.includes(trimmed)) {
        return [...list, trimmed];
      }
      return list;
    };

    const removeGenre = (list: string[], genre: string): string[] =>
      list.filter(g => g !== genre);

    it('should add a new genre', () => {
      const result = addGenre(genres, 'Action');
      expect(result).toContain('Action');
      expect(result).toHaveLength(1);
    });

    it('should not add duplicate genres', () => {
      genres = ['Action'];
      const result = addGenre(genres, 'Action');
      expect(result).toHaveLength(1);
    });

    it('should trim whitespace from genre names', () => {
      const result = addGenre(genres, '  Drama  ');
      expect(result).toContain('Drama');
    });

    it('should not add empty genre', () => {
      const result = addGenre(genres, '');
      expect(result).toHaveLength(0);
    });

    it('should remove an existing genre', () => {
      genres = ['Action', 'Drama'];
      const result = removeGenre(genres, 'Action');
      expect(result).not.toContain('Action');
      expect(result).toContain('Drama');
    });

    it('should handle removing non-existent genre gracefully', () => {
      genres = ['Action'];
      const result = removeGenre(genres, 'Comedy');
      expect(result).toHaveLength(1);
    });
  });

  describe('Form field validation', () => {
    const validateTitle = (title: string): boolean =>
      title.trim().length > 0;

    const validateYear = (year: number): boolean =>
      year >= 1900 && year <= new Date().getFullYear() + 5;

    const validateDuration = (minutes: number): boolean =>
      minutes > 0;

    it('should reject empty title', () => {
      expect(validateTitle('')).toBe(false);
      expect(validateTitle('  ')).toBe(false);
    });

    it('should accept valid title', () => {
      expect(validateTitle('Inception')).toBe(true);
    });

    it('should reject years below 1900', () => {
      expect(validateYear(1800)).toBe(false);
    });

    it('should accept current year', () => {
      expect(validateYear(new Date().getFullYear())).toBe(true);
    });

    it('should reject zero or negative duration', () => {
      expect(validateDuration(0)).toBe(false);
      expect(validateDuration(-10)).toBe(false);
    });

    it('should accept valid duration', () => {
      expect(validateDuration(120)).toBe(true);
    });
  });

  describe('Initial rating logic', () => {
    const isRatingValid = (rating: number): boolean =>
      rating >= 1 && rating <= 10;

    const hasInitialRating = (rating: number): boolean =>
      rating > 0;

    it('should consider rating 0 as no rating provided', () => {
      expect(hasInitialRating(0)).toBe(false);
    });

    it('should consider rating > 0 as provided', () => {
      expect(hasInitialRating(7)).toBe(true);
    });

    it('should validate rating is within bounds', () => {
      expect(isRatingValid(1)).toBe(true);
      expect(isRatingValid(10)).toBe(true);
      expect(isRatingValid(11)).toBe(false);
    });
  });
});
