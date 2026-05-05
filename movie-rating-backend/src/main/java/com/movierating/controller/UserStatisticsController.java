package com.movierating.controller;

import com.movierating.service.UserStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/stats")
public class UserStatisticsController {

    @Autowired
    private UserStatisticsService userStatisticsService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable Long userId) {
        return ResponseEntity.ok(userStatisticsService.getUserStats(userId));
    }
}
