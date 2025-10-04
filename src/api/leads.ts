const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://backoffice-backend.vercel.app/api'

export interface Lead {
  id: string
  orgId: string
  title: string
  company: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  source: string
  tags: string[]
  priority: number
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'FOLLOW_UP' | 'DISQUALIFIED' | 'CONVERTED'
  ownerId?: string
  notes?: string
  createdAt: string
  updatedAt: string
  owner?: {
    id: string
    fullName: string
  }
  quotes?: Array<{
    id: string
    quoteNo: string
    status: string
  }>
  samples?: Array<{
    id: string
    status: string
  }>
  orders?: Array<{
    id: string
    orderNo: string
    status: string
  }>
}

export interface CreateLeadData {
  orgId: string
  title: string
  company: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  source: string
  tags?: string[]
  priority?: number
  status?: Lead['status']
  ownerId?: string
  notes?: string
}

export async function getAllLeads(orgId: string = 'default'): Promise<Lead[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/leads?orgId=${orgId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch leads')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}

export async function createLead(data: CreateLeadData): Promise<Lead> {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create lead')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating lead:', error)
    throw error
  }
}

export async function updateLead(leadId: string, data: Partial<CreateLeadData>): Promise<Lead> {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update lead')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating lead:', error)
    throw error
  }
}

export async function deleteLead(leadId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete lead')
    }
  } catch (error) {
    console.error('Error deleting lead:', error)
    throw error
  }
}
