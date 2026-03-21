import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import { Switch } from '../components/ui/switch';

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    logo: '',
    quote: '',
    order: 0,
    is_active: true
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await adminAPI.getTestimonials();
      setTestimonials(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch testimonials');
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminAPI.uploadFile(file);
      setFormData({ ...formData, logo: response.data.url });
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminAPI.updateTestimonial(editingItem._id, formData);
        toast.success('Testimonial updated successfully');
      } else {
        await adminAPI.createTestimonial(formData);
        toast.success('Testimonial created successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to save testimonial');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      position: item.position,
      company: item.company,
      logo: item.logo,
      quote: item.quote,
      order: item.order,
      is_active: item.is_active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await adminAPI.deleteTestimonial(id);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      position: '',
      company: '',
      logo: '',
      quote: '',
      order: 0,
      is_active: true
    });
  };

  if (loading) {
    return <div className="p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div></div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonials Management</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2" size={20} /> Add New Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Quote/Testimonial</Label>
                <Textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <div>
                <Label>Company Logo</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {formData.logo && (
                    <img src={formData.logo} alt="Preview" className="w-20 h-20 object-contain rounded border" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                {editingItem ? 'Update' : 'Create'} Testimonial
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-4">
              <img src={item.logo} alt={item.company} className="w-16 h-16 object-contain" />
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.position}</p>
                <p className="text-sm text-orange-500 font-semibold">{item.company}</p>
              </div>
            </div>
            <p className="text-gray-700 italic mb-4">"{item.quote}"</p>
            <div className="flex gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">Order: {item.order}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleEdit(item)} size="sm" variant="outline" className="flex-1">
                <Edit size={16} className="mr-1" /> Edit
              </Button>
              <Button onClick={() => handleDelete(item._id)} size="sm" variant="destructive">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManagement;
