# Wezeep – Backend & Mobile Integration Guide

This guide explains how to set up the development environment, run the Spring Boot backend and React Native (Expo) mobile app, and connect all flows end-to-end.

---

## 1. Prerequisites

- **Java 17+** (backend uses Java 25 in `pom.xml`; you can set `java.version` to 17 in `backend/pom.xml` if needed)
- **Maven 3.8+**
- **PostgreSQL 14+**
- **Node.js 18+** and **npm** or **bun**
- **Expo CLI** (`npm install -g expo-cli` or use `npx expo`)
- **Android Studio** / **Xcode** or **Expo Go** on a device for running the mobile app

---

## 2. Backend (Spring Boot) Setup

### 2.1 Database

1. Create a PostgreSQL database:
   ```bash
   createdb wezeep
   ```
2. Create a user (optional; can use default):
   ```sql
   CREATE USER wezeep WITH PASSWORD 'wezeep';
   GRANT ALL PRIVILEGES ON DATABASE wezeep TO wezeep;
   ```

### 2.2 Environment Variables

Create `backend/.env` or set in your shell:

```bash
# Database
export DATABASE_URL=jdbc:postgresql://localhost:5432/wezeep
export DATABASE_USERNAME=wezeep
export DATABASE_PASSWORD=wezeep

# JWT (use a long random string in production)
export JWT_SECRET=your-256-bit-secret-key-change-in-production-minimum-32-characters

# Optional: Redis (for cache). If not running Redis, disable cache in application.yml or use simple cache.
export REDIS_HOST=localhost
export REDIS_PORT=6379
```

**Note:** If Redis is not installed, the app may fail on cache. You can switch to a simple in-memory cache in `application.yml`:

```yaml
spring:
  cache:
    type: none  # or remove redis and use simple
```

Or comment out `spring-boot-starter-data-redis` in `pom.xml` and use `@EnableCaching` with a simple cache manager.

### 2.3 Run Backend

**With PostgreSQL and Redis (production-like):**

```bash
cd backend
./mvnw spring-boot:run
```

Or with Maven:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Without Docker (dev profile – H2 in-memory, no Redis, no OAuth2):**

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at **http://localhost:8080**.

### 2.4 Health Check

```bash
curl http://localhost:8080/actuator/health
```

### 2.5 API Base Path

All APIs are under `/api/`:

- **Auth:** `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/refresh`
- **Users:** `GET /api/users/me`
- **Transactions:** `POST /api/transactions/send/p2p`, `POST /api/transactions/send/worldwide`, `GET /api/transactions`, `GET /api/transactions/{id}`
- **Money requests:** `POST /api/money-requests`, `GET /api/money-requests/sent`, `GET /api/money-requests/received`, `POST /api/money-requests/{id}/fulfill`
- **Split bills:** `POST /api/split-bills`, `GET /api/split-bills`, `GET /api/split-bills/participating`, `POST /api/split-bills/{id}/pay?participantId=...`
- **Bill vendors:** `GET /api/bill-vendors`
- **Bill payments:** `POST /api/bill-payments`, `GET /api/bill-payments`
- **Wallets:** `GET /api/wallets`
- **Contacts:** `GET /api/contacts`

---

## 3. Mobile (React Native / Expo) Setup

### 3.1 Dependencies

Install dependencies **before** running the app (required for Expo to find the project):

```bash
cd mobile
npm install
# or
bun install
```

If you see "Unable to find expo in this project", run `npm install` (or `bun install`) and wait for it to finish, then run `npm run start` or `npx expo start`.

### 3.2 Environment Variables

Create `mobile/.env` or set before running:

```bash
# Backend API base URL (use your machine IP if testing on device/emulator)
export EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

For **Android emulator**, use `http://10.0.2.2:8080`.  
For **physical device**, use your computer’s LAN IP, e.g. `http://192.168.1.100:8080`.

### 3.3 Run Mobile App

```bash
cd mobile
npx expo start
```

Then:

- Press **w** for web
- Press **a** for Android
- Press **i** for iOS (mac only)
- Or scan the QR code with **Expo Go** on your phone

---

## 4. Connecting Frontend to Backend

### 4.1 Auth Token Storage

The mobile app stores the JWT in AsyncStorage under `auth_token` after login/register. The API client in `mobile/lib/api.ts` reads this token and sends it as `Authorization: Bearer <token>` on every request.

### 4.2 Flows Wired to Backend

