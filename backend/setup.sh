#!/bin/bash

# Wezeep Backend Setup Script

echo "Setting up Wezeep Backend..."

# Check Java version
if ! command -v java &> /dev/null; then
    echo "Java is not installed. Please install Java 21 or 25 first."
    echo "See README.md for installation instructions."
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | sed '/^1\./s///' | cut -d'.' -f1)
echo "Java version: $JAVA_VERSION"

if [ "$JAVA_VERSION" -lt 21 ]; then
    echo "Warning: Java 21 or higher is recommended. Current version: $JAVA_VERSION"
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo "Maven is not installed. Installing Maven..."
    # You may need to install Maven manually
    exit 1
fi

echo "Maven version: $(mvn -version | head -n 1)"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/wezeep
DATABASE_USERNAME=wezeep
DATABASE_PASSWORD=wezeep

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Security
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRATION=3888000000
JWT_REFRESH_EXPIRATION=7776000000

# Rate Limiting
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_HOUR=100

# FX Rates
FX_UPDATE_INTERVAL=60
FX_RATE_CHANGE_THRESHOLD=0.01

# Transaction Fees
TRANSACTION_FEE_MIN=0.015
TRANSACTION_FEE_MAX=0.03
EOF
    echo ".env file created. Please review and update as needed."
fi

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL 14+ first."
fi

# Build the project
echo "Building the project..."
mvn clean install -DskipTests

echo "Setup complete!"
echo "Next steps:"
echo "1. Set up PostgreSQL database: createdb wezeep"
echo "2. Start Redis (optional): redis-server"
echo "3. Run the application: mvn spring-boot:run"
echo "4. Or use Docker: docker-compose up"
