.PHONY: help dev dev:win backend mobile docker-dev docker-down build test lint

help:
	@echo "money-app Makefile"
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  dev         Start backend and mobile (POSIX: runs scripts/start-dev.sh)"
	@echo "  dev:win     Start backend and mobile (Windows PowerShell script)"
	@echo "  backend     Start backend (mvn wrapper)"
	@echo "  mobile      Install dependencies and start Expo (mobile)"
	@echo "  docker-dev  Start Postgres + Redis + backend via docker-compose.dev.yml"
	@echo "  docker-down Stop and remove containers and volumes"
	@echo "  test        Run backend tests (mvn test)"
	@echo "  lint        Run mobile lint (npm --prefix mobile run lint)"

# Default target
dev:
	bash ./scripts/start-dev.sh

dev:win:
	powershell -ExecutionPolicy Bypass -File .\scripts\start-dev.ps1

backend:
	cd backend && ./mvnw spring-boot:run

mobile:
	cd mobile && npm install && npx expo start

docker-dev:
	docker-compose -f docker-compose.dev.yml up --build

docker-down:
	docker-compose -f docker-compose.dev.yml down -v

build:
	cd backend && ./mvnw clean package -DskipTests

test:
	cd backend && ./mvnw test

lint:
	npm --prefix mobile run lint
