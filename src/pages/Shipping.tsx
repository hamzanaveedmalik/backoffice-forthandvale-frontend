import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Truck, Search, Filter, Package, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getShippingOrders } from '@/api/orders'

export default function Shipping() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      const data = await getShippingOrders('default')
      setOrders(data)
      setIsLoading(false)
    }
    fetchOrders()
  }, [])

  // Filter orders that are shipped or delivered
  const shippingOrders = orders.filter(
    (order) => order.status === 'SHIPPED' || order.status === 'DELIVERED'
  )

  const filteredOrders = shippingOrders.filter((order) => {
    const matchesSearch =
      order.orderNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.lead?.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.lead?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((item: any) => 
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesStatus =
      statusFilter === 'all' || order.status?.toUpperCase() === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  const getShippingInfo = (order: any) => {
    if (order.status === 'DELIVERED') {
      return {
        status: 'Delivered',
        date: order.actualDeliveryDate,
        icon: <Package className="h-4 w-4" />,
        color: 'text-green-600',
      }
    } else {
      return {
        status: 'In Transit',
        date: order.expectedDeliveryDate,
        icon: <Truck className="h-4 w-4" />,
        color: 'text-blue-600',
      }
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Shipping</h1>
        <p className="text-muted-foreground">
          Track and manage order shipments and deliveries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Shipments
            </CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {shippingOrders.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time shipments
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Transit
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {shippingOrders.filter((o) => o.status === 'shipped').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently shipping
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {shippingOrders.filter((o) => o.status === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
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
                  placeholder="Search shipments..."
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
              <option value="shipped">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipments ({filteredOrders.length})
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
                  <TableHead>Shipping Status</TableHead>
                  <TableHead>Shipped Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">Loading shipping orders...</div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">No shipping orders found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const shippingInfo = getShippingInfo(order)
                    return (
                      <TableRow key={order.id} className="table-row">
                        <TableCell className="font-medium">
                          {order.orderNo}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.lead?.contactName || 'N/A'}
                            </div>
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
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {shippingInfo.icon}
                            <span className={shippingInfo.color}>
                              {shippingInfo.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {order.actualDeliveryDate || order.expectedDeliveryDate
                            ? new Date(order.actualDeliveryDate || order.expectedDeliveryDate).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            {order.trackingNumber ? 'Track' : 'Add Tracking'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
