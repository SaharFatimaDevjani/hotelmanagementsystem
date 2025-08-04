package com.hotelbooking.model;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;


public class BookingDTO {
	@NotNull
    private Long roomId;
	
	@NotNull
    private LocalDate checkIn;
	
	@NotNull
    private LocalDate checkOut;
	
	@NotNull
    private String paymentMethod;

    public Long getRoomId() {
        return roomId;
    }
    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }
    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }
    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
   
}
