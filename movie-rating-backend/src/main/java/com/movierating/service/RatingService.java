package com.movierating.service;

import com.movierating.model.Content;
import com.movierating.model.Rating;
import com.movierating.model.User;
import com.movierating.repository.ContentRepository;
import com.movierating.repository.RatingRepository;
import com.movierating.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RatingService {
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ContentRepository contentRepository;
    
    @Autowired
    private ContentService contentService;
    
    public Rating createOrUpdateRating(Long userId, Long contentId, Integer score, String comment) {
        // Validate score range
        if (score < 1 || score > 10) {
            throw new IllegalArgumentException("Rating score must be between 1 and 10");
        }
        
        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Check if content exists
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));
        
        // Check for existing rating
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndContentId(userId, contentId);
        
        Rating rating;
        if (existingRating.isPresent()) {
            // Update existing rating
            rating = existingRating.get();
            rating.setScore(score);
            if (comment != null) {
                rating.setComment(comment);
            }
            rating.setUpdatedAt(LocalDateTime.now());
        } else {
            // Create new rating
            rating = new Rating(user, content, score);
            rating.setComment(comment);
        }
        
        Rating savedRating = ratingRepository.save(rating);
        
        // Update content's average rating
        updateContentAverageRating(contentId);
        
        return savedRating;
    }
    
    public Optional<Rating> getRating(Long userId, Long contentId) {
        return ratingRepository.findByUserIdAndContentId(userId, contentId);
    }
    
    public List<Rating> getUserRatings(Long userId) {
        return ratingRepository.findByUserId(userId);
    }
    
    public Page<Rating> getUserRatings(Long userId, Pageable pageable) {
        return ratingRepository.findRecentRatingsByUserId(userId, pageable);
    }
    
    public List<Rating> getContentRatings(Long contentId) {
        return ratingRepository.findByContentId(contentId);
    }
    
    public Page<Rating> getContentRatings(Long contentId, Pageable pageable) {
        return ratingRepository.findRecentRatingsByContentId(contentId, pageable);
    }
    
    public void deleteRating(Long userId, Long contentId) {
        Optional<Rating> rating = ratingRepository.findByUserIdAndContentId(userId, contentId);
        if (rating.isPresent()) {
            ratingRepository.delete(rating.get());
            
            // Update content's average rating
            updateContentAverageRating(contentId);
        }
    }
    
    public Double getAverageRatingForContent(Long contentId) {
        return ratingRepository.getAverageRatingByContentId(contentId);
    }
    
    public Long getRatingCountForContent(Long contentId) {
        return ratingRepository.getRatingCountByContentId(contentId);
    }
    
    public List<Rating> getRatingsWithComments(Pageable pageable) {
        return ratingRepository.findRatingsWithComments(pageable).getContent();
    }
    
    public List<Object[]> getRatingDistribution(Long contentId) {
        return ratingRepository.getRatingDistributionByContentId(contentId);
    }
    
    public List<Object[]> getTopRatedContentByUser(Long userId, Pageable pageable) {
        return ratingRepository.findTopRatedContentByUser(userId, pageable);
    }
    
    public List<Object[]> getMostActiveUsers(Pageable pageable) {
        return ratingRepository.findMostActiveUsers(pageable);
    }
    
    public Long getUserRatingCount(Long userId) {
        return ratingRepository.countByUserId(userId);
    }
    
    public List<Rating> getUserRatingsWithMinScore(Long userId, Integer minScore) {
        return ratingRepository.findByUserIdAndMinScore(userId, minScore);
    }
    
    public List<Rating> getContentRatingsWithMinScore(Long contentId, Integer minScore) {
        return ratingRepository.findByContentIdAndMinScore(contentId, minScore);
    }
    
    private void updateContentAverageRating(Long contentId) {
        Double averageRating = ratingRepository.getAverageRatingByContentId(contentId);
        Long ratingCount = ratingRepository.getRatingCountByContentId(contentId);
        
        if (averageRating != null) {
            Content content = contentRepository.findById(contentId)
                    .orElseThrow(() -> new IllegalArgumentException("Content not found"));
            
            content.setAverageRating(averageRating);
            content.setRatingCount(ratingCount.intValue());
            content.setUpdatedAt(LocalDateTime.now());
            contentRepository.save(content);
        }
    }
    
    public boolean hasUserRatedContent(Long userId, Long contentId) {
        return ratingRepository.findByUserIdAndContentId(userId, contentId).isPresent();
    }

    public Double getAverageRatingForUser(Long userId) {
        List<Rating> ratings = ratingRepository.findByUserId(userId);
        if (ratings.isEmpty()) return 0.0;
        return ratings.stream().mapToDouble(Rating::getScore).average().orElse(0.0);
    }
}