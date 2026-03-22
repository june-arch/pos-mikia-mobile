-- POS Mikia Seed Data
-- Run this after creating tables with supabase-schema.sql

-- Insert Store Data
INSERT INTO "Store" ("id", "name", "address", "phone", "openHours", "qrisImageUrl", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Toko MIKIA',
  'Jl. Sudirman No. 123, Jakarta',
  '021-12345678',
  'Senin - Sabtu: 09:00 - 21:00, Minggu: 10:00 - 18:00',
  'https://ik.imagekit.io/demo/default-qris.jpg',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert Categories
INSERT INTO "Category" ("id", "name", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Fashion Wanita', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Fashion Pria', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Aksesoris', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Tas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Sepatu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Brands
INSERT INTO "Brand" ("id", "name", "logoUrl", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'MIKIA Original', 'https://ik.imagekit.io/demo/brands/mikia.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Nike', 'https://ik.imagekit.io/demo/brands/nike.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Adidas', 'https://ik.imagekit.io/demo/brands/adidas.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Puma', 'https://ik.imagekit.io/demo/brands/puma.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Local Brand', 'https://ik.imagekit.io/demo/brands/local.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Sample Products
INSERT INTO "Product" ("id", "name", "sku", "description", "price", "stock", "categoryId", "brandId", "imageUrl", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Blouse MIKIA Premium', 'BLW-001', 'Blouse premium dengan bahan nyaman dan desain elegan', 299000, 50, 
   (SELECT id FROM "Category" WHERE name = 'Fashion Wanita' LIMIT 1), 
   (SELECT id FROM "Brand" WHERE name = 'MIKIA Original' LIMIT 1),
   'https://ik.imagekit.io/demo/products/blouse-1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   
INSERT INTO "Product" ("id", "name", "sku", "description", "price", "stock", "categoryId", "brandId", "imageUrl", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Dress Casual MIKIA', 'DRS-001', 'Dress casual untuk daily wear', 450000, 30,
   (SELECT id FROM "Category" WHERE name = 'Fashion Wanita' LIMIT 1),
   (SELECT id FROM "Brand" WHERE name = 'MIKIA Original' LIMIT 1),
   'https://ik.imagekit.io/demo/products/dress-1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   
INSERT INTO "Product" ("id", "name", "sku", "description", "price", "stock", "categoryId", "brandId", "imageUrl", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Kemeja Formal MIKIA', 'KMH-001', 'Kemeja formal untuk kerja', 350000, 40,
   (SELECT id FROM "Category" WHERE name = 'Fashion Pria' LIMIT 1),
   (SELECT id FROM "Brand" WHERE name = 'MIKIA Original' LIMIT 1),
   'https://ik.imagekit.io/demo/products/kemeja-1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   
INSERT INTO "Product" ("id", "name", "sku", "description", "price", "stock", "categoryId", "brandId", "imageUrl", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Kaos Casual Nike', 'KTS-001', 'Kaos casual dengan logo Nike', 250000, 60,
   (SELECT id FROM "Category" WHERE name = 'Fashion Pria' LIMIT 1),
   (SELECT id FROM "Brand" WHERE name = 'Nike' LIMIT 1),
   'https://ik.imagekit.io/demo/products/kaos-nike.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   
INSERT INTO "Product" ("id", "name", "sku", "description", "price", "stock", "categoryId", "brandId", "imageUrl", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Topi Baseball MIKIA', 'TPI-001', 'Topi baseball dengan logo MIKIA', 99000, 100,
   (SELECT id FROM "Category" WHERE name = 'Aksesoris' LIMIT 1),
   (SELECT id FROM "Brand" WHERE name = 'MIKIA Original' LIMIT 1),
   'https://ik.imagekit.io/demo/products/topi-1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   
INSERT INTO "Product" ("id", "name", "sku", "description", "price", "stock", "categoryId", "brandId", "imageUrl", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Ikat Pinggang Kulit', 'IPK-001', 'Ikat pinggang kulit asli', 150000, 80,
   (SELECT id FROM "Category" WHERE name = 'Aksesoris' LIMIT 1),
   (SELECT id FROM "Brand" WHERE name = 'Local Brand' LIMIT 1),
   'https://ik.imagekit.io/demo/products/ikat-pinggang.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   
INSERT INTO "Product" ("id", "name", "sku", "description", "price", "stock", "categoryId", "brandId", "imageUrl", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Tas Ransel MIKIA', 'TRS-001', 'Tas ransel dengan banyak kompartemen', 399000, 25,
   (SELECT id FROM "Category" WHERE name = 'Tas' LIMIT 1),
   (SELECT id FROM "Brand" WHERE name = 'MIKIA Original' LIMIT 1),
   'https://ik.imagekit.io/demo/products/tas-1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   
INSERT INTO "Product" ("id", "name", "sku", "description", "price", "stock", "categoryId", "brandId", "imageUrl", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Sneakers Adidas', 'SNK-001', 'Sneakers sporty dengan Adidas', 550000, 35,
   (SELECT id FROM "Category" WHERE name = 'Sepatu' LIMIT 1),
   (SELECT id FROM "Brand" WHERE name = 'Adidas' LIMIT 1),
   'https://ik.imagekit.io/demo/products/sneakers-adidas.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Admin User (password: admin123)
INSERT INTO "User" ("id", "email", "name", "password", "role", "avatarUrl", "biodata", "bankAccount", "salaryAmount", "paymentMethod", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@mikiaboutique.com',
  'Admin MIKIA',
  '$2b$10$4K3xSYLOJq/P8ni7.KJneO.tkf3W4LmoIrw7JkEpmlqj29FjwsUwC', -- admin123
  'SUPERADMIN',
  'https://ik.imagekit.io/demo/users/admin.jpg',
  'Administrator sistem POS MIKIA',
  'BCA 1234567890',
  5000000,
  'TRANSFER',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert Sample Employees (password: employee123)
INSERT INTO "User" ("id", "email", "name", "password", "role", "avatarUrl", "biodata", "bankAccount", "salaryAmount", "paymentMethod", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'kasir1@mikiaboutique.com', 'Sarah Putri', '$2b$10$CPUHpwFRSSyVPRgmFXlEfORbpEHpIMSFwh/wfODGaktziPdu24z5W', -- employee123
   'KARYAWAN', 'https://ik.imagekit.io/demo/users/sarah.jpg', 'Kasir senior dengan 3 tahun pengalaman', 'BNI 2345678901', 3500000, 'CASH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   
  (gen_random_uuid(), 'kasir2@mikiaboutique.com', 'Budi Santoso', '$2b$10$CPUHpwFRSSyVPRgmFXlEfORbpEHpIMSFwh/wfODGaktziPdu24z5W', -- employee123
   'KARYAWAN', 'https://ik.imagekit.io/demo/users/budi.jpg', 'Kasir part-time', 'Mandiri 3456789012', 2000000, 'CASH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Sample Operational Expenses
INSERT INTO "OperationalExpense" ("id", "category", "amount", "description", "date", "createdAt")
VALUES 
  (gen_random_uuid(), 'Sewa Toko', 5000000, 'Sewa toko bulan Januari 2024', CURRENT_DATE - INTERVAL '30 days', CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Listrik', 1500000, 'Tagihan listrik bulan Januari 2024', CURRENT_DATE - INTERVAL '28 days', CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Internet', 500000, 'Tagihan internet bulan Januari 2024', CURRENT_DATE - INTERVAL '25 days', CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Gaji Karyawan', 7000000, 'Gaji karyawan bulan Januari 2024', CURRENT_DATE - INTERVAL '20 days', CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'Marketing', 2000000, 'Iklan media sosial Januari 2024', CURRENT_DATE - INTERVAL '15 days', CURRENT_TIMESTAMP);

-- Insert Sample Testimonials
INSERT INTO "Testimonial" ("id", "name", "role", "content", "avatarUrl", "proofImageUrl", "rating", "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Andi Wijaya', 'Pelanggan Setia', 'Kualitas produk MIKIA sangat bagus, pelayanan ramah, harga terjangkau. Sangat recommended!', 
   'https://ik.imagekit.io/demo/testimonials/andi.jpg', 'https://ik.imagekit.io/demo/testimonials/proof-andi.jpg', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   
  (gen_random_uuid(), 'Maya Sari', 'Fashion Blogger', 'Fashion MIKIA selalu update dengan trend terkini. Sudah 3 tahun jadi pelanggan setia!', 
   'https://ik.imagekit.io/demo/testimonials/maya.jpg', 'https://ik.imagekit.io/demo/testimonials/proof-maya.jpg', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   
  (gen_random_uuid(), 'Rudi Hermawan', 'Pelanggan', 'Harga murah tapi kualitas premium. Saya beli tas dan sepatu di sini, awet dan stylish.', 
   'https://ik.imagekit.io/demo/testimonials/rudi.jpg', NULL, 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Sample Stock Movements
INSERT INTO "InventoryMovement" ("id", "productId", "quantity", "type", "source", "destination", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  p.id,
  100,
  'IN',
  'Supplier',
  'Gudang',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Product" p
LIMIT 5;

-- Update stock based on movements
UPDATE "Product" 
SET stock = stock + 100 
WHERE id IN (
  SELECT id FROM "Product" LIMIT 5
);

COMMIT;

-- Seed data completed!
-- Total records inserted:
-- - 1 Store
-- - 5 Categories  
-- - 5 Brands
-- - 8 Products
-- - 1 Admin User
-- - 2 Employees
-- - 5 Operational Expenses
-- - 3 Testimonials
-- - 5 Stock Movements
