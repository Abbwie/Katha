'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, FileText, Star, Clock, Package } from 'lucide-react';

export default function UserDashboard() {
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
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, {user?.fullName || user?.username || user?.email}!</h1>
        <p className="text-muted-foreground mb-8">Manage your projects and orders</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-card border border-border rounded-lg p-6">
            <Package className="w-8 h-8 text-accent mb-3" />
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-muted-foreground">Active Orders</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <FileText className="w-8 h-8 text-accent mb-3" />
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-muted-foreground">Quotes Requested</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <Star className="w-8 h-8 text-accent mb-3" />
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-muted-foreground">Reviews Left</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <Clock className="w-8 h-8 text-accent mb-3" />
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-muted-foreground">Pending</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Orders</h2>
            <div className="space-y-3">
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
              <Link href="/services" className="block w-full bg-accent text-accent-foreground text-center py-2 rounded-md hover:bg-accent/90 transition">
                Browse Services
              </Link>
            </div>
          </div>

          {/* Recent Quotes */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Quotes</h2>
            <div className="space-y-3">
              <p className="text-muted-foreground text-center py-8">No quotes yet</p>
              <Link href="/services" className="block w-full bg-secondary text-secondary-foreground text-center py-2 rounded-md hover:bg-secondary/80 transition">
                Request a Quote
              </Link>
            </div>
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
          <Link href="/profile/edit" className="inline-block mt-4 text-accent hover:underline">
            Edit Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}