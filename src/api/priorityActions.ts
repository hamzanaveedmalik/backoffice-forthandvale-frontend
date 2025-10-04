const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://backoffice-forthandvale-backend.vercel.app/api'

export interface PriorityAction {
  id: string
  orgId: string
  leadId?: string
  type: 'FOLLOW_UP' | 'SAMPLE_DISPATCH' | 'QUOTE_EXPIRING' | 'NEW_LEAD_RESPONSE' | 'SAMPLE_FOLLOW_UP' | 'QUOTE_FOLLOW_UP' | 'ORDER_FOLLOW_UP' | 'PAYMENT_FOLLOW_UP' | 'CUSTOM'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  title: string
  description: string
  dueDate: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE'
  assignedTo?: string
  metadata?: any
  createdAt: string
  updatedAt: string
  completedAt?: string
  lead?: {
    id: string
    title: string
    company: string
    contactName: string
    contactEmail: string
    owner?: {
      id: string
      fullName: string
    }
  }
  assignee?: {
    id: string
    fullName: string
  }
}

export interface CreatePriorityActionData {
  orgId: string
  leadId?: string
  type: PriorityAction['type']
  priority: PriorityAction['priority']
  title: string
  description: string
  dueDate: string
  assignedTo?: string
  metadata?: any
}

export interface PriorityActionStats {
  total: number
  todaysCount: number
  byPriority: Record<string, number>
  byStatus: Record<string, number>
}

export async function getTodaysPriorityActions(orgId: string = 'default'): Promise<PriorityAction[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/priority-actions/today?orgId=${orgId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch today\'s priority actions')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching today\'s priority actions:', error)
    return []
  }
}

export async function getAllPriorityActions(orgId: string = 'default'): Promise<PriorityAction[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/priority-actions?orgId=${orgId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch priority actions')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching priority actions:', error)
    return []
  }
}

export async function createPriorityAction(data: CreatePriorityActionData): Promise<PriorityAction> {
  try {
    const response = await fetch(`${API_BASE_URL}/priority-actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create priority action')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating priority action:', error)
    throw error
  }
}

export async function updatePriorityActionStatus(
  actionId: string, 
  status: PriorityAction['status'],
  completedBy?: string
): Promise<PriorityAction> {
  try {
    const response = await fetch(`${API_BASE_URL}/priority-actions/${actionId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, completedBy }),
    })
    if (!response.ok) {
      throw new Error('Failed to update priority action status')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating priority action status:', error)
    throw error
  }
}

export async function autoGeneratePriorityActions(orgId: string = 'default'): Promise<{ count: number; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/priority-actions/auto-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgId }),
    })
    if (!response.ok) {
      throw new Error('Failed to auto-generate priority actions')
    }
    return await response.json()
  } catch (error) {
    console.error('Error auto-generating priority actions:', error)
    throw error
  }
}

export async function generateLeadBasedPriorityActions(orgId: string = 'default'): Promise<{ count: number; message: string; details: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/priority-actions/generate-lead-based`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgId }),
    })
    if (!response.ok) {
      throw new Error('Failed to generate lead-based priority actions')
    }
    return await response.json()
  } catch (error) {
    console.error('Error generating lead-based priority actions:', error)
    throw error
  }
}

export async function getPriorityActionStats(orgId: string = 'default'): Promise<PriorityActionStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/priority-actions/stats?orgId=${orgId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch priority action stats')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching priority action stats:', error)
    return {
      total: 0,
      todaysCount: 0,
      byPriority: {},
      byStatus: {}
    }
  }
}
