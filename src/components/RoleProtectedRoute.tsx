import React, { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface RoleProtectedRouteProps {
  children: ReactNode
  requiredPermission: keyof typeof import('@/types/user').ROLE_PERMISSIONS.super_user
  fallback?: ReactNode
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallback,
}) => {
  const { hasPermission, currentUser } = useAuth()

  if (!hasPermission(requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Your role ({currentUser?.role}) doesn't have the required
              permissions.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Contact your administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
