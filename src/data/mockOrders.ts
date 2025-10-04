export interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    company: string
    email: string
  }
  product: {
    name: string
    sku: string
  }
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  shippingDate?: string
  deliveryDate?: string
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customer: {
      name: 'John Smith',
      company: 'Leather Works Inc.',
      email: 'john@leatherworks.com'
    },
    product: {
      name: 'Premium Leather Wallet',
      sku: 'LW-001'
    },
    amount: 89.99,
    status: 'shipped',
    orderDate: '2024-01-15',
    shippingDate: '2024-01-18',
    deliveryDate: '2024-01-22'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customer: {
      name: 'Sarah Johnson',
      company: 'Fashion Forward',
      email: 'sarah@fashionforward.com'
    },
    product: {
      name: 'Leather Handbag',
      sku: 'LW-002'
    },
    amount: 149.99,
    status: 'delivered',
    orderDate: '2024-01-10',
    shippingDate: '2024-01-12',
    deliveryDate: '2024-01-16'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customer: {
      name: 'Mike Davis',
      company: 'Corporate Gifts Ltd.',
      email: 'mike@corpgifts.com'
    },
    product: {
      name: 'Executive Briefcase',
      sku: 'LW-003'
    },
    amount: 299.99,
    status: 'processing',
    orderDate: '2024-01-20'
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customer: {
      name: 'Emily Brown',
      company: 'Luxury Accessories',
      email: 'emily@luxuryacc.com'
    },
    product: {
      name: 'Leather Belt',
      sku: 'LW-004'
    },
    amount: 59.99,
    status: 'pending',
    orderDate: '2024-01-22'
  },
  {
    id: '5',
    orderNumber: 'ORD-005',
    customer: {
      name: 'David Wilson',
      company: 'Retail Solutions',
      email: 'david@retailsolutions.com'
    },
    product: {
      name: 'Leather Watch Strap',
      sku: 'LW-005'
    },
    amount: 39.99,
    status: 'shipped',
    orderDate: '2024-01-18',
    shippingDate: '2024-01-20'
  }
]
