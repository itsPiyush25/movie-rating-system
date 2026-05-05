package com.movierating.controller;

import com.movierating.model.Content;
import com.movierating.model.ContentType;
import com.movierating.service.ContentService;
import com.movierating.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/import")
public class ImportController {

    @Autowired
    private ContentService contentService;

    @Autowired
    private WatchlistService watchlistService;

    @PostMapping("/content/csv")
    public ResponseEntity<Map<String, Object>> importContentCsv(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        List<Content> importedContent = new ArrayList<>();
        int successCount = 0;
        int failCount = 0;

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue; // Skip header
                }
                String[] data = line.split(",");
                if (data.length >= 2) {
                    try {
                        Content content = Content.builder()
                                .title(data[0].trim())
                                .contentType(ContentType.valueOf(data[1].trim().toUpperCase()))
                                .releaseYear(data.length > 2 ? Integer.parseInt(data[2].trim()) : null)
                                .description(data.length > 3 ? data[3].trim() : "")
                                .build();
                        importedContent.add(contentService.createContent(content));
                        successCount++;
                    } catch (Exception e) {
                        failCount++;
                    }
                }
            }
            response.put("successCount", successCount);
            response.put("failCount", failCount);
            response.put("message", "Import completed");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to process CSV: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
