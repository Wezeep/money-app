-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    wezeep_id VARCHAR(50) NOT NULL UNIQUE,
    home_country VARCHAR(2) NOT NULL,
    preferred_currency VARCHAR(20) NOT NULL DEFAULT 'USD',
    password VARCHAR(255),
    privacy_toggle_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    session_expiry_days INTEGER NOT NULL DEFAULT 45,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_phone ON users(phone_number);
CREATE INDEX idx_wezeep_id ON users(wezeep_id);

-- Create wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(3) NOT NULL,
    balance DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, currency)
);

CREATE INDEX idx_user_currency ON wallets(user_id, currency);

-- Create payment_methods table
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    provider_account_id VARCHAR(500),
    encrypted_details VARCHAR(500),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user ON payment_methods(user_id);
CREATE INDEX idx_type ON payment_methods(type);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    amount_sent DECIMAL(19, 2) NOT NULL,
    sent_currency VARCHAR(3) NOT NULL,
    amount_received DECIMAL(19, 2) NOT NULL,
    received_currency VARCHAR(3) NOT NULL,
    exchange_rate DECIMAL(19, 6),
    transaction_fee DECIMAL(19, 2),
    transaction_fee_percentage DECIMAL(5, 4),
    forex_margin DECIMAL(19, 2),
    forex_margin_percentage DECIMAL(5, 4),
    payment_method VARCHAR(50) NOT NULL,
    delivery_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reference VARCHAR(100),
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_sender ON transactions(sender_id);
CREATE INDEX idx_recipient ON transactions(recipient_id);
CREATE INDEX idx_status ON transactions(status);
CREATE INDEX idx_created_at ON transactions(created_at);

-- Create transaction_tags table
CREATE TABLE transaction_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL
);

CREATE INDEX idx_transaction ON transaction_tags(transaction_id);
CREATE INDEX idx_name ON transaction_tags(name);

-- Create contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    wezeep_id VARCHAR(50),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_contact ON contacts(user_id);
CREATE INDEX idx_wezeep_id_contact ON contacts(wezeep_id);
CREATE INDEX idx_phone_contact ON contacts(phone_number);

-- Create money_requests table
CREATE TABLE money_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    fixed_amount DECIMAL(19, 2),
    currency VARCHAR(3) NOT NULL,
    is_fixed_amount BOOLEAN NOT NULL DEFAULT TRUE,
    notes VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    completed_at TIMESTAMP,
    shareable_link VARCHAR(500)
);

CREATE INDEX idx_requester ON money_requests(requester_id);
CREATE INDEX idx_recipient_mr ON money_requests(recipient_id);
CREATE INDEX idx_status_mr ON money_requests(status);
CREATE INDEX idx_expires_at ON money_requests(expires_at);

-- Create split_bills table
CREATE TABLE split_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    total_amount DECIMAL(19, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    is_equal_split BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    notes VARCHAR(500),
    group_link VARCHAR(500),
    qr_code VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_creator ON split_bills(creator_id);
CREATE INDEX idx_status_sb ON split_bills(status);

-- Create split_bill_participants table
CREATE TABLE split_bill_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_bill_id UUID NOT NULL REFERENCES split_bills(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(19, 2) NOT NULL,
    paid_amount DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    last_reminder_sent_at TIMESTAMP
);

CREATE INDEX idx_split_bill ON split_bill_participants(split_bill_id);
CREATE INDEX idx_user_sbp ON split_bill_participants(user_id);
CREATE INDEX idx_status_sbp ON split_bill_participants(status);

-- Create reward_accounts table
CREATE TABLE reward_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_points DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    current_points DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    total_transactions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_ra ON reward_accounts(user_id);
