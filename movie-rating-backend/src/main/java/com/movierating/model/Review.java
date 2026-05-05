package com.movierating.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "is_spoiler", nullable = false)
    private Boolean isSpoiler = false;
    
    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = true;
    
    @Column(name = "helpful_count", nullable = false)
    private Integer helpfulCount = 0;
    
    @Column(name = "unhelpful_count", nullable = false)
    private Integer unhelpfulCount = 0;
    
    @Column(name = "reply_to_review_id")
    private Long replyToReviewId; // For threaded reviews
    
    public Review() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Review(User user, Content content, String text) {
        this();
        this.user = user;
        this.content = content;
        this.text = text;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Content getContent() {
        return content;
    }
    
    public void setContent(Content content) {
        this.content = content;
    }
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Boolean getIsSpoiler() {
        return isSpoiler;
    }
    
    public void setIsSpoiler(Boolean isSpoiler) {
        this.isSpoiler = isSpoiler;
    }
    
    public Boolean getIsPublic() {
        return isPublic;
    }
    
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
    
    public Integer getHelpfulCount() {
        return helpfulCount;
    }
    
    public void setHelpfulCount(Integer helpfulCount) {
        this.helpfulCount = helpfulCount;
    }
    
    public Integer getUnhelpfulCount() {
        return unhelpfulCount;
    }
    
    public void setUnhelpfulCount(Integer unhelpfulCount) {
        this.unhelpfulCount = unhelpfulCount;
    }
    
    public Long getReplyToReviewId() {
        return replyToReviewId;
    }
    
    public void setReplyToReviewId(Long replyToReviewId) {
        this.replyToReviewId = replyToReviewId;
    }
    
    // Helper methods
    public void markAsHelpful() {
        this.helpfulCount++;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markAsUnhelpful() {
        this.unhelpfulCount++;
        this.updatedAt = LocalDateTime.now();
    }
    
    public Integer getTotalVotes() {
        return this.helpfulCount + this.unhelpfulCount;
    }
    
    public Double getHelpfulPercentage() {
        if (getTotalVotes() == 0) {
            return 0.0;
        }
        return (this.helpfulCount * 100.0) / getTotalVotes();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "Review{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : null) +
                ", contentId=" + (content != null ? content.getId() : null) +
                ", text='" + (text != null ? text.substring(0, Math.min(50, text.length())) + "..." : "") + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}