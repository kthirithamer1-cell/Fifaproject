-- ============================================================
-- Flawless Affiliate Marketing Program — Supabase Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- 1. Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  instagram TEXT,
  tiktok TEXT,
  governorate TEXT,
  ref_code TEXT NOT NULL UNIQUE,
  payment_method TEXT DEFAULT 'flouci' CHECK (payment_method IN ('flouci', 'bank_transfer')),
  flouci_id TEXT,
  card_number TEXT,
  pin_hash TEXT NOT NULL,
  total_earned NUMERIC DEFAULT 0,
  total_paid NUMERIC DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'diamond')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Referral clicks tracking
CREATE TABLE IF NOT EXISTS referral_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  ref_code TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  source_url TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_governorate TEXT,
  package TEXT NOT NULL CHECK (package IN ('premium', 'ultimate')),
  price NUMERIC NOT NULL,
  affiliate_code TEXT,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'cancelled')),
  commission_status TEXT DEFAULT 'none' CHECK (commission_status IN ('none', 'pending', 'confirmed', 'paid')),
  commission_amount NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

-- 4. Commission payouts
CREATE TABLE IF NOT EXISTS payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('flouci', 'bank_transfer')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  reference TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliates_ref_code ON affiliates(ref_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_phone ON affiliates(phone);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_ref_code ON referral_clicks(ref_code);
CREATE INDEX IF NOT EXISTS idx_orders_affiliate_code ON orders(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_payouts_affiliate_id ON payouts(affiliate_id);

-- 6. Function to update affiliate earnings when order is delivered
CREATE OR REPLACE FUNCTION update_affiliate_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- When order status changes to 'delivered' and has an affiliate
  IF NEW.status = 'delivered' AND NEW.affiliate_id IS NOT NULL AND OLD.status != 'delivered' THEN
    -- Set commission as confirmed
    NEW.commission_status := 'confirmed';
    NEW.commission_amount := 10; -- 10 DT flat commission
    
    -- Update affiliate total earned
    UPDATE affiliates
    SET total_earned = total_earned + 10
    WHERE id = NEW.affiliate_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger for auto commission
DROP TRIGGER IF EXISTS trigger_commission_on_delivery ON orders;
CREATE TRIGGER trigger_commission_on_delivery
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliate_commission();

-- 8. Enable Row Level Security (RLS) & Policies
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Allow full access for service_role (Next.js server-side API routes)
CREATE POLICY "Service Role full access on affiliates" ON affiliates FOR ALL USING (true);
CREATE POLICY "Service Role full access on referral_clicks" ON referral_clicks FOR ALL USING (true);
CREATE POLICY "Service Role full access on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Service Role full access on payouts" ON payouts FOR ALL USING (true);

-- Allow public / anon users to insert referral clicks & orders
CREATE POLICY "Anon insert on referral_clicks" ON referral_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon insert on orders" ON orders FOR INSERT WITH CHECK (true);

-- ============================================================
-- 9. Card Generation Job Queue (Async Architecture)
-- ============================================================

CREATE TABLE IF NOT EXISTS card_jobs (
  id TEXT PRIMARY KEY,                          -- unique job ID (crypto.randomUUID)
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'done', 'failed')),
  input JSONB NOT NULL,                         -- full request payload (photo, cardData, stats, etc.)
  image_url TEXT,                               -- base64 data URL result (on success)
  error TEXT,                                   -- error message (on failure)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_card_jobs_status ON card_jobs(status);
CREATE INDEX IF NOT EXISTS idx_card_jobs_created ON card_jobs(created_at);

ALTER TABLE card_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service Role full access on card_jobs" ON card_jobs FOR ALL USING (true);

