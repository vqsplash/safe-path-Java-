package com.example.safepath.service;

import com.example.safepath.entity.User;
import com.example.safepath.entity.UserToken;
import com.example.safepath.repository.UserRepository;
import com.example.safepath.repository.UserTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<UserToken> login(String username, String rawPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return Optional.empty();

        User user = userOpt.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) return Optional.empty();

        // get or create token
        Optional<UserToken> tokenOpt = tokenRepository.findByUser(user);
        if (tokenOpt.isPresent()) return tokenOpt;

        UserToken token = new UserToken();
        token.setUser(user);
        tokenRepository.save(token);
        return Optional.of(token);
    }

    public void logout(String tokenStr) {
        tokenRepository.findByToken(tokenStr).ifPresent(tokenRepository::delete);
    }

    public Optional<User> getUserByToken(String tokenStr) {
        return tokenRepository.findByToken(tokenStr).map(UserToken::getUser);
    }
    public boolean registerUser(String username, String rawPassword) {
    if (userRepository.findByUsername(username).isPresent()) {
        return false; 
    }
    User user = new User();
    user.setUsername(username);
    user.setPassword(passwordEncoder.encode(rawPassword));
    userRepository.save(user);
    return true;
}

}
