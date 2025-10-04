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
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Send,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'

// Mock data - replace with real API calls
const mockQuotes = [
  {
    id: '1',
    leadId: '2',
    lead: {
      title: 'Luxury Handbag Collection',
      company: 'Fashion Forward Ltd',
      contactName: 'Emily Davis',
    },
    quoteNo: 'Q-2024-001',
    currency: 'USD',
    incoterm: 'FOB',
    subtotal: 2500.0,
    shipping: 150.0,
    tax: 265.0,
    discount: 0.0,
    total: 2915.0,
    validUntil: '2024-02-15T23:59:59Z',
    status: 'SENT',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    lines: [
      {
        sku: 'HB-001',
        description: 'Premium Leather Handbag - Black',
        qty: 10,
        unitPrice: 250.0,
        lineTotal: 2500.0,
      },
    ],
  },
  {
    id: '2',
    leadId: '3',
    lead: {
      title: 'Executive Briefcase Order',
      company: 'Global Enterprises',
      contactName: 'Robert Brown',
    },
    quoteNo: 'Q-2024-002',
    currency: 'USD',
    incoterm: 'CIF',
    subtotal: 4000.0,
    shipping: 200.0,
    tax: 420.0,
    discount: 200.0,
    total: 4420.0,
    validUntil: '2024-02-20T23:59:59Z',
    status: 'ACCEPTED',
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
    lines: [
      {
        sku: 'BC-001',
        description: 'Custom Executive Briefcase',
        qty: 5,
        unitPrice: 800.0,
        lineTotal: 4000.0,
      },
    ],
  },
  {
    id: '3',
    leadId: '1',
    lead: {
      title: 'Corporate Gift Order',
      company: 'TechCorp Solutions',
      contactName: 'John Smith',
    },
    quoteNo: 'Q-2024-003',
    currency: 'USD',
    incoterm: 'EXW',
    subtotal: 1200.0,
    shipping: 100.0,
    tax: 130.0,
    discount: 0.0,
    total: 1430.0,
    validUntil: '2024-02-10T23:59:59Z',
    status: 'DRAFTING',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lines: [
      {
        sku: 'PF-001',
        description: 'Executive Leather Portfolio',
        qty: 20,
        unitPrice: 60.0,
        lineTotal: 1200.0,
      },
    ],
  },
]

export default function Quotes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredQuotes = mockQuotes.filter((quote) => {
    const matchesSearch =
      quote.quoteNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.lead.contactName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || quote.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFTING: {
        variant: 'secondary' as const,
        className: 'bg-gray-100 text-gray-800',
        icon: Clock,
      },
      SENT: {
        variant: 'default' as const,
        className: 'bg-blue-100 text-blue-800',
        icon: Send,
      },
      ACCEPTED: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      REJECTED: {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800',
        icon: XCircle,
      },
      EXPIRED: {
        variant: 'secondary' as const,
        className: 'bg-orange-100 text-orange-800',
        icon: AlertCircle,
      },
    }

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFTING
    const Icon = config.icon

    return (
      <Badge
        variant={config.variant}
        className={`${config.className} flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const getQuoteStats = () => {
    const stats = {
      total: mockQuotes.length,
      drafting: mockQuotes.filter((q) => q.status === 'DRAFTING').length,
      sent: mockQuotes.filter((q) => q.status === 'SENT').length,
      accepted: mockQuotes.filter((q) => q.status === 'ACCEPTED').length,
      rejected: mockQuotes.filter((q) => q.status === 'REJECTED').length,
      totalValue: mockQuotes.reduce((sum, q) => sum + Number(q.total), 0),
    }
    return stats
  }

  const stats = getQuoteStats()

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quotes</h1>
        <p className="text-muted-foreground">
          Manage quotations from creation to acceptance
        </p>
      </div>

      {/* Quote Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Quotes
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time quotes
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafting
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.drafting}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In preparation</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sent
            </CardTitle>
            <Send className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.sent}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Accepted
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.accepted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully accepted
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All quotes combined
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
                  placeholder="Search quotes, leads, or companies..."
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
              <option value="DRAFTING">Drafting</option>
              <option value="SENT">Sent</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quotes ({filteredQuotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="table-row">
                    <TableCell>
                      <div>
                        <div className="font-medium">{quote.quoteNo}</div>
                        <div className="text-sm text-muted-foreground">
                          {quote.currency} • {quote.incoterm}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quote.lead.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {quote.lead.company} - {quote.lead.contactName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {quote.lines.length} item
                          {quote.lines.length > 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Qty:{' '}
                          {quote.lines.reduce((sum, line) => sum + line.qty, 0)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          ${Number(quote.total).toLocaleString()}
                        </div>
                        {quote.discount > 0 && (
                          <div className="text-sm text-green-600">
                            -${Number(quote.discount).toFixed(2)} discount
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(quote.status)}
                        {isExpired(quote.validUntil) &&
                          quote.status === 'SENT' && (
                            <Badge
                              variant="outline"
                              className="text-orange-600 border-orange-200"
                            >
                              Expired
                            </Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(quote.validUntil).toLocaleDateString()}
                        </div>
                        {isExpired(quote.validUntil) && (
                          <div className="text-xs text-red-600 mt-1">
                            {Math.ceil(
                              (new Date().getTime() -
                                new Date(quote.validUntil).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{' '}
                            days ago
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        {quote.status === 'DRAFTING' && (
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
