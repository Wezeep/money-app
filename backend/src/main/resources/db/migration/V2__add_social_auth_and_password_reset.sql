-- Add password column to users if not exists (already added in V1)
-- Add referral_code and profile_completed to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_user_prt ON password_reset_tokens(user_id);

-- Create social_auths table
CREATE TABLE IF NOT EXISTS social_auths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(500),
    name VARCHAR(500),
    access_token VARCHAR(1000),
    refresh_token VARCHAR(1000),
    token_expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_provider_id ON social_auths(provider, provider_user_id);
CREATE INDEX IF NOT EXISTS idx_user_sa ON social_auths(user_id);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id),
    referred_user_id UUID REFERENCES users(id),
    referral_code VARCHAR(50) NOT NULL UNIQUE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    points_earned DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referred ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_code ON referrals(referral_code);

-- Create cashback_offers table
CREATE TABLE IF NOT EXISTS cashback_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    cashback_percentage DECIMAL(5, 2) NOT NULL,
    min_transaction_amount DECIMAL(19, 2),
    max_cashback_amount DECIMAL(19, 2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    applicable_country VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_active ON cashback_offers(is_active, start_date, end_date);

-- Create reward_redemptions table
CREATE TABLE IF NOT EXISTS reward_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    redemption_type VARCHAR(50) NOT NULL,
    points_used DECIMAL(19, 2) NOT NULL,
    cash_value DECIMAL(19, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_rr ON reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_status_rr ON reward_redemptions(status);

-- Update reward_accounts table
ALTER TABLE reward_accounts ADD COLUMN IF NOT EXISTS total_referrals INTEGER NOT NULL DEFAULT 0;
ALTER TABLE reward_accounts ADD COLUMN IF NOT EXISTS total_cashback_earned DECIMAL(19, 2) NOT NULL DEFAULT 0.00;
