package com.movierating.repository;

import com.movierating.model.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistItemRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByWatchlistId(Long watchlistId);
    Optional<WatchlistItem> findByWatchlistIdAndContentId(Long watchlistId, Long contentId);
    void deleteByWatchlistIdAndContentId(Long watchlistId, Long contentId);
}
