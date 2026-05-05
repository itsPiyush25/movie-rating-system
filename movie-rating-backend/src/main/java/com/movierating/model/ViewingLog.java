package com.movierating.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "viewing_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ViewingLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    public ViewingLog(User user, Content content) {
        this.user = user;
        this.content = content;
        this.startedAt = LocalDateTime.now();
        this.platform = ViewingPlatform.WEB;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;
    
    @Column(name = "started_at", nullable = false)
    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();
    
    @Column(name = "finished_at")
    private LocalDateTime finishedAt;
    
    @Column(name = "watch_duration_minutes")
    private Integer watchDurationMinutes;
    
    @Column(name = "completion_percentage")
    private Integer completionPercentage; // 0-100
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ViewingPlatform platform = ViewingPlatform.WEB;
    
    @Column(name = "device_info")
    private String deviceInfo;
    
    @Column(name = "session_id")
    private String sessionId;

    @Column(name = "watch_companions")
    private String watchCompanions;
    
    @Column(name = "rating_id")
    private Long ratingId; // Optional reference to rating given after viewing
    
    // Helper methods
    public void markAsCompleted() {
        this.finishedAt = LocalDateTime.now();
        this.completionPercentage = 100;
    }
    
    public void markAsCompleted(Integer completionPercentage) {
        this.finishedAt = LocalDateTime.now();
        this.completionPercentage = completionPercentage;
    }
    
    public boolean isCompleted() {
        return this.finishedAt != null;
    }
}

enum ViewingPlatform {
    WEB,
    MOBILE,
    TV,
    TABLET,
    DESKTOP_APP,
    OTHER
}