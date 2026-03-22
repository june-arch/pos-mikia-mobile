// Product store for React Native mobile app
// Uses shared contracts and Zustand for state management

import { create } from 'zustand';
import {
  Product,
  Category,
  Brand,
  PaginationState,
  FilterState,
  UIState,
  CreateProductForm,
  UpdateProductForm,
} from '@pos-mikia/shared';
import { productsAPI, categoriesAPI, brandsAPI } from '../services/api';

interface ProductState extends UIState {
  // Products
  products: Product[];
  categories: Category[];
  brands: Brand[];
  pagination: PaginationState;
  filters: FilterState;
  
  // Cart
  cart: CartItem[];
  cartTotal: number;
  
  // Actions
  fetchProducts: (pagination?: Partial<PaginationState>, filters?: Partial<FilterState>) => Promise<void>;
  createProduct: (form: CreateProductForm) => Promise<void>;
  updateProduct: (form: UpdateProductForm) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  getProductByBarcode: (barcode: string) => Promise<Product | null>;
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Categories and brands
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  
  // UI actions
  setFilters: (filters: Partial<FilterState>) => void;
  clearError: () => void;
}

interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  categories: [],
  brands: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  },
  filters: {},
  cart: [],
  cartTotal: 0,
  isLoading: false,
  error: null,
  success: null,

  // Fetch products
  fetchProducts: async (pagination?: Partial<PaginationState>, filters?: Partial<FilterState>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await productsAPI.getProducts(pagination, {
        ...get().filters,
        ...filters,
      });
      
      set({
        products: response.data,
        pagination: response.pagination,
        filters: { ...get().filters, ...filters },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  // Create product
  createProduct: async (form: CreateProductForm) => {
    set({ isLoading: true, error: null });
    
    try {
      const newProduct = await productsAPI.createProduct(form);
      
      set(state => ({
        products: [newProduct, ...state.products],
        isLoading: false,
        success: 'Product created successfully',
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create product',
        isLoading: false,
      });
    }
  },

  // Update product
  updateProduct: async (form: UpdateProductForm) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedProduct = await productsAPI.updateProduct(form);
      
      set(state => ({
        products: state.products.map(p => p.id === form.id ? updatedProduct : p),
        isLoading: false,
        success: 'Product updated successfully',
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update product',
        isLoading: false,
      });
    }
  },

  // Delete product
  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await productsAPI.deleteProduct(id);
      
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        isLoading: false,
        success: 'Product deleted successfully',
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete product',
        isLoading: false,
      });
    }
  },

  // Search products
  searchProducts: async (query: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const results = await productsAPI.searchProducts(query);
      
      set({
        products: results,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search products',
        isLoading: false,
      });
    }
  },

  // Get product by barcode
  getProductByBarcode: async (barcode: string) => {
    try {
      const product = await productsAPI.getProductByBarcode(barcode);
      return product;
    } catch (error) {
      console.error('Failed to get product by barcode:', error);
      return null;
    }
  },

  // Add to cart
  addToCart: (product: Product, quantity: number = 1) => {
    set(state => {
      const existingItem = state.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedCart = state.cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        return {
          cart: updatedCart,
          cartTotal: calculateCartTotal(updatedCart),
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity,
          addedAt: new Date().toISOString(),
        };
        
        const updatedCart = [...state.cart, newItem];
        
        return {
          cart: updatedCart,
          cartTotal: calculateCartTotal(updatedCart),
        };
      }
    });
  },

  // Remove from cart
  removeFromCart: (productId: string) => {
    set(state => {
      const updatedCart = state.cart.filter(item => item.product.id !== productId);
      
      return {
        cart: updatedCart,
        cartTotal: calculateCartTotal(updatedCart),
      };
    });
  },

  // Update cart item quantity
  updateCartItemQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    set(state => {
      const updatedCart = state.cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      
      return {
        cart: updatedCart,
        cartTotal: calculateCartTotal(updatedCart),
      };
    });
  },

  // Clear cart
  clearCart: () => {
    set({
      cart: [],
      cartTotal: 0,
    });
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const categories = await categoriesAPI.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  // Fetch brands
  fetchBrands: async () => {
    try {
      const brands = await brandsAPI.getBrands();
      set({ brands });
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  },

  // Set filters
  setFilters: (filters: Partial<FilterState>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Helper function to calculate cart total
function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
}

// Selectors for convenience
export const useProducts = () => {
  const store = useProductStore();
  return {
    products: store.products,
    isLoading: store.isLoading,
    error: store.error,
    pagination: store.pagination,
    filters: store.filters,
    fetchProducts: store.fetchProducts,
    createProduct: store.createProduct,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,
    searchProducts: store.searchProducts,
    setFilters: store.setFilters,
    clearError: store.clearError,
  };
};

export const useCart = () => {
  const store = useProductStore();
  return {
    cart: store.cart,
    cartTotal: store.cartTotal,
    cartItemsCount: store.cart.reduce((count, item) => count + item.quantity, 0),
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateCartItemQuantity: store.updateCartItemQuantity,
    clearCart: store.clearCart,
    isInCart: (productId: string) => store.cart.some(item => item.product.id === productId),
    getCartItem: (productId: string) => store.cart.find(item => item.product.id === productId),
  };
};

export const useProductCatalog = () => {
  const store = useProductStore();
  return {
    categories: store.categories,
    brands: store.brands,
    fetchCategories: store.fetchCategories,
    fetchBrands: store.fetchBrands,
    getProductByBarcode: store.getProductByBarcode,
  };
};
