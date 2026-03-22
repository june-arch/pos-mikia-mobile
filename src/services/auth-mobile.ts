// Authentication service for React Native mobile app
// Simplified version for mobile compatibility

import { supabase } from '../lib/supabase';
import { AuthUser } from '@pos-mikia/shared-types';

// Simplified auth service for mobile
export class MobileAuthService {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: {
          id: data.user?.id || '',
          email: data.user?.email || '',
          name: data.user?.user_metadata?.name || data.user?.email || '',
          role: data.user?.user_metadata?.role || 'EMPLOYEE',
          image: data.user?.user_metadata?.avatar_url
        },
        session: data.session
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, name?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email,
            role: 'EMPLOYEE'
          }
        }
      });

      if (error) throw error;

      return {
        user: {
          id: data.user?.id || '',
          email: data.user?.email || '',
          name: data.user?.user_metadata?.name || data.user?.email || '',
          role: data.user?.user_metadata?.role || 'EMPLOYEE',
          image: data.user?.user_metadata?.avatar_url
        },
        session: data.session
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email || '',
        role: user.user_metadata?.role || 'EMPLOYEE',
        image: user.user_metadata?.avatar_url
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async resetPassword(email: string) {
    try {
      await supabase.auth.resetPasswordForEmail(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

// Session management for mobile
export class MobileSessionManager {
  private static readonly SESSION_KEY = 'pos_mikia_session';

  static async saveSession(session: any): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  static async getSession(): Promise<any> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const session = await AsyncStorage.getItem(this.SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  static async clearSession(): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  static async isSessionValid(session: any): Promise<boolean> {
    if (!session) return false;
    
    const sessionTime = new Date(session.expires_at).getTime();
    const currentTime = new Date().getTime();
    return sessionTime > currentTime;
  }
}

// Auth utilities
export class MobileAuthUtils {
  private authService = new MobileAuthService();

  async initializeAuth(): Promise<AuthUser | null> {
    try {
      const session = await MobileSessionManager.getSession();
      
      if (session && await MobileSessionManager.isSessionValid(session)) {
        return await this.authService.getCurrentUser();
      } else {
        await MobileSessionManager.clearSession();
        return null;
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      return null;
    }
  }

  async signIn(email: string, password: string) {
    const result = await this.authService.signIn(email, password);
    await MobileSessionManager.saveSession(result.session);
    return result;
  }

  async signUp(email: string, password: string, name?: string) {
    const result = await this.authService.signUp(email, password, name);
    if (result.session) {
      await MobileSessionManager.saveSession(result.session);
    }
    return result;
  }

  async signOut() {
    await this.authService.signOut();
    await MobileSessionManager.clearSession();
  }

  async resetPassword(email: string) {
    await this.authService.resetPassword(email);
  }

  // Permission helpers
  static isAdmin(user: AuthUser | null): boolean {
    return user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  }

  static isSuperAdmin(user: AuthUser | null): boolean {
    return user?.role === 'SUPERADMIN';
  }

  static canAccessDashboard(user: AuthUser | null): boolean {
    return user !== null;
  }

  static canManageProducts(user: AuthUser | null): boolean {
    return this.isAdmin(user);
  }

  static canManageUsers(user: AuthUser | null): boolean {
    return this.isSuperAdmin(user);
  }

  static canViewReports(user: AuthUser | null): boolean {
    return this.isAdmin(user);
  }

  static canProcessOrders(user: AuthUser | null): boolean {
    return user !== null;
  }
}

// Export instance
export const authService = new MobileAuthService();
export const authUtils = new MobileAuthUtils();
