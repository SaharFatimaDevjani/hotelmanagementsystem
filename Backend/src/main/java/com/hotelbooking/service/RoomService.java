package com.hotelbooking.service;

import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.model.Room;
import com.hotelbooking.repository.RoomRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepo;

    public RoomService(RoomRepository roomRepo) {
        this.roomRepo = roomRepo;
    }

    public List<Room> getAllRooms() {
        return roomRepo.findAll();
    }

    public Room addRoom(Room room) {
        return roomRepo.save(room);
    }

    public Room updateRoom(Long id, Room updatedRoom) {
        Room room = roomRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        room.setRoomNumber(updatedRoom.getRoomNumber());
        room.setType(updatedRoom.getType());
        room.setCapacity(updatedRoom.getCapacity());
        room.setRatePerNight(updatedRoom.getRatePerNight());
        room.setDiscount(updatedRoom.getDiscount());
        room.setDescription(updatedRoom.getDescription());
        room.setAvailable(updatedRoom.isAvailable());

        return roomRepo.save(room);
    }

    public void deleteRoom(Long id) {
        if (!roomRepo.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id " + id);
        }
        roomRepo.deleteById(id);
    }

    public Room getRoomById(Long id) {
        return roomRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id " + id));
    }
}
