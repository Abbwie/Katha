'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X,
  Upload,
  GripVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  priceMin: number;
  priceMax: number;
  turnaround: string;
  isActive: boolean;
  images: string[];
  orders: number;
  revenue: number;
}

const initialServices: Service[] = [
  {
    id: '1',
    name: 'FDM 3D Printing',
    category: 'printing',
    description: 'High-quality FDM 3D printing for prototypes and production parts.',
    priceMin: 200,
    priceMax: 5000,
    turnaround: '2-3 days',
    isActive: true,
    images: ['https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=400&h=300&fit=crop'],
    orders: 45,
    revenue: 125000,
  },
  {
    id: '2',
    name: 'SLA Resin Printing',
    category: 'printing',
    description: 'Ultra-detailed resin printing for high-precision models.',
    priceMin: 500,
    priceMax: 8000,
    turnaround: '3-5 days',
    isActive: true,
    images: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'],
    orders: 32,
    revenue: 96000,
  },
  {
    id: '3',
    name: 'PCB Fabrication',
    category: 'pcb',
    description: 'Professional PCB manufacturing with quick turnaround.',
    priceMin: 500,
    priceMax: 25000,
    turnaround: '5-7 days',
    isActive: true,
    images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop'],
    orders: 28,
    revenue: 280000,
  },
  {
    id: '4',
    name: 'Rapid Prototyping',
    category: 'printing',
    description: 'Quick iteration prototypes for product development.',
    priceMin: 1000,
    priceMax: 15000,
    turnaround: '1-2 days',
    isActive: false,
    images: ['https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=400&h=300&fit=crop'],
    orders: 18,
    revenue: 72000,
  },
];

const portfolioItems = [
  {
    id: '1',
    title: 'Custom Drone Parts',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    service: 'FDM 3D Printing',
  },
  {
    id: '2',
    title: 'Medical Device Prototype',
    image: 'https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=400&h=300&fit=crop',
    service: 'SLA Resin Printing',
  },
  {
    id: '3',
    title: 'IoT Controller Board',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    service: 'PCB Fabrication',
  },
  {
    id: '4',
    title: 'Robotics Components',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    service: 'FDM 3D Printing',
  },
  {
    id: '5',
    title: 'Automotive Sensor Housing',
    image: 'https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=400&h=300&fit=crop',
    service: 'Rapid Prototyping',
  },
  {
    id: '6',
    title: 'Smart Home Controller',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    service: 'PCB Fabrication',
  },
];

const categories = [
  { value: 'printing', label: '3D Printing' },
  { value: 'pcb', label: 'PCB Fabrication' },
  { value: 'cad', label: 'CAD Design' },
  { value: 'laser', label: 'Laser Cutting' },
  { value: 'machining', label: 'CNC Machining' },
  { value: 'assembly', label: 'Assembly' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    priceMin: '',
    priceMax: '',
    turnaround: '',
  });

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleActive = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      priceMin: service.priceMin.toString(),
      priceMax: service.priceMax.toString(),
      turnaround: service.turnaround,
    });
    setIsAddDialogOpen(true);
  };

  const handleSave = () => {
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                ...formData,
                priceMin: parseInt(formData.priceMin),
                priceMax: parseInt(formData.priceMax),
              }
            : s
        )
      );
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        description: formData.description,
        priceMin: parseInt(formData.priceMin),
        priceMax: parseInt(formData.priceMax),
        turnaround: formData.turnaround,
        isActive: true,
        images: [],
        orders: 0,
        revenue: 0,
      };
      setServices([...services, newService]);
    }
    setIsAddDialogOpen(false);
    setEditingService(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      priceMin: '',
      priceMax: '',
      turnaround: '',
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      priceMin: '',
      priceMax: '',
      turnaround: '',
    });
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground">Manage your services and portfolio</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio ({portfolioItems.length})</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className={`relative ${!service.isActive ? 'opacity-60' : ''}`}>
                {/* Service Image */}
                <div className="relative h-40 bg-muted">
                  {service.images[0] ? (
                    <Image
                      src={service.images[0]}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={service.isActive ? 'default' : 'secondary'}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{service.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{service.category}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(service)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(service.id)}>
                          {service.isActive ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(service.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Price Range</p>
                      <p className="font-semibold">
                        ₱{service.priceMin.toLocaleString()} - ₱{service.priceMax.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Turnaround</p>
                      <p className="font-semibold">{service.turnaround}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-muted-foreground">{service.orders} orders</span>
                    <span className="font-medium text-emerald-500">
                      ₱{service.revenue.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Showcase your best work to attract more clients
            </p>
            <Button onClick={() => setIsPortfolioDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <GripVertical className="w-5 h-5 text-white/70 cursor-grab" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.service}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., FDM 3D Printing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceMin">Min Price (₱)</Label>
                <Input
                  id="priceMin"
                  type="number"
                  value={formData.priceMin}
                  onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                  placeholder="200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceMax">Max Price (₱)</Label>
                <Input
                  id="priceMax"
                  type="number"
                  value={formData.priceMax}
                  onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turnaround">Turnaround Time</Label>
              <Input
                id="turnaround"
                value={formData.turnaround}
                onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                placeholder="e.g., 2-3 days"
              />
            </div>

            <div className="space-y-2">
              <Label>Service Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop images or click to upload
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Choose Files
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingService ? 'Save Changes' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Portfolio Item Dialog */}
      <Dialog open={isPortfolioDialogOpen} onOpenChange={setIsPortfolioDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Portfolio Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Project Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop an image or click to upload
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input id="projectTitle" placeholder="e.g., Custom Drone Parts" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectService">Related Service</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">Description (Optional)</Label>
              <Textarea
                id="projectDescription"
                placeholder="Brief description of the project..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPortfolioDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsPortfolioDialogOpen(false)}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
