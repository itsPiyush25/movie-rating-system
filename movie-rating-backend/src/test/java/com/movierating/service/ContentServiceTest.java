package com.movierating.service;

import com.movierating.model.Content;
import com.movierating.model.ContentType;
import com.movierating.model.Genre;
import com.movierating.repository.ContentRepository;
import com.movierating.repository.GenreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContentServiceTest {

    @Mock
    private ContentRepository contentRepository;

    @Mock
    private GenreRepository genreRepository;

    @InjectMocks
    private ContentService contentService;

    private Content testContent;

    @BeforeEach
    void setUp() {
        testContent = new Content();
        testContent.setTitle("Test Movie");
        testContent.setContentType(ContentType.MOVIE);
    }

    @Test
    void createContent_ShouldResolveGenresAndSave() {
        Genre action = new Genre("Action");
        Set<Genre> genres = new HashSet<>();
        genres.add(action);
        testContent.setGenres(genres);

        when(genreRepository.findByName("Action")).thenReturn(Optional.empty());
        when(genreRepository.save(any(Genre.class))).thenReturn(action);
        when(contentRepository.save(any(Content.class))).thenReturn(testContent);

        Content created = contentService.createContent(testContent);

        assertThat(created).isNotNull();
        assertThat(created.getTitle()).isEqualTo("Test Movie");
        verify(genreRepository).findByName("Action");
        verify(genreRepository).save(any(Genre.class));
        verify(contentRepository).save(any(Content.class));
    }

    @Test
    void getContentById_ShouldReturnContent() {
        when(contentRepository.findById(1L)).thenReturn(Optional.of(testContent));

        Optional<Content> result = contentService.getContentById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Test Movie");
    }

    @Test
    void searchContent_ShouldReturnList() {
        when(contentRepository.searchByTitleOrDescription("Test")).thenReturn(Collections.singletonList(testContent));

        java.util.List<Content> results = contentService.searchContent("Test");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).isEqualTo("Test Movie");
    }
}
