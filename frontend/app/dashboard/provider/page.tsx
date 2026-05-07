'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, DollarSign, Users, Star, PlusCircle, Settings, Clock, CheckCircle } from 'lucide-react';

export default function ProviderDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');
    const fullName = localStorage.getItem('full_name');

    if (!userId) {
      window.location.href = '/sign-in';
    } else {
      setUser({ userId, email, username, fullName });
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Provider Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.username || user?.email}!</p>
          </div>
          <Link href="/dashboard/provider/services/new">
            <button className="bg-accent text-accent-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-accent/90 transition">
              <PlusCircle className="w-4 h-4" />
              Add New Service
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <Package className="w-8 h-8 text-accent mb-3" />
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-muted-foreground">Active Orders</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <DollarSign className="w-8 h-8 text-accent mb-3" />
            <h3 className="text-2xl font-bold text-foreground">₱0</h3>
            <p className="text-muted-foreground">Total Earnings</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <Users className="w-8 h-8 text-accent mb-3" />
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-muted-foreground">Total Clients</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <Star className="w-8 h-8 text-accent mb-3" />
            <h3 className="text-2xl font-bold text-foreground">0.0</h3>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Orders</h2>
            <div className="space-y-3">
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
              <p className="text-sm text-muted-foreground text-center">Orders will appear here when clients request your services</p>
            </div>
          </div>

          {/* Your Services */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Your Services</h2>
              <Link href="/dashboard/provider/services/new" className="text-accent text-sm hover:underline">
                + Add Service
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-muted-foreground text-center py-8">No services listed yet</p>
              <Link href="/dashboard/provider/services/new" className="block w-full bg-accent text-accent-foreground text-center py-2 rounded-md hover:bg-accent/90 transition">
                List Your First Service
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/provider/services" className="text-center p-4 border border-border rounded-lg hover:bg-secondary transition">
              <Package className="w-6 h-6 text-accent mx-auto mb-2" />
              <span className="text-sm text-foreground">Manage Services</span>
            </Link>
            <Link href="/dashboard/provider/orders" className="text-center p-4 border border-border rounded-lg hover:bg-secondary transition">
              <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
              <span className="text-sm text-foreground">View Orders</span>
            </Link>
            <Link href="/dashboard/provider/earnings" className="text-center p-4 border border-border rounded-lg hover:bg-secondary transition">
              <DollarSign className="w-6 h-6 text-accent mx-auto mb-2" />
              <span className="text-sm text-foreground">Earnings</span>
            </Link>
            <Link href="/dashboard/provider/settings" className="text-center p-4 border border-border rounded-lg hover:bg-secondary transition">
              <Settings className="w-6 h-6 text-accent mx-auto mb-2" />
              <span className="text-sm text-foreground">Settings</span>
            </Link>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Your Profile</h2>
          <div className="space-y-2 text-foreground">
            <p><strong className="text-muted-foreground">User ID:</strong> {user?.userId}</p>
            <p><strong className="text-muted-foreground">Username:</strong> {user?.username}</p>
            <p><strong className="text-muted-foreground">Email:</strong> {user?.email}</p>
            <p><strong className="text-muted-foreground">Full Name:</strong> {user?.fullName}</p>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/provider/profile/edit" className="text-accent hover:underline">
              Edit Profile →
            </Link>
            <Link href="/dashboard/provider/become-verified" className="text-accent hover:underline">
              Get Verified →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}