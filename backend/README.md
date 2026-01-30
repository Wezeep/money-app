# Wezeep Backend API

Spring Boot REST API for the Wezeep fintech mobile app.

## Quick start

1. **PostgreSQL:** Create database `wezeep` and user (see root [INTEGRATION.md](../INTEGRATION.md)).
2. **Environment:** Set `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `JWT_SECRET` (see INTEGRATION.md).
3. **Run:** `./mvnw spring-boot:run`

API base: **http://localhost:8080**

## Full setup and mobile integration

See **[INTEGRATION.md](../INTEGRATION.md)** in the project root for:

- Environment variables
- Database and optional Redis setup
- Running backend and mobile together
- API endpoints and flows (auth, send money, request money, split bill, pay bills)

## Tech stack

- Java 17+ (pom uses 25; override `java.version` to 17 if needed)
- Spring Boot 4, Spring Security, JWT
- PostgreSQL, Flyway migrations
- Optional Redis for cache
