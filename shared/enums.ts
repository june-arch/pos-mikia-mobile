// Enums and types for POS Mikia Mobile
// Centralized enum definitions

// User Roles
export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

// Order Status
export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// Payment Methods
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  EWALLET = 'EWALLET',
  TRANSFER = 'TRANSFER',
}

// Stock Movement Types
export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
}

// Expense Categories
export enum ExpenseCategoryType {
  RENT = 'RENT',
  UTILITIES = 'UTILITIES',
  SALARIES = 'SALARIES',
  MARKETING = 'MARKETING',
  MAINTENANCE = 'MAINTENANCE',
  SUPPLIES = 'SUPPLIES',
  OTHER = 'OTHER',
}

// Notification Types
export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

// Sync Queue Status
export enum SyncQueueStatus {
  PENDING = 'PENDING',
  SYNCING = 'SYNCING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Print Job Status
export enum PrintJobStatus {
  PENDING = 'PENDING',
  PRINTING = 'PRINTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Print Job Types
export enum PrintJobType {
  RECEIPT = 'RECEIPT',
  REPORT = 'REPORT',
  LABEL = 'LABEL',
}

// Export Formats
export enum ExportFormat {
  CSV = 'CSV',
  PDF = 'PDF',
  EXCEL = 'EXCEL',
}

// Export Types
export enum ExportType {
  PRODUCTS = 'PRODUCTS',
  ORDERS = 'ORDERS',
  REPORTS = 'REPORTS',
  INVENTORY = 'INVENTORY',
}

// Sort Options
export enum SortOption {
  NAME = 'name',
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  STOCK = 'stock',
}

// Sort Order
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Filter Options
export enum FilterOption {
  IN_STOCK = 'inStock',
  OUT_OF_STOCK = 'outOfStock',
  LOW_STOCK = 'lowStock',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// UI States
export enum UIState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

// Screen Names
export enum ScreenName {
  LOGIN = 'Login',
  DASHBOARD = 'Dashboard',
  PRODUCTS = 'Products',
  CART = 'Cart',
  CHECKOUT = 'Checkout',
  ORDERS = 'Orders',
  CUSTOMERS = 'Customers',
  REPORTS = 'Reports',
  SETTINGS = 'Settings',
  PROFILE = 'Profile',
  BARCODE_SCANNER = 'BarcodeScanner',
  BLUETOOTH_PRINTERS = 'BluetoothPrinters',
}

// Tab Names
export enum TabName {
  HOME = 'Home',
  PRODUCTS = 'Products',
  ORDERS = 'Orders',
  REPORTS = 'Reports',
  SETTINGS = 'Settings',
}

// Permission Types
export enum Permission {
  READ_PRODUCTS = 'read_products',
  WRITE_PRODUCTS = 'write_products',
  DELETE_PRODUCTS = 'delete_products',
  READ_ORDERS = 'read_orders',
  WRITE_ORDERS = 'write_orders',
  DELETE_ORDERS = 'delete_orders',
  READ_CUSTOMERS = 'read_customers',
  WRITE_CUSTOMERS = 'write_customers',
  DELETE_CUSTOMERS = 'delete_customers',
  READ_REPORTS = 'read_reports',
  MANAGE_USERS = 'manage_users',
  MANAGE_SETTINGS = 'manage_settings',
}

// Error Codes
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Log Levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

// Device Types
export enum DeviceType {
  PRINTER = 'printer',
  SCANNER = 'scanner',
  DISPLAY = 'display',
}

// Connection Status
export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  ERROR = 'error',
}

// Data Sync Status
export enum DataSyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  SYNCING = 'syncing',
  ERROR = 'error',
}

// App Themes
export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

// Language
export enum Language {
  INDONESIAN = 'id',
  ENGLISH = 'en',
}

// Currency
export enum Currency {
  IDR = 'IDR',
  USD = 'USD',
  EUR = 'EUR',
}

// Time Formats
export enum TimeFormat {
  FORMAT_12 = '12h',
  FORMAT_24 = '24h',
}

// Date Formats
export enum DateFormat {
  DD_MM_YYYY = 'dd/MM/yyyy',
  MM_DD_YYYY = 'MM/dd/yyyy',
  YYYY_MM_DD = 'yyyy-MM-dd',
  DD_MM_YY = 'dd/MM/yy',
}

// Barcode Formats
export enum BarcodeFormat {
  CODE_128 = 'CODE_128',
  CODE_39 = 'CODE_39',
  EAN_13 = 'EAN_13',
  EAN_8 = 'EAN_8',
  UPC_A = 'UPC_A',
  UPC_E = 'UPC_E',
  QR_CODE = 'QR_CODE',
  PDF_417 = 'PDF_417',
  AZTEC = 'AZTEC',
}

// Printer Alignment
export enum PrinterAlignment {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

// Printer Font Size
export enum PrinterFontSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

// Notification Channels
export enum NotificationChannel {
  ORDERS = 'orders',
  INVENTORY = 'inventory',
  SYSTEM = 'system',
  MARKETING = 'marketing',
}

// Report Types
export enum ReportType {
  SALES = 'sales',
  INVENTORY = 'inventory',
  EXPENSES = 'expenses',
  CUSTOMERS = 'customers',
  PRODUCTS = 'products',
}

// Date Range Types
export enum DateRangeType {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THIS_WEEK = 'this_week',
  LAST_WEEK = 'last_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_YEAR = 'this_year',
  LAST_YEAR = 'last_year',
  CUSTOM = 'custom',
}

// Chart Types
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area',
  DONUT = 'donut',
}

// Loading Types
export enum LoadingType {
  SPINNER = 'spinner',
  SKELETON = 'skeleton',
  OVERLAY = 'overlay',
}

// Modal Types
export enum ModalType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  CONFIRM = 'confirm',
  INPUT = 'input',
}

// Input Types
export enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  PASSWORD = 'password',
  SEARCH = 'search',
  URL = 'url',
}

// Button Variants
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  DANGER = 'danger',
}

// Button Sizes
export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}
