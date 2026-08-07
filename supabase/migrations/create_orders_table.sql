-- Drop check constraint on package if present
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_package_check;

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT,
    name TEXT,
    phone TEXT,
    customer_phone TEXT,
    package TEXT,
    governorate TEXT,
    city TEXT,
    address TEXT,
    card_size TEXT DEFAULT 'standard',
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2),
    delivery_fee DECIMAL(10, 2) DEFAULT 8.00,
    total_price DECIMAL(10, 2),
    price DECIMAL(10, 2),
    total DECIMAL(10, 2),
    card_image_url TEXT,
    image_url TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add any missing columns in case public.orders table already existed
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS package TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS governorate TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS card_size TEXT DEFAULT 'standard';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 8.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_price DECIMAL(10, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS card_image_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Drop NOT NULL constraints on legacy columns so any insertion format works
DO $$
BEGIN
    ALTER TABLE public.orders ALTER COLUMN customer_phone DROP NOT NULL;
    ALTER TABLE public.orders ALTER COLUMN package DROP NOT NULL;
    ALTER TABLE public.orders ALTER COLUMN price DROP NOT NULL;
    ALTER TABLE public.orders ALTER COLUMN customer_name DROP NOT NULL;
    ALTER TABLE public.orders ALTER COLUMN phone DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public order insertion
DROP POLICY IF EXISTS "Allow public order placement" ON public.orders;
CREATE POLICY "Allow public order placement" ON public.orders
    FOR INSERT TO public
    WITH CHECK (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Allow service role full access to orders" ON public.orders;
CREATE POLICY "Allow service role full access to orders" ON public.orders
    FOR ALL TO service_role
    USING (true);

-- Create storage bucket for card orders if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-orders', 'card-orders', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for card-orders bucket
DROP POLICY IF EXISTS "Public card upload" ON storage.objects;
CREATE POLICY "Public card upload" ON storage.objects
    FOR INSERT TO public
    WITH CHECK (bucket_id = 'card-orders');

DROP POLICY IF EXISTS "Public card read" ON storage.objects;
CREATE POLICY "Public card read" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'card-orders');
