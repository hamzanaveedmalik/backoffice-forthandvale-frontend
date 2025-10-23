import {
  Package,
  LayoutDashboard,
  Truck,
  Menu,
  LogOut,
  Users,
  UserPlus,
  FileText,
  Quote,
  Home,
} from 'lucide-react';
// import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_DISPLAY_NAMES, BackendRole, UserRole } from '@/types/user';

// Helper function to map backend roles to frontend roles
const mapBackendRoleToFrontend = (backendRole: BackendRole): UserRole => {
  const roleMap: Record<BackendRole, UserRole> = {
    super: 'super_user',
    user: 'user',
    mini: 'mini_user',
  };
  return roleMap[backendRole];
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { logout, currentUser, hasPermission } = useAuth();

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      permission: 'canViewDashboard' as const,
    },
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: LayoutDashboard,
      permission: 'canViewDashboard' as const,
    },
    {
      name: 'Leads',
      href: '/app/leads',
      icon: UserPlus,
      permission: 'canViewDashboard' as const,
    },
    {
      name: 'Samples',
      href: '/app/samples',
      icon: Package,
      permission: 'canViewDashboard' as const,
    },
    {
      name: 'Quotes',
      href: '/app/quotes',
      icon: FileText,
      permission: 'canViewDashboard' as const,
    },
    {
      name: 'Orders',
      href: '/app/orders',
      icon: Quote,
      permission: 'canViewOrders' as const,
    },
    {
      name: 'Shipping',
      href: '/app/shipping',
      icon: Truck,
      permission: 'canViewShipping' as const,
    },
    {
      name: 'Users',
      href: '/app/users',
      icon: Users,
      permission: 'canManageUsers' as const,
    },
  ].filter((item) => hasPermission(item.permission));

  return (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 bg-card border-r border-border h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex flex-col items-center gap-2">
              <img
                src="/fandv-logo.png"
                alt="FORTH & VALE Logo"
                className="w-[70%] h-auto object-contain"
              />
              <p className="text-xs text-muted-foreground text-center">
                Business Dashboard
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-muted"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div
          className={`space-y-2 ${
            collapsed ? 'flex flex-col items-center' : ''
          }`}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''} ${
                  collapsed ? 'justify-center' : ''
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div
          className={`flex items-center gap-2 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {currentUser?.fullName || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser
                  ? ROLE_DISPLAY_NAMES[
                      mapBackendRoleToFrontend(currentUser.role)
                    ]
                  : 'F&V Admin'}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className={`w-full mt-2 text-muted-foreground hover:text-foreground ${
            collapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </div>
  );
}
