import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import RoomList from "./Components/RoomList";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminPanel from "./Pages/AdminPanel";
import Dashboard from "./Components/Dashboard";
import ErrorBoundary from "./Components/ErrorBoundary";
import AddRoomPage from "./Pages/AddRoomPage";
import EditRoomPage from "./Pages/EditRoomPage";
import AddUserPage from "./Pages/AddUserPage";
import EditUserPage from "./Pages/EditUserPage";
import AddBookingPage from "./Pages/AddBookingPage";
import EditBookingPage from "./Pages/EditBookingPage";
import BookingList from "./Components/BookingList";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/rooms/add" element={<AddRoomPage />} />
          <Route path="/admin/rooms/:id" element={<EditRoomPage />} />
          <Route path="/admin/users/add" element={<AddUserPage />} />
          <Route path="/admin/users/edit/:id" element={<EditUserPage />} />
          <Route path="/admin/bookings/add" element={<AddBookingPage />} />
          <Route path="/admin/bookings/edit/:id" element={<EditBookingPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;