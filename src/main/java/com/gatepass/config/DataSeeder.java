package com.gatepass.config;

import com.gatepass.entity.User;
import com.gatepass.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin if not exists
        if (!userRepository.existsByEmail("admin@gatepass.com")) {
            User admin = User.builder()
                .name("System Administrator")
                .email("admin@gatepass.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.admin)
                .department("Administration")
                .build();
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin@gatepass.com / admin123");
        } else {
            // Update existing admin password to ensure it's correct
            User admin = userRepository.findByEmail("admin@gatepass.com").get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("✅ Admin password reset: admin@gatepass.com / admin123");
        }
    }
}
