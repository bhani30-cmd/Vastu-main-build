import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import { Switch } from '../components/ui/switch';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Industrial',
    description: '',
    client: '',
    image: '',
    gallery_images: [],
    location: '',
    area: '',
    completion_date: '',
    highlights: [],
    scope: '',
    is_featured: false,
    is_active: true
  });
  const [uploading, setUploading] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');

  const categories = ['Industrial', 'Commercial', 'Institutional', 'Residential', 'Office', 'Retail'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await adminAPI.getProjects();
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch projects');
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
        await adminAPI.updateProject(editingItem._id, formData);
        toast.success('Project updated successfully');
      } else {
        await adminAPI.createProject(formData);
        toast.success('Project created successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      client: item.client,
      image: item.image,
      gallery_images: item.gallery_images || [],
      location: item.location || '',
      area: item.area || '',
      completion_date: item.completion_date || '',
      highlights: item.highlights || [],
      scope: item.scope || '',
      is_featured: item.is_featured,
      is_active: item.is_active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await adminAPI.deleteProject(id);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setHighlightInput('');
    setFormData({
      title: '',
      category: 'Industrial',
      description: '',
      client: '',
      image: '',
      gallery_images: [],
      location: '',
      area: '',
      completion_date: '',
      highlights: [],
      scope: '',
      is_featured: false,
      is_active: true
    });
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await adminAPI.uploadFile(file);
      setFormData({ ...formData, gallery_images: [...formData.gallery_images, response.data.url] });
      toast.success('Gallery image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData({
      ...formData,
      gallery_images: formData.gallery_images.filter((_, i) => i !== index)
    });
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div></div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2" size={20} /> Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Project' : 'Add New Project'}</DialogTitle>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Client</Label>
                  <Input
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Noida, UP"
                  />
                </div>
                <div>
                  <Label>Area</Label>
                  <Input
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g., 100,000 sq ft"
                  />
                </div>
                <div>
                  <Label>Completion Date</Label>
                  <Input
                    value={formData.completion_date}
                    onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>
              <div>
                <Label>Project Scope (detailed)</Label>
                <Textarea
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  rows={3}
                  placeholder="Detailed scope of the project..."
                />
              </div>
              <div>
                <Label>Main Image</Label>
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
              <div>
                <Label>Gallery Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploading}
                />
                {formData.gallery_images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.gallery_images.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} alt={`Gallery ${i + 1}`} className="w-16 h-16 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label>Highlights</Label>
                <div className="flex gap-2">
                  <Input
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="Add a highlight..."
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                  />
                  <Button type="button" onClick={addHighlight} variant="outline" className="shrink-0">Add</Button>
                </div>
                {formData.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.highlights.map((h, i) => (
                      <span key={i} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        {h}
                        <button type="button" onClick={() => removeHighlight(i)} className="hover:text-red-600">x</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label>Featured</Label>
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
                {editingItem ? 'Update' : 'Create'} Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded-lg shadow">
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded mb-3" />
            <span className="text-xs font-semibold text-orange-500 mb-1 block">{item.category}</span>
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            <p className="text-xs text-gray-500 mb-3">Client: {item.client}</p>
            <div className="flex gap-2 mb-3 flex-wrap">
              {item.is_featured && (
                <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">Featured</span>
              )}
              <span className={`text-xs px-2 py-1 rounded ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
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

export default ProjectsManagement;
