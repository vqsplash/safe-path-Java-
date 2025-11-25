package com.example.safepath.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "user_tokens")
public class UserToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(unique = true, nullable = false)
    private String token;

    @PrePersist
    public void prePersist() {
        if (token == null) {
            token = UUID.randomUUID().toString(); // generate random token
        }
    }
}
