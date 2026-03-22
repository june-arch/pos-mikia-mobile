// API service for React Native mobile app
// Uses shared contracts and mobile-specific implementations

import { supabase } from '../lib/supabase';
import {
  Product,
  Category,
  Brand,
  Order,
  OrderItem,
  Customer,
  User,
  Store,
  StockMovement,
  Expense,
  ApiResponse,
  PaginatedResponse,
  PaginationState,
  FilterState,
  CreateProductForm,
  UpdateProductForm,
  CreateOrderForm,
  OrderItemForm,
} from '@pos-mikia/shared';

// Mobile API service for POS Mikia
export class MobileAPIService {
  // Products
  async getProducts(
    pagination?: Partial<PaginationState>,
    filters?: Partial<FilterState>
  ): Promise<PaginatedResponse<Product>> {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*)
      `);

    // Apply filters
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    if (filters?.categoryId) {
      query = query.eq('categoryId', filters.categoryId);
    }
    if (filters?.brandId) {
      query = query.eq('brandId', filters.brandId);
    }
    if (filters?.inStock !== undefined) {
      query = query.gt('stock', filters.inStock ? 0 : -1);
    }
    if (filters?.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
    }

    // Apply pagination
    const limit = pagination?.limit || 20;
    const offset = ((pagination?.page || 1) - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      pagination: {
        page: pagination?.page || 1,
        limit,
        total: count || 0,
        hasMore: (offset + data.length) < (count || 0),
      },
    };
  }

  async getProductById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createProduct(form: CreateProductForm): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...form,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select(`
        *,
        category:categories(*),
        brand:brands(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProduct(form: UpdateProductForm): Promise<Product> {
    const { id, ...updateData } = form;
    
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        category:categories(*),
        brand:brands(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ isActive: false })
      .eq('id', id);

    if (error) throw error;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Orders
  async getOrders(
    pagination?: Partial<PaginationState>,
    filters?: {
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<PaginatedResponse<Order>> {
    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `);

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.dateFrom) {
      query = query.gte('createdAt', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('createdAt', filters.dateTo);
    }

    query = query.order('createdAt', { ascending: false });

    // Apply pagination
    const limit = pagination?.limit || 20;
    const offset = ((pagination?.page || 1) - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      pagination: {
        page: pagination?.page || 1,
        limit,
        total: count || 0,
        hasMore: (offset + data.length) < (count || 0),
      },
    };
  }

  async createOrder(form: CreateOrderForm): Promise<Order> {
    // Calculate total amount
    const totalAmount = form.items.reduce(
      (sum, item) => sum + item.quantity * (item as any).unitPrice,
      0
    );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customerName: form.customerName,
        paymentMethod: form.paymentMethod,
        totalAmount,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = form.items.map((item, index) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: (item as any).unitPrice,
      totalPrice: item.quantity * (item as any).unitPrice,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update stock
    for (const item of form.items) {
      await supabase.rpc('decrement_stock', {
        product_id: item.productId,
        quantity: item.quantity,
      });
    }

    // Return complete order with items
    return this.getOrderById(order.id);
  }

  async getOrderById(id: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Customers
  async getCustomers(search?: string): Promise<Customer[]> {
    let query = supabase.from('customers').select('*');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    query = query.order('name');

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        ...customer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Users
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  // Stock
  async getStockMovements(productId?: string): Promise<StockMovement[]> {
    let query = supabase
      .from('stock_movements')
      .select(`
        *,
        user:users(name),
        product:products(name)
      `)
      .order('createdAt', { ascending: false });

    if (productId) {
      query = query.eq('productId', productId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async addStockMovement(movement: Omit<StockMovement, 'id' | 'createdAt'>): Promise<StockMovement> {
    const { data, error } = await supabase
      .from('stock_movements')
      .insert({
        ...movement,
        createdAt: new Date().toISOString(),
      })
      .select(`
        *,
        user:users(name),
        product:products(name)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Reports
  async getSalesReport(dateFrom: string, dateTo: string): Promise<any> {
    const { data, error } = await supabase.rpc('get_sales_report', {
      p_date_from: dateFrom,
      p_date_to: dateTo,
    });

    if (error) throw error;
    return data;
  }

  // Search
  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*)
      `)
      .or(`name.ilike.%${query}%,sku.ilike.%${query}%,barcode.ilike.%${query}%`)
      .eq('isActive', true)
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  // Barcode lookup
  async getProductByBarcode(barcode: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*)
      `)
      .eq('barcode', barcode)
      .eq('isActive', true)
      .single();

    if (error) return null;
    return data;
  }
}

// Create API instance
export const api = new MobileAPIService();

// Export specific API services for convenience
export const productsAPI = {
  getProducts: api.getProducts.bind(api),
  getProductById: api.getProductById.bind(api),
  createProduct: api.createProduct.bind(api),
  updateProduct: api.updateProduct.bind(api),
  deleteProduct: api.deleteProduct.bind(api),
  searchProducts: api.searchProducts.bind(api),
  getProductByBarcode: api.getProductByBarcode.bind(api),
};

export const ordersAPI = {
  getOrders: api.getOrders.bind(api),
  createOrder: api.createOrder.bind(api),
  getOrderById: api.getOrderById.bind(api),
  updateOrderStatus: api.updateOrderStatus.bind(api),
};

export const customersAPI = {
  getCustomers: api.getCustomers.bind(api),
  createCustomer: api.createCustomer.bind(api),
};

export const categoriesAPI = {
  getCategories: api.getCategories.bind(api),
};

export const brandsAPI = {
  getBrands: api.getBrands.bind(api),
};

export const stockAPI = {
  getStockMovements: api.getStockMovements.bind(api),
  addStockMovement: api.addStockMovement.bind(api),
};

export const reportsAPI = {
  getSalesReport: api.getSalesReport.bind(api),
};

// Export default API
export default api;
