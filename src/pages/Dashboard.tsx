import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Package,
  TrendingUp,
  Truck,
  CheckCircle,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  Zap,
  ExternalLink,
  BarChart3,
  Star,
  Globe,
  Briefcase,
  MessageSquare,
  UserPlus,
  PieChart,
  Activity,
  RefreshCw,
} from 'lucide-react'
import { mockOrders } from '@/data/mockOrders'
import { useAuth } from '@/contexts/AuthContext'
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  getTodaysPriorityActions,
  autoGeneratePriorityActions,
  type PriorityAction,
} from '@/api/priorityActions'
import { ExcelUpload } from '@/components/ExcelUpload'

// Mock data for Lead Source Performance
const leadSourcePerformance = [
  {
    name: 'Website',
    count: 15,
    conversion: 22,
    revenue: 65000,
    cost: 8000,
    roi: '713%',
    icon: Globe,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    description: 'Organic website traffic and inquiries',
    trend: '+12%',
    trendDirection: 'up',
  },
  {
    name: 'LinkedIn',
    count: 5,
    conversion: 18,
    revenue: 25000,
    cost: 3000,
    roi: '733%',
    icon: MessageSquare,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-500',
    description: 'LinkedIn outreach and content marketing',
    trend: '+5%',
    trendDirection: 'up',
  },
  {
    name: 'Cold Outreach',
    count: 5,
    conversion: 12,
    revenue: 15000,
    cost: 2000,
    roi: '650%',
    icon: Phone,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    description: 'Direct cold calls and emails',
    trend: '-3%',
    trendDirection: 'down',
  },
  {
    name: 'Trade Show',
    count: 12,
    conversion: 35,
    revenue: 85000,
    cost: 15000,
    roi: '467%',
    icon: Briefcase,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    description: 'Industry events and exhibitions',
    trend: '+8%',
    trendDirection: 'up',
  },
  {
    name: 'Referral',
    count: 8,
    conversion: 48,
    revenue: 125000,
    cost: 0,
    roi: '∞',
    icon: UserPlus,
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    description: 'Customer referrals and word-of-mouth',
    trend: '+15%',
    trendDirection: 'up',
  },
]

// Mock data for Pipeline Value & Forecast
const pipelineData = {
  totalPipeline: 125000,
  qualified: 85000,
  quoted: 45000,
  closingSoon: 28000,
  monthlyTarget: 35000,
  currentProgress: 80, // 80% of monthly target
  expectedClosures: 28000,
  dealsClosingThisWeek: 3,
  dealsClosingNextWeek: 2,
  dealsClosingThisMonth: 5,
  averageDealSize: 25000,
  winRate: 68,
  salesVelocity: 18500, // Average revenue per week
  forecastAccuracy: 85,
  pipelineHealth: 'excellent',
  riskLevel: 'low',
  opportunities: [
    {
      id: 1,
      name: 'TechCorp Solutions - Corporate Gifts',
      stage: 'quoted',
      value: 15000,
      probability: 75,
      closeDate: '2024-02-15',
      daysToClose: 12,
      owner: 'Sarah Johnson',
      status: 'on-track',
    },
    {
      id: 2,
      name: 'Fashion Forward Ltd - Handbag Collection',
      stage: 'closing',
      value: 25000,
      probability: 90,
      closeDate: '2024-02-08',
      daysToClose: 5,
      owner: 'Mike Wilson',
      status: 'hot',
    },
    {
      id: 3,
      name: 'Global Enterprises - Executive Briefcases',
      stage: 'qualified',
      value: 35000,
      probability: 60,
      closeDate: '2024-02-28',
      daysToClose: 25,
      owner: 'Sarah Johnson',
      status: 'on-track',
    },
    {
      id: 4,
      name: 'Luxury Retail Co - New Inquiry',
      stage: 'quoted',
      value: 18000,
      probability: 80,
      closeDate: '2024-02-20',
      daysToClose: 17,
      owner: 'Mike Wilson',
      status: 'hot',
    },
    {
      id: 5,
      name: 'Corporate Gifts Inc - Sample Follow-up',
      stage: 'qualified',
      value: 12000,
      probability: 45,
      closeDate: '2024-03-05',
      daysToClose: 30,
      owner: 'Sarah Johnson',
      status: 'at-risk',
    },
  ],
}

