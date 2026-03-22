// Zustand store for authentication state
// Works with mobile auth service

import { create } from 'zustand';
import { AuthUser } from '@shared-types';
import { MobileAuthUtils } from '../services/auth';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
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
  isLoading: false,
  isAuthenticated: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await MobileAuthUtils.signIn(email, password);
      set({ 
        user: result.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign in failed', 
        isLoading: false 
      });
    }
  },

  signUp: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await MobileAuthUtils.signUp(email, password, name);
      if (result.user) {
        set({ 
          user: result.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ 
          isLoading: false,
          error: 'Account created. Please check your email to verify.'
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign up failed', 
        isLoading: false 
      });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    
    try {
      await MobileAuthUtils.signOut();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign out failed', 
        isLoading: false 
      });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await MobileAuthUtils.resetPassword(email);
      set({ 
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Password reset failed', 
        isLoading: false 
      });
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      const user = await MobileAuthUtils.initializeAuth();
      set({ 
        user, 
        isAuthenticated: !!user, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Auth initialization failed', 
        isLoading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Auth hooks for convenience
export const useAuth = () => {
  const auth = useAuthStore();
  
  return {
    ...auth,
    isAdmin: auth.user?.role === 'ADMIN' || auth.user?.role === 'SUPERADMIN',
    isSuperAdmin: auth.user?.role === 'SUPERADMIN',
    canManageProducts: auth.isAdmin,
    canManageUsers: auth.isSuperAdmin,
    canViewReports: auth.isAdmin,
  };
};
