package com.example.safepath.controller;

import com.example.safepath.dto.ReportDto;
import com.example.safepath.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReportController {
    @Autowired
    private ReportService service;

    // Create
    @PostMapping("/report/create")
    public ResponseEntity<?> createReport(@RequestBody ReportDto dto) {
        ReportDto saved = service.createReport(dto);
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("message", "Report created successfully");
        body.put("data", saved);
        return ResponseEntity.status(201).body(body);
    }

    // Get all
    @GetMapping("/report/get-all-reports")
    public ResponseEntity<?> getAllReports() {
        List<ReportDto> list = service.getAllReports();
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("data", list);
        return ResponseEntity.ok(body);
    }

    // Update
    @PutMapping("/report/{id}/update")
    public ResponseEntity<?> updateReport(@PathVariable("id") Long id, @RequestBody ReportDto dto) {
        ReportDto updated = service.updateReport(id, dto);
        if (updated == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Report not found"));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Report updated successfully", "data", updated));
    }

    // Delete
    @DeleteMapping("/report/{id}/delete")
    public ResponseEntity<?> deleteReport(@PathVariable("id") Long id) {
        boolean ok = service.deleteReport(id);
        if (!ok) return ResponseEntity.status(404).body(Map.of("success", false, "message", "Report not found"));
        return ResponseEntity.status(204).body(Map.of("success", true, "message", "Report deleted successfully"));
    }

    // Accepted/solved with pagination
    @GetMapping("/report/get-all-accepted-reports")
    public ResponseEntity<?> getAcceptedSolved(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int page_size) {
        Page<ReportDto> p = service.getAcceptedOrSolved(page, page_size);
        return ResponseEntity.ok(Map.of(
                "count", p.getTotalElements(),
                "next", null,
                "previous", null,
                "results", p.getContent()
        ));
    }

    // statistics
    @GetMapping("/report/get-report-statistics")
    public ResponseEntity<?> getStatistics() {
        long total = service.getTotalReports();
        Map<String, Long> statusCounts = service.getStatusCounts();
        long pending = statusCounts.getOrDefault("pending", 0L);
        long accepted = statusCounts.getOrDefault("accepted", 0L);
        long solved = statusCounts.getOrDefault("solved", 0L);
        long rejected = statusCounts.getOrDefault("rejected", 0L);

        Map<String, Object> data = new HashMap<>();
        data.put("total_reports", total);
        data.put("pending_reports", pending);
        data.put("accepted_reports", accepted);
        data.put("solved_reports", solved);
        data.put("rejected_reports", rejected);

        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }
}