export default function Dashboard() {
  const { currentUser } = useAuth()
  const [todaysPriorityActions, setTodaysPriorityActions] = useState<
    PriorityAction[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  // Fetch today's priority actions
  const fetchPriorityActions = async () => {
    try {
      setIsLoading(true)
      const actions = await getTodaysPriorityActions('default')
      setTodaysPriorityActions(actions)
    } catch (error) {
      console.error('Error fetching priority actions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on component mount
  useEffect(() => {
    fetchPriorityActions()
  }, [])

  // Auto-generate priority actions
  const handleAutoGenerate = async () => {
    try {
      setIsGenerating(true)
      const result = await autoGeneratePriorityActions('default')
      console.log(`Generated ${result.count} new priority actions`)

      // Refresh the actions list
      const actions = await getTodaysPriorityActions('default')
      setTodaysPriorityActions(actions)
    } catch (error) {
      console.error('Error auto-generating priority actions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const totalOrders = mockOrders.length
  const shippedOrders = mockOrders.filter(
    (order) => order.status === 'shipped'
  ).length
  const deliveredOrders = mockOrders.filter(
    (order) => order.status === 'delivered'
  ).length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.amount, 0)

  // Calculate priority action stats
  const highPriorityCount = todaysPriorityActions.filter(
    (task) => task.priority === 'HIGH' || task.priority === 'URGENT'
  ).length
  const mediumPriorityCount = todaysPriorityActions.filter(
    (task) => task.priority === 'MEDIUM'
  ).length
  const totalValue = todaysPriorityActions.reduce((sum, task) => {
    const value = task.metadata?.leadValue || task.metadata?.quoteValue || 0
    return sum + (typeof value === 'number' ? value : 0)
  }, 0)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
      case 'URGENT':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'MEDIUM':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'LOW':
        return 'border-gray-200 bg-gray-50 text-gray-800'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800'
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'FOLLOW_UP':
        return <Phone className="h-4 w-4" />
      case 'SAMPLE_DISPATCH':
        return <Package className="h-4 w-4" />
      case 'QUOTE_EXPIRING':
        return <FileText className="h-4 w-4" />
      case 'NEW_LEAD_RESPONSE':
        return <Users className="h-4 w-4" />
      case 'SAMPLE_FOLLOW_UP':
        return <Package className="h-4 w-4" />
      case 'QUOTE_FOLLOW_UP':
        return <FileText className="h-4 w-4" />
      case 'ORDER_FOLLOW_UP':
        return <Truck className="h-4 w-4" />
      case 'PAYMENT_FOLLOW_UP':
        return <DollarSign className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDueTime = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffMs = due.getTime() - now.getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))

    if (diffHours < 0) {
      return 'OVERDUE'
    } else if (diffHours < 1) {
      return 'ASAP'
    } else if (diffHours < 24) {
      return `${diffHours}h`
    } else {
      return due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Package,
      description: 'All time orders',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      description: 'Revenue generated',
    },
    {
      title: 'Orders Shipped',
      value: shippedOrders,
      icon: Truck,
      description: 'Currently in transit',
    },
    {
      title: 'Orders Delivered',
      value: deliveredOrders,
      icon: CheckCircle,
      description: 'Successfully delivered',
    },
  ]

  return (
    <RoleProtectedRoute requiredPermission="canViewDashboard">
      <div className="p-8 space-y-8">
        {/* Header with Quick Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser?.fullName || 'Admin'}! Focus on today's
              priority actions to drive revenue.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/leads">
              <Button className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Add New Lead
              </Button>
            </Link>
            <Link to="/quotes">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create Quote
              </Button>
            </Link>
          </div>
        </div>

        {/* TODAY'S PRIORITY ACTIONS - MOST IMPORTANT WIDGET */}
        <Card className="dashboard-card border-l-4 border-l-red-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                🔥 TODAY'S PRIORITY ACTIONS ({todaysPriorityActions.length})
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">
                      {highPriorityCount} High Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-700 font-medium">
                      {mediumPriorityCount} Medium
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    Total Value:{' '}
                    <span className="font-bold text-green-600">
                      ${totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <ExcelUpload
                  onSuccess={() => {
                    fetchPriorityActions()
                  }}
                />
                <Button
                  onClick={handleAutoGenerate}
                  disabled={isGenerating}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-1" />
                  )}
                  {isGenerating ? 'Generating...' : 'Auto-Generate'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Loading priority actions...
                </span>
              </div>
            ) : todaysPriorityActions.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No Priority Actions Today
                </h3>
                <p className="text-muted-foreground mb-4">
                  Click "Auto-Generate" to create priority actions based on your
                  leads, quotes, and samples.
                </p>
                <Button
                  onClick={handleAutoGenerate}
                  disabled={isGenerating}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-1" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Actions'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysPriorityActions.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg hover:shadow-md transition-all ${
                      task.priority === 'HIGH' || task.priority === 'URGENT'
                        ? 'border-red-200 bg-red-50/50'
                        : 'border-yellow-200 bg-yellow-50/50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(task.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground text-base">
                          {task.lead?.company || task.title}
                        </h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">
                          $
                          {(
                            task.metadata?.leadValue ||
                            task.metadata?.quoteValue ||
                            0
                          ).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 font-medium">
                        {task.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due: {formatDueTime(task.dueDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {task.lead?.contactName ||
                            task.assignee?.fullName ||
                            'Unassigned'}
                        </span>
                        <span className="text-purple-600 font-medium">
                          → {task.type.replace('_', ' ').toLowerCase()}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground bg-white/50 px-2 py-1 rounded">
                        Status: {task.status} • Type:{' '}
                        {task.type.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-600 hover:bg-gray-100"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-1">
                    💡 Pro Tip: Speed Wins Deals
                  </h4>
                  <p className="text-sm text-purple-700">
                    Leads contacted within 1 hour are 7x more likely to convert.
                    Focus on high-priority actions first!
                  </p>
                </div>
                <Link to="/leads">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Manage All Leads
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LEAD SOURCE PERFORMANCE WIDGET */}
        <Card className="dashboard-card border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-green-600" />
                🎯 LEAD SOURCE PERFORMANCE
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-green-700 font-medium">
                    Best: Referral (48%)
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Total Leads:{' '}
                  <span className="font-bold text-green-600">45</span>
                </div>
                <div className="text-muted-foreground">
                  Avg Conversion:{' '}
                  <span className="font-bold text-green-600">27%</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadSourcePerformance.map((source) => {
                const Icon = source.icon
                const isBest =
                  source.conversion ===
                  Math.max(...leadSourcePerformance.map((s) => s.conversion))
                const isWorst =
                  source.conversion ===
                  Math.min(...leadSourcePerformance.map((s) => s.conversion))

                return (
                  <div
                    key={source.name}
                    className={`p-4 border rounded-lg hover:shadow-md transition-all ${
                      isBest
                        ? 'border-green-200 bg-green-50/50'
                        : isWorst
                        ? 'border-red-200 bg-red-50/50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${source.bgColor} bg-opacity-10`}
                        >
                          <Icon className={`h-5 w-5 ${source.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            {source.name}
                            {isBest && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                            {isWorst && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {source.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-foreground">
                            {source.conversion}%
                          </span>
                          <div className="flex items-center gap-1">
                            {source.trendDirection === 'up' ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                source.trendDirection === 'up'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {source.trend}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {source.count} leads • $
                          {source.revenue.toLocaleString()} revenue
                        </div>
                      </div>
                    </div>

                    {/* Conversion Rate Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          Conversion Rate
                        </span>
                        <span className="font-medium">
                          {source.conversion}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${source.bgColor} ${
                            isBest ? 'ring-2 ring-green-300' : ''
                          }`}
                          style={{ width: `${source.conversion}%` }}
                        />
                      </div>
                    </div>

                    {/* ROI and Performance Metrics */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-foreground">ROI</div>
                        <div className={`font-bold ${source.color}`}>
                          {source.roi}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-foreground">
                          Cost
                        </div>
                        <div className="text-muted-foreground">
                          {source.cost === 0
                            ? 'Free'
                            : `$${source.cost.toLocaleString()}`}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-foreground">
                          Revenue
                        </div>
                        <div className="font-bold text-green-600">
                          ${source.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Strategic Insights */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    💡 Strategic Insights
                  </h4>
                  <div className="space-y-2 text-sm text-green-700">
                    <p>
                      <strong>Best Investment:</strong> Referrals convert 4x
                      better than cold outreach (48% vs 12%)
                    </p>
                    <p>
                      <strong>ROI Leader:</strong> Website leads have the
                      highest ROI at 713%
                    </p>
                    <p>
                      <strong>Recommendation:</strong> Focus 60% budget on
                      referral programs, 30% on website optimization, 10% on
                      trade shows
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Optimize Sources
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PIPELINE VALUE & FORECAST WIDGET */}
        <Card className="dashboard-card border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <PieChart className="h-6 w-6 text-blue-600" />
                💰 PIPELINE VALUE & FORECAST
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-green-700 font-medium">
                    Health: {pipelineData.pipelineHealth.toUpperCase()}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Win Rate:{' '}
                  <span className="font-bold text-blue-600">
                    {pipelineData.winRate}%
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Accuracy:{' '}
                  <span className="font-bold text-blue-600">
                    {pipelineData.forecastAccuracy}%
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pipeline Overview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground text-lg">
                  Pipeline Overview
                </h4>

                {/* Total Pipeline Value */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Total Pipeline
                    </span>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    ${pipelineData.totalPipeline.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {pipelineData.opportunities.length} active opportunities
                  </div>
                </div>

                {/* Pipeline Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Qualified</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${pipelineData.qualified.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(
                          (pipelineData.qualified /
                            pipelineData.totalPipeline) *
                            100
                        )}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Quoted</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${pipelineData.quoted.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(
                          (pipelineData.quoted / pipelineData.totalPipeline) *
                            100
                        )}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Closing Soon</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${pipelineData.closingSoon.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(
                          (pipelineData.closingSoon /
                            pipelineData.totalPipeline) *
                            100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Forecast */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground text-lg">
                  Monthly Forecast
                </h4>

                {/* Monthly Target Progress */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Monthly Target Progress
                    </span>
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-2xl font-bold text-foreground">
                      {pipelineData.currentProgress}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      of ${pipelineData.monthlyTarget.toLocaleString()} target
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                      style={{ width: `${pipelineData.currentProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>
                      ${pipelineData.expectedClosures.toLocaleString()} expected
                    </span>
                    <span>
                      ${pipelineData.monthlyTarget.toLocaleString()} target
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-foreground">
                      {pipelineData.dealsClosingThisWeek}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Closing This Week
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-foreground">
                      {pipelineData.dealsClosingThisMonth}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Closing This Month
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-foreground">
                      ${pipelineData.averageDealSize.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg Deal Size
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-foreground">
                      ${pipelineData.salesVelocity.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Weekly Velocity
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Opportunities */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground text-lg">
                  Active Opportunities
                </h4>
                <Link to="/leads">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {pipelineData.opportunities.slice(0, 3).map((opportunity) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'hot':
                        return 'border-red-200 bg-red-50 text-red-800'
                      case 'on-track':
                        return 'border-green-200 bg-green-50 text-green-800'
                      case 'at-risk':
                        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
                      default:
                        return 'border-gray-200 bg-gray-50 text-gray-800'
                    }
                  }

                  const getStageColor = (stage: string) => {
                    switch (stage) {
                      case 'qualified':
                        return 'bg-green-100 text-green-800'
                      case 'quoted':
                        return 'bg-yellow-100 text-yellow-800'
                      case 'closing':
                        return 'bg-red-100 text-red-800'
                      default:
                        return 'bg-gray-100 text-gray-800'
                    }
                  }

                  return (
                    <div
                      key={opportunity.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-medium text-foreground truncate">
                            {opportunity.name}
                          </h5>
                          <Badge className={getStatusColor(opportunity.status)}>
                            {opportunity.status.toUpperCase()}
                          </Badge>
                          <Badge className={getStageColor(opportunity.stage)}>
                            {opportunity.stage.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Owner: {opportunity.owner}</span>
                          <span>
                            Close:{' '}
                            {new Date(
                              opportunity.closeDate
                            ).toLocaleDateString()}
                          </span>
                          <span>{opportunity.daysToClose} days</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          ${opportunity.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {opportunity.probability}% probability
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Forecast Insights */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    💡 Forecast Insights
                  </h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>
                      <strong>On Track:</strong> You're{' '}
                      {pipelineData.currentProgress}% to monthly target with $
                      {pipelineData.expectedClosures.toLocaleString()} expected
                      closures
                    </p>
                    <p>
                      <strong>Pipeline Health:</strong>{' '}
                      {pipelineData.pipelineHealth.toUpperCase()} -{' '}
                      {pipelineData.opportunities.length} active opportunities
                      worth ${pipelineData.totalPipeline.toLocaleString()}
                    </p>
                    <p>
                      <strong>Risk Level:</strong>{' '}
                      {pipelineData.riskLevel.toUpperCase()} - Forecast accuracy
                      at {pipelineData.forecastAccuracy}%
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <PieChart className="h-4 w-4 mr-1" />
                    View Pipeline
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Forecast Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders Preview */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {order.orderNumber}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.customer.name} • {order.product.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      ${order.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleProtectedRoute>
  )
}
