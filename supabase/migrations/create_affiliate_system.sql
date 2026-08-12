-- ==============================================================================
-- FLAWLESS TN - AFFILIATE & REFERRAL SYSTEM MIGRATION (10 DT COMMISSION)
-- Resilient & Idempotent Migration
-- ==============================================================================

-- 1. Base Table: affiliates
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Safely add all columns to affiliates in case table already existed
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'D17';
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS payment_details TEXT;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS commission_per_order DECIMAL(10, 2) DEFAULT 10.00;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS total_clicks INT DEFAULT 0;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS total_generated INT DEFAULT 0;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS total_orders INT DEFAULT 0;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS total_earned DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS total_paid DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS ref_code TEXT;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Safely drop legacy check constraints if present
ALTER TABLE public.affiliates DROP CONSTRAINT IF EXISTS affiliates_payment_method_check;
ALTER TABLE public.affiliates DROP CONSTRAINT IF EXISTS affiliates_status_check;
ALTER TABLE public.affiliates DROP CONSTRAINT IF EXISTS affiliates_package_check;

-- Safely drop legacy NOT NULL constraints if table already existed
DO $$
BEGIN
    ALTER TABLE public.affiliates ALTER COLUMN ref_code DROP NOT NULL;
    ALTER TABLE public.affiliates ALTER COLUMN payment_method DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    UPDATE public.affiliates SET code = ref_code WHERE code IS NULL AND ref_code IS NOT NULL;
    UPDATE public.affiliates SET ref_code = code WHERE ref_code IS NULL AND code IS NOT NULL;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Create Indexes on affiliates
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates (LOWER(code));
CREATE INDEX IF NOT EXISTS idx_affiliates_phone ON public.affiliates (phone);


-- 2. Base Table: affiliate_events (tracks clicks & card generations)
CREATE TABLE IF NOT EXISTS public.affiliate_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Safely add columns to affiliate_events
ALTER TABLE public.affiliate_events ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE;
ALTER TABLE public.affiliate_events ADD COLUMN IF NOT EXISTS affiliate_code TEXT;
ALTER TABLE public.affiliate_events ADD COLUMN IF NOT EXISTS event_type TEXT; -- 'click', 'card_generated'
ALTER TABLE public.affiliate_events ADD COLUMN IF NOT EXISTS ip_hash TEXT;
ALTER TABLE public.affiliate_events ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.affiliate_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.affiliate_events ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create Indexes on affiliate_events
CREATE INDEX IF NOT EXISTS idx_affiliate_events_affiliate_id ON public.affiliate_events (affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_events_code ON public.affiliate_events (LOWER(affiliate_code));
CREATE INDEX IF NOT EXISTS idx_affiliate_events_type ON public.affiliate_events (event_type);


-- 3. Base Table: affiliate_payouts
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Safely add columns to affiliate_payouts
ALTER TABLE public.affiliate_payouts ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE;
ALTER TABLE public.affiliate_payouts ADD COLUMN IF NOT EXISTS amount DECIMAL(10, 2);
ALTER TABLE public.affiliate_payouts ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'D17';
ALTER TABLE public.affiliate_payouts ADD COLUMN IF NOT EXISTS payment_details TEXT;
ALTER TABLE public.affiliate_payouts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'; -- pending, processing, completed, rejected
ALTER TABLE public.affiliate_payouts ADD COLUMN IF NOT EXISTS transaction_ref TEXT;
ALTER TABLE public.affiliate_payouts ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.affiliate_payouts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.affiliate_payouts ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Create Indexes on affiliate_payouts
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate ON public.affiliate_payouts (affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_status ON public.affiliate_payouts (status);


-- 4. Update orders table with affiliate attribution columns
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS affiliate_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10, 2) DEFAULT 10.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS commission_status TEXT DEFAULT 'pending'; -- pending, approved, paid, cancelled

CREATE INDEX IF NOT EXISTS idx_orders_affiliate_code ON public.orders (LOWER(affiliate_code));
CREATE INDEX IF NOT EXISTS idx_orders_affiliate_id ON public.orders (affiliate_id);


-- 5. Row Level Security Policies
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Public can read limited affiliate status / verify code
DROP POLICY IF EXISTS "Public can view affiliate status" ON public.affiliates;
CREATE POLICY "Public can view affiliate status" ON public.affiliates
    FOR SELECT TO public
    USING (true);

-- Public can insert tracking events
DROP POLICY IF EXISTS "Public can insert affiliate events" ON public.affiliate_events;
CREATE POLICY "Public can insert affiliate events" ON public.affiliate_events
    FOR INSERT TO public
    WITH CHECK (true);

-- Service role has full permissions on all affiliate tables
DROP POLICY IF EXISTS "Service role full access to affiliates" ON public.affiliates;
CREATE POLICY "Service role full access to affiliates" ON public.affiliates
    FOR ALL TO service_role
    USING (true);

DROP POLICY IF EXISTS "Service role full access to affiliate_events" ON public.affiliate_events;
CREATE POLICY "Service role full access to affiliate_events" ON public.affiliate_events
    FOR ALL TO service_role
    USING (true);

DROP POLICY IF EXISTS "Service role full access to affiliate_payouts" ON public.affiliate_payouts;
CREATE POLICY "Service role full access to affiliate_payouts" ON public.affiliate_payouts
    FOR ALL TO service_role
    USING (true);
