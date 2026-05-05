'use client';

import { useState } from 'react';
import {
  DollarSign,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const earningsData = [
  { month: 'Jan', earnings: 130500, payouts: 117000 },
  { month: 'Feb', earnings: 136800, payouts: 123000 },
  { month: 'Mar', earnings: 133200, payouts: 120000 },
  { month: 'Apr', earnings: 144900, payouts: 130000 },
  { month: 'May', earnings: 139500, payouts: 125500 },
  { month: 'Jun', earnings: 150300, payouts: 135000 },
];

const payouts = [
  { id: 'PAY-001', date: '2024-01-15', amount: 45000, status: 'completed', method: 'Bank Transfer', reference: 'BT-2024-001' },
  { id: 'PAY-002', date: '2024-01-01', amount: 42000, status: 'completed', method: 'Bank Transfer', reference: 'BT-2024-002' },
  { id: 'PAY-003', date: '2023-12-15', amount: 48000, status: 'completed', method: 'GCash', reference: 'GC-2023-045' },
  { id: 'PAY-004', date: '2023-12-01', amount: 41000, status: 'completed', method: 'Bank Transfer', reference: 'BT-2023-089' },
  { id: 'PAY-005', date: '2023-11-15', amount: 39500, status: 'completed', method: 'Bank Transfer', reference: 'BT-2023-078' },
];

const pendingPayouts = [
  { id: 'PND-001', amount: 28500, estimatedDate: '2024-01-31', orders: 8 },
];

const transactions = [
  { id: 'TXN-001', date: '2024-01-18', type: 'Order Payment', description: 'ORD-2024-001 - PCB Fabrication', amount: 15000, status: 'completed' },
  { id: 'TXN-002', date: '2024-01-17', type: 'Order Payment', description: 'ORD-2024-004 - CAD Design', amount: 12000, status: 'pending' },
  { id: 'TXN-003', date: '2024-01-16', type: 'Order Payment', description: 'ORD-2024-002 - 3D Printing', amount: 3500, status: 'completed' },
  { id: 'TXN-004', date: '2024-01-15', type: 'Payout', description: 'Bi-weekly payout', amount: -45000, status: 'completed' },
  { id: 'TXN-005', date: '2024-01-14', type: 'Order Payment', description: 'ORD-2024-003 - Laser Cutting', amount: 8200, status: 'completed' },
  { id: 'TXN-006', date: '2024-01-12', type: 'Commission', description: 'Platform fee (10%)', amount: -1520, status: 'completed' },
  { id: 'TXN-007', date: '2024-01-10', type: 'Refund', description: 'ORD-2024-006 - Cancelled order', amount: -4500, status: 'completed' },
];

const invoices = [
  { id: 'INV-2024-001', date: '2024-01-18', client: 'Tech Startup Inc.', amount: 15000, status: 'paid' },
  { id: 'INV-2024-002', date: '2024-01-17', client: 'Innovation Labs', amount: 12000, status: 'pending' },
  { id: 'INV-2024-003', date: '2024-01-16', client: 'Juan Dela Cruz', amount: 3500, status: 'paid' },
  { id: 'INV-2024-004', date: '2024-01-14', client: 'Maria Santos', amount: 8200, status: 'paid' },
  { id: 'INV-2024-005', date: '2024-01-10', client: 'Electronics Plus', amount: 45000, status: 'paid' },
];

export default function FinancialsPage() {
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  const stats = [
    {
      title: 'Available Balance',
      value: '₱28,500',
      description: 'Ready for payout',
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Pending Earnings',
      value: '₱15,500',
      description: 'Processing orders',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'This Month',
      value: '₱67,200',
      description: '+12.3% vs last month',
      icon: ArrowUpRight,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Paid Out',
      value: '₱835,200',
      description: 'All time',
      icon: CheckCircle,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financials</h1>
          <p className="text-muted-foreground">Manage your earnings, payouts, and invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>Request Payout</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Monthly earnings and payouts</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 months</SelectItem>
              <SelectItem value="6m">6 months</SelectItem>
              <SelectItem value="12m">12 months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(v) => `₱${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`₱${value.toLocaleString()}`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                  name="Earnings"
                />
                <Line
                  type="monotone"
                  dataKey="payouts"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="Payouts"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Earnings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-muted-foreground">Payouts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Transactions, Payouts, Invoices */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{txn.type}</Badge>
                      </TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            txn.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }
                        >
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${txn.amount < 0 ? 'text-red-500' : 'text-emerald-500'}`}
                      >
                        {txn.amount < 0 ? '-' : '+'}₱{Math.abs(txn.amount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts">
          <div className="grid gap-6">
            {/* Pending Payout */}
            {pendingPayouts.length > 0 && (
              <Card className="border-amber-500/50 bg-amber-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Pending Payout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingPayouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">₱{payout.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {payout.orders} orders · Estimated {payout.estimatedDate}
                        </p>
                      </div>
                      <Button>Request Early Payout</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Payout History */}
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="text-muted-foreground">{payout.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {payout.method === 'Bank Transfer' ? (
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <CreditCard className="w-4 h-4 text-muted-foreground" />
                            )}
                            {payout.method}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{payout.reference}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₱{payout.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Payout Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>Manage your payout preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">BDO Savings Account</p>
                        <p className="text-sm text-muted-foreground">****4589 · Primary</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-dashed rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Add Payment Method</p>
                        <p className="text-sm text-muted-foreground">GCash, PayMaya, or Bank Account</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoices</CardTitle>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            invoice.status === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₱{invoice.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            View
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Preview Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invoice {selectedInvoice?.id}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client</span>
                  <span className="font-medium">{selectedInvoice.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    className={
                      selectedInvoice.status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }
                  >
                    {selectedInvoice.status}
                  </Badge>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">₱{selectedInvoice.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  Send to Client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
