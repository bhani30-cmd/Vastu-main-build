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

const CapabilitiesManagement = () => {
  const [capabilities, setCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    order: 0,
    is_active: true
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCapabilities();
  }, []);

  const fetchCapabilities = async () => {
    try {
      const response = await adminAPI.getCapabilities();
      setCapabilities(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch capabilities');
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminAPI.uploadFile(file);
      setFormData({ ...formData, image: response.data.url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminAPI.updateCapability(editingItem._id, formData);
        toast.success('Capability updated successfully');
      } else {
        await adminAPI.createCapability(formData);
        toast.success('Capability created successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchCapabilities();
    } catch (error) {
      toast.error('Failed to save capability');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      image: item.image,
      description: item.description || '',
      order: item.order,
      is_active: item.is_active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this capability?')) return;
    
    try {
      await adminAPI.deleteCapability(id);
      toast.success('Capability deleted successfully');
      fetchCapabilities();
    } catch (error) {
      toast.error('Failed to delete capability');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      image: '',
      description: '',
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
        <h1 className="text-3xl font-bold">Capabilities Management</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2" size={20} /> Add New Capability
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Capability' : 'Add New Capability'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Image</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
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
                {editingItem ? 'Update' : 'Create'} Capability
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capabilities.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded-lg shadow">
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded mb-3" />
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            {item.description && <p className="text-sm text-gray-600 mb-3">{item.description}</p>}
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

export default CapabilitiesManagement;
