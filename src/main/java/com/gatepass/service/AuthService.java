package com.gatepass.service;

import com.gatepass.dto.*;
import com.gatepass.entity.User;
import com.gatepass.exception.BadRequestException;
import com.gatepass.repository.UserRepository;
import com.gatepass.security.JwtUtils;
import com.gatepass.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtils jwtUtils;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email)) {
            throw new BadRequestException("Email already in use");
        }
        if (req.role == User.Role.admin) {
            throw new BadRequestException("Admin registration not allowed");
        }

        User user = User.builder()
            .name(req.name)
            .email(req.email.toLowerCase())
            .password(passwordEncoder.encode(req.password))
            .role(req.role != null ? req.role : User.Role.student)
            .department(req.department)
            .registerNumber(req.registerNumber)
            .year(req.year)
            .phone(req.phone)
            .build();

        userRepository.save(user);

        String token = jwtUtils.generateTokenFromEmail(user.getEmail());
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(),
                                user.getRole().name(), user.getDepartment(), token);
    }

    public AuthResponse login(LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email, req.password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(userDetails.getId(), userDetails.getName(),
                                userDetails.getUsername(), userDetails.getRole(),
                                user.getDepartment(), token);
    }
}
