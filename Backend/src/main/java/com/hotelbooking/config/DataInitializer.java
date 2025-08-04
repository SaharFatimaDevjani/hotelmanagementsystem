package com.hotelbooking.config;

import com.hotelbooking.model.User;
import com.hotelbooking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public void run(String... args) {
        if (userRepo.findByUsername("WALKIN") == null) {
            User walkinUser = new User();
            walkinUser.setUsername("WALKIN");
            walkinUser.setPassword(passwordEncoder.encode("walkin123")); // dummy password
            walkinUser.setRole("CUSTOMER");
            userRepo.save(walkinUser);
            System.out.println("✅ Walk-In user created!");
        }
    }
}
