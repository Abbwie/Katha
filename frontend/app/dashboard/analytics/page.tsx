'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const monthlyRevenue = [
  { month: 'Jan', revenue: 145000, orders: 42 },
  { month: 'Feb', revenue: 152000, orders: 48 },
  { month: 'Mar', revenue: 148000, orders: 45 },
  { month: 'Apr', revenue: 161000, orders: 52 },
  { month: 'May', revenue: 155000, orders: 49 },
  { month: 'Jun', revenue: 167000, orders: 55 },
  { month: 'Jul', revenue: 172000, orders: 58 },
  { month: 'Aug', revenue: 185000, orders: 62 },
  { month: 'Sep', revenue: 178000, orders: 59 },
  { month: 'Oct', revenue: 192000, orders: 65 },
  { month: 'Nov', revenue: 205000, orders: 72 },
  { month: 'Dec', revenue: 218000, orders: 78 },
];

const weeklyViews = [
  { day: 'Mon', views: 245 },
  { day: 'Tue', views: 312 },
  { day: 'Wed', views: 298 },
  { day: 'Thu', views: 356 },
  { day: 'Fri', views: 389 },
  { day: 'Sat', views: 178 },
  { day: 'Sun', views: 134 },
];

const serviceBreakdown = [
  { name: '3D Printing', value: 35, revenue: 612500, color: '#005b96' },
  { name: 'PCB Fabrication', value: 28, revenue: 490000, color: '#03396c' },
  { name: 'CAD Design', value: 18, revenue: 315000, color: '#011f4b' },
  { name: 'Laser Cutting', value: 12, revenue: 210000, color: '#0077b6' },
  { name: 'Other', value: 7, revenue: 122500, color: '#48cae4' },
];

const customerLocations = [
  { location: 'Metro Manila', customers: 156, percentage: 45 },
  { location: 'Cebu', customers: 52, percentage: 15 },
  { location: 'Davao', customers: 38, percentage: 11 },
  { location: 'Laguna', customers: 34, percentage: 10 },
  { location: 'Batangas', customers: 28, percentage: 8 },
  { location: 'Others', customers: 38, percentage: 11 },
];

const topClients = [
  { name: 'Tech Startup Inc.', orders: 24, revenue: 285000 },
  { name: 'Innovation Labs', orders: 18, revenue: 216000 },
  { name: 'Electronics Plus', orders: 15, revenue: 195000 },
  { name: 'Maria Santos', orders: 12, revenue: 98000 },
  { name: 'Juan Dela Cruz', orders: 10, revenue: 75000 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('12m');

  const stats = [
    {
      title: 'Total Revenue',
      value: '₱1,878,000',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last year',
    },
    {
      title: 'Total Orders',
      value: '685',
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCart,
      description: 'vs last year',
    },
    {
      title: 'Unique Customers',
      value: '346',
      change: '+24.3%',
      trend: 'up',
      icon: Users,
      description: 'vs last year',
    },
    {
      title: 'Profile Views',
      value: '12,458',
      change: '+32.1%',
      trend: 'up',
      icon: Eye,
      description: 'vs last year',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your business performance and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-accent/10">
                  <stat.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue & Orders Trend</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Orders</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fill: 'currentColor', fontSize: 12 }} />
                  <YAxis
                    yAxisId="revenue"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    tickFormatter={(v) => `₱${v / 1000}k`}
                  />
                  <YAxis
                    yAxisId="orders"
                    orientation="right"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `₱${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Orders',
                    ]}
                  />
                  <Area
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--accent))"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="orders"
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Breakdown & Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-6">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {serviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Share']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3">
              {serviceBreakdown.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₱{(service.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-muted-foreground">{service.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Views */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Views This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyViews}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" tick={{ fill: 'currentColor', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value, 'Views']}
                  />
                  <Bar dataKey="views" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">1,912</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
              <div>
                <p className="text-2xl font-bold">273</p>
                <p className="text-sm text-muted-foreground">Avg/Day</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-500">+18%</p>
                <p className="text-sm text-muted-foreground">vs Last Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerLocations.map((loc) => (
                <div key={loc.location} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{loc.location}</span>
                    <span className="text-muted-foreground">{loc.customers} customers ({loc.percentage}%)</span>
                  </div>
                  <Progress value={loc.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients.map((client, i) => (
                <div key={client.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm font-medium text-accent">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.orders} orders</p>
                  </div>
                  <p className="font-semibold">₱{client.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
