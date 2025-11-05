package com.skillverse.controller;

import com.skillverse.dto.ReportDto;
import com.skillverse.exception.ResourceNotFoundException;
import com.skillverse.model.entity.Report;
import com.skillverse.model.entity.User;
import com.skillverse.repository.ReportRepository;
import com.skillverse.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired private ReportRepository reportRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Void> submitReport(@Valid @RequestBody ReportDto reportDto, Authentication authentication) {
        String reporterEmail = authentication.getName();
        User reporter = userRepository.findByEmail(reporterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", reporterEmail));

        User reportedUser = userRepository.findById(reportDto.reportedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reportDto.reportedUserId()));

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedUser(reportedUser);
        report.setReason(reportDto.reason());

        reportRepository.save(report);

        return ResponseEntity.ok().build();
    }
}