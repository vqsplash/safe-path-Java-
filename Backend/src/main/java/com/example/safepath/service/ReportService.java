package com.example.safepath.service;

import com.example.safepath.dto.LocationDto;
import com.example.safepath.dto.ReportDto;
import com.example.safepath.entity.Location;
import com.example.safepath.entity.Report;
import com.example.safepath.mapper.ReportMapper;
import com.example.safepath.repository.LocationRepository;
import com.example.safepath.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private LocationRepository locationRepository;

    public ReportDto createReport(ReportDto dto) {
        // create or reuse location
        Location locationEntity = null;
        if (dto.getLocation() != null) {
            LocationDto ld = dto.getLocation();
            // if id present, try to reuse
            if (ld.getId() != null) {
                Optional<Location> opt = locationRepository.findById(ld.getId());
                locationEntity = opt.orElse(ReportMapper.toLocationEntity(ld));
            } else {
                locationEntity = ReportMapper.toLocationEntity(ld);
            }
            locationEntity = locationRepository.save(locationEntity);
        }
        Report r = ReportMapper.toEntity(dto, locationEntity);
        if (r.getSubmittedAt() == null) r.setSubmittedAt(LocalDateTime.now());
        Report saved = reportRepository.save(r);
        return ReportMapper.toDto(saved);
    }

    public List<ReportDto> getAllReports() {
        return reportRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .map(ReportMapper::toDto)
                .collect(Collectors.toList());
    }

    public ReportDto updateReport(Long id, ReportDto dto) {
        Optional<Report> opt = reportRepository.findById(id);
        if (opt.isEmpty()) return null;
        Report r = opt.get();
        // update fields
        r.setIncidentType(dto.getIncidentType());
        r.setDescription(dto.getDescription());
        r.setDateTime(dto.getDateTime());
        r.setAssignedNgo(dto.getAssignedNgo());
        if (dto.getStatus() != null) r.setStatus(dto.getStatus());

        if (dto.getLocation() != null) {
            LocationDto ld = dto.getLocation();
            Location loc;
            if (ld.getId() != null) {
                loc = locationRepository.findById(ld.getId()).orElse(ReportMapper.toLocationEntity(ld));
            } else {
                loc = ReportMapper.toLocationEntity(ld);
            }
            loc = locationRepository.save(loc);
            r.setLocation(loc);
        }

        Report saved = reportRepository.save(r);
        return ReportMapper.toDto(saved);
    }

    public boolean deleteReport(Long id) {
        if (!reportRepository.existsById(id)) return false;
        reportRepository.deleteById(id);
        return true;
    }

    public Page<ReportDto> getAcceptedOrSolved(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ReportDto> p = reportRepository.findAll(pageable)
                .map(ReportMapper::toDto); // fallback
        // We need only accepted/solved
        List<String> wanted = Arrays.asList("accepted", "solved");
        List<Report> filtered = reportRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream().filter(r -> wanted.contains(r.getStatus())).collect(Collectors.toList());
        int start = Math.min(page * size, filtered.size());
        int end = Math.min(start + size, filtered.size());
        List<ReportDto> content = filtered.subList(start, end).stream().map(ReportMapper::toDto).collect(Collectors.toList());
        return new PageImpl<>(content, pageable, filtered.size());
    }

    public boolean updateStatus(Long id, String status) {
        Optional<Report> opt = reportRepository.findById(id);
        if (opt.isEmpty()) return false;
        Report r = opt.get();
        r.setStatus(status);
        reportRepository.save(r);
        return true;
    }

    public Map<String, Long> getStatusCounts() {
        List<Report> all = reportRepository.findAll();
        Map<String, Long> map = new HashMap<>();
        for (Report r: all) {
            map.put(r.getStatus(), map.getOrDefault(r.getStatus(), 0L) + 1L);
        }
        return map;
    }

    public Map<String, Long> getTypeCounts() {
        List<Report> all = reportRepository.findAll();
        Map<String, Long> map = new HashMap<>();
        for (Report r: all) {
            map.put(r.getIncidentType(), map.getOrDefault(r.getIncidentType(), 0L) + 1L);
        }
        return map;
    }

    public long getTotalReports() { return reportRepository.count(); }

    public List<ReportDto> getRecentReports(int n) {
        return reportRepository.findAll(Sort.by(Sort.Direction.DESC, "submittedAt"))
                .stream().limit(n).map(ReportMapper::toDto).collect(Collectors.toList());
    }
}
