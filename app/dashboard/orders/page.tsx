'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  MessageSquare,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  orderNumber: string;
  client: {
    name: string;
    email: string;
    avatar?: string;
  };
  service: string;
  description: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  dueDate: string;
  files: string[];
  deliverables: string[];
  notes: string;
}

const initialOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    client: { name: 'Tech Startup Inc.', email: 'orders@techstartup.com' },
    service: 'PCB Fabrication',
    description: 'Custom PCB for IoT sensor module - 50 units',
    amount: 15000,
    status: 'in_progress',
    createdAt: '2024-01-15',
    dueDate: '2024-01-22',
    files: ['gerber_files.zip', 'bom.xlsx'],
    deliverables: [],
    notes: 'Rush order - client needs by Friday',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    client: { name: 'Juan Dela Cruz', email: 'juan@email.com' },
    service: 'FDM 3D Printing',
    description: 'Prototype enclosure for wearable device',
    amount: 3500,
    status: 'pending',
    createdAt: '2024-01-16',
    dueDate: '2024-01-20',
    files: ['enclosure_v2.stl'],
    deliverables: [],
    notes: '',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    client: { name: 'Maria Santos', email: 'maria@company.ph' },
    service: 'Laser Cutting',
    description: 'Acrylic signage pieces - 20 units',
    amount: 8200,
    status: 'ready',
    createdAt: '2024-01-14',
    dueDate: '2024-01-18',
    files: ['signage_design.ai'],
    deliverables: ['final_pieces.jpg'],
    notes: 'Client confirmed design approval',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    client: { name: 'Innovation Labs', email: 'projects@innovationlabs.ph' },
    service: 'CAD Design',
    description: 'Product design for smart home controller',
    amount: 12000,
    status: 'confirmed',
    createdAt: '2024-01-17',
    dueDate: '2024-01-25',
    files: ['requirements.pdf', 'reference_images.zip'],
    deliverables: [],
    notes: '',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    client: { name: 'Electronics Plus', email: 'procurement@electronicsplus.com' },
    service: 'PCB Assembly',
    description: 'PCBA for production run - 100 units',
    amount: 45000,
    status: 'delivered',
    createdAt: '2024-01-10',
    dueDate: '2024-01-15',
    files: ['gerber.zip', 'bom.xlsx', 'pick_place.csv'],
    deliverables: ['delivery_receipt.pdf', 'test_report.pdf'],
    notes: 'Delivered on time, client satisfied',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    client: { name: 'Startup XYZ', email: 'hello@startupxyz.com' },
    service: 'SLA Resin Printing',
    description: 'High-detail miniatures - 10 units',
    amount: 4500,
    status: 'cancelled',
    createdAt: '2024-01-12',
    dueDate: '2024-01-19',
    files: ['models.zip'],
    deliverables: [],
    notes: 'Client cancelled due to budget constraints',
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: CheckCircle },
  in_progress: { label: 'In Progress', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Package },
  ready: { label: 'Ready', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: Truck },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    in_progress: orders.filter((o) => o.status === 'in_progress' || o.status === 'confirmed').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedOrders(newExpanded);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track all your orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => setFilterStatus('all')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{orderCounts.all}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => setFilterStatus('pending')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{orderCounts.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => setFilterStatus('in_progress')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-500">{orderCounts.in_progress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => setFilterStatus('ready')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">{orderCounts.ready}</p>
            <p className="text-sm text-muted-foreground">Ready</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => setFilterStatus('delivered')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{orderCounts.delivered}</p>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders, clients, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No orders found matching your criteria
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                const isExpanded = expandedOrders.has(order.id);

                return (
                  <div key={order.id} className="p-4">
                    {/* Main Row */}
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => toggleExpand(order.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>

                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-accent/10 text-accent text-sm">
                          {order.client.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{order.orderNumber}</span>
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {order.client.name} · {order.service}
                        </p>
                      </div>

                      <div className="hidden md:block text-right">
                        <p className="font-semibold">₱{order.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Due: {order.dueDate}</p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {order.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept Order
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                className="text-destructive"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Decline Order
                              </DropdownMenuItem>
                            </>
                          )}
                          {order.status === 'confirmed' && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'in_progress')}>
                              <Package className="w-4 h-4 mr-2" />
                              Start Working
                            </DropdownMenuItem>
                          )}
                          {order.status === 'in_progress' && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'ready')}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Ready
                            </DropdownMenuItem>
                          )}
                          {order.status === 'ready' && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                              <Truck className="w-4 h-4 mr-2" />
                              Mark as Delivered
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-4 ml-12 pl-4 border-l-2 border-border space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Description</p>
                          <p className="text-sm text-muted-foreground">{order.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-2">Client Files</p>
                            <div className="space-y-1">
                              {order.files.map((file, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 p-2 bg-muted rounded text-sm"
                                >
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <span className="flex-1 truncate">{file}</span>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Download className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">Deliverables</p>
                            {order.deliverables.length > 0 ? (
                              <div className="space-y-1">
                                {order.deliverables.map((file, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 p-2 bg-muted rounded text-sm"
                                  >
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span className="flex-1 truncate">{file}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsUploadOpen(true);
                                }}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Deliverables
                              </Button>
                            )}
                          </div>
                        </div>

                        {order.notes && (
                          <div>
                            <p className="text-sm font-medium mb-1">Notes</p>
                            <p className="text-sm text-muted-foreground">{order.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(order)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Full Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Order {selectedOrder.orderNumber}</DialogTitle>
                  <Badge className={statusConfig[selectedOrder.status].color}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Client Info */}
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {selectedOrder.client.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedOrder.client.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.client.email}</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{selectedOrder.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">₱{selectedOrder.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{selectedOrder.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{selectedOrder.dueDate}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p>{selectedOrder.description}</p>
                </div>

                {/* Files */}
                <div>
                  <p className="text-sm font-medium mb-2">Client Files</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOrder.files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                      >
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span className="flex-1 truncate text-sm">{file}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Deliverables</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsUploadOpen(true)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {selectedOrder.deliverables.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedOrder.deliverables.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-lg"
                        >
                          <FileText className="w-5 h-5 text-emerald-500" />
                          <span className="flex-1 truncate text-sm">{file}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No deliverables uploaded yet</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                  <Textarea
                    id="notes"
                    defaultValue={selectedOrder.notes}
                    placeholder="Add internal notes..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {selectedOrder.status === 'pending' && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'cancelled');
                        setIsDetailsOpen(false);
                      }}
                    >
                      Decline
                    </Button>
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'confirmed');
                        setIsDetailsOpen(false);
                      }}
                    >
                      Accept Order
                    </Button>
                  </>
                )}
                {selectedOrder.status === 'in_progress' && (
                  <Button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'ready');
                      setIsDetailsOpen(false);
                    }}
                  >
                    Mark as Ready
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Deliverables Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Deliverables</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop files or click to upload
              </p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Supported formats: PDF, ZIP, JPG, PNG (Max 50MB per file)
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsUploadOpen(false)}>Upload Files</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
