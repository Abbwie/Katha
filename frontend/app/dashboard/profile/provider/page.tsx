'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Phone, MapPin, Globe, Save, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ProviderProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    emailAddr: '',
    phoneNum: '',
    shopAddress: '',
    websiteUrl: '',
    shopDesc: '',
  });

  useEffect(() => {
    const uid = localStorage.getItem('user_id');
    const userEmail = localStorage.getItem('email');
    const userName = localStorage.getItem('full_name');
    
    if (!uid) {
      router.push('/sign-in');
      return;
    }
    
    setFormData({
      shopName: userName || userEmail?.split('@')[0] || 'My Shop',
      ownerName: userName || '',
      emailAddr: userEmail || '',
      phoneNum: '',
      shopAddress: '',
      websiteUrl: '',
      shopDesc: '',
    });
    setLoading(false);
  }, [router]);

  const handleSaveClick = () => {
    alert('Profile update coming soon!');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Shop Profile</h1>
        <Badge className="bg-accent">Seller Account</Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Shop Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl bg-accent/10 text-accent">
                {formData.shopName?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input
              id="shopName"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailAddr">Email Address</Label>
            <Input
              id="emailAddr"
              type="email"
              value={formData.emailAddr}
              onChange={(e) => setFormData({ ...formData, emailAddr: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNum">Phone Number</Label>
            <Input
              id="phoneNum"
              value={formData.phoneNum}
              onChange={(e) => setFormData({ ...formData, phoneNum: e.target.value })}
              placeholder="+63 917 123 4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopAddress">Shop Address</Label>
            <Input
              id="shopAddress"
              value={formData.shopAddress}
              onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
              placeholder="City, Province"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website</Label>
            <Input
              id="websiteUrl"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="www.yourshop.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopDesc">Description</Label>
            <Textarea
              id="shopDesc"
              value={formData.shopDesc}
              onChange={(e) => setFormData({ ...formData, shopDesc: e.target.value })}
              placeholder="Describe your services..."
              rows={4}
            />
          </div>

          <Button onClick={handleSaveClick} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}