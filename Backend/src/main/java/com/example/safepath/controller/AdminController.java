package com.example.safepath.controller;

import com.example.safepath.dto.ReportDto;
import com.example.safepath.entity.Report;
import com.example.safepath.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private ReportService service;

    @PostMapping("/report/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable("id") Long id) {
        boolean ok = service.updateStatus(id, "accepted");
        if (!ok) return ResponseEntity.status(404).body(Map.of("success", false, "message", "Report not found"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Report accepted successfully"));
    }

    @PostMapping("/report/{id}/solve")
    public ResponseEntity<?> solve(@PathVariable("id") Long id) {
        boolean ok = service.updateStatus(id, "solved");
        if (!ok) return ResponseEntity.status(404).body(Map.of("success", false, "message", "Report not found"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Report marked as solved successfully"));
    }

    @PostMapping("/report/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable("id") Long id) {
        boolean ok = service.updateStatus(id, "rejected");
        if (!ok) return ResponseEntity.status(404).body(Map.of("success", false, "message", "Report not found"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Report rejected successfully"));
    }

    // dashboard summary
    @GetMapping("/dashboard/summary")
    public ResponseEntity<?> dashboardSummary() {
        long total = service.getTotalReports();
        Map<String, Long> statusSummary = service.getStatusCounts();
        Map<String, Long> typeSummary = service.getTypeCounts();
        List<ReportDto> recent = service.getRecentReports(5);



        return ResponseEntity.ok(Map.of(
                "total_reports", total,
                "status_summary", statusSummary,
                "type_summary", typeSummary,
                "recent_reports", recent
        ));
    }
}
