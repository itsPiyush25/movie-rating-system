package com.movierating.service;

import com.movierating.model.Content;
import com.movierating.model.ContentType;
import com.movierating.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContentService {
    
    @Autowired
    private ContentRepository contentRepository;
    
    public Content createContent(Content content) {
        // Validate required fields
        if (content.getTitle() == null || content.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Content title is required");
        }
        
        if (content.getContentType() == null) {
            throw new IllegalArgumentException("Content type is required");
        }
        
        // Set default values
        content.setStatus(com.movierating.model.ContentStatus.ACTIVE);
        content.setAverageRating(0.0);
        content.setRatingCount(0);
        content.setViewCount(0);
        content.setCreatedAt(LocalDateTime.now());
        content.setUpdatedAt(LocalDateTime.now());
        
        return contentRepository.save(content);
    }
    
    public Optional<Content> getContentById(Long id) {
        return contentRepository.findById(id);
    }
    
    public Optional<Content> getContentByImdbId(String imdbId) {
        return contentRepository.findByImdbId(imdbId);
    }
    
    public Optional<Content> getContentByTmdbId(String tmdbId) {
        return contentRepository.findByTmdbId(tmdbId);
    }
    
    public List<Content> searchContent(String query) {
        return contentRepository.searchByTitleOrDescription(query);
    }
    
    public List<Content> fullTextSearch(String query) {
        return contentRepository.fullTextSearch(query);
    }
    
    public Page<Content> getContentByType(ContentType contentType, Pageable pageable) {
        return contentRepository.findByContentType(contentType, pageable);
    }
    
    public List<Content> getContentByReleaseYear(Integer year) {
        return contentRepository.findByReleaseYear(year);
    }
    
    public List<Content> getUpcomingContent() {
        return contentRepository.findUpcomingContent();
    }
    
    public Page<Content> getTopRatedContent(Pageable pageable) {
        return contentRepository.findTopRated(pageable);
    }
    
    public Page<Content> getMostViewedContent(Pageable pageable) {
        return contentRepository.findMostViewed(pageable);
    }
    
    public Page<Content> getRecentContent(Pageable pageable) {
        return contentRepository.findRecentContent(pageable);
    }
    
    public List<Content> getContentByGenre(Long genreId) {
        return contentRepository.findByGenreId(genreId);
    }
    
    public List<Content> getContentByDirector(Long directorId) {
        return contentRepository.findByDirectorId(directorId);
    }
    
    public List<Content> getContentByCast(Long castId) {
        return contentRepository.findByCastId(castId);
    }
    
    public Content updateContent(Long contentId, Content contentUpdates) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));
        
        // Update allowed fields
        if (contentUpdates.getTitle() != null) {
            content.setTitle(contentUpdates.getTitle());
        }
        
        if (contentUpdates.getDescription() != null) {
            content.setDescription(contentUpdates.getDescription());
        }
        
        if (contentUpdates.getReleaseYear() != null) {
            content.setReleaseYear(contentUpdates.getReleaseYear());
        }
        
        if (contentUpdates.getReleaseDate() != null) {
            content.setReleaseDate(contentUpdates.getReleaseDate());
        }
        
        if (contentUpdates.getDurationMinutes() != null) {
            content.setDurationMinutes(contentUpdates.getDurationMinutes());
        }
        
        if (contentUpdates.getPosterUrl() != null) {
            content.setPosterUrl(contentUpdates.getPosterUrl());
        }
        
        if (contentUpdates.getBackdropUrl() != null) {
            content.setBackdropUrl(contentUpdates.getBackdropUrl());
        }
        
        if (contentUpdates.getTrailerUrl() != null) {
            content.setTrailerUrl(contentUpdates.getTrailerUrl());
        }
        
        if (contentUpdates.getStatus() != null) {
            content.setStatus(contentUpdates.getStatus());
        }
        
        content.setUpdatedAt(LocalDateTime.now());
        
        return contentRepository.save(content);
    }
    
    public void deleteContent(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));
        
        content.setStatus(com.movierating.model.ContentStatus.DELETED);
        content.setUpdatedAt(LocalDateTime.now());
        contentRepository.save(content);
    }
    
    public void incrementViewCount(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));
        
        content.setViewCount(content.getViewCount() + 1);
        content.setUpdatedAt(LocalDateTime.now());
        contentRepository.save(content);
    }
    
    public void updateAverageRating(Long contentId, Double newRating) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));
        
        content.updateAverageRating(newRating);
        contentRepository.save(content);
    }
    
    public long getContentCountByType(ContentType contentType) {
        return contentRepository.countByContentType(contentType);
    }
    
    public Double getOverallAverageRating() {
        return contentRepository.getOverallAverageRating();
    }
    
    public List<Content> getContentReleasedBetween(LocalDate startDate, LocalDate endDate) {
        return contentRepository.findByReleaseDateBetween(startDate, endDate);
    }
    
    public List<Content> getContentWithMinRating(Double minRating) {
        return contentRepository.findByAverageRatingGreaterThanEqual(minRating);
    }

    public List<Content> getTrendingContent(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return contentRepository.findMostViewed(pageable).getContent();
    }

    public List<Content> getRecommendations(Long userId) {
        // Very simple recommendation: content from top viewed genres
        Pageable pageable = PageRequest.of(0, 10);
        return contentRepository.findTopRated(pageable).getContent();
    }
}