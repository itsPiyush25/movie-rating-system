package com.movierating.controller;

import com.movierating.exception.ResourceNotFoundException;
import com.movierating.model.Content;
import com.movierating.model.ContentType;
import com.movierating.service.ContentService;
import com.movierating.service.SystemStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/contents")
public class ContentController {
    
    @Autowired
    private ContentService contentService;

    @Autowired
    private SystemStatisticsService systemStatisticsService;
    
    @PostMapping
    public ResponseEntity<?> createContent(@RequestBody Content content) {
        try {
            Content createdContent = contentService.createContent(content);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdContent);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getContentById(@PathVariable Long id) {
        Content content = contentService.getContentById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found with id: " + id));
        
        // Increment view count when content is accessed
        contentService.incrementViewCount(id);
        return ResponseEntity.ok(content);
    }
    
    @GetMapping("/imdb/{imdbId}")
    public ResponseEntity<?> getContentByImdbId(@PathVariable String imdbId) {
        Optional<Content> content = contentService.getContentByImdbId(imdbId);
        
        if (content.isPresent()) {
            return ResponseEntity.ok(content.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Content not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @GetMapping("/tmdb/{tmdbId}")
    public ResponseEntity<?> getContentByTmdbId(@PathVariable String tmdbId) {
        Optional<Content> content = contentService.getContentByTmdbId(tmdbId);
        
        if (content.isPresent()) {
            return ResponseEntity.ok(content.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Content not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Content>> searchContent(@RequestParam String query) {
        List<Content> contents = contentService.searchContent(query);
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/search/fulltext")
    public ResponseEntity<List<Content>> fullTextSearch(@RequestParam String query) {
        List<Content> contents = contentService.fullTextSearch(query);
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<Page<Content>> getContentByType(
            @PathVariable ContentType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Content> contents = contentService.getContentByType(type, pageable);
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/year/{year}")
    public ResponseEntity<List<Content>> getContentByReleaseYear(@PathVariable Integer year) {
        List<Content> contents = contentService.getContentByReleaseYear(year);
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Content>> getUpcomingContent() {
        List<Content> contents = contentService.getUpcomingContent();
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/top-rated")
    public ResponseEntity<Page<Content>> getTopRatedContent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Content> contents = contentService.getTopRatedContent(pageable);
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/most-viewed")
    public ResponseEntity<Page<Content>> getMostViewedContent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Content> contents = contentService.getMostViewedContent(pageable);
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<Page<Content>> getRecentContent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Content> contents = contentService.getRecentContent(pageable);
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/genre/{genreId}")
    public ResponseEntity<List<Content>> getContentByGenre(@PathVariable Long genreId) {
        List<Content> contents = contentService.getContentByGenre(genreId);
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/director/{directorId}")
    public ResponseEntity<List<Content>> getContentByDirector(@PathVariable Long directorId) {
        List<Content> contents = contentService.getContentByDirector(directorId);
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/cast/{castId}")
    public ResponseEntity<List<Content>> getContentByCast(@PathVariable Long castId) {
        List<Content> contents = contentService.getContentByCast(castId);
        return ResponseEntity.ok(contents);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateContent(@PathVariable Long id, @RequestBody Content contentUpdates) {
        try {
            Content updatedContent = contentService.updateContent(id, contentUpdates);
            return ResponseEntity.ok(updatedContent);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContent(@PathVariable Long id) {
        try {
            contentService.deleteContent(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Content deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @GetMapping("/{id}/view")
    public ResponseEntity<?> incrementViewCount(@PathVariable Long id) {
        try {
            contentService.incrementViewCount(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "View count incremented");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    @GetMapping("/stats/count/{type}")
    public ResponseEntity<Map<String, Long>> getContentCountByType(@PathVariable ContentType type) {
        long count = contentService.getContentCountByType(type);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats/average-rating")
    public ResponseEntity<Map<String, Double>> getOverallAverageRating() {
        Double averageRating = contentService.getOverallAverageRating();
        Map<String, Double> response = new HashMap<>();
        response.put("averageRating", averageRating != null ? averageRating : 0.0);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/filter/rating")
    public ResponseEntity<List<Content>> getContentWithMinRating(@RequestParam Double minRating) {
        List<Content> contents = contentService.getContentWithMinRating(minRating);
        return ResponseEntity.ok(contents);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<Content>> getTrendingContent(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(contentService.getTrendingContent(limit));
    }

    @GetMapping("/recommendations/user/{userId}")
    public ResponseEntity<List<Content>> getRecommendations(@PathVariable Long userId) {
        return ResponseEntity.ok(contentService.getRecommendations(userId));
    }

    @GetMapping("/stats/global")
    public ResponseEntity<Map<String, Object>> getGlobalStats() {
        return ResponseEntity.ok(systemStatisticsService.getGlobalStats());
    }
}
