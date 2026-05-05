package com.movierating.service;

import com.movierating.model.*;
import com.movierating.repository.WatchlistItemRepository;
import com.movierating.repository.WatchlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WatchlistServiceTest {

    @Mock
    private WatchlistRepository watchlistRepository;

    @Mock
    private WatchlistItemRepository watchlistItemRepository;

    @Mock
    private UserService userService;

    @Mock
    private ContentService contentService;

    @InjectMocks
    private WatchlistService watchlistService;

    private User testUser;
    private Content testContent;
    private Watchlist testWatchlist;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");

        testContent = new Content();
        testContent.setId(1L);
        testContent.setTitle("Test Movie");

        testWatchlist = new Watchlist();
        testWatchlist.setId(1L);
        testWatchlist.setUser(testUser);
        testWatchlist.setName("My Watchlist");
    }

    @Test
    void createWatchlist_ShouldSaveAndReturn() {
        when(userService.getUserById(1L)).thenReturn(Optional.of(testUser));
        when(watchlistRepository.save(any(Watchlist.class))).thenReturn(testWatchlist);

        Watchlist result = watchlistService.createWatchlist(1L, "My Watchlist", "A test watchlist", true);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("My Watchlist");
        verify(watchlistRepository).save(any(Watchlist.class));
    }

    @Test
    void createWatchlist_ShouldThrowWhenUserNotFound() {
        when(userService.getUserById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> watchlistService.createWatchlist(99L, "Test", "Desc", true))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void getUserWatchlists_ShouldReturnList() {
        when(watchlistRepository.findByUserId(1L)).thenReturn(Collections.singletonList(testWatchlist));

        List<Watchlist> result = watchlistService.getUserWatchlists(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("My Watchlist");
    }

    @Test
    void addToWatchlist_ShouldSaveItem() {
        when(watchlistRepository.findById(1L)).thenReturn(Optional.of(testWatchlist));
        when(contentService.getContentById(1L)).thenReturn(Optional.of(testContent));
        when(watchlistItemRepository.findByWatchlistIdAndContentId(1L, 1L))
                .thenReturn(Optional.empty());

        WatchlistItem item = new WatchlistItem();
        item.setWatchlist(testWatchlist);
        item.setContent(testContent);
        when(watchlistItemRepository.save(any(WatchlistItem.class))).thenReturn(item);

        WatchlistItem result = watchlistService.addToWatchlist(1L, 1L);

        assertThat(result).isNotNull();
        verify(watchlistItemRepository).save(any(WatchlistItem.class));
    }

    @Test
    void addToWatchlist_ShouldReturnExistingItemIfAlreadyAdded() {
        WatchlistItem existing = new WatchlistItem();
        existing.setWatchlist(testWatchlist);
        existing.setContent(testContent);

        when(watchlistRepository.findById(1L)).thenReturn(Optional.of(testWatchlist));
        when(contentService.getContentById(1L)).thenReturn(Optional.of(testContent));
        when(watchlistItemRepository.findByWatchlistIdAndContentId(1L, 1L))
                .thenReturn(Optional.of(existing));

        WatchlistItem result = watchlistService.addToWatchlist(1L, 1L);

        assertThat(result).isNotNull();
        verify(watchlistItemRepository, never()).save(any());
    }

    @Test
    void getWatchlistItems_ShouldReturnList() {
        when(watchlistItemRepository.findByWatchlistId(1L)).thenReturn(Collections.emptyList());

        List<WatchlistItem> result = watchlistService.getWatchlistItems(1L);

        assertThat(result).isEmpty();
    }
}
