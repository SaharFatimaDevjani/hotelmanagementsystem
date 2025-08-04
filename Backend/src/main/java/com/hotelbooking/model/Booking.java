package com.hotelbooking.model;


import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
public class Booking {
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private Long id;
		
		@ManyToOne
		private User customer;
		
		@ManyToOne
		private Room room;
		
		private LocalDate checkIn;
		private LocalDate checkOut;
		private double totalPrice;
		private String paymentMethod;
		private boolean paymentStatus;
		
		public Long getId() {
			return id;
		}
		
		public User getCustomer() {
			return customer;
		}
		
		public void setCustomer(User customer) {
			this.customer = customer;
		}
		
		public Room getRoom() {
			return room;
		}
		
		public void setRoom(Room room) {
			this.room = room;
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
		
		public double getTotalPrice() {
			return totalPrice;
		}
		
		public void setTotalPrice(double totalPrice) {
			this.totalPrice = totalPrice;
		}
		
		public String getPaymentMethod() {
			return paymentMethod;
		}
		
		public void setPaymentMethod(String paymentMethod) {
			this.paymentMethod = paymentMethod;
		}
		
		public boolean isPaymentStatus() {
			return paymentStatus;
		}
		
		public void setPaymentStatus(boolean paymentStatus) {
			this.paymentStatus = paymentStatus;
		}
		
		public boolean isValidDateRange() {
	        return checkIn != null && checkOut != null && checkIn.isBefore(checkOut);
	    }
}
