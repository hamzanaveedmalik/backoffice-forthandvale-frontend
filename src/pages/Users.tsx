import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Edit, Trash2, Key } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { User, UserRole, BackendRole, ROLE_DISPLAY_NAMES } from '@/types/user'
import { getAllUsers, createUser, updateUser, deleteUser } from '../api/users'

// Helper function to map backend roles to frontend roles
const mapBackendRoleToFrontend = (backendRole: BackendRole): UserRole => {
  const roleMap: Record<BackendRole, UserRole> = {
    super: 'super_user',
    user: 'user',
    mini: 'mini_user',
  }
  return roleMap[backendRole]
}

// Helper function to map frontend roles to backend roles
const mapFrontendRoleToBackend = (frontendRole: UserRole): BackendRole => {
  const roleMap: Record<UserRole, BackendRole> = {
    super_user: 'super',
    user: 'user',
    mini_user: 'mini',
  }
  return roleMap[frontendRole]
}

export default function Users() {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    password: '',
    role: 'user' as BackendRole,
  })

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (error) {
        console.error('Failed to load users:', error)
        setError('Failed to load users')
      } finally {
        setIsLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      setError('Email, full name, and password are required')
      return
    }

    try {
      await createUser({
        ...newUser,
      })
      const allUsers = await getAllUsers()
      setUsers(allUsers)
      setNewUser({
        email: '',
        fullName: '',
        password: '',
        role: 'user' as BackendRole,
      })
      setIsCreateDialogOpen(false)
      setError('')
      setSuccess('User created successfully')
    } catch (err) {
      setError('Failed to create user')
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      await updateUser(editingUser.id, editingUser)
      const allUsers = await getAllUsers()
      setUsers(allUsers)
      setIsEditDialogOpen(false)
      setEditingUser(null)
      setError('')
      setSuccess('User updated successfully')
    } catch (err) {
      setError('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId)
        const allUsers = await getAllUsers()
        setUsers(allUsers)
        setError('')
        setSuccess('User deleted successfully')
      } catch (err) {
        setError('Failed to delete user')
      }
    }
  }

  const handleResetPassword = async (userId: string) => {
    const newPassword = prompt('Enter new password:')
    if (newPassword) {
      try {
        await updateUser(userId, { password: newPassword })
        const allUsers = await getAllUsers()
        setUsers(allUsers)
        setSuccess('Password reset successfully')
      } catch (err) {
        setError('Failed to reset password')
      }
    }
  }

  if (!hasPermission('canManageUsers')) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to manage users.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading users...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system with appropriate permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={mapBackendRoleToFrontend(newUser.role)}
                  onValueChange={(value: UserRole) =>
                    setNewUser({
                      ...newUser,
                      role: mapFrontendRoleToBackend(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_user">Super User</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="mini_user">Mini User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage existing user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.fullName || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'super' ? 'default' : 'secondary'}
                    >
                      {ROLE_DISPLAY_NAMES[mapBackendRoleToFrontend(user.role)]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(user as any).lastLogin
                      ? new Date((user as any).lastLogin).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fullName">Full Name</Label>
                <Input
                  id="edit-fullName"
                  value={editingUser.fullName || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={mapBackendRoleToFrontend(editingUser.role)}
                  onValueChange={(value: UserRole) =>
                    setEditingUser({
                      ...editingUser,
                      role: mapFrontendRoleToBackend(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_user">Super User</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="mini_user">Mini User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser}>Update User</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
