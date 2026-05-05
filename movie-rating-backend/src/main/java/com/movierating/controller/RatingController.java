package com.movierating.controller;

import com.movierating.model.Rating;
import com.movierating.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping("/{userId}/rate/{contentId}")
    public ResponseEntity<Rating> rateContent(
            @PathVariable Long userId,
            @PathVariable Long contentId,
            @RequestBody Map<String, Object> ratingData) {
        
        Integer score = (Integer) ratingData.get("score");
        String comment = (String) ratingData.get("comment");
        
        return ResponseEntity.ok(ratingService.createOrUpdateRating(userId, contentId, score, comment));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getUserRatings(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getUserRatings(userId));
    }

    @GetMapping("/content/{contentId}")
    public ResponseEntity<List<Rating>> getContentRatings(@PathVariable Long contentId) {
        return ResponseEntity.ok(ratingService.getContentRatings(contentId));
    }

    @GetMapping("/content/{contentId}/distribution")
    public ResponseEntity<List<Object[]>> getRatingDistribution(@PathVariable Long contentId) {
        return ResponseEntity.ok(ratingService.getRatingDistribution(contentId));
    }

    @DeleteMapping("/{userId}/remove/{contentId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long userId, @PathVariable Long contentId) {
        ratingService.deleteRating(userId, contentId);
        return ResponseEntity.ok().build();
    }
}
