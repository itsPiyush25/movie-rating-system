package com.movierating.repository;

import com.movierating.model.User;
import com.movierating.model.Content;
import com.movierating.model.ViewingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViewingLogRepository extends JpaRepository<ViewingLog, Long> {
    List<ViewingLog> findByUserOrderByStartedAtDesc(User user);
    List<ViewingLog> findByUserIdOrderByStartedAtDesc(Long userId);
    List<ViewingLog> findByUserIdAndContentId(Long userId, Long contentId);
    void deleteByUserId(Long userId);
}
