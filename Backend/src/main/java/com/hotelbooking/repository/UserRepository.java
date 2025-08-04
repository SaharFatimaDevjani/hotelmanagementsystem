package com.hotelbooking.repository;


import com.hotelbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
	User findByUsername(String username);
}
