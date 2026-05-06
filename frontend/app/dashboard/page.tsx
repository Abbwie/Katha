'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage (set during login)
    const userId = localStorage.getItem('user_id');
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');
    const fullName = localStorage.getItem('full_name');

    if (!userId) {
      // No user logged in, send to sign-in page
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
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">Katha</Link>
          <div className="flex gap-4 items-center">
            <span className="text-sm">Welcome, {user?.fullName || user?.username || user?.email}!</span>
            <button onClick={handleLogout} className="text-red-600">Logout</button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="space-y-2">
              <p><strong>User ID:</strong> {user?.userId}</p>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Full Name:</strong> {user?.fullName}</p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/services" className="block w-full bg-blue-500 text-white text-center py-2 rounded">
                Browse Services
              </Link>
              <Link href="/my-orders" className="block w-full bg-green-500 text-white text-center py-2 rounded">
                My Orders
              </Link>
              <Link href="/profile" className="block w-full bg-gray-500 text-white text-center py-2 rounded">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}