// frontend/lib/api.ts
const API_BASE = 'http://localhost:8000';

export const api = {
  // ============ STORES / PROVIDERS ============
  
  // Get all stores (for marketplace browsing)
  async getStores(category?: string, search?: string) {
    let url = `${API_BASE}/stores`;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;
    
    const res = await fetch(url);
    return res.json();
  },

  // Get single store by ID
  async getStore(storeId: number) {
    const res = await fetch(`${API_BASE}/stores/${storeId}`);
    return res.json();
  },

  // ============ AUTHENTICATION ============
  
  // Register new user
  async register(username: string, password: string) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  // Login user
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/Katha_Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  // Get all users (admin/test only)
  async getUsers() {
    const res = await fetch(`${API_BASE}/api/users`);
    return res.json();
  },

  // ============ SERVICES ============
  
  // Get all services (with optional filters)
  async getServices(category?: string, minPrice?: number, maxPrice?: number) {
    let url = `${API_BASE}/services`;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (minPrice) params.append('min_price', minPrice.toString());
    if (maxPrice) params.append('max_price', maxPrice.toString());
    if (params.toString()) url += `?${params.toString()}`;
    
    const res = await fetch(url);
    return res.json();
  },

  // Get services for a specific provider
  async getProviderServices(providerId: number) {
    const res = await fetch(`${API_BASE}/services/provider/${providerId}`);
    return res.json();
  },

  // Create a new service (provider only)
  async createService(providerId: number, serviceData: {
    category: string;
    title: string;
    description: string;
    price: number;
    price_unit: string;
    turnaround_days: number;
    min_order_qty: number;
  }) {
    const res = await fetch(`${API_BASE}/services?provider_id=${providerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    return res.json();
  },

  // Update a service
  async updateService(serviceId: number, providerId: number, updateData: {
    title?: string;
    description?: string;
    price?: number;
    is_active?: boolean;
  }) {
    const res = await fetch(`${API_BASE}/services/${serviceId}?provider_id=${providerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    return res.json();
  },

  // Delete a service (soft delete)
  async deleteService(serviceId: number, providerId: number) {
    const res = await fetch(`${API_BASE}/services/${serviceId}?provider_id=${providerId}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // ============ QUOTES ============
  
  // Request a quote (client uploads file and requirements)
  async submitQuote(formData: FormData) {
    const res = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // Get quotes for a client
  async getClientQuotes(clientId: number) {
    const res = await fetch(`${API_BASE}/quotes/client/${clientId}`);
    return res.json();
  },

  // Get quotes for a provider
  async getProviderQuotes(providerId: number) {
    const res = await fetch(`${API_BASE}/quotes/provider/${providerId}`);
    return res.json();
  },

  // Respond to a quote (accept/reject/counter)
  async respondToQuote(quoteId: number, status: string, estimatedPrice?: number) {
    let url = `${API_BASE}/quotes/${quoteId}/respond?status=${status}`;
    if (estimatedPrice) {
      url += `&estimated_price=${estimatedPrice}`;
    }
    const res = await fetch(url, {
      method: 'PUT',
    });
    return res.json();
  },

  // ============ ORDERS ============
  
  // Create an order from an accepted quote
  async createOrder(orderData: { quote_id: number; total_amount: number }) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  // Get orders for a client
  async getClientOrders(clientId: number) {
    const res = await fetch(`${API_BASE}/orders/client/${clientId}`);
    return res.json();
  },

  // Get orders for a provider
  async getProviderOrders(providerId: number) {
    const res = await fetch(`${API_BASE}/orders/provider/${providerId}`);
    return res.json();
  },

  // Update order status (in_progress, completed, etc.)
  async updateOrderStatus(orderId: number, status: string) {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Update payment status
  async updatePaymentStatus(orderId: number, paymentStatus: string) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/payment?payment_status=${paymentStatus}`, {
      method: 'PUT',
    });
    return res.json();
  },

  // ============ AI / COMPATIBILITY ============
  
  // Submit file and prompt to KathaAI
  async submitCompatibility(formData: FormData) {
    const res = await fetch(`${API_BASE}/compatibility/submit`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // ============ ANALYTICS ============
  
  // Get provider analytics stats
  async getProviderStats(providerId: number) {
    const res = await fetch(`${API_BASE}/analytics/provider/${providerId}/stats`);
    return res.json();
  },

  // Get orders grouped by status
  async getOrdersByStatus(providerId: number) {
    const res = await fetch(`${API_BASE}/analytics/provider/${providerId}/orders-by-status`);
    return res.json();
  },

  // ============ FINANCIALS ============
  
  // Get provider earnings overview
  async getProviderEarnings(providerId: number) {
    const res = await fetch(`${API_BASE}/financials/provider/${providerId}/earnings`);
    return res.json();
  },

  // Get transaction history
  async getTransactions(providerId: number) {
    const res = await fetch(`${API_BASE}/financials/provider/${providerId}/transactions`);
    return res.json();
  },

  // Request a payout
  async requestPayout(providerId: number, amount: number, method: string) {
    const res = await fetch(`${API_BASE}/financials/provider/${providerId}/request-payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, method }),
    });
    return res.json();
  },
};