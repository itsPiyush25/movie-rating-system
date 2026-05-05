package com.movierating.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "watchlist_items", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"watchlist_id", "content_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watchlist_id", nullable = false)
    @JsonIgnore
    private Watchlist watchlist;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private WatchlistStatus status = WatchlistStatus.PLANNED;
    
    @Column(name = "added_at", nullable = false)
    @Builder.Default
    private LocalDateTime addedAt = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    @Builder.Default
    private WatchlistPriority priority = WatchlistPriority.MEDIUM;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "planned_watch_date")
    private LocalDateTime plannedWatchDate;
    
    @Column(name = "watched_at")
    private LocalDateTime watchedAt;

    public enum WatchlistStatus {
        PLANNED,
        WATCHED,
        ABANDONED,
        IN_PROGRESS
    }

    public enum WatchlistPriority {
        LOW,
        MEDIUM,
        HIGH
    }
}