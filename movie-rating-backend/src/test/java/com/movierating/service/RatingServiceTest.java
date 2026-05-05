package com.movierating.service;

import com.movierating.model.Content;
import com.movierating.model.Rating;
import com.movierating.model.User;
import com.movierating.repository.ContentRepository;
import com.movierating.repository.RatingRepository;
import com.movierating.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ContentRepository contentRepository;

    @InjectMocks
    private RatingService ratingService;

    private User testUser;
    private Content testContent;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);

        testContent = new Content();
        testContent.setId(1L);
        testContent.setTitle("Test Movie");
    }

    @Test
    void createOrUpdateRating_ShouldCreateNewRating() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(contentRepository.findById(1L)).thenReturn(Optional.of(testContent));
        when(ratingRepository.findByUserIdAndContentId(1L, 1L)).thenReturn(Optional.empty());
        
        Rating newRating = new Rating(testUser, testContent, 8);
        newRating.setComment("Great!");
        when(ratingRepository.save(any(Rating.class))).thenReturn(newRating);
        
        // Average rating calculation mocks
        when(ratingRepository.getAverageRatingByContentId(1L)).thenReturn(8.0);
        when(ratingRepository.getRatingCountByContentId(1L)).thenReturn(1L);

        Rating result = ratingService.createOrUpdateRating(1L, 1L, 8, "Great!");

        assertThat(result).isNotNull();
        assertThat(result.getScore()).isEqualTo(8);
        assertThat(result.getComment()).isEqualTo("Great!");
        
        verify(ratingRepository).save(any(Rating.class));
        verify(contentRepository).save(any(Content.class));
    }

    @Test
    void getContentRatings_ShouldReturnRatings() {
        when(ratingRepository.findByContentId(1L)).thenReturn(java.util.Collections.emptyList());

        java.util.List<Rating> results = ratingService.getContentRatings(1L);

        assertThat(results).isEmpty();
    }
}
