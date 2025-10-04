import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Package, Search, Filter, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getAllOrders } from '@/api/orders'

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      const data = await getAllOrders('default')
      setOrders(data)
      setIsLoading(false)
    }
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.lead?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.lead?.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((item: any) => 
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesStatus =
      statusFilter === 'all' || order.status?.toUpperCase() === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toUpperCase() || 'PENDING'
    const statusConfig: Record<string, {variant: 'secondary' | 'default' | 'destructive', className: string}> = {
      PENDING: {
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800',
      },
      CONFIRMED: {
        variant: 'default' as const,
        className: 'bg-blue-100 text-blue-800',
      },
      PRODUCTION: {
        variant: 'default' as const,
        className: 'bg-indigo-100 text-indigo-800',
      },
      QUALITY_CHECK: {
        variant: 'default' as const,
        className: 'bg-cyan-100 text-cyan-800',
      },
      SHIPPED: {
        variant: 'default' as const,
        className: 'bg-purple-100 text-purple-800',
      },
      DELIVERED: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800',
      },
      CANCELLED: {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800',
      },
    }

    const config =
      statusConfig[normalizedStatus] || statusConfig.PENDING

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all your leather goods orders
        </p>
      </div>

      {/* Filters */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers, or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">Loading orders...</div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">No orders found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="table-row">
                      <TableCell className="font-medium">
                        {order.orderNo}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.lead?.contactName || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.lead?.company || 'No company'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.items?.[0]?.description || 'No items'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.items?.length || 0} item(s)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(order.total).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
