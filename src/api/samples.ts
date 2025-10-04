const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://backoffice-forthandvale-backend.vercel.app/api'

export interface Sample {
  id: string
  orgId: string
  leadId: string
  lead?: {
    title: string
    company: string
    contactName: string
  }
  products: string[]
  status: 'REQUESTED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'FEEDBACK_PENDING' | 'APPROVED' | 'REJECTED'
  requestedDate: string
  shippedDate?: string
  deliveredDate?: string
  trackingNumber?: string
  feedback?: string
  notes?: string
  createdAt: string
  updatedAt: string
  assignee?: {
    id: string
    fullName: string
  }
}

export interface CreateSampleData {
  orgId: string
  leadId: string
  products: string[]
  notes?: string
}

export async function getAllSamples(orgId: string = 'default'): Promise<Sample[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/samples?orgId=${orgId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch samples')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching samples:', error)
    return []
  }
}

export async function getSampleById(id: string): Promise<Sample | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/samples/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch sample')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching sample:', error)
    return null
  }
}

export async function createSample(data: CreateSampleData): Promise<Sample> {
  try {
    const response = await fetch(`${API_BASE_URL}/samples`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create sample')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating sample:', error)
    throw error
  }
}

export async function updateSample(id: string, data: Partial<CreateSampleData>): Promise<Sample> {
  try {
    const response = await fetch(`${API_BASE_URL}/samples/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update sample')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating sample:', error)
    throw error
  }
}

export async function updateSampleStatus(id: string, status: Sample['status'], trackingNumber?: string): Promise<Sample> {
  try {
    const response = await fetch(`${API_BASE_URL}/samples/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, trackingNumber }),
    })
    if (!response.ok) {
      throw new Error('Failed to update sample status')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating sample status:', error)
    throw error
  }
}

export async function deleteSample(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/samples/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete sample')
    }
  } catch (error) {
    console.error('Error deleting sample:', error)
    throw error
  }
}

