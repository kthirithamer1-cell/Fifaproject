-- ============================================================
-- Seed Fake Data Linked to Account: Phone 28998300 | PIN 0001
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- 1. Insert or Update Affiliate Partner (Phone: 28998300 | PIN: 0001)
INSERT INTO affiliates (
  id,
  name,
  phone,
  instagram,
  tiktok,
  governorate,
  ref_code,
  payment_method,
  flouci_id,
  card_number,
  pin_hash,
  total_earned,
  total_paid,
  tier,
  status,
  created_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'أحمد بن سعيد',
  '28998300',
  '@ahmed_partner',
  '@ahmed_tiktok',
  'تونس',
  'AHMED2899',
  'flouci',
  '21628998300',
  NULL,
  'pin_vo5d', -- Exact Hash for PIN '0001'
  120.00,     -- Total earned so far
  50.00,      -- Total paid out
  'silver',   -- Tier: Silver 🥈
  'active',
  NOW() - INTERVAL '30 days'
)
ON CONFLICT (phone) DO UPDATE SET
  pin_hash = 'pin_vo5d',
  total_earned = 120.00,
  total_paid = 50.00,
  tier = 'silver',
  status = 'active';

-- Get the target affiliate ID for phone 28998300
DO $$
DECLARE
  target_id UUID;
  target_ref TEXT;
BEGIN
  SELECT id, ref_code INTO target_id, target_ref FROM affiliates WHERE phone = '28998300';

  -- 2. Insert Referral Traffic Clicks (15 sample clicks)
  INSERT INTO referral_clicks (affiliate_id, ref_code, ip_address, user_agent, source_url, clicked_at) VALUES
  (target_id, target_ref, '197.26.12.4', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', 'https://instagram.com', NOW() - INTERVAL '15 days'),
  (target_id, target_ref, '197.26.14.88', 'Mozilla/5.0 (Android 13; Mobile)', 'https://tiktok.com', NOW() - INTERVAL '14 days'),
  (target_id, target_ref, '197.28.9.12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://facebook.com', NOW() - INTERVAL '12 days'),
  (target_id, target_ref, '41.226.15.3', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1)', 'https://instagram.com', NOW() - INTERVAL '10 days'),
  (target_id, target_ref, '41.226.90.11', 'Mozilla/5.0 (Linux; Android 12)', 'https://tiktok.com', NOW() - INTERVAL '8 days'),
  (target_id, target_ref, '197.30.5.99', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'https://instagram.com', NOW() - INTERVAL '6 days'),
  (target_id, target_ref, '197.30.8.20', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5)', 'https://instagram.com', NOW() - INTERVAL '5 days'),
  (target_id, target_ref, '41.230.1.44', 'Mozilla/5.0 (Android 14)', 'https://tiktok.com', NOW() - INTERVAL '4 days'),
  (target_id, target_ref, '41.230.12.8', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2)', 'https://instagram.com', NOW() - INTERVAL '3 days'),
  (target_id, target_ref, '197.28.44.1', 'Mozilla/5.0 (Windows NT 10.0)', 'https://facebook.com', NOW() - INTERVAL '2 days'),
  (target_id, target_ref, '197.28.44.9', 'Mozilla/5.0 (Android 13)', 'https://instagram.com', NOW() - INTERVAL '1 day'),
  (target_id, target_ref, '41.229.8.77', 'Mozilla/5.0 (iPhone)', 'https://tiktok.com', NOW() - INTERVAL '12 hours'),
  (target_id, target_ref, '41.229.8.90', 'Mozilla/5.0 (iPhone)', 'https://instagram.com', NOW() - INTERVAL '5 hours'),
  (target_id, target_ref, '197.26.88.2', 'Mozilla/5.0 (Android 14)', 'https://facebook.com', NOW() - INTERVAL '2 hours'),
  (target_id, target_ref, '197.26.88.9', 'Mozilla/5.0 (iPhone)', 'https://instagram.com', NOW() - INTERVAL '30 minutes');

  -- 3. Insert Orders in Different States (Delivered, Pending, Processing, Cancelled)
  INSERT INTO orders (
    customer_name,
    customer_phone,
    customer_address,
    customer_governorate,
    package,
    price,
    affiliate_code,
    affiliate_id,
    status,
    commission_status,
    commission_amount,
    notes,
    created_at,
    delivered_at
  ) VALUES 
  ('سالم الماجري', '55112233', 'حي الخضراء', 'تونس', 'ultimate', 49.00, target_ref, target_id, 'delivered', 'confirmed', 10.00, 'تم التسليم بنجاح', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '8 hours'),
  ('مريم الطرابلسي', '22334455', 'طريق العين', 'صفاقس', 'premium', 39.00, target_ref, target_id, 'delivered', 'confirmed', 10.00, 'تم التسليم بنجاح', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '6 hours'),
  ('ياسين الغربي', '99887766', 'القنطاوي', 'سوسة', 'ultimate', 49.00, target_ref, target_id, 'delivered', 'confirmed', 10.00, 'تم التسليم بنجاح', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '4 hours'),
  ('أنس الجلاصي', '20112233', 'المنزه 6', 'أريانة', 'ultimate', 49.00, target_ref, target_id, 'delivered', 'confirmed', 10.00, 'تم التسليم بنجاح', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '2 hours'),
  ('فاطمة بن سعيد', '50445566', 'شارع الحبيب بورقيبة', 'نابل', 'premium', 39.00, target_ref, target_id, 'pending', 'pending', 0.00, 'في طور التثبت من الهاتف', NOW() - INTERVAL '3 hours', NULL),
  ('محمد علي', '97112244', 'حي الرياض', 'سوسة', 'ultimate', 49.00, target_ref, target_id, 'processing', 'pending', 0.00, 'تم إرسال الكوماند مع شركة التوصيل', NOW() - INTERVAL '2 hours', NULL),
  ('خليل الرياحي', '52334411', 'المرسى', 'تونس', 'premium', 39.00, target_ref, target_id, 'cancelled', 'none', 0.00, 'ألغى الحريف الطلب', NOW() - INTERVAL '1 hour', NULL);

  -- 4. Insert Payout Requests in Different Statuses (Completed, Pending, Rejected)
  INSERT INTO payouts (
    affiliate_id,
    amount,
    method,
    status,
    reference,
    requested_at,
    completed_at
  ) VALUES 
  (target_id, 50.00, 'flouci', 'completed', 'FLOUCI-TX-998811', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days'),
  (target_id, 30.00, 'flouci', 'pending', NULL, NOW() - INTERVAL '1 day', NULL),
  (target_id, 20.00, 'bank_transfer', 'rejected', 'معلومات الحساب غير مكتملة', NOW() - INTERVAL '25 days', NOW() - INTERVAL '24 days');
END $$;
