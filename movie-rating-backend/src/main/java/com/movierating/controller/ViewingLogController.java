package com.movierating.controller;

import com.movierating.model.ViewingLog;
import com.movierating.service.ViewingLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/history")
public class ViewingLogController {

    @Autowired
    private ViewingLogService viewingLogService;

    @PostMapping("/{userId}/log/{contentId}")
    public ResponseEntity<ViewingLog> logViewing(
            @PathVariable Long userId,
            @PathVariable Long contentId,
            @RequestBody(required = false) ViewingLog logData) {
        return ResponseEntity.ok(viewingLogService.logViewing(userId, contentId, logData));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ViewingLog>> getUserHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(viewingLogService.getUserHistory(userId));
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearHistory(@PathVariable Long userId) {
        viewingLogService.clearHistory(userId);
        return ResponseEntity.ok().build();
    }
}
