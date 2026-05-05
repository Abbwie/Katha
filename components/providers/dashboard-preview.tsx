'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Star,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

const dashboardTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const mockOrders = [
  { id: 'ORD-001', customer: 'Juan D.', service: '3D Print - Prototype', amount: '₱2,500', status: 'In Progress', time: '2 hrs ago' },
  { id: 'ORD-002', customer: 'Maria S.', service: 'PCB Design Review', amount: '₱4,200', status: 'Pending', time: '4 hrs ago' },
  { id: 'ORD-003', customer: 'Carlo M.', service: 'Laser Engraving', amount: '₱1,800', status: 'Completed', time: '1 day ago' },
];

const mockMessages = [
  { from: 'Juan D.', message: 'Hi! Can you do rush delivery?', time: '10 min ago', unread: true },
  { from: 'Maria S.', message: 'The design looks great!', time: '1 hr ago', unread: true },
  { from: 'Carlo M.', message: 'Thank you for the quality work.', time: '3 hrs ago', unread: false },
];

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Dashboard at Your Fingertips
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage orders, communicate with customers, and track your business growth all in one place
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-background rounded-2xl border border-border shadow-2xl overflow-hidden">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold">MH</span>
              </div>
              <div>
                <div className="font-semibold text-foreground">MakerHub Manila</div>
                <div className="text-xs text-muted-foreground">Pro Provider</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[10px] text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="hidden md:block w-56 border-r border-border bg-card/50 p-4">
              <nav className="space-y-1">
                {dashboardTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                    {tab.id === 'messages' && (
                      <Badge className="ml-auto bg-accent/20 text-accent text-xs">2</Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Mobile Tabs */}
              <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2">
                {dashboardTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                        <span className="flex items-center text-xs text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">₱47,520</div>
                      <div className="text-xs text-muted-foreground">This month</div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Package className="w-5 h-5 text-muted-foreground" />
                        <span className="flex items-center text-xs text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +8%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">24</div>
                      <div className="text-xs text-muted-foreground">Active orders</div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span className="flex items-center text-xs text-red-500">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          -2%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">156</div>
                      <div className="text-xs text-muted-foreground">Customers</div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Star className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">4.9</div>
                      <div className="text-xs text-muted-foreground">Avg. rating</div>
                    </Card>
                  </div>

                  {/* Recent Orders */}
                  <Card>
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <h3 className="font-semibold text-foreground">Recent Orders</h3>
                      <Button variant="ghost" size="sm" className="text-accent">
                        View all <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    <div className="divide-y divide-border">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                              {order.customer.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{order.service}</div>
                              <div className="text-sm text-muted-foreground">{order.customer} - {order.time}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-foreground">{order.amount}</div>
                            <Badge
                              variant={order.status === 'Completed' ? 'default' : order.status === 'In Progress' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">All Orders</h3>
                    <div className="flex gap-2">
                      <Badge variant="outline">All (24)</Badge>
                      <Badge variant="secondary">Pending (5)</Badge>
                      <Badge variant="secondary">In Progress (12)</Badge>
                    </div>
                  </div>
                  <Card>
                    <div className="divide-y divide-border">
                      {[...mockOrders, ...mockOrders].slice(0, 5).map((order, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <CheckCircle2 className={`w-5 h-5 ${order.status === 'Completed' ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <div>
                              <div className="font-medium text-foreground">{order.id}</div>
                              <div className="text-sm text-muted-foreground">{order.service}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-foreground">{order.amount}</div>
                            <div className="text-xs text-muted-foreground">{order.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Messages</h3>
                  <Card>
                    <div className="divide-y divide-border">
                      {mockMessages.map((msg, idx) => (
                        <div key={idx} className={`flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer ${msg.unread ? 'bg-accent/5' : ''}`}>
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {msg.from.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-foreground">{msg.from}</span>
                              <span className="text-xs text-muted-foreground">{msg.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                          </div>
                          {msg.unread && (
                            <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-foreground">Analytics Overview</h3>
                  
                  {/* Revenue Chart Placeholder */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                        <div className="text-3xl font-bold text-foreground">₱285,400</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Weekly</Button>
                        <Button variant="secondary" size="sm">Monthly</Button>
                        <Button variant="outline" size="sm">Yearly</Button>
                      </div>
                    </div>
                    
                    {/* Simple Bar Chart Visualization */}
                    <div className="flex items-end justify-between h-40 gap-2">
                      {[35, 55, 45, 70, 60, 85, 75, 90, 65, 80, 95, 70].map((height, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-accent/80 rounded-t-sm transition-all hover:bg-accent"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Performance Metrics */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">Response Time</div>
                      <div className="text-2xl font-bold text-foreground">1.2 hrs</div>
                      <div className="text-xs text-green-600">Faster than 90% of providers</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">Completion Rate</div>
                      <div className="text-2xl font-bold text-foreground">98.5%</div>
                      <div className="text-xs text-green-600">+2.3% from last month</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">Repeat Customers</div>
                      <div className="text-2xl font-bold text-foreground">67%</div>
                      <div className="text-xs text-green-600">Building loyalty</div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          This is a preview of the provider dashboard. Actual features may vary.
        </p>
      </div>
    </section>
  );
}
