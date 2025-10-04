import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    password: 'admin123',
    role: 'super',
    email: 'admin@leathercraft.com',
    fullName: 'System Administrator',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    password: 'manager123',
    role: 'user',
    email: 'manager@leathercraft.com',
    fullName: 'Operations Manager',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    password: 'viewer123',
    role: 'mini',
    email: 'viewer@leathercraft.com',
    fullName: 'Dashboard Viewer',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

// Helper functions for user management
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockUsers.push(newUser);
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return undefined;
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updatedAt: new Date() };
  return mockUsers[userIndex];
};

export const deleteUser = (id: string): boolean => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return false;
  
  mockUsers.splice(userIndex, 1);
  return true;
};

export const getAllUsers = (): User[] => {
  return mockUsers;
};