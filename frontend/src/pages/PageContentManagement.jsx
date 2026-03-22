import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FileText, Edit, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import { Switch } from '../components/ui/switch';

const PageContentManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    page_name: '',
    title: '',
    content: {},
    meta_description: '',
    is_active: true
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await adminAPI.getPages();
      setPages(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch pages');
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      page_name: page.page_name,
      title: page.title,
      content: JSON.stringify(page.content, null, 2),
      meta_description: page.meta_description || '',
      is_active: page.is_active
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let contentObj;
      try {
        contentObj = typeof formData.content === 'string' ? JSON.parse(formData.content) : formData.content;
      } catch (err) {
        toast.error('Invalid JSON in content field');
        return;
      }

      const payload = {
        ...formData,
        content: contentObj
      };

      if (editingPage) {
        await adminAPI.updatePage(editingPage.page_name, payload);
        toast.success('Page updated successfully');
      } else {
        await adminAPI.createPage(payload);
        toast.success('Page created successfully');
      }
      
      setDialogOpen(false);
      resetForm();
      fetchPages();
    } catch (error) {
      toast.error('Failed to save page');
    }
  };

  const resetForm = () => {
    setEditingPage(null);
    setFormData({
      page_name: '',
      title: '',
      content: {},
      meta_description: '',
      is_active: true
    });
  };

  if (loading) {
    return <div className=\"p-8\"><div className=\"animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500\"></div></div>;
  }

  return (
    <div className=\"p-8\">
      <div className=\"flex justify-between items-center mb-6\">
        <h1 className=\"text-3xl font-bold\">Page Content Management</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className=\"bg-orange-500 hover:bg-orange-600\">
              <Plus className=\"mr-2\" size={20} /> Add New Page
            </Button>
          </DialogTrigger>
          <DialogContent className=\"max-w-3xl max-h-[90vh] overflow-y-auto\">
            <DialogHeader>
              <DialogTitle>{editingPage ? 'Edit Page Content' : 'Add New Page'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className=\"space-y-4\">
              <div>
                <Label>Page Name (URL identifier)</Label>
                <Input
                  value={formData.page_name}
                  onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                  required
                  placeholder=\"about, services, contact, etc.\"
                  disabled={!!editingPage}
                />
              </div>
              
              <div>
                <Label>Page Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label>Content (JSON format)</Label>
                <Textarea
                  value={typeof formData.content === 'string' ? formData.content : JSON.stringify(formData.content, null, 2)}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  placeholder='{\"hero_title\": \"Title\", \"hero_subtitle\": \"Subtitle\"}'
                  className=\"font-mono text-sm\"
                />
                <p className=\"text-xs text-gray-500 mt-1\">Enter valid JSON content for the page</p>
              </div>
              
              <div>
                <Label>Meta Description (SEO)</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className=\"flex items-center gap-2\">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Page Active</Label>
              </div>
              
              <Button type=\"submit\" className=\"w-full bg-orange-500 hover:bg-orange-600\">
                {editingPage ? 'Update' : 'Create'} Page
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
        {pages.map((page) => (
          <div key={page._id} className=\"bg-white p-6 rounded-lg shadow-lg\">
            <div className=\"flex items-center gap-3 mb-4\">
              <FileText className=\"text-orange-500\" size={32} />
              <div>
                <h3 className=\"text-xl font-bold\">{page.title}</h3>
                <p className=\"text-sm text-gray-500\">/{page.page_name}</p>
              </div>
            </div>
            
            <p className=\"text-sm text-gray-600 mb-4 line-clamp-2\">
              {page.meta_description || 'No description'}
            </p>
            
            <div className=\"flex items-center justify-between mb-4\">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                page.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {page.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <Button onClick={() => handleEdit(page)} className=\"w-full\" variant=\"outline\">
              <Edit size={16} className=\"mr-2\" /> Edit Content
            </Button>
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className=\"text-center py-12 text-gray-500\">
          <FileText size={48} className=\"mx-auto mb-4 opacity-50\" />
          <p>No pages created yet</p>
        </div>
      )}
    </div>
  );
};

export default PageContentManagement;
