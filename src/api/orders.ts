const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://backoffice-forthandvale-backend.vercel.app/api'

export interface Order {
  id: string
  orgId: string
  orderNo: string
  leadId?: string
  quoteId?: string
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
  shipping: number
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'PRODUCTION' | 'QUALITY_CHECK' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED'
  orderDate: string
  expectedDeliveryDate?: string
  actualDeliveryDate?: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy?: {
    id: string
    fullName: string
  }
}

export interface CreateOrderData {
  orgId: string
  leadId?: string
  quoteId?: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
  expectedDeliveryDate?: string
  notes?: string
}

export async function getAllOrders(orgId: string = 'default'): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders?orgId=${orgId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch orders')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch order')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create order')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function updateOrder(id: string, data: Partial<CreateOrderData>): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update order')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}

export async function updateOrderStatus(id: string, status: Order['status'], trackingNumber?: string): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, trackingNumber }),
    })
    if (!response.ok) {
      throw new Error('Failed to update order status')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

export async function updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/payment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentStatus }),
    })
    if (!response.ok) {
      throw new Error('Failed to update payment status')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating payment status:', error)
    throw error
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete order')
    }
  } catch (error) {
    console.error('Error deleting order:', error)
    throw error
  }
}

// Get orders ready for shipping
export async function getShippingOrders(orgId: string = 'default'): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/shipping?orgId=${orgId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch shipping orders')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching shipping orders:', error)
    return []
  }
}

