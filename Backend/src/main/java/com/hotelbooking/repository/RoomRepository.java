package com.hotelbooking.repository;


import com.hotelbooking.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RoomRepository extends JpaRepository<Room, Long> {
	
}
