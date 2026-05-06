export interface Provider {
  id: string;
  name: string;
  image: string;
  category: 'printing' | 'pcb' | 'cad' | 'laser' | 'machining' | 'assembly';
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  services: string[];
  priceRange: { min: number; max: number };
  turnaroundDays: number;
  description: string;
  verified: boolean;
  responseTime: string;
  createdAt: string;
}

export interface Order {
  id: string;
  providerId: string;
  status: 'quote-requested' | 'quote-provided' | 'accepted' | 'in-progress' | 'completed';
  files: string[];
  specifications: string;
  budget?: number;
  turnaroundRequest?: number;
  createdAt: string;
  updatedAt: string;
}

export const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'MakerHub Manila',
    image: '/images/3dprint.jpg',
    category: 'printing',
    location: 'Makati, Metro Manila',
    coordinates: { lat: 14.5547, lng: 121.0244 },
    rating: 4.4,
    reviewCount: 234,
    services: ['FDM 3D Printing', 'SLA Resin Printing', 'Rapid Prototyping', 'Production Runs'],
    priceRange: { min: 200, max: 15000 },
    turnaroundDays: 3 ,
    description: 'Leading 3D printing studio in Metro Manila with professional-grade equipment and fast turnaround.',
    verified: true,
    responseTime: '< 1 hour',
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    name: 'Khaleds Circuit Labs',
    image: '/images/circuitlabs.jpg',
    category: 'pcb',
    location: 'Quezon City, Metro Manila',
    coordinates: { lat: 14.6760, lng: 121.0437 },
    rating: 4.8,
    reviewCount: 189,
    services: ['PCB Design', 'PCB Fabrication', 'PCBA Assembly', 'Prototyping'],
    priceRange: { min: 500, max: 50000 },
    turnaroundDays: 7,
    description: 'Trusted PCB manufacturer serving Philippine tech startups and enterprises since 2010.',
    verified: true,
    responseTime: '< 2 hours',
    createdAt: '2025-02-20',
  },
  {
    id: '3',
    name: 'Abbys CAD Solutions',
    image: '/images/cadsolutions.jpeg',
    category: 'cad',
    location: 'BGC, Taguig',
    coordinates: { lat: 14.5503, lng: 121.0462 },
    rating: 4.7,
    reviewCount: 156,
    services: ['3D CAD Modeling', 'Product Design', 'Technical Drawings', 'Mechanical Design'],
    priceRange: { min: 1000, max: 25000 },
    turnaroundDays: 5,
    description: 'Expert CAD design team specializing in product development and technical documentation.',
    verified: true,
    responseTime: '< 3 hours',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Ishis CutPoint Laser Services',
    image: '/images/laserservice.jpeg',
    category: 'laser',
    location: 'Pasay City, Metro Manila',
    coordinates: { lat: 14.5378, lng: 121.0014 },
    rating: 4.6,
    reviewCount: 142,
    services: ['Laser Cutting', 'Laser Engraving', 'Wood/Acrylic Work', 'Metal Engraving'],
    priceRange: { min: 300, max: 20000 },
    turnaroundDays: 2,
    description: 'Professional laser cutting and engraving services for business and creative projects.',
    verified: true,
    responseTime: '< 1 hour',
    createdAt: '2022-04-05',
  },
  {
    id: '5',
    name: 'Precision Machining Davao',
    image: '/images/precisionmachining.jpeg',
    category: 'machining',
    location: 'Davao City',
    coordinates: { lat: 7.1907, lng: 125.4553 },
    rating: 4.7,
    reviewCount: 118,
    services: ['CNC Machining', 'Metal Fabrication', 'Custom Parts', 'Precision Tooling'],
    priceRange: { min: 800, max: 60000 },
    turnaroundDays: 6,
    description: 'State-of-the-art CNC machining facility producing precision parts for industrial clients.',
    verified: true,
    responseTime: '< 4 hours',
    createdAt: '2021-05-01',
  },
  {
    id: '6',
    name: 'Ashleys ElectroAssembly Solutions',
    image: '/images/electroassembly.jpeg',
    category: 'assembly',
    location: 'Las Pinas, Metro Manila',
    coordinates: { lat: 14.4445, lng: 120.9939 },
    rating: 4.8,
    reviewCount: 167,
    services: ['Electronics Assembly', 'Component Soldering', 'Quality Testing', 'Packaging'],
    priceRange: { min: 400, max: 30000 },
    turnaroundDays: 4,
    description: 'Full-service electronics assembly with quality control and fast delivery across the Philippines.',
    verified: true,
    responseTime: '< 2 hours',
    createdAt: '2026-01-25',
  },
  {
    id: '7',
    name: ' Abby Cebu 3D Innovations',
    image: '/images/cebu3d.jpg',
    category: 'printing',
    location: 'Cebu City',
    coordinates: { lat: 10.3157, lng: 123.8854 },
    rating: 4.5,
    reviewCount: 94,
    services: ['3D Printing', 'Prototyping', 'Model Making', 'Dental/Medical Models'],
    priceRange: { min: 150, max: 12000 },
    turnaroundDays: 3,
    description: 'Innovative 3D printing services in Cebu specializing in medical and industrial applications.',
    verified: true,
    responseTime: '< 5 hours',
    createdAt: '2021-02-28',
  },
  {
    id: '8',
    name: ' Khaled IloiloTech PCB Works',
    image: '/images/PCBwork.jpg',
    category: 'pcb',
    location: 'Iloilo City',
    coordinates: { lat: 10.7202, lng: 122.5621 },
    rating: 4.6,
    reviewCount: 87,
    services: ['Single-Sided PCB', 'Double-Sided PCB', 'Flex PCB', 'Quick Prototypes'],
    priceRange: { min: 350, max: 35000 },
    turnaroundDays: 5,
    description: 'Affordable PCB fabrication services with commitment to quality and quick turnaround times.',
    verified: true,
    responseTime: '< 6 hours',
    createdAt: '2023-03-18',
  },
  {
    id: '9',
    name: ' Ishi Designer Consultant',
    image: '/images/designconsultant.jpg',
    category: 'cad',
    location: 'Ortigas, Metro Manila',
    coordinates: { lat: 14.5870, lng: 121.0612 },
    rating: 4.7,
    reviewCount: 201,
    services: ['Product Development', 'Engineering Drawings', 'Feasibility Studies', 'Design Consulting'],
    priceRange: { min: 2000, max: 45000 },
    turnaroundDays: 7,
    description: 'Award-winning design studio helping Philippine entrepreneurs and companies develop products.',
    verified: true,
    responseTime: '< 3 hours',
    createdAt: '2023-04-12',
  },
  {
    id: '10',
    name: 'Ashleys Laguna Fabrication Hub',
    image: '/images/fabricationhub.jpg',
    category: 'machining',
    location: 'Santa Rosa, Laguna',
    coordinates: { lat: 14.3122, lng: 121.1113 },
    rating: 4.4,
    reviewCount: 76,
    services: ['Turning', 'Milling', 'Grinding', 'Prototype Machining'],
    priceRange: { min: 600, max: 40000 },
    turnaroundDays: 5,
    description: 'Versatile machining services with quick setup and flexible production capabilities.',
    verified: false,
    responseTime: '< 8 hours',
    createdAt: '2022-05-08',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    providerId: '1',
    status: 'quote-provided',
    files: ['prototype-design.stp', 'specifications.pdf'],
    specifications: 'ABS plastic, 50mm x 30mm x 20mm',
    budget: 5000,
    turnaroundRequest: 3,
    createdAt: '2024-05-01',
    updatedAt: '2024-05-02',
  },
  {
    id: 'ORD-002',
    providerId: '2',
    status: 'in-progress',
    files: ['schematic.sch', 'bom.csv'],
    specifications: '4-layer PCB, FR-4, HASL finish',
    budget: 8000,
    turnaroundRequest: 7,
    createdAt: '2024-04-28',
    updatedAt: '2024-05-03',
  },
];

export const categoryLabels: Record<string, string> = {
  printing: '3D Printing',
  pcb: 'PCB Fabrication',
  cad: 'CAD Design',
  laser: 'Laser Services',
  machining: 'Machining',
  assembly: 'Assembly',
};
