'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/sign-in';
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-card border border-border rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Profile</h2>
            <div className="space-y-2 text-foreground">
              <p><strong className="text-muted-foreground">User ID:</strong> {user?.userId}</p>
              <p><strong className="text-muted-foreground">Username:</strong> {user?.username}</p>
              <p><strong className="text-muted-foreground">Email:</strong> {user?.email}</p>
              <p><strong className="text-muted-foreground">Full Name:</strong> {user?.fullName}</p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-card border border-border rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/services" 
                className="block w-full bg-primary text-primary-foreground text-center py-2 rounded-md hover:bg-primary/90 transition">
                Browse Services
              </Link>
              <Link href="/my-orders" 
                className="block w-full bg-secondary text-secondary-foreground text-center py-2 rounded-md hover:bg-secondary/80 transition">
                My Orders
              </Link>
              <Link href="/profile" 
                className="block w-full bg-accent text-accent-foreground text-center py-2 rounded-md hover:bg-accent/90 transition">
                Edit Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full bg-destructive text-destructive-foreground text-center py-2 rounded-md hover:bg-destructive/90 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}