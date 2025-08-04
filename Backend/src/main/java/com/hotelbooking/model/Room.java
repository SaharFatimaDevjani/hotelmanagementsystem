package com.hotelbooking.model;

import jakarta.persistence.*;


@Entity
public class Room {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String roomNumber;
	private String type;
	private int capacity;
	private double ratePerNight;
	private double discount;
	private String description;
	private boolean available = true;

	
	
	public Long getId() {
		return id;
	}
	
	public String getRoomNumber() {
		return roomNumber;
	}
	
	public void setRoomNumber(String roomNumber) {
		this.roomNumber = roomNumber;
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public int getCapacity() {
		return capacity;
	}
	
	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}
	
	public double getRatePerNight() {
		return ratePerNight;
	}
	
	public void setRatePerNight(double ratePerNight) {
		this.ratePerNight = ratePerNight;
	}
	
	public double getDiscount() {
		return discount;
	}
	
	public void setDiscount(double discount) {
		this.discount = discount;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public boolean isAvailable() {
		return available;
	}
	public void setAvailable(boolean available) {
		this.available = available;
	}
	
	
}
