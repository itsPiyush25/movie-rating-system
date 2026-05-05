package com.movierating.controller;

import com.movierating.exception.ResourceNotFoundException;
import com.movierating.model.Watchlist;
import com.movierating.model.WatchlistItem;
import com.movierating.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<Watchlist> createWatchlist(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        String description = (String) payload.get("description");
        boolean isPublic = payload.get("isPublic") != null && (boolean) payload.get("isPublic");
        
        return ResponseEntity.ok(watchlistService.createWatchlist(userId, name, description, isPublic));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Watchlist>> getUserWatchlists(@PathVariable Long userId) {
        return ResponseEntity.ok(watchlistService.getUserWatchlists(userId));
    }

    @GetMapping("/{watchlistId}")
    public ResponseEntity<List<WatchlistItem>> getWatchlistItems(@PathVariable Long watchlistId) {
        return ResponseEntity.ok(watchlistService.getWatchlistItems(watchlistId));
    }

    @PostMapping("/{watchlistId}/add/{contentId}")
    public ResponseEntity<WatchlistItem> addToWatchlist(
            @PathVariable Long watchlistId,
            @PathVariable Long contentId) {
        return ResponseEntity.ok(watchlistService.addToWatchlist(watchlistId, contentId));
    }

    @DeleteMapping("/{watchlistId}/remove/{contentId}")
    public ResponseEntity<Void> removeFromWatchlist(
            @PathVariable Long watchlistId,
            @PathVariable Long contentId) {
        watchlistService.removeFromWatchlist(watchlistId, contentId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{watchlistId}/update/{contentId}")
    public ResponseEntity<WatchlistItem> updateWatchlistItem(
            @PathVariable Long watchlistId,
            @PathVariable Long contentId,
            @RequestBody WatchlistItem updates) {
        return ResponseEntity.ok(watchlistService.updateWatchlistItem(watchlistId, contentId, updates));
    }

    @PostMapping("/{watchlistId}/watched/{contentId}")
    public ResponseEntity<WatchlistItem> markAsWatched(
            @PathVariable Long watchlistId,
            @PathVariable Long contentId) {
        return ResponseEntity.ok(watchlistService.markAsWatched(watchlistId, contentId));
    }

    @GetMapping("/{watchlistId}/random")
    public ResponseEntity<WatchlistItem> getRandomItem(@PathVariable Long watchlistId) {
        return watchlistService.getRandomItem(watchlistId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("No items found in watchlist: " + watchlistId));
    }
}
