-- Add transfer type and international beneficiary fields to transactions
-- P2P: recipient_id required (Wezeep user). INTERNATIONAL: recipient_id nullable, beneficiary details used.

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS transfer_type VARCHAR(20) NOT NULL DEFAULT 'P2P';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recipient_name VARCHAR(200);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recipient_phone VARCHAR(30);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recipient_country_code VARCHAR(2);

-- Allow recipient_id to be NULL for international transfers to non-Wezeep beneficiaries
ALTER TABLE transactions ALTER COLUMN recipient_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_transfer_type ON transactions(transfer_type);
