package com.movierating.repository;

import com.movierating.model.Content;
import com.movierating.model.ContentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    
    Optional<Content> findByTitle(String title);
    
    Optional<Content> findByImdbId(String imdbId);
    
    Optional<Content> findByTmdbId(String tmdbId);
    
    List<Content> findByContentType(ContentType contentType);
    
    Page<Content> findByContentType(ContentType contentType, Pageable pageable);
    
    List<Content> findByReleaseYear(Integer releaseYear);
    
    List<Content> findByReleaseDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT c FROM Content c WHERE c.averageRating >= :minRating ORDER BY c.averageRating DESC")
    List<Content> findByAverageRatingGreaterThanEqual(@Param("minRating") Double minRating);
    
    @Query("SELECT c FROM Content c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Content> searchByTitleOrDescription(@Param("query") String query);
    
    @Query("SELECT c FROM Content c JOIN c.genres g WHERE g.id = :genreId")
    List<Content> findByGenreId(@Param("genreId") Long genreId);
    
    @Query("SELECT c FROM Content c JOIN c.directors d WHERE d.id = :personId")
    List<Content> findByDirectorId(@Param("personId") Long personId);
    
    @Query("SELECT c FROM Content c JOIN c.cast ca WHERE ca.id = :personId")
    List<Content> findByCastId(@Param("personId") Long personId);
    
    @Query("SELECT c FROM Content c ORDER BY c.averageRating DESC, c.ratingCount DESC")
    Page<Content> findTopRated(Pageable pageable);
    
    @Query("SELECT c FROM Content c ORDER BY c.viewCount DESC")
    Page<Content> findMostViewed(Pageable pageable);
    
    @Query("SELECT c FROM Content c WHERE c.releaseDate > CURRENT_DATE ORDER BY c.releaseDate ASC")
    List<Content> findUpcomingContent();
    
    @Query("SELECT c FROM Content c WHERE c.status = 'ACTIVE' ORDER BY c.createdAt DESC")
    Page<Content> findRecentContent(Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Content c WHERE c.contentType = :contentType")
    long countByContentType(@Param("contentType") ContentType contentType);
    
    @Query("SELECT AVG(c.averageRating) FROM Content c WHERE c.ratingCount > 0")
    Double getOverallAverageRating();
    
    @Query(value = "SELECT * FROM contents WHERE MATCH(title, description) AGAINST(:query IN NATURAL LANGUAGE MODE)", 
           nativeQuery = true)
    List<Content> fullTextSearch(@Param("query") String query);
}