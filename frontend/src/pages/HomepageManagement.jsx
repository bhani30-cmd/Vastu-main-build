import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';

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

const HomepageManagement = () => {
  const [loading, setLoading] = useState(true);
  const [existing, setExisting] = useState(null);
  const [formData, setFormData] = useState({
    title: 'Home',
    hero_title: '',
    hero_subtitle: '',
    body: '',
    meta_description: '',
    is_active: true,
  });

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      const res = await adminAPI.getPage('home');
      setExisting(res.data);
      const c = res.data.content || {};
      setFormData({
        title: res.data.title || 'Home',
        hero_title: c.hero_title || '',
        hero_subtitle: c.hero_subtitle || '',
        body: c.body || '',
        meta_description: res.data.meta_description || '',
        is_active: res.data.is_active !== undefined ? res.data.is_active : true,
      });
      setLoading(false);
    } catch (e) {
      setExisting(null);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      page_name: 'home',
      title: formData.title,
      content: {
        hero_title: formData.hero_title,
        hero_subtitle: formData.hero_subtitle,
        body: formData.body,
      },
      meta_description: formData.meta_description,
      is_active: formData.is_active,
    };
    try {
      if (existing) {
        await adminAPI.updatePage('home', payload);
        toast.success('Homepage updated');
      } else {
        await adminAPI.createPage(payload);
        toast.success('Homepage created');
      }
      await fetchHome();
    } catch {
      toast.error('Failed to save homepage');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8" data-testid="homepage-management">
      <h1 className="text-3xl font-bold mb-6">Homepage Management</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Display Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Home"
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label>Active</Label>
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
                placeholder="Welcome"
              />
            </div>
            <div>
              <Label>Hero Subtitle</Label>
              <Input
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                placeholder="Tagline"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <Label className="mb-2 block">Body Content</Label>
          <div className="bg-white rounded-md border">
            <ReactQuill
              theme="snow"
              value={formData.body}
              onChange={(value) => setFormData({ ...formData, body: value })}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Homepage content..."
              style={{ minHeight: '250px' }}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <Label>Meta Description (SEO)</Label>
          <Textarea
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            rows={2}
            placeholder="Short description"
          />
        </div>

        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          {existing ? 'Update Homepage' : 'Create Homepage'}
        </Button>
      </form>
    </div>
  );
};

export default HomepageManagement;
