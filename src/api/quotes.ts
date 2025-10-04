const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://backoffice-forthandvale-backend.vercel.app/api'

export interface Quote {
  id: string
  orgId: string
  leadId: string
  quoteNo: string
  lead?: {
    title: string
    company: string
    contactName: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  validUntil: string
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy?: {
    id: string
    fullName: string
  }
}

export interface CreateQuoteData {
  orgId: string
  leadId: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
  validUntil: string
  notes?: string
}

export async function getAllQuotes(orgId: string = 'default'): Promise<Quote[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes?orgId=${orgId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch quotes')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return []
  }
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch quote')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching quote:', error)
    return null
  }
}

export async function createQuote(data: CreateQuoteData): Promise<Quote> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create quote')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating quote:', error)
    throw error
  }
}

export async function updateQuote(id: string, data: Partial<CreateQuoteData>): Promise<Quote> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update quote')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating quote:', error)
    throw error
  }
}

export async function updateQuoteStatus(id: string, status: Quote['status']): Promise<Quote> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error('Failed to update quote status')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating quote status:', error)
    throw error
  }
}

export async function deleteQuote(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete quote')
    }
  } catch (error) {
    console.error('Error deleting quote:', error)
    throw error
  }
}

