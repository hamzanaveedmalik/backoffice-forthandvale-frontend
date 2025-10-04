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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getAllLeads, Lead } from '@/api/leads'

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Fetch leads on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true)
        const leadsData = await getAllLeads('default')
        setLeads(leadsData)
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesPriority =
      priorityFilter === 'all' || lead.priority?.toString() === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NEW: {
        variant: 'secondary' as const,
        className: 'bg-blue-100 text-blue-800',
        icon: Clock,
      },
      QUALIFIED: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      CONTACTED: {
        variant: 'default' as const,
        className: 'bg-yellow-100 text-yellow-800',
        icon: Phone,
      },
      FOLLOW_UP: {
        variant: 'default' as const,
        className: 'bg-orange-100 text-orange-800',
        icon: Calendar,
      },
      DISQUALIFIED: {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800',
        icon: XCircle,
      },
      CONVERTED: {
        variant: 'default' as const,
        className: 'bg-purple-100 text-purple-800',
        icon: TrendingUp,
      },
    }

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW
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

  const getPriorityBadge = (priority: number) => {
    const priorityConfig = {
      1: { className: 'bg-red-100 text-red-800', label: 'High' },
      2: { className: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      3: { className: 'bg-green-100 text-green-800', label: 'Low' },
    }

    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig[3]

    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPipelineStats = () => {
    const stats = {
      total: leads.length,
      new: leads.filter((l) => l.status === 'NEW').length,
      qualified: leads.filter((l) => l.status === 'QUALIFIED').length,
      contacted: leads.filter((l) => l.status === 'CONTACTED').length,
      converted: leads.filter((l) => l.status === 'CONVERTED').length,
    }
    return stats
  }

  const stats = getPipelineStats()

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">
            Manage your sales pipeline from initial contact to conversion
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leads...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground">
          Manage your sales pipeline from initial contact to conversion
        </p>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time leads</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Leads
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.new}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Recently added</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Qualified
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.qualified}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to contact
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contacted
            </CardTitle>
            <Phone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.contacted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Converted
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.converted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully converted
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
                  placeholder="Search leads, companies, or contacts..."
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
              <option value="NEW">New</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="DISQUALIFIED">Disqualified</option>
              <option value="CONVERTED">Converted</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Priority</option>
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Lead
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Users className="h-5 w-5" />
            Leads ({filteredLeads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Pipeline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="table-row">
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{lead.company}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.contactName}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.contactEmail}
                        </div>
                        {lead.contactPhone && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.contactPhone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.source}</Badge>
                    </TableCell>
                    <TableCell>
                      {lead.priority ? getPriorityBadge(lead.priority) : '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.owner?.fullName || 'Unassigned'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 text-xs">
                        {lead.quotes && lead.quotes.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {lead.quotes.length} Quote
                            {lead.quotes.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {lead.samples && lead.samples.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {lead.samples.length} Sample
                            {lead.samples.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {lead.orders && lead.orders.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {lead.orders.length} Order
                            {lead.orders.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {}}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{lead.title}</DialogTitle>
                            <DialogDescription>
                              Lead details and pipeline progress
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium">
                                  Company Information
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {lead.company}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  Contact Information
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {lead.contactName} - {lead.contactEmail}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">Notes</h4>
                              <p className="text-sm text-muted-foreground">
                                {lead.notes || 'No notes available'}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium">Tags</h4>
                              <div className="flex gap-2 mt-2">
                                {lead.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Edit Lead</Button>
                            <Button>Add Activity</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
