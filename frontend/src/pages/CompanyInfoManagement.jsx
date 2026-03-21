import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const CompanyInfoManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    tagline: '',
    about_us: '',
    email: '',
    phone: '',
    address: '',
    established_year: 1986,
    iso_certifications: '',
    social_links: {
      facebook: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    }
  });

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await adminAPI.getCompanyInfo();
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch company info');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await adminAPI.updateCompanyInfo(formData);
      toast.success('Company information updated successfully');
    } catch (error) {
      toast.error('Failed to update company information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div></div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Company Information</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label>Company Name</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label>Tagline</Label>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Building Dreams, Creating Landmarks"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label>About Us</Label>
              <Textarea
                value={formData.about_us}
                onChange={(e) => setFormData({ ...formData, about_us: e.target.value })}
                rows={5}
              />
            </div>
            
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Established Year</Label>
              <Input
                type="number"
                value={formData.established_year}
                onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
              />
            </div>
            
            <div>
              <Label>ISO Certifications</Label>
              <Input
                value={formData.iso_certifications}
                onChange={(e) => setFormData({ ...formData, iso_certifications: e.target.value })}
                placeholder="ISO 9001 : 2015 | ISO 14001 : 2015"
              />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Facebook</Label>
                <Input
                  value={formData.social_links?.facebook || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_links: { ...formData.social_links, facebook: e.target.value } 
                  })}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div>
                <Label>Twitter</Label>
                <Input
                  value={formData.social_links?.twitter || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_links: { ...formData.social_links, twitter: e.target.value } 
                  })}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              
              <div>
                <Label>LinkedIn</Label>
                <Input
                  value={formData.social_links?.linkedin || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_links: { ...formData.social_links, linkedin: e.target.value } 
                  })}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              
              <div>
                <Label>YouTube</Label>
                <Input
                  value={formData.social_links?.youtube || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_links: { ...formData.social_links, youtube: e.target.value } 
                  })}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={saving}
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save Company Information'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanyInfoManagement;
