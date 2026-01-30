-- Bill vendors (payees) - e.g. Netflix, Electric Company
CREATE TABLE IF NOT EXISTS bill_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bill_vendors_category ON bill_vendors(category);

-- Bill payments - user payments to vendors
CREATE TABLE IF NOT EXISTS bill_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES bill_vendors(id) ON DELETE CASCADE,
    amount DECIMAL(19, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    frequency VARCHAR(20) NOT NULL DEFAULT 'one-time',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reference VARCHAR(100),
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bill_payments_user ON bill_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_bill_payments_vendor ON bill_payments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bill_payments_status ON bill_payments(status);

-- Seed default bill vendors (Flyway runs once per migration)
INSERT INTO bill_vendors (name, category, icon, color) VALUES
('Netflix', 'Entertainment', '🎬', '#E50914'),
('Spotify', 'Entertainment', '🎵', '#1DB954'),
('Electric Company', 'Utilities', '⚡', '#FFA500'),
('Water Utility', 'Utilities', '💧', '#4A90E2'),
('Internet Provider', 'Utilities', '🌐', '#00A8E8'),
('Amazon Prime', 'Entertainment', '📦', '#FF9900');
