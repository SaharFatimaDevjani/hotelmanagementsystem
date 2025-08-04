package com.hotelbooking.controller;

import com.hotelbooking.model.User;
import com.hotelbooking.model.UserDTO;
import com.hotelbooking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // ✅ Admin: Get all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // ✅ Public: Register (always CUSTOMER)
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        if (userRepo.findByUsername(userDTO.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists.");
        }
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole("CUSTOMER");
        userRepo.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // ✅ Admin: Create user with any role
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createUser(@RequestBody UserDTO userDTO) {
        if (userRepo.findByUsername(userDTO.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists.");
        }
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(userDTO.getRole().toUpperCase());
        userRepo.save(user);
        return ResponseEntity.ok("User created with role: " + userDTO.getRole());
    }

    // ✅ Admin: Add balance
    @PutMapping("/{id}/balance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addBalance(@PathVariable Long id, @RequestParam double amount) {
        if (amount <= 0) {
            return ResponseEntity.badRequest().body("Amount must be positive.");
        }
        return userRepo.findById(id).map(user -> {
            user.setAccountBalance(user.getAccountBalance() + amount);
            userRepo.save(user);
            return ResponseEntity.ok("Balance updated. New balance: " + user.getAccountBalance());
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get user by ID (admin or self)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<User> getUserById(@PathVariable Long id, Authentication authentication) {
        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        String currentUsername = authentication.getName();
        User currentUser = userRepo.findByUsername(currentUsername);

        if (currentUser.getRole().equalsIgnoreCase("ADMIN") || currentUser.getId().equals(user.getId())) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // ✅ Update user (admin or self)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO, Authentication authentication) {
        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOpt.get();

        String currentUsername = authentication.getName();
        User currentUser = userRepo.findByUsername(currentUsername);

        if (currentUser.getRole().equalsIgnoreCase("ADMIN") || currentUser.getId().equals(user.getId())) {
            user.setUsername(userDTO.getUsername());
            
            // 🚨 Only update password if not blank
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }

            userRepo.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }


    // ✅ Delete user (admin or self)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id, Authentication authentication) {
        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        String currentUsername = authentication.getName();
        User currentUser = userRepo.findByUsername(currentUsername);

        if (currentUser.getRole().equalsIgnoreCase("ADMIN") || currentUser.getId().equals(user.getId())) {
            userRepo.deleteById(id);
            return ResponseEntity.ok("User deleted successfully.");
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
    }
}
