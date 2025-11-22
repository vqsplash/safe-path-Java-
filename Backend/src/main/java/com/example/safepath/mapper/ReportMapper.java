package com.example.safepath.mapper;

import com.example.safepath.dto.LocationDto;
import com.example.safepath.dto.ReportDto;
import com.example.safepath.entity.Location;
import com.example.safepath.entity.Report;

public class ReportMapper {
    public static ReportDto toDto(Report r) {
        if (r == null) return null;
        ReportDto dto = new ReportDto();
        dto.setId(r.getId());
        dto.setIncidentType(r.getIncidentType());
        dto.setDescription(r.getDescription());
        dto.setDateTime(r.getDateTime());
        dto.setSubmittedAt(r.getSubmittedAt());
        dto.setStatus(r.getStatus());
        dto.setAssignedNgo(r.getAssignedNgo());
        if (r.getLocation() != null) {
            LocationDto ld = new LocationDto();
            Location l = r.getLocation();
            ld.setId(l.getId());
            ld.setLatitude(l.getLatitude());
            ld.setLongitude(l.getLongitude());
            ld.setDisplayName(l.getDisplayName());
            dto.setLocation(ld);
        }
        return dto;
    }

    public static Report toEntity(ReportDto dto, Location locationEntity) {
        if (dto == null) return null;
        Report r = new Report();
        r.setIncidentType(dto.getIncidentType());
        r.setDescription(dto.getDescription());
        r.setDateTime(dto.getDateTime());
        r.setStatus(dto.getStatus() == null ? "pending" : dto.getStatus());
        r.setAssignedNgo(dto.getAssignedNgo());
        r.setLocation(locationEntity);
        return r;
    }

    public static Location toLocationEntity(LocationDto dto) {
        if (dto == null) return null;
        Location l = new Location();
        l.setLatitude(dto.getLatitude());
        l.setLongitude(dto.getLongitude());
        l.setDisplayName(dto.getDisplayName());
        return l;
    }
}
