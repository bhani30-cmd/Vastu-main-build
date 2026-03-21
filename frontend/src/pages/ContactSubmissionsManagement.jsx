import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Mail, Phone, Calendar, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

const ContactSubmissionsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await adminAPI.getContacts();
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch contact submissions');
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updateContactStatus(id, status);
      toast.success('Status updated successfully');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await adminAPI.deleteContact(id);
      toast.success('Submission deleted successfully');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete submission');
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div></div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <p className="text-gray-600 mt-2">Total: {contacts.length} submissions</p>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{contact.name}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(contact.status)}`}>
                    {contact.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <a href={`mailto:${contact.email}`} className="hover:text-orange-500">{contact.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <a href={`tel:${contact.phone}`} className="hover:text-orange-500">{contact.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="font-semibold text-sm mb-1">Subject: {contact.subject}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Button onClick={() => handleView(contact)} size="sm" variant="outline">
                  <Eye size={16} className="mr-1" /> View
                </Button>
                <Select value={contact.status} onValueChange={(value) => handleStatusChange(contact._id, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => handleDelete(contact._id)} size="sm" variant="destructive">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Mail size={48} className="mx-auto mb-4 opacity-50" />
            <p>No contact submissions yet</p>
          </div>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Name:</Label>
                <p>{selectedContact.name}</p>
              </div>
              <div>
                <Label className="font-semibold">Email:</Label>
                <p>{selectedContact.email}</p>
              </div>
              <div>
                <Label className="font-semibold">Phone:</Label>
                <p>{selectedContact.phone}</p>
              </div>
              <div>
                <Label className="font-semibold">Subject:</Label>
                <p>{selectedContact.subject}</p>
              </div>
              <div>
                <Label className="font-semibold">Message:</Label>
                <p className="whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <Label className="font-semibold">Submitted:</Label>
                <p>{new Date(selectedContact.created_at).toLocaleString()}</p>
              </div>
              <div>
                <Label className="font-semibold">Status:</Label>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(selectedContact.status)}`}>
                  {selectedContact.status.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Label = ({ children, className }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

export default ContactSubmissionsManagement;
