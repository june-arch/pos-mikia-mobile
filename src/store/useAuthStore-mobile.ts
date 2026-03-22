// Zustand store for authentication state
// Mobile-compatible version with shared contracts

import { create } from 'zustand';
import {
  AuthUser,
  UIState,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@pos-mikia/shared';
import { authService, MobileSessionManager } from '../services/auth';

interface AuthState extends UIState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authService.signIn(email, password);
      await MobileSessionManager.saveSession(result.session);
      set({ 
        user: result.user, 
        isAuthenticated: true, 
        isLoading: false,
        success: SUCCESS_MESSAGES.login,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.unauthorized, 
        isLoading: false 
      });
    }
  },

  signUp: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authService.signUp(email, password, name);
      if (result.session) {
        await MobileSessionManager.saveSession(result.session);
      }
      if (result.user) {
        set({ 
          user: result.user, 
          isAuthenticated: true, 
          isLoading: false,
          success: SUCCESS_MESSAGES.login,
        });
      } else {
        set({ 
          isLoading: false,
          success: 'Account created. Please check your email to verify.',
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.validation, 
        isLoading: false 
      });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    
    try {
      await authService.signOut();
      await MobileSessionManager.clearSession();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null,
        success: SUCCESS_MESSAGES.logout,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.unknown, 
        isLoading: false 
      });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await authService.resetPassword(email);
      set({ 
        isLoading: false,
        success: 'Password reset link sent to your email',
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.validation, 
        isLoading: false 
      });
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      const session = await MobileSessionManager.getSession();
      
      if (session && await MobileSessionManager.isSessionValid(session)) {
        const user = await authService.getCurrentUser();
        set({ 
          user, 
          isAuthenticated: !!user, 
          isLoading: false 
        });
      } else {
        await MobileSessionManager.clearSession();
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.unknown, 
        isLoading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null, success: null });
  },
}));

// Auth hooks for convenience
export const useAuth = () => {
  const auth = useAuthStore();
  
  return {
    ...auth,
    isAdmin: auth.user?.role === 'ADMIN' || auth.user?.role === 'SUPERADMIN',
    isSuperAdmin: auth.user?.role === 'SUPERADMIN',
    canManageProducts: auth.user?.role === 'ADMIN' || auth.user?.role === 'SUPERADMIN',
    canManageUsers: auth.user?.role === 'SUPERADMIN',
    canViewReports: auth.user?.role === 'ADMIN' || auth.user?.role === 'SUPERADMIN',
    isEmployee: auth.user?.role === 'EMPLOYEE',
    roleDisplayName: auth.user ? 
      auth.user.role === 'SUPERADMIN' ? 'Super Admin' :
      auth.user.role === 'ADMIN' ? 'Admin' : 'Employee' : null,
  };
};
