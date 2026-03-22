-- Supabase Schema for POS Mikia
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'KARYAWAN');
CREATE TYPE "SalaryPaymentMethod" AS ENUM ('CASH', 'TRANSFER');
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT', 'TRANSFER');
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'RECEIVED', 'CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'QRIS', 'TRANSFER');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- Users Table
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" DEFAULT 'KARYAWAN' NOT NULL,
  "avatarUrl" TEXT,
  "biodata" TEXT,
  "bankAccount" TEXT,
  "salaryAmount" REAL DEFAULT 0 NOT NULL,
  "paymentMethod" "SalaryPaymentMethod" DEFAULT 'CASH' NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Store Table
CREATE TABLE "Store" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "name" TEXT NOT NULL,
  "address" TEXT,
  "phone" TEXT,
  "openHours" TEXT,
  "qrisImageUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Category Table
CREATE TABLE "Category" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "name" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Brand Table
CREATE TABLE "Brand" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "name" TEXT UNIQUE NOT NULL,
  "logoUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Product Table
CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "name" TEXT NOT NULL,
  "sku" TEXT UNIQUE NOT NULL,
  "description" TEXT,
  "price" REAL NOT NULL,
  "stock" INTEGER DEFAULT 0 NOT NULL,
  "categoryId" TEXT NOT NULL REFERENCES "Category"("id"),
  "brandId" TEXT REFERENCES "Brand"("id"),
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Salary Payment Table
CREATE TABLE "SalaryPayment" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "amount" REAL NOT NULL,
  "status" TEXT DEFAULT 'PAID' NOT NULL,
  "paidAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "notes" TEXT
);

-- Stock Invoice Table
CREATE TABLE "StockInvoice" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "invoiceNo" TEXT UNIQUE NOT NULL,
  "supplier" TEXT,
  "totalAmount" REAL DEFAULT 0 NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Stock Invoice Item Table
CREATE TABLE "StockInvoiceItem" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "stockInvoiceId" TEXT NOT NULL REFERENCES "StockInvoice"("id"),
  "productId" TEXT NOT NULL REFERENCES "Product"("id"),
  "quantity" INTEGER NOT NULL,
  "priceCost" REAL NOT NULL
);

-- Stock Transfer Table
CREATE TABLE "StockTransfer" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "transferNo" TEXT UNIQUE NOT NULL,
  "source" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "status" "TransferStatus" DEFAULT 'PENDING' NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Stock Transfer Item Table
CREATE TABLE "StockTransferItem" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "stockTransferId" TEXT NOT NULL REFERENCES "StockTransfer"("id"),
  "productId" TEXT NOT NULL REFERENCES "Product"("id"),
  "quantity" INTEGER NOT NULL
);

-- Operational Expense Table
CREATE TABLE "OperationalExpense" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "category" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "description" TEXT,
  "date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Order Table
CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "cashierId" TEXT NOT NULL REFERENCES "User"("id"),
  "customerName" TEXT,
  "totalAmount" REAL NOT NULL,
  "paymentMethod" "PaymentMethod" NOT NULL,
  "status" "OrderStatus" DEFAULT 'COMPLETED' NOT NULL,
  "isJastip" BOOLEAN DEFAULT false NOT NULL,
  "paymentProofUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Order Item Table
CREATE TABLE "OrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "orderId" TEXT NOT NULL REFERENCES "Order"("id"),
  "productId" TEXT NOT NULL REFERENCES "Product"("id"),
  "quantity" INTEGER NOT NULL,
  "price" REAL NOT NULL
);

-- Testimonial Table
CREATE TABLE "Testimonial" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "name" TEXT NOT NULL,
  "role" TEXT,
  "content" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "proofImageUrl" TEXT,
  "rating" INTEGER DEFAULT 5 NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Inventory Movement Table (moved to end to avoid circular references)
CREATE TABLE "InventoryMovement" (
  "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  "productId" TEXT NOT NULL REFERENCES "Product"("id"),
  "quantity" INTEGER NOT NULL,
  "type" "MovementType" NOT NULL,
  "source" TEXT,
  "destination" TEXT NOT NULL,
  "invoiceId" TEXT REFERENCES "StockInvoice"("id"),
  "transferId" TEXT REFERENCES "StockTransfer"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");
CREATE INDEX "Order_cashierId_idx" ON "Order"("cashierId");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE INDEX "InventoryMovement_productId_idx" ON "InventoryMovement"("productId");
CREATE INDEX "SalaryPayment_userId_idx" ON "SalaryPayment"("userId");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER "User_updated_at" BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Store_updated_at" BEFORE UPDATE ON "Store" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Category_updated_at" BEFORE UPDATE ON "Category" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Brand_updated_at" BEFORE UPDATE ON "Brand" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Product_updated_at" BEFORE UPDATE ON "Product" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "StockTransfer_updated_at" BEFORE UPDATE ON "StockTransfer" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Testimonial_updated_at" BEFORE UPDATE ON "Testimonial" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
