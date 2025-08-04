package com.hotelbooking.repository;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.Room;
import com.hotelbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomer(User customer);
    List<Booking> findByRoomId(long roomId);
}