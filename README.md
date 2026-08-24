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

## What's Not Working / Verified Issues

These were confirmed by actually building and running the project, not just reading the code:

1. **Backend test suite fails to run.** `Backend/src/test/java/com/example/demo/HotelBookingSystemApplicationTests.java` is in package `com.example.demo`, but the application lives in `com.hotelbooking`. `@SpringBootTest` searches upward from the test's own package for a `@SpringBootConfiguration` and can't find one, so `./mvnw test` throws `IllegalStateException` and the build fails outright. Fix: move the test to `com.hotelbooking` (or add `@SpringBootTest(classes = HotelBookingSystemApplication.class)`).

2. **`@PreAuthorize` role checks are silently ignored.** Every controller uses `@PreAuthorize("hasRole('ADMIN')")` etc., but no config class has `@EnableMethodSecurity`. Without it, Spring Security 6 never evaluates these annotations — they're inert. Combined with `SecurityConfig` only requiring `.anyRequest().authenticated()`, **any authenticated user (a plain CUSTOMER) can currently call admin-only endpoints** (create/delete rooms, list/create/delete users, view all bookings, walk-in booking) directly via the API, bypassing the UI's client-side role redirect entirely. This is the most important fix in the repo.

3. **Frontend admin "Edit Room" is a dead link.** `AdminRoomsTab.jsx` navigates to `/admin/rooms/edit/:id`, but the only registered route is `/admin/rooms/:id` (`App.jsx`). Clicking "Edit" on a room in the admin panel does not match any route, so nothing renders.

4. **`Pages/Dashboard.jsx` doesn't compile / isn't used.** It both imports `Dashboard` from `Components/Dashboard` and declares its own local `const Dashboard`, which is an illegal duplicate identifier (ESLint fails with a parse error). It's dead code — `App.jsx` routes `/dashboard` straight to `Components/Dashboard` instead — so it can be deleted.

5. **`npm run lint` fails (2 errors).** The `Pages/Dashboard.jsx` parse error above, plus an unused `err` variable in `Pages/AdminPanel.jsx`'s catch block.

6. **Hardcoded secrets and credentials.** The JWT signing key is a hardcoded string literal in `JwtUtil.java`, and the MySQL username/password are committed in plaintext in `application.properties`. Fine for local dev, unsafe to ship — both should move to environment variables.

7. **Inconsistent/leftover config.** `application.properties` sets `spring.h2.console.enabled=true` while the app is wired to MySQL, not H2 — that line has no effect and is leftover from a template. `CorsConfig` hardcodes `http://localhost:5173` as the only allowed origin, so any other frontend origin (a deployed build, a different dev port) is blocked by default.

8. **Several admin pages are orphaned.** `AddUserPage`, `EditUserPage`, `AddBookingPage`, `EditBookingPage` are routed in `App.jsx` but never linked to from the UI — `AdminUsersTab` does user add/edit inline instead, and there's no "add/edit booking" entry point in `AdminBookingsTab`. Either wire them up or remove them.

## Suggested Priorities

1. Add `@EnableMethodSecurity` (security-critical — this is a real access-control bug, not just a code-quality issue).
2. Fix the test package mismatch so CI/`mvnw test` actually runs and passes.
3. Fix or remove the broken "Edit Room" link and delete dead `Pages/Dashboard.jsx`.
4. Move the JWT secret and DB credentials to environment variables (e.g. `application.properties` → `${JWT_SECRET}`, `${DB_PASSWORD}`).
5. Clean up the two ESLint errors and orphaned admin pages.
6. Longer term: add integration tests around booking overlap logic and role-based access, and make CORS origins configurable per environment.

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

Note: as described above, the "Admin" access column is currently **not enforced server-side** due to the missing `@EnableMethodSecurity` — only the `authenticated()` check applies today.
