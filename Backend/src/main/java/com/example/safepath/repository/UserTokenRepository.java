package com.example.safepath.repository;

import com.example.safepath.entity.UserToken;
import com.example.safepath.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {
    Optional<UserToken> findByToken(String token);
    Optional<UserToken> findByUser(User user);
}
