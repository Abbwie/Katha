'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Users,
  Star,
  Clock,
  ArrowRight,
  Package,
  MessageSquare,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
  { month: 'Jul', revenue: 72000 },
];

const ordersData = [
  { day: 'Mon', orders: 12 },
  { day: 'Tue', orders: 18 },
  { day: 'Wed', orders: 15 },
  { day: 'Thu', orders: 22 },
  { day: 'Fri', orders: 19 },
  { day: 'Sat', orders: 8 },
  { day: 'Sun', orders: 5 },
];

const recentOrders = [
  {
    id: 'ORD-2024-001',
    client: 'Tech Startup Inc.',
    service: 'PCB Fabrication',
    amount: 15000,
    status: 'In Progress',
    avatar: 'TS',
  },
  {
    id: 'ORD-2024-002',
    client: 'Juan Dela Cruz',
    service: '3D Printing',
    amount: 3500,
    status: 'Pending',
    avatar: 'JD',
  },
  {
    id: 'ORD-2024-003',
    client: 'Maria Santos',
    service: 'Laser Cutting',
    amount: 8200,
    status: 'Completed',
    avatar: 'MS',
  },
  {
    id: 'ORD-2024-004',
    client: 'Innovation Labs',
    service: 'CAD Design',
    amount: 12000,
    status: 'In Progress',
    avatar: 'IL',
  },
];

const recentMessages = [
  {
    name: 'Juan Dela Cruz',
    message: 'Hi, can you give me an update on my order?',
    time: '5 min ago',
    unread: true,
  },
  {
    name: 'Tech Startup Inc.',
    message: 'The prototype looks great! Can we discuss...',
    time: '1 hour ago',
    unread: true,
  },
  {
    name: 'Maria Santos',
    message: 'Thank you for the quick turnaround!',
    time: '3 hours ago',
    unread: false,
  },
];

const topServices = [
  { name: '3D Printing', orders: 45, revenue: 125000, progress: 85 },
  { name: 'PCB Fabrication', orders: 32, revenue: 280000, progress: 72 },
  { name: 'Laser Cutting', orders: 28, revenue: 95000, progress: 60 },
  { name: 'CAD Design', orders: 18, revenue: 72000, progress: 45 },
];

export default function DashboardOverview() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const stats = [
    {
      title: 'Total Revenue',
      value: '₱347,500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Profile Views',
      value: '2,847',
      change: '+23.1%',
      trend: 'up',
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Avg Rating',
      value: '4.9',
      change: '-0.1',
      trend: 'down',
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Revenue Overview</CardTitle>
            <div className="flex gap-1">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="h-7 text-xs"
                >
                  {range}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'currentColor' }} />
                  <YAxis className="text-xs" tick={{ fill: 'currentColor' }} tickFormatter={(v) => `₱${v/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Orders This Week</CardTitle>
            <Badge variant="secondary">99 total</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fill: 'currentColor' }} />
                  <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value, 'Orders']}
                  />
                  <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" className="text-accent">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                      {order.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{order.client}</p>
                      <Badge
                        variant={
                          order.status === 'Completed'
                            ? 'default'
                            : order.status === 'In Progress'
                              ? 'secondary'
                              : 'outline'
                        }
                        className={
                          order.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : order.status === 'In Progress'
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.id} · {order.service}
                    </p>
                  </div>
                  <p className="font-semibold">₱{order.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages & Top Services */}
        <div className="space-y-6">
          {/* Recent Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Messages</CardTitle>
              <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                2 unread
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-2 rounded-lg ${msg.unread ? 'bg-accent/5' : ''}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {msg.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm ${msg.unread ? 'font-semibold' : 'font-medium'}`}>
                          {msg.name}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                    </div>
                    {msg.unread && <span className="w-2 h-2 bg-accent rounded-full mt-2" />}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Messages
              </Button>
            </CardContent>
          </Card>

          {/* Top Services */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Top Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.slice(0, 3).map((service, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.orders} orders</p>
                    </div>
                    <Progress value={service.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Package className="w-5 h-5 text-accent" />
              <span className="text-sm">Add Service</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <ShoppingCart className="w-5 h-5 text-accent" />
              <span className="text-sm">View Orders</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-sm">Set Availability</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-sm">Invite Team</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
