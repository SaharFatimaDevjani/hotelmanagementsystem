import React from 'react';
import RoomList from '../Components/RoomList';

const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold p-4">Welcome to Hotel Booking</h1>
      <RoomList />
    </div>
  );
};

export default Home;