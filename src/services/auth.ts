// Authentication service for React Native mobile app
// Uses shared contracts and mobile-specific implementations

import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthUser,
  User,
  UserRole,
  STORAGE_KEYS,
  ERROR_MESSAGES,
} from '@pos-mikia/shared';

// Mobile authentication service
export class MobileAuthService {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: AuthUser; session: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user || !data.session) {
        throw new Error('Sign in failed');
      }

      // Get user profile from database
      const userProfile = await this.getUserProfile(data.user.id);

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        name: userProfile?.name || data.user.user_metadata?.name || email,
        role: userProfile?.role || 'EMPLOYEE',
        image: userProfile?.avatarUrl || data.user.user_metadata?.avatar_url,
      };

      return {
        user: authUser,
        session: data.session,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string, name?: string): Promise<{ user?: AuthUser; session?: any }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email,
            role: 'EMPLOYEE',
          },
        },
      });

      if (error) throw error;

      if (data.user && data.session) {
        // User is automatically signed in
        const userProfile = await this.getUserProfile(data.user.id);

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: userProfile?.name || data.user.user_metadata?.name || name || email,
          role: userProfile?.role || 'EMPLOYEE',
          image: userProfile?.avatarUrl || data.user.user_metadata?.avatar_url,
        };

        return {
          user: authUser,
          session: data.session,
        };
      }

      // User created but needs email verification
      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local storage
      await AsyncStorage.removeItem(STORAGE_KEYS.auth);
      await AsyncStorage.removeItem(STORAGE_KEYS.user);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get current authenticated user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      // Get user profile from database
      const userProfile = await this.getUserProfile(user.id);

      const authUser: AuthUser = {
        id: user.id,
        email: user.email || '',
        name: userProfile?.name || user.user_metadata?.name || user.email || '',
        role: userProfile?.role || 'EMPLOYEE',
        image: userProfile?.avatarUrl || user.user_metadata?.avatar_url,
      };

      return authUser;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Save session to AsyncStorage
  async saveSession(session: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(session));
    } catch (error) {
      console.error('Save session error:', error);
      throw error;
    }
  }

  // Get session from AsyncStorage
  async getSession(): Promise<any | null> {
    try {
      const sessionData = await AsyncStorage.getItem(STORAGE_KEYS.auth);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  // Clear session from AsyncStorage
  async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.auth);
      await AsyncStorage.removeItem(STORAGE_KEYS.user);
    } catch (error) {
      console.error('Clear session error:', error);
      throw error;
    }
  }

  // Check if session is valid
  async isSessionValid(session: any): Promise<boolean> {
    try {
      if (!session) return false;

      const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
      
      if (error || !user) {
        await this.clearSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Check session validity error:', error);
      return false;
    }
  }

  // Initialize auth state
  async initializeAuth(): Promise<AuthUser | null> {
    try {
      const session = await this.getSession();
      
      if (session && await this.isSessionValid(session)) {
        const user = await this.getCurrentUser();
        if (user) {
          await this.saveSession(session);
          return user;
        }
      } else {
        await this.clearSession();
      }

      return null;
    } catch (error) {
      console.error('Initialize auth error:', error);
      await this.clearSession();
      return null;
    }
  }

  // Get user profile from database
  private async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }
}

// Mobile session manager
export class MobileSessionManager {
  static async saveSession(session: any): Promise<void> {
    const authService = new MobileAuthService();
    return authService.saveSession(session);
  }

  static async getSession(): Promise<any | null> {
    const authService = new MobileAuthService();
    return authService.getSession();
  }

  static async clearSession(): Promise<void> {
    const authService = new MobileAuthService();
    return authService.clearSession();
  }

  static async isSessionValid(session: any): Promise<boolean> {
    const authService = new MobileAuthService();
    return authService.isSessionValid(session);
  }
}

// Mobile auth utilities
export class MobileAuthUtils {
  static hasPermission(user: AuthUser | null, permission: string): boolean {
    if (!user) return false;

    const permissions = {
      [UserRole.SUPERADMIN]: [
        'read_products', 'write_products', 'delete_products',
        'read_orders', 'write_orders', 'delete_orders',
        'read_customers', 'write_customers', 'delete_customers',
        'read_reports', 'manage_users', 'manage_settings',
      ],
      [UserRole.ADMIN]: [
        'read_products', 'write_products', 'delete_products',
        'read_orders', 'write_orders', 'delete_orders',
        'read_customers', 'write_customers', 'delete_customers',
        'read_reports',
      ],
      [UserRole.EMPLOYEE]: [
        'read_products', 'read_orders', 'read_customers',
      ],
    };

    return permissions[user.role as UserRole]?.includes(permission) || false;
  }

  static canManageProducts(user: AuthUser | null): boolean {
    return this.hasPermission(user, 'write_products');
  }

  static canManageOrders(user: AuthUser | null): boolean {
    return this.hasPermission(user, 'write_orders');
  }

  static canManageUsers(user: AuthUser | null): boolean {
    return this.hasPermission(user, 'manage_users');
  }

  static canViewReports(user: AuthUser | null): boolean {
    return this.hasPermission(user, 'read_reports');
  }

  static isAdmin(user: AuthUser | null): boolean {
    return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN;
  }

  static isSuperAdmin(user: AuthUser | null): boolean {
    return user?.role === UserRole.SUPERADMIN;
  }

  static getRoleDisplayName(role: string): string {
    const roleNames = {
      [UserRole.SUPERADMIN]: 'Super Admin',
      [UserRole.ADMIN]: 'Admin',
      [UserRole.EMPLOYEE]: 'Employee',
    };

    return roleNames[role as UserRole] || role;
  }
}

// Create auth service instance
export const authService = new MobileAuthService();

// Export auth utilities
export { MobileAuthUtils as AuthUtils };

// Export default
export default authService;
