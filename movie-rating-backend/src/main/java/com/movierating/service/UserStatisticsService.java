package com.movierating.service;

import com.movierating.model.ViewingLog;
import com.movierating.repository.ViewingLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserStatisticsService {

    @Autowired
    private ViewingLogRepository viewingLogRepository;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private WatchlistService watchlistService;

    public Map<String, Object> getUserStats(Long userId) {
        List<ViewingLog> history = viewingLogRepository.findByUserIdOrderByStartedAtDesc(userId);
        
        Map<String, Object> stats = new HashMap<>();
        
        // Total Watch Time
        long totalMinutes = history.stream()
                .filter(log -> log.getWatchDurationMinutes() != null)
                .mapToLong(ViewingLog::getWatchDurationMinutes)
                .sum();
        stats.put("totalWatchTimeMinutes", totalMinutes);
        
        // Content Count
        stats.put("totalContentWatched", (long) history.size());
        
        // Genre Distribution (Simplified)
        Map<String, Long> genreCount = new HashMap<>();
        history.forEach(log -> {
            log.getContent().getGenres().forEach(genre -> {
                genreCount.put(genre.getName(), genreCount.getOrDefault(genre.getName(), 0L) + 1);
            });
        });
        stats.put("genreDistribution", genreCount);
        
        // Favorite Genre
        String favoriteGenre = genreCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");
        stats.put("favoriteGenre", favoriteGenre);
        
        // Rating Stats
        stats.put("ratingCount", ratingService.getUserRatingCount(userId));
        stats.put("averageRating", ratingService.getAverageRatingForUser(userId));
        
        // Watchlist Stats
        long watchlistCount = watchlistService.getUserWatchlists(userId).stream()
                .mapToLong(wl -> watchlistService.getWatchlistItems(wl.getId()).size())
                .sum();
        stats.put("watchlistCount", watchlistCount);
        
        return stats;
    }
}
