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
import {
  Package,
  Search,
  Filter,
  Plus,
  Eye,
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getAllSamples } from '@/api/samples'

export default function Samples() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [samples, setSamples] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSamples = async () => {
      setIsLoading(true)
      const data = await getAllSamples('default')
      setSamples(data)
      setIsLoading(false)
    }
    fetchSamples()
  }, [])

  const filteredSamples = samples.filter((sample) => {
    const products = Array.isArray(sample.products) ? sample.products.join(' ') : ''
    const matchesSearch =
      products.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sample.lead?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sample.lead?.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sample.lead?.contactName || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || sample.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      REQUESTED: {
        variant: 'secondary' as const,
        className: 'bg-blue-100 text-blue-800',
        icon: Clock,
      },
      PREPARING: {
        variant: 'default' as const,
        className: 'bg-yellow-100 text-yellow-800',
        icon: Package,
      },
      SHIPPED: {
        variant: 'default' as const,
        className: 'bg-purple-100 text-purple-800',
        icon: Truck,
      },
      DELIVERED: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      FEEDBACK_PENDING: {
        variant: 'default' as const,
        className: 'bg-blue-100 text-blue-800',
        icon: Clock,
      },
      APPROVED: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      REJECTED: {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800',
        icon: XCircle,
      },
    }

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.REQUESTED
    const Icon = config.icon

    return (
      <Badge
        variant={config.variant}
        className={`${config.className} flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getSampleStats = () => {
    const stats = {
      total: samples.length,
      requested: samples.filter((s) => s.status === 'REQUESTED').length,
      preparing: samples.filter((s) => s.status === 'PREPARING').length,
      shipped: samples.filter((s) => s.status === 'SHIPPED').length,
      delivered: samples.filter((s) => s.status === 'DELIVERED').length,
    }
    return stats
  }

  const stats = getSampleStats()

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Samples</h1>
        <p className="text-muted-foreground">
          Track sample requests from initial request to delivery
        </p>
      </div>

      {/* Sample Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Samples
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time samples
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Requested
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.requested}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Preparing
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.preparing}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Being prepared</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Shipped
            </CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.shipped}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In transit</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.delivered}
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
                  placeholder="Search samples, leads, or items..."
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
              <option value="REQUESTED">Requested</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Samples Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Package className="h-5 w-5" />
            Samples ({filteredSamples.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample Item</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Cost Estimate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-muted-foreground">Loading samples...</div>
                    </TableCell>
                  </TableRow>
                ) : filteredSamples.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-muted-foreground">No samples found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSamples.map((sample) => (
                    <TableRow key={sample.id} className="table-row">
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {sample.products?.join(', ') || 'No products'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {sample.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sample.lead?.title || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">
                            {sample.lead?.company} {sample.lead?.contactName && `- ${sample.lead?.contactName}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{sample.products?.length || 0}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">-</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(sample.status)}</TableCell>
                      <TableCell>
                        {sample.trackingNumber ? (
                          <div>
                            <div className="font-medium">Tracking</div>
                            <div className="text-sm text-muted-foreground">
                              {sample.trackingNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {sample.assignee?.fullName || 'Unassigned'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Requested:{' '}
                            {new Date(sample.requestedDate).toLocaleDateString()}
                          </div>
                          {sample.shippedDate && (
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              Shipped:{' '}
                              {new Date(sample.shippedDate).toLocaleDateString()}
                            </div>
                          )}
                          {sample.deliveredDate && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Delivered:{' '}
                              {new Date(sample.deliveredDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
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
