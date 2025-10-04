// API layer for user operations
// This will be used by the frontend to communicate with the backend

import { User, BackendRole } from '@/types/user';

export interface CreateUserData {
  email: string;
  fullName: string;
  password: string;
  role: BackendRole;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://backoffice-backend.vercel.app/api';

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const response = await fetch(`${API_BASE_URL}/users/email/${email}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function createUser(userData: CreateUserData): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return response.json();
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
}

export async function deleteUser(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return true;
}

export async function updateLastLogin(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}/last-login`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('Failed to update last login');
  }
}
