export type UserRole = 'super_user' | 'user' | 'mini_user';
export type BackendRole = 'super' | 'user' | 'mini';

export interface User {
  id: string;
  email: string;
  password: string;
  role: BackendRole; // Backend returns 'super', 'user', 'mini'
  fullName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermissions {
  canViewDashboard: boolean;
  canViewOrders: boolean;
  canViewShipping: boolean;
  canManageUsers: boolean;
  canResetPasswords: boolean;
  canCreateAccounts: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_user: {
    canViewDashboard: true,
    canViewOrders: true,
    canViewShipping: true,
    canManageUsers: true,
    canResetPasswords: true,
    canCreateAccounts: true,
  },
  user: {
    canViewDashboard: true,
    canViewOrders: true,
    canViewShipping: true,
    canManageUsers: false,
    canResetPasswords: false,
    canCreateAccounts: false,
  },
  mini_user: {
    canViewDashboard: true,
    canViewOrders: false,
    canViewShipping: false,
    canManageUsers: false,
    canResetPasswords: false,
    canCreateAccounts: false,
  },
};

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  super_user: 'Super User',
  user: 'User',
  mini_user: 'Mini User',
};