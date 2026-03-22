// Shared TypeScript contracts for POS Mikia Mobile
// Pure interfaces only - no platform dependencies

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE';
  storeId: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  image?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  barcode: string;
  categoryId: string;
  brandId: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  customerId?: string;
  customerName?: string;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'EWALLET' | 'TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints?: number;
  createdAt: string;
  updatedAt: string;
}

// Store types
export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  settings: StoreSettings;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  taxRate: number;
  currency: string;
  receiptHeader: string;
  receiptFooter: string;
  lowStockThreshold: number;
  enableBarcode: boolean;
  enableBluetooth: boolean;
  enableNotifications: boolean;
}

// Inventory types
export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  userId: string;
  createdAt: string;
}

// Employee types
export interface Employee {
  id: string;
  userId: string;
  storeId: string;
  position: string;
  salary?: number;
  hireDate: string;
  isActive: boolean;
  user?: User;
}

// Expense types
export interface Expense {
  id: string;
  storeId: string;
  userId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// Report types
export interface SalesReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: ProductSales[];
  paymentMethods: PaymentMethodStats[];
}

export interface ProductSales {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

// Form types
export interface CreateProductForm {
  name: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  barcode: string;
  categoryId: string;
  brandId: string;
  imageUrl?: string;
}

export interface UpdateProductForm extends Partial<CreateProductForm> {
  id: string;
}

export interface CreateOrderForm {
  customerName?: string;
  paymentMethod: 'CASH' | 'CARD' | 'EWALLET' | 'TRANSFER';
  items: OrderItemForm[];
}

export interface OrderItemForm {
  productId: string;
  quantity: number;
}

// UI State types
export interface UIStateInterface {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface FilterState {
  search?: string;
  categoryId?: string;
  brandId?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Bluetooth Printer types
export interface BluetoothPrinter {
  id: string;
  name: string;
  address: string;
  isConnected: boolean;
  lastConnected?: string;
}

export interface PrintJob {
  id: string;
  type: 'RECEIPT' | 'REPORT' | 'LABEL';
  data: any;
  status: 'PENDING' | 'PRINTING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

// Offline Sync types
export interface SyncQueue {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  data: any;
  status: 'PENDING' | 'SYNCING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  syncedAt?: string;
  error?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// Export types
export interface ExportData {
  format: 'CSV' | 'PDF' | 'EXCEL';
  type: 'PRODUCTS' | 'ORDERS' | 'REPORTS' | 'INVENTORY';
  filters?: any;
  dateRange?: [string, string];
}

// Chart Data types
export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationState;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
