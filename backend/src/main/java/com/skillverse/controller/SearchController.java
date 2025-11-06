package com.skillverse.controller;

import com.skillverse.dto.SearchDtos.SearchResponseDto;
import com.skillverse.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired private SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResponseDto> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(searchService.search(query));
    }
}