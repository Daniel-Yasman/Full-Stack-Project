# Platter – Quick Reservation System

## Project Plan

**What does this app do?**
Clients reserve a table for a specific date and time.
Each reservation includes their email and phone number, which the host uses to confirm check-in quickly and accurately.

**Who is this for?**  
Busy professionals who want a fast, simple lunch without the usual delays.

**What problem does it solve?**  
It cuts average lunch wait times from around 30 minutes to under 5, saving valuable time and removing unnecessary hassle.

---

## MVP

**User registration**

- Provide name, email, phone, and password (limited checks, stored in the DB)
- One-time setup

**User Login**

- Email + Password (dummy email allowed, minimal validation)

**Make reservation**

- Logged-in user picks date/time, enters fake credit card, and submits
- Reservation is saved in the backend (user session stored in localStorage)

**View “My reservations”**

- Shows booking history (user-exclusive view for now)

**Cancel reservation**

- Users can request cancellation by phone (manual cancellation logic coming later)

---

## Data Models

**User**

- name
- email
- password
- phone

**Food**

- name

**Reservation**

- userId (ref: User)
- foodItem (ref: Food)
- date
- time
- creditCard
- createdAt

---

## API Endpoints

| METHOD | PATH              | DESCRIPTION                                      |
| ------ | ----------------- | ------------------------------------------------ |
| POST   | /api/register     | Register a new User                              |
| POST   | /api/login        | Login a User                                     |
| GET    | /api/food         | Get list of food items                           |
| POST   | /api/reservations | Create a new reservation (triggered by checkout) |
| GET    | /api/reservations | Get reservation history for the logged-in user   |

---

## Future Features (Post-MVP)

- Implement JWT that replaces localStorage
- Implement bcrypt for hashing
- Input validation (server-side)
- Role-based access (admin vs. user routes)
- Reservation cancelation via user
- Use date libraries like date-fns or moment for time handling
- Cart System
- Admin dashboard with CRUD capabilities
- Reservation success page (saved in Users page)
- Forgot password check
- User confirmation modal before canceling a reservation
- Manual QA testings (STP/STD/STR)
- Meals: Categories and types
- Basic search engine
- Ratings and feedback
- Review System
- News and Announcements
- Pretty & Fancy UI/UX
