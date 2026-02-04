# Wezeep — Full Project (Backend & Mobile)

[![Backend](https://img.shields.io/badge/backend-SpringBoot-blue)](backend)
[![Mobile](https://img.shields.io/badge/mobile-Expo%20%2B%20React%20Native-purple)](mobile)

Professional documentation for developing, testing, and deploying the Wezeep fintech application.

---

## Table of Contents

- [Project overview](#project-overview)
- [Key features](#key-features)
- [Architecture & tech stack](#architecture--tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started (development)](#getting-started-development)
  - [Backend](#backend)
  - [Mobile](#mobile)
  - [End-to-end (local)](#end-to-end-local)
- [Configuration (environment variables)](#configuration-environment-variables)
- [Testing & linting](#testing--linting)
- [Deployment notes](#deployment-notes)
- [Troubleshooting & tips](#troubleshooting--tips)
- [Contributing](#contributing)
- [Security & responsible disclosure](#security--responsible-disclosure)

---

## Project overview

This repository contains two primary projects that together form the Wezeep product:

- `backend` — Production-ready Spring Boot REST API that manages authentication, wallets, transactions, rewards, bill payments, and integrations with external providers.
- `mobile` — Expo / React Native application that provides the user interface for the fintech flows (auth, send/request money, split bills, pay bills).

See `INTEGRATION.md` for advanced setup, network and device routing notes, and additional integration guidance.

---

## Key features

- User authentication (email/password + social sign-in)
- JWT-based session management
- Multi-currency wallets, P2P and international transfers
- Bill payments and split bills
- Reward and referral system
- Contact management and fuzzy search
- Flyway migrations and seeded data for development

(Full feature list available in `backend/FEATURES.md`.)

---

## Architecture & tech stack

Backend

- Java (tested with 17+), Spring Boot (4.x), Spring Security, Spring Data JPA
- PostgreSQL, Flyway for migrations
- Optional Redis for caching
- JWT (io.jsonwebtoken), MapStruct, Lombok

Mobile

- Expo (SDK 54), React 19, React Native 0.81
- Expo Router (file-based routing), Nativewind for styling
- Uses `mobile/lib/api.ts` as the API client (Authorization header with Bearer token)

---

## Prerequisites

- Java 17+ (pom currently lists Java 25, but Java 17+ is supported for local dev)
- Maven 3.8+
- PostgreSQL 14+
- Node 18+ and npm
- Optional: Redis (for cache testing)
- Optional: Android Studio / Xcode for emulators

---

## Getting started (development)

### Backend

1. Create a PostgreSQL database (example):

```bash
createdb wezeep
# or with psql
psql -c "CREATE DATABASE wezeep;"
```

2. Configure environment variables (see [Configuration](#configuration-environment-variables)).

3. Run the application:

```bash
cd backend
# use included Maven wrapper
./mvnw spring-boot:run
```

4. Health check:

```bash
curl http://localhost:8080/actuator/health
```

API base: `http://localhost:8080/api/`


### Mobile (Expo)

1. Install dependencies:

```bash
cd mobile
npm install
```

2. Configure `EXPO_PUBLIC_API_BASE_URL` for your environment (emulator vs device). See [Configuration](#configuration-environment-variables).

3. Start the Metro server:

```bash
npx expo start
```

4. Launch on a device or emulator (see Metro output for QR code/options).


### End-to-end (local)

1. Start PostgreSQL (and Redis if using it).
2. Start the backend (`./mvnw spring-boot:run`).
3. Start the mobile app (`npx expo start`) and set `EXPO_PUBLIC_API_BASE_URL` appropriately.

For Android emulator, use `http://10.0.2.2:8080`. For a physical device, use your machine's LAN IP (e.g., `http://192.168.1.100:8080`).

### Developer convenience files

To simplify local development the repository includes example environment files and helper scripts:

- `backend/.env.example` — example variables for the backend (copy to `backend/.env`)
- `mobile/.env.example` — example variables for the mobile app (copy to `mobile/.env`)
- `scripts/start-dev.ps1` — PowerShell script that opens two PowerShell windows and runs the backend and Expo concurrently (Windows)
- `scripts/start-dev.sh` — POSIX shell script that starts the backend in the background and runs Expo in the foreground (macOS / Linux / WSL)

Usage (Windows PowerShell):

```powershell
# From repo root
.\scripts\start-dev.ps1
```

Usage (macOS / Linux / WSL):

```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

> Note: The scripts are convenience helpers. If you prefer process managers (tmux, pm2) or containerized workflows, feel free to adapt them.


---

## Configuration (environment variables)

Create `.env` files or export variables in your shell. Example variables below (do not commit secrets to version control):

Backend (example)

```env
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/wezeep
DATABASE_USERNAME=wezeep
DATABASE_PASSWORD=wezeep

# JWT
JWT_SECRET=replace-with-a-strong-secret

# Optional: Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (SMTP) - for password reset and notifications (replace for production)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=your@email
MAIL_PASSWORD=super-secret

# OAuth2 (if used)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
```

Mobile (example)

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
# For Android emulator
# EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080
```

---

## Testing & linting

Backend

- Run unit/integration tests: `mvn test` (TBD)

Mobile

- Run lint: `npm run lint`
- Run TypeScript checks (if applicable): `tsc --noEmit`

---

## Deployment notes

- Build backend artifact: `mvn clean package` (produces an executable JAR)
- Consider containerizing with Docker for consistent deployment
- Use environment variables and a secrets management solution for production secrets (Key Vault, AWS Secrets Manager, etc.)
- Enable TLS for all production endpoints and rotate `JWT_SECRET` periodically
- Monitor Flyway migrations and keep regular backups for Postgres

---

## Development with Docker (recommended)

A `docker-compose.dev.yml` is included to run Postgres, Redis, and the backend locally in containers. This is useful for reproducible development environments and for CI debugging.

Start development environment (builds backend image):

```bash
# from repository root
docker-compose -f docker-compose.dev.yml up --build
```

Notes:
- The `backend` service uses the repository `backend/Dockerfile`. The compose file sets the database host to `db` and Redis host to `redis` so the backend connects to containerized services.
- The compose file provides sensible defaults for dev (DB: `wezeep` / user `wezeep`), edit environment values or use `backend/.env` to override before starting.
- To tear down and clear DB data:

```bash
docker-compose -f docker-compose.dev.yml down -v
```

---

## Troubleshooting & tips

- 401 errors: verify JWT token storage and `Authorization` header on mobile requests.
- DB migration failures: ensure database user has correct privileges and Flyway migrations are applied.
- Redis issues: either run local Redis or disable Redis-backed cache for local development.
- Mobile connectivity: emulator vs device requires different host settings (see End-to-end section).

---

## Contributing

Please read `CONTRIBUTING.md` for details on the developer workflow, PR expectations, testing, and local verification steps.

- Follow the existing code style and add unit tests for new backend features.
- For mobile, add simple integration or screen tests for critical flows.
- Open a pull request with a clear description and include test steps.

---

## Security & responsible disclosure

If you discover a security issue, do not open a public issue. Contact the repository owner or maintainers directly with details and steps to reproduce. Include no sensitive data in public channels.

---

## License

No license file detected. Licensing has been temporarily removed; contact the maintainers for clarification.

---

What I added (done)

- `backend/.env.example` — example environment variables for the backend (copy to `backend/.env` and edit)
- `mobile/.env.example` — example environment variables for the mobile app (copy to `mobile/.env` and edit)
- `scripts/start-dev.ps1` — PowerShell helper to open separate windows and run backend + Expo (Windows)
- `scripts/start-dev.sh` — POSIX helper to start backend and Expo (macOS / Linux / WSL)
- `docker-compose.dev.yml` — Docker Compose setup for Postgres + Redis + backend
- `CONTRIBUTING.md` — contribution workflow and guidelines

Next suggestions

1. Add a `SECURITY.md` with contact details for reporting security issues.
2. Add a `docker-compose.dev.override.yml` for optional services (Adminer, pgadmin) or to provide volumes for sample data.
3. Add GitHub Action workflows for CI (build, tests, container scan) to validate PRs automatically.

If you'd like, I can implement any of the above next—tell me which one to prioritize.

---

## Standardized developer tasks (Make & NPM scripts)

For convenience the repository includes a `Makefile` and a root `package.json` with common developer targets:

Make targets (from repo root):

- `make dev` — Start backend and mobile (POSIX: runs `./scripts/start-dev.sh`)
- `make dev:win` — Start backend and mobile on Windows (runs PowerShell helper)
- `make backend` — Start backend (`./mvnw spring-boot:run`)
- `make mobile` — Install mobile deps and start Expo
- `make docker-dev` — Start the Postgres+Redis+backend stack via Docker Compose
- `make docker-down` — Stop and remove containers and volumes
- `make test` — Run backend tests
- `make lint` — Run mobile lint script

NPM scripts (repo root):

- `npm run dev` — POSIX dev helper (runs `bash ./scripts/start-dev.sh`)
- `npm run dev:win` — Windows PowerShell helper
- `npm run docker:dev` — Run `docker-compose -f docker-compose.dev.yml up --build`

Notes

- Makefile is convenient for macOS / Linux / WSL users. Windows users can use `npm run dev:win` or execute `scripts/start-dev.ps1` directly.
- All scripts are non-destructive; Docker volumes are only removed when you run `docker-compose -f docker-compose.dev.yml down -v`.

---
