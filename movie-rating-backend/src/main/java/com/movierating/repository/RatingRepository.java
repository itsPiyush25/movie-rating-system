package com.movierating.repository;

import com.movierating.model.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    Optional<Rating> findByUserIdAndContentId(Long userId, Long contentId);
    
    List<Rating> findByUserId(Long userId);
    
    List<Rating> findByContentId(Long contentId);
    
    Page<Rating> findByContentId(Long contentId, Pageable pageable);
    
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId AND r.score >= :minScore")
    List<Rating> findByUserIdAndMinScore(@Param("userId") Long userId, @Param("minScore") Integer minScore);
    
    @Query("SELECT r FROM Rating r WHERE r.content.id = :contentId AND r.score >= :minScore")
    List<Rating> findByContentIdAndMinScore(@Param("contentId") Long contentId, @Param("minScore") Integer minScore);
    
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.content.id = :contentId")
    Double getAverageRatingByContentId(@Param("contentId") Long contentId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.content.id = :contentId")
    Long getRatingCountByContentId(@Param("contentId") Long contentId);
    
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId ORDER BY r.updatedAt DESC")
    Page<Rating> findRecentRatingsByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT r FROM Rating r WHERE r.content.id = :contentId ORDER BY r.updatedAt DESC")
    Page<Rating> findRecentRatingsByContentId(@Param("contentId") Long contentId, Pageable pageable);
    
    @Query("SELECT r.content.id, AVG(r.score) as avgScore FROM Rating r " +
           "WHERE r.user.id = :userId GROUP BY r.content.id ORDER BY avgScore DESC")
    List<Object[]> findTopRatedContentByUser(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT r.user.id, COUNT(r) as ratingCount FROM Rating r " +
           "GROUP BY r.user.id ORDER BY ratingCount DESC")
    List<Object[]> findMostActiveUsers(Pageable pageable);
    
    @Query("SELECT r FROM Rating r WHERE r.comment IS NOT NULL AND LENGTH(r.comment) > 0 " +
           "ORDER BY r.updatedAt DESC")
    Page<Rating> findRatingsWithComments(Pageable pageable);
    
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId AND r.content.id IN :contentIds")
    List<Rating> findByUserIdAndContentIds(@Param("userId") Long userId, @Param("contentIds") List<Long> contentIds);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT r.score, COUNT(r) FROM Rating r WHERE r.content.id = :contentId GROUP BY r.score")
    List<Object[]> getRatingDistributionByContentId(@Param("contentId") Long contentId);
}