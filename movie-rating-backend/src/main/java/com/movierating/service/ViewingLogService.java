package com.movierating.service;

import com.movierating.model.Content;
import com.movierating.model.User;
import com.movierating.model.ViewingLog;
import com.movierating.repository.ViewingLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ViewingLogService {

    @Autowired
    private ViewingLogRepository viewingLogRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ContentService contentService;

    public ViewingLog logViewing(Long userId, Long contentId, ViewingLog logData) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Content content = contentService.getContentById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Content not found"));

        ViewingLog log = new ViewingLog(user, content);
        if (logData != null) {
            if (logData.getPlatform() != null) log.setPlatform(logData.getPlatform());
            if (logData.getDeviceInfo() != null) log.setDeviceInfo(logData.getDeviceInfo());
            if (logData.getWatchDurationMinutes() != null) log.setWatchDurationMinutes(logData.getWatchDurationMinutes());
            if (logData.getCompletionPercentage() != null) log.setCompletionPercentage(logData.getCompletionPercentage());
        }
        
        // Increment view count in content
        contentService.incrementViewCount(contentId);
        
        return viewingLogRepository.save(log);
    }

    public List<ViewingLog> getUserHistory(Long userId) {
        return viewingLogRepository.findByUserIdOrderByStartedAtDesc(userId);
    }

    public void clearHistory(Long userId) {
        viewingLogRepository.deleteByUserId(userId);
    }
}
