package com.hotelbooking.service;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.Room;
import com.hotelbooking.model.User;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final RoomRepository roomRepo;
    private final UserRepository userRepo;

    public BookingService(BookingRepository bookingRepo, RoomRepository roomRepo, UserRepository userRepo) {
        this.bookingRepo = bookingRepo;
        this.roomRepo = roomRepo;
        this.userRepo = userRepo;
    }

    
    // Make booking with availability and payment checks
    public Booking makeBooking(Booking booking) {
    Room room = booking.getRoom();
    User customer = booking.getCustomer();
    
 // ✅ Check date range
    if (customer == null) {
        throw new RuntimeException("Customer is required for booking.");
    }

    if (!booking.isValidDateRange()) {
        throw new RuntimeException("Invalid date range: check-in must be before check-out.");
    }

    // ✅ Check availability (includes maintenance flag now)
    if (!isRoomAvailable(room.getId(), booking.getCheckIn(), booking.getCheckOut())) {
        throw new RuntimeException("Room is not available.");
    }

    // ✅ Calculate price
    long nights = ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
    if (nights <= 0) throw new RuntimeException("Invalid date range.");
    double basePrice = room.getRatePerNight() * nights;
    double totalPrice = basePrice - (basePrice * room.getDiscount() / 100);

    // ✅ Payment check
    String method = booking.getPaymentMethod();
    	if ("CASH".equalsIgnoreCase(method)) {
        booking.setPaymentStatus(true); // Paid on spot
    	} else if ("ACCOUNT".equalsIgnoreCase(method)) {
        if (customer.getAccountBalance() >= totalPrice) {
            customer.setAccountBalance(customer.getAccountBalance() - totalPrice);
            booking.setPaymentStatus(true);
        } else {
            throw new RuntimeException("Insufficient account balance.");
        }
    } else if ("CARD".equalsIgnoreCase(method)) {
        // Simulate success
        booking.setPaymentStatus(true);
    } else {
        throw new RuntimeException("Unsupported payment method.");
    }

    booking.setTotalPrice(totalPrice);
    return bookingRepo.save(booking);
}


    // Check if room available for given dates
    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 🚨 Check the availability flag
        if (!room.isAvailable()) {
            return false; // Room is disabled for booking
        }

        // 🚨 Check date overlaps
        List<Booking> bookings = bookingRepo.findByRoomId(roomId);
        for (Booking booking : bookings) {
            if (!(checkOut.isBefore(booking.getCheckIn()) || checkIn.isAfter(booking.getCheckOut()))) {
                return false;
            }
        }
        return true;
    }


    // Admin: get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    // Get booking by ID (used by both admin and customer with controller filters)
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepo.findById(id);
    }

    // Get bookings by username (optional, keep for compatibility)
    public List<Booking> getBookingsByUsername(String username) {
        User user = userRepo.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found: " + username);
        return bookingRepo.findByCustomer(user);
    }

    // Get bookings by user ID - safer for filtering customer bookings
    public List<Booking> getBookingsByUserId(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return bookingRepo.findByCustomer(user);
    }

    // Update booking
    public Optional<Booking> updateBooking(Long id, Booking updatedBooking) {
        return bookingRepo.findById(id).map(existing -> {
            existing.setRoom(updatedBooking.getRoom());
            existing.setCustomer(updatedBooking.getCustomer());
            existing.setCheckIn(updatedBooking.getCheckIn());
            existing.setCheckOut(updatedBooking.getCheckOut());
            existing.setPaymentMethod(updatedBooking.getPaymentMethod());
            existing.setPaymentStatus(updatedBooking.isPaymentStatus());
            existing.setTotalPrice(updatedBooking.getTotalPrice());
            return bookingRepo.save(existing);
        });
    }

    // Delete booking by id
    public boolean deleteBooking(Long id) {
        if (bookingRepo.existsById(id)) {
            bookingRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
