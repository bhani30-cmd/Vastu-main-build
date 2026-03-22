import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../services/api';
import { FileText, Edit, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import { Switch } from '../components/ui/switch';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote'],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'align',
  'list', 'bullet', 'indent',
  'blockquote',
  'link', 'image',
];

const PageContentManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    page_name: '',
    title: '',
    hero_title: '',
    hero_subtitle: '',
    body: '',
    meta_description: '',
    is_active: true,
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

  const parseContent = (content) => {
    if (!content) return { hero_title: '', hero_subtitle: '', body: '' };
    if (typeof content === 'string') {
      return { hero_title: '', hero_subtitle: '', body: content };
    }
    return {
      hero_title: content.hero_title || '',
      hero_subtitle: content.hero_subtitle || '',
      body: content.body || '',
    };
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    const parsed = parseContent(page.content);
    setFormData({
      page_name: page.page_name,
      title: page.title,
      hero_title: parsed.hero_title,
      hero_subtitle: parsed.hero_subtitle,
      body: parsed.body,
      meta_description: page.meta_description || '',
      is_active: page.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        page_name: formData.page_name,
        title: formData.title,
        content: {
          hero_title: formData.hero_title,
          hero_subtitle: formData.hero_subtitle,
          body: formData.body,
        },
        meta_description: formData.meta_description,
        is_active: formData.is_active,
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
      hero_title: '',
      hero_subtitle: '',
      body: '',
      meta_description: '',
      is_active: true,
    });
  };

  const getPreviewText = (content) => {
    if (!content) return 'No content';
    if (typeof content === 'string') return content.substring(0, 100);
    const parts = [];
    if (content.hero_title) parts.push(content.hero_title);
    if (content.hero_subtitle) parts.push(content.hero_subtitle);
    if (content.body) {
      const stripped = content.body.replace(/<[^>]*>/g, '');
      parts.push(stripped.substring(0, 80));
    }
    return parts.join(' — ') || 'No content';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8" data-testid="page-content-management">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Page Content Management</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600" data-testid="add-page-btn">
              <Plus className="mr-2" size={20} /> Add New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPage ? 'Edit Page Content' : 'Add New Page'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5" data-testid="page-form">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Page Identifier</Label>
                  <Input
                    value={formData.page_name}
                    onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                    required
                    placeholder="about, services, contact..."
                    disabled={!!editingPage}
                    data-testid="page-name-input"
                  />
                  <p className="text-xs text-gray-400 mt-1">URL-friendly slug (cannot change after creation)</p>
                </div>
                <div>
                  <Label>Display Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="About Us"
                    data-testid="page-title-input"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Hero Section</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hero Title</Label>
                    <Input
                      value={formData.hero_title}
                      onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                      placeholder="Page heading"
                      data-testid="hero-title-input"
                    />
                  </div>
                  <div>
                    <Label>Hero Subtitle</Label>
                    <Input
                      value={formData.hero_subtitle}
                      onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                      placeholder="Short tagline or description"
                      data-testid="hero-subtitle-input"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="mb-2 block">Page Body</Label>
                <div className="bg-white rounded-md border" data-testid="page-body-editor">
                  <ReactQuill
                    theme="snow"
                    value={formData.body}
                    onChange={(value) => setFormData({ ...formData, body: value })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your page content here..."
                    style={{ minHeight: '250px' }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Use the toolbar to format headings, fonts, colours, lists and more</p>
              </div>

              <div className="border-t pt-4">
                <Label>Meta Description (SEO)</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={2}
                  placeholder="Short description for search engines..."
                  data-testid="page-meta-input"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  data-testid="page-active-switch"
                />
                <Label>Page Active</Label>
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" data-testid="page-submit-btn">
                {editingPage ? 'Update' : 'Create'} Page
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div key={page._id} className="bg-white p-6 rounded-lg shadow-lg" data-testid={`page-card-${page.page_name}`}>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-orange-500" size={32} />
              <div>
                <h3 className="text-xl font-bold">{page.title}</h3>
                <p className="text-sm text-gray-500">/{page.page_name}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {getPreviewText(page.content)}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                page.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {page.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <Button onClick={() => handleEdit(page)} className="w-full" variant="outline" data-testid={`edit-page-${page.page_name}-btn`}>
              <Edit size={16} className="mr-2" /> Edit Content
            </Button>
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-12 text-gray-500" data-testid="no-pages-message">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>No pages created yet</p>
        </div>
      )}

      <style>{`
        .ql-container { min-height: 200px; font-size: 15px; }
        .ql-editor { min-height: 200px; }
        .ql-toolbar.ql-snow { border-radius: 6px 6px 0 0; background: #f9fafb; }
        .ql-container.ql-snow { border-radius: 0 0 6px 6px; }
      `}</style>
    </div>
  );
};

export default PageContentManagement;
