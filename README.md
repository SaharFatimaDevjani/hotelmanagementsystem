# Hotel Management System

A full-stack hotel booking application: a Spring Boot REST API backend with JWT authentication and MySQL persistence, and a React (Vite + Tailwind) frontend for customers and admins to browse rooms, make bookings, and manage the hotel.

## Tech Stack

**Backend**
- Java 17, Spring Boot 3.5.3
- Spring Web, Spring Data JPA, Spring Security
- MySQL (via `mysql-connector-j`)
- JWT auth (`io.jsonwebtoken` / jjwt 0.11.5)
- Maven (wrapper included, `./mvnw`)

**Frontend**
- React 19 + Vite 7
- React Router 7
- Tailwind CSS 4
- Axios, `jwt-decode`

## Project Structure

```
hotelmanagementsystem/
├── Backend/    Spring Boot REST API (com.hotelbooking)
│   └── src/main/java/com/hotelbooking/
│       ├── config/       Security, JWT, CORS, seed data
│       ├── controller/   REST endpoints (auth, users, rooms, bookings)
│       ├── model/        JPA entities + DTOs
│       ├── repository/   Spring Data repositories
│       ├── service/      Business logic
│       └── exception/    Global exception handler
└── Frontend/   React SPA (Vite)
    └── src/
        ├── Components/   Reusable UI (forms, lists, admin tabs, navbar)
        ├── Pages/        Routed pages
        └── Services/     Axios API client
```

## What's Working

- **Auth flow**: register (`/users/register`) → login (`/auth/login`) → JWT stored in `localStorage` → attached via Axios interceptor → decoded client-side to route admins vs. customers.
- **Room browsing & booking**: public room listing, booking form with date/payment-method validation, server-side overlap and availability checks, price calculation with per-room discount.
- **Payment methods**: `CASH` (paid on the spot), `ACCOUNT` (deducted from the user's stored balance), `CARD` (simulated success) — handled in `BookingService.makeBooking`.
- **Admin panel**: tabbed UI for managing rooms, users, and viewing all bookings, backed by full CRUD endpoints.
- **Walk-in bookings**: a seeded `WALKIN` user (`DataInitializer`) lets admins book rooms for customers without an account (`POST /bookings/admin/book`).
- **Validation & error handling**: `@Valid` on booking input, a `GlobalExceptionHandler` that turns exceptions into consistent JSON error responses.
- **Builds cleanly**: `./mvnw compile` and `npm run build` both succeed with no errors.

## Getting Started

### Prerequisites
- Java 17+
- MySQL running locally (or update `application.properties` to point elsewhere)
- Node.js 18+

### Backend

```bash
cd Backend
# create the database first: CREATE DATABASE hotel_db;
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`. Update `src/main/resources/application.properties` with your own MySQL username/password if they differ from `root` / `admin`. Tables are auto-created/updated via `spring.jpa.hibernate.ddl-auto=update`, and a default `WALKIN` user is seeded on startup.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` and talks to the backend at `http://localhost:8080` (see `src/Services/api.js`).

### Default accounts

No admin account is seeded — register a user via the UI, then manually update its `role` to `ADMIN` in the database (or use another admin account, once one exists, via `POST /users/admin`) to reach the admin panel.

## API Overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/users/register` | Public | Register as CUSTOMER |
| GET | `/users` | Admin | List all users |
| POST | `/users/admin` | Admin | Create user with any role |
| GET/PUT/DELETE | `/users/{id}` | Admin or self | Manage a user |
| PUT | `/users/{id}/balance` | Admin | Top up account balance |
| GET | `/rooms`, `/rooms/{id}` | Public | Browse rooms |
| POST/PUT/DELETE | `/rooms`, `/rooms/{id}` | Admin | Manage rooms |
| GET | `/bookings` | Customer | Own bookings |
| GET | `/bookings/all` | Admin | All bookings |
| GET/PUT/DELETE | `/bookings/{id}` | Admin or owner | Manage a booking |
| POST | `/bookings` | Customer | Make a booking |
| POST | `/bookings/admin/book` | Admin | Walk-in booking |
