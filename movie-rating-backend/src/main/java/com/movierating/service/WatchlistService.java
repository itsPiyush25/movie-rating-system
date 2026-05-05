package com.movierating.service;

import com.movierating.model.Content;
import com.movierating.model.User;
import com.movierating.model.Watchlist;
import com.movierating.model.WatchlistItem;
import com.movierating.repository.WatchlistItemRepository;
import com.movierating.repository.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepository;

    @Autowired
    private WatchlistItemRepository watchlistItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ContentService contentService;

    public Watchlist createWatchlist(Long userId, String name, String description, boolean isPublic) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Watchlist watchlist = Watchlist.builder()
                .name(name)
                .description(description)
                .user(user)
                .isPublic(isPublic)
                .build();
        
        return watchlistRepository.save(watchlist);
    }

    public List<Watchlist> getUserWatchlists(Long userId) {
        return watchlistRepository.findByUserId(userId);
    }

    public Optional<Watchlist> getWatchlistById(Long id) {
        return watchlistRepository.findById(id);
    }

    public WatchlistItem addToWatchlist(Long watchlistId, Long contentId) {
        Watchlist watchlist = watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new IllegalArgumentException("Watchlist not found"));
        Content content = contentService.getContentById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));

        Optional<WatchlistItem> existing = watchlistItemRepository.findByWatchlistIdAndContentId(watchlistId, contentId);
        if (existing.isPresent()) {
            return existing.get();
        }

        WatchlistItem item = WatchlistItem.builder()
                .watchlist(watchlist)
                .content(content)
                .build();
        return watchlistItemRepository.save(item);
    }

    public List<WatchlistItem> getWatchlistItems(Long watchlistId) {
        return watchlistItemRepository.findByWatchlistId(watchlistId);
    }

    public void removeFromWatchlist(Long watchlistId, Long contentId) {
        watchlistItemRepository.deleteByWatchlistIdAndContentId(watchlistId, contentId);
    }

    public WatchlistItem updateWatchlistItem(Long watchlistId, Long contentId, WatchlistItem updates) {
        WatchlistItem item = watchlistItemRepository.findByWatchlistIdAndContentId(watchlistId, contentId)
                .orElseThrow(() -> new IllegalArgumentException("Watchlist item not found"));

        if (updates.getPriority() != null) {
            item.setPriority(updates.getPriority());
        }
        if (updates.getStatus() != null) {
            item.setStatus(updates.getStatus());
        }
        if (updates.getNotes() != null) {
            item.setNotes(updates.getNotes());
        }
        if (updates.getPlannedWatchDate() != null) {
            item.setPlannedWatchDate(updates.getPlannedWatchDate());
        }

        return watchlistItemRepository.save(item);
    }

    public WatchlistItem markAsWatched(Long watchlistId, Long contentId) {
        WatchlistItem item = watchlistItemRepository.findByWatchlistIdAndContentId(watchlistId, contentId)
                .orElseThrow(() -> new IllegalArgumentException("Watchlist item not found"));
        item.setStatus(WatchlistItem.WatchlistStatus.WATCHED);
        item.setWatchedAt(LocalDateTime.now());
        return watchlistItemRepository.save(item);
    }

    public Optional<WatchlistItem> getRandomItem(Long watchlistId) {
        List<WatchlistItem> items = watchlistItemRepository.findByWatchlistId(watchlistId);
        if (items.isEmpty()) {
            return Optional.empty();
        }
        Random random = new Random();
        return Optional.of(items.get(random.nextInt(items.size())));
    }
}