| Flow              | Mobile screens                    | Backend endpoints                                      |
|-------------------|-----------------------------------|--------------------------------------------------------|
| **Login / Sign up** | `index.tsx` (login), `signup.tsx` | `POST /api/auth/login`, `POST /api/auth/register`     |
| **Send P2P**      | `send-p2p.tsx` → `send-p2p-status.tsx` | `POST /api/transactions/send/p2p`, `GET /api/transactions/{id}` |
| **Send worldwide** | `send-worldwide.tsx` → `send-worldwide-details.tsx` → `send-worldwide-status.tsx` | `POST /api/transactions/send/worldwide`, `GET /api/transactions/{id}` |
| **Request money** | `request-money.tsx` → `request-money-details.tsx` → `request-money-status.tsx` | `POST /api/money-requests` (per contact)               |
| **Split bill**    | `bill-split.tsx` → `bill-split-status.tsx` | `POST /api/split-bills` (participants by contactId)   |
| **Pay bills**     | `pay-bill.tsx` (vendor list + pay) → `pay-bill-status.tsx` | `GET /api/bill-vendors`, `POST /api/bill-payments`    |

### 4.3 Contacts and IDs

- **P2P / Request money / Split bill** can use **contactId** (UUID from `GET /api/contacts`). The backend resolves contact → user via `wezeepId`.
- If you use mock contact IDs (e.g. `"1"`, `"2"`) and the backend has no such contacts, those flows will fail until you use real contacts from the API or seed contacts with matching wezeepId users.

### 4.4 First User (Register)

1. Open the app → **Sign Up**.
2. Fill email, password, phone, first name, last name, Wezeep ID (alphanumeric), home country.
3. On success, you are logged in and redirected to the tabs.
4. You can then use Send money, Request money, Split bill, and Pay bills (with seeded bill vendors).

---

## 5. Running Both Together (Local Demo)

1. **Start PostgreSQL** (and Redis if you left it enabled).
2. **Start backend:**
   ```bash
   cd backend && ./mvnw spring-boot:run
   ```
3. **Set mobile API URL** (e.g. in `mobile/.env`):
   ```bash
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
   ```
   For device/emulator use the appropriate host (e.g. `10.0.2.2:8080` or your machine IP).
4. **Start mobile:**
   ```bash
   cd mobile && npx expo start
   ```
5. **Test flow:**
   - Register a user on the app.
   - Send P2P (you’ll need a second user or a contact linked to a Wezeep user).
   - Pay a bill (vendors are seeded by migration V4).
   - Request money / Split bill (works when contacts have valid wezeepId and matching users in DB).

---

## 6. Security Notes (Fintech)

- **JWT:** Use a long, random `JWT_SECRET` in production; rotate periodically.
- **HTTPS:** Use TLS in production for API and app.
- **CORS:** Restrict `allowedOrigins` in `SecurityConfig` to your app’s domains.
- **Rate limiting:** `RateLimitConfig` and config in `application.yml` should be tuned for production.
- **Sensitive data:** Do not log tokens or full payment details; use structured logging and redaction.
- **DB:** Restrict DB user permissions; use migrations only for schema changes; backup regularly.

---

## 7. Troubleshooting

- **401 on API calls:** Ensure you’re logged in and the token is stored; check `Authorization` header in network tab.
- **CORS errors:** Ensure backend CORS allows your app origin (e.g. `http://localhost:19006` for Expo web).
- **Connection refused (mobile → backend):** Use the correct `EXPO_PUBLIC_API_BASE_URL` for your environment (device vs emulator vs web).
- **Flyway / DB errors:** Ensure PostgreSQL is running and credentials match; run migrations manually if needed (`flyway migrate` or re-run app).
- **Redis connection errors:** Disable Redis or start a local Redis instance; or switch to a simple cache as noted above.

---

## 8. Project Structure (Summary)

```
money-app/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/wezeep/
│   │   ├── api/controller/  # REST controllers
│   │   ├── api/dto/         # Request/response DTOs
│   │   ├── domain/model/    # JPA entities
│   │   ├── domain/repository/
│   │   ├── service/
│   │   ├── security/        # JWT, auth
│   │   └── exception/
│   └── src/main/resources/db/migration/  # Flyway SQL
├── mobile/                  # Expo / React Native
│   ├── app/                 # Screens (file-based routing)
│   ├── components/         # AuthContext, ThemeProvider, etc.
│   └── lib/api.ts           # API client
└── INTEGRATION.md           # This file
```
