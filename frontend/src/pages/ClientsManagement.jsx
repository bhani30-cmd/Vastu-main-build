import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import { Switch } from '../components/ui/switch';

const ClientsManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    order: 0,
    is_active: true
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await adminAPI.getClients();
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch clients');
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
        await adminAPI.updateClient(editingItem._id, formData);
        toast.success('Client updated successfully');
      } else {
        await adminAPI.createClient(formData);
        toast.success('Client created successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchClients();
    } catch (error) {
      toast.error('Failed to save client');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      logo: item.logo,
      order: item.order,
      is_active: item.is_active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    
    try {
      await adminAPI.deleteClient(id);
      toast.success('Client deleted successfully');
      fetchClients();
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      logo: '',
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
        <h1 className="text-3xl font-bold">Clients Management</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2" size={20} /> Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Logo</Label>
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
                {editingItem ? 'Update' : 'Create'} Client
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {clients.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-lg shadow text-center">
            <img src={item.logo} alt={item.name} className="w-full h-24 object-contain mb-3" />
            <h3 className="font-bold mb-2">{item.name}</h3>
            <div className="flex gap-2 justify-center mb-3">
              <span className={`text-xs px-2 py-1 rounded ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">Order: {item.order}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleEdit(item)} size="sm" variant="outline" className="flex-1">
                <Edit size={16} />
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

export default ClientsManagement;
