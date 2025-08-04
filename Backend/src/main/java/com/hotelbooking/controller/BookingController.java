package com.hotelbooking.controller;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.BookingDTO;
import com.hotelbooking.model.Room;
import com.hotelbooking.model.User;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;


import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepo;
    private final RoomRepository roomRepo;

    public BookingController(BookingService bookingService, UserRepository userRepo, RoomRepository bookingRepo) {
        this.bookingService = bookingService;
        this.userRepo = userRepo;
        this.roomRepo = bookingRepo;
    }

    // Admin: get all bookings
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // Customer: get own bookings
    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Booking> getBookingsForCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepo.findByUsername(username);
        return bookingService.getBookingsByUsername(user.getUsername());
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id, Authentication authentication) {
        Optional<Booking> bookingOpt = bookingService.getBookingById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();

            String username = authentication.getName();
            User user = userRepo.findByUsername(username);

            // Admin can see all bookings
            if (user.getRole().equalsIgnoreCase("ADMIN")) {
                return ResponseEntity.ok(booking);
            }

            // Customer can see only own booking
            if (booking.getCustomer().getId().equals(user.getId())) {
                return ResponseEntity.ok(booking);
            }

            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Booking> makeBooking(@Valid @RequestBody BookingDTO bookingDTO, Authentication authentication) {
        String username = authentication.getName();
        User customer = userRepo.findByUsername(username);

        Room room = roomRepo.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setRoom(room);
        booking.setCheckIn(bookingDTO.getCheckIn());
        booking.setCheckOut(bookingDTO.getCheckOut());
        booking.setPaymentMethod(bookingDTO.getPaymentMethod());

        if (!booking.isValidDateRange()) {
            return ResponseEntity.badRequest().body(null);
        }

        Booking savedBooking = bookingService.makeBooking(booking);
        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepo.findByUsername(username);

        Optional<Booking> existingBookingOpt = bookingService.getBookingById(id);

        if (existingBookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking existingBooking = existingBookingOpt.get();

        if (user.getRole().equalsIgnoreCase("ADMIN") || existingBooking.getCustomer().getId().equals(user.getId())) {
            Optional<Booking> updatedOpt = bookingService.updateBooking(id, updatedBooking);
            return updatedOpt
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id, Authentication authentication) {
        return bookingService.getBookingById(id).map(existingBooking -> {
            String username = authentication.getName();
            User user = userRepo.findByUsername(username);

            if (user.getRole().equalsIgnoreCase("ADMIN") || existingBooking.getCustomer().getId().equals(user.getId())) {
                bookingService.deleteBooking(id);
                return ResponseEntity.ok("Booking deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
            }
        }).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/admin/book")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> adminBookRoom(@RequestBody BookingDTO bookingDTO) {
        Room room = roomRepo.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User walkinUser = userRepo.findByUsername("WALKIN");
        if (walkinUser == null) {
            throw new RuntimeException("Walk-In user not found. Please restart the application.");
        }

        Booking booking = new Booking();
        booking.setCustomer(walkinUser);
        booking.setRoom(room);
        booking.setCheckIn(bookingDTO.getCheckIn());
        booking.setCheckOut(bookingDTO.getCheckOut());
        booking.setPaymentMethod(bookingDTO.getPaymentMethod());
        booking.setPaymentStatus(true); // Assume paid for walk-in as they will pay physically

        Booking saved = bookingService.makeBooking(booking);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }



    
}
