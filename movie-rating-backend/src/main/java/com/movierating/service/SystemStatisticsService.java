package com.movierating.service;

import com.movierating.model.ContentType;
import com.movierating.repository.ContentRepository;
import com.movierating.repository.RatingRepository;
import com.movierating.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SystemStatisticsService {

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalContent", contentRepository.count());
        stats.put("totalMovies", contentRepository.countByContentType(ContentType.MOVIE));
        stats.put("totalTvShows", contentRepository.countByContentType(ContentType.TV_SHOW));
        stats.put("totalRatings", ratingRepository.count());
        stats.put("totalUsers", userRepository.count());
        
        return stats;
    }
}
