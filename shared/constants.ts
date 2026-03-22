// App constants for POS Mikia Mobile
// Centralized configuration values

// App Configuration
export const APP_CONFIG = {
  name: 'MIKIA POS',
  version: '1.0.0',
  description: 'Boutique & Jastip Management System',
} as const;

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// Supabase Configuration
export const SUPABASE_CONFIG = {
  realtimeChannels: {
    products: 'products-changes',
    orders: 'orders-changes',
    inventory: 'inventory-changes',
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  auth: '@pos_mikia_auth',
  user: '@pos_mikia_user',
  settings: '@pos_mikia_settings',
  cart: '@pos_mikia_cart',
  offline_queue: '@pos_mikia_offline_queue',
  last_sync: '@pos_mikia_last_sync',
  bluetooth_printers: '@pos_mikia_bluetooth_printers',
} as const;

// Pagination
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
} as const;

// Currency
export const CURRENCY = {
  code: 'IDR',
  symbol: 'Rp',
  locale: 'id-ID',
} as const;

// Barcode
export const BARCODE = {
  supportedFormats: [
    'CODE_128',
    'CODE_39',
    'EAN_13',
    'EAN_8',
    'UPC_A',
    'UPC_E',
    'QR_CODE',
  ] as const,
  scanTimeout: 10000, // 10 seconds
} as const;

// Bluetooth Printer
export const PRINTER = {
  connectionTimeout: 15000, // 15 seconds
  paperWidth: 58, // mm
  maxCharsPerLine: 32,
  defaultFontSize: 1,
  alignment: {
    left: 0,
    center: 1,
    right: 2,
  } as const,
} as const;

// Offline Configuration
export const OFFLINE_CONFIG = {
  syncInterval: 30000, // 30 seconds
  maxQueueSize: 1000,
  retryAttempts: 5,
  retryDelay: 5000, // 5 seconds
} as const;

// Notification
export const NOTIFICATION = {
  types: {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
  } as const,
  duration: {
    short: 3000,
    medium: 5000,
    long: 8000,
  } as const,
} as const;

// Validation
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s\-\(\)]+$/,
  barcode: /^[A-Za-z0-9]+$/,
  sku: /^[A-Za-z0-9\-_]+$/,
} as const;

// Limits
export const LIMITS = {
  maxProductName: 100,
  maxDescription: 500,
  maxCustomerName: 100,
  maxQuantity: 9999,
  maxPrice: 999999999,
  minPrice: 0,
  maxStock: 99999,
  minStock: 0,
} as const;

// Colors
export const COLORS = {
  primary: '#f59e0b',
  secondary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  dark: '#1f2937',
  light: '#f9fafb',
  border: '#e5e7eb',
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    inverse: '#ffffff',
  },
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Typography
export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Animation
export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Permissions
export const PERMISSIONS = {
  camera: 'camera',
  bluetooth: 'bluetooth',
  location: 'location',
  notifications: 'notifications',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Koneksi internet bermasalah. Silakan periksa koneksi Anda.',
  server: 'Server sedang bermasalah. Silakan coba lagi nanti.',
  unauthorized: 'Anda tidak memiliki akses. Silakan login kembali.',
  forbidden: 'Akses ditolak. Anda tidak memiliki izin untuk melakukan ini.',
  notFound: 'Data tidak ditemukan.',
  validation: 'Input tidak valid. Silakan periksa kembali.',
  timeout: 'Request timeout. Silakan coba lagi.',
  unknown: 'Terjadi kesalahan yang tidak diketahui.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  login: 'Login berhasil!',
  logout: 'Logout berhasil!',
  create: 'Data berhasil ditambahkan!',
  update: 'Data berhasil diperbarui!',
  delete: 'Data berhasil dihapus!',
  sync: 'Sinkronisasi berhasil!',
  print: 'Print berhasil!',
  save: 'Data berhasil disimpan!',
} as const;

// Confirmation Messages
export const CONFIRMATION_MESSAGES = {
  delete: 'Apakah Anda yakin ingin menghapus data ini?',
  logout: 'Apakah Anda yakin ingin logout?',
  clearCart: 'Apakah Anda yakin ingin mengosongkan keranjang?',
  reset: 'Apakah Anda yakin ingin mereset data?',
} as const;
