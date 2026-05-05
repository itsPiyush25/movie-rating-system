package com.movierating.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "contents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Content {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "release_year")
    private Integer releaseYear;
    
    @Column(name = "release_date")
    private LocalDate releaseDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentType contentType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ContentStatus status = ContentStatus.ACTIVE;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "imdb_id")
    private String imdbId;
    
    @Column(name = "tmdb_id")
    private String tmdbId;
    
    @Column(name = "poster_url")
    private String posterUrl;
    
    @Column(name = "backdrop_url")
    private String backdropUrl;
    
    @Column(name = "trailer_url")
    private String trailerUrl;
    
    @Column(name = "average_rating")
    @Builder.Default
    private Double averageRating = 0.0;
    
    @Column(name = "rating_count")
    @Builder.Default
    private Integer ratingCount = 0;
    
    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;
    
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "content_genres",
        joinColumns = @JoinColumn(name = "content_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    @Builder.Default
    private Set<Genre> genres = new HashSet<>();
    
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "content_directors",
        joinColumns = @JoinColumn(name = "content_id"),
        inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    @Builder.Default
    private Set<Person> directors = new HashSet<>();
    
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "content_cast",
        joinColumns = @JoinColumn(name = "content_id"),
        inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    @Builder.Default
    private Set<Person> cast = new HashSet<>();
    
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Rating> ratings = new HashSet<>();
    
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<WatchlistItem> watchlistItems = new HashSet<>();
    
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ViewingLog> viewingLogs = new HashSet<>();
    
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Review> reviews = new HashSet<>();
    
    // Helper methods
    public void addGenre(Genre genre) {
        this.genres.add(genre);
        genre.getContents().add(this);
    }
    
    public void removeGenre(Genre genre) {
        this.genres.remove(genre);
        genre.getContents().remove(this);
    }
    
    public void addDirector(Person director) {
        this.directors.add(director);
        director.getDirectedContents().add(this);
    }
    
    public void removeDirector(Person director) {
        this.directors.remove(director);
        director.getDirectedContents().remove(this);
    }
    
    public void addCastMember(Person castMember) {
        this.cast.add(castMember);
        castMember.getActedContents().add(this);
    }
    
    public void removeCastMember(Person castMember) {
        this.cast.remove(castMember);
        castMember.getActedContents().remove(this);
    }
    
    public void updateAverageRating(double newRating) {
        double totalRating = this.averageRating * this.ratingCount;
        this.ratingCount++;
        this.averageRating = (totalRating + newRating) / this.ratingCount;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void incrementViewCount() {
        this.viewCount++;
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}