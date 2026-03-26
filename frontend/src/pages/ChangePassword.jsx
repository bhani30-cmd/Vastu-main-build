import React, { useState } from 'react';
import { adminAPI } from '../services/api';
import { Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const ChangePassword = () => {
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [pwLoading, setPwLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Lock size={28} /> Change Password
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (pwForm.new_password !== pwForm.confirm_password) {
                toast.error('New passwords do not match');
                return;
              }
              if (pwForm.new_password.length < 6) {
                toast.error('New password must be at least 6 characters');
                return;
              }
              setPwLoading(true);
              try {
                await adminAPI.changePassword({
                  current_password: pwForm.current_password,
                  new_password: pwForm.new_password
                });
                toast.success('Password changed successfully');
                setPwForm({ current_password: '', new_password: '', confirm_password: '' });
              } catch (error) {
                toast.error(error.response?.data?.detail || 'Failed to change password');
              } finally {
                setPwLoading(false);
              }
            }}
            className="grid gap-4"
          >
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={pwForm.current_password}
                onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={pwForm.new_password}
                  onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={pwForm.confirm_password}
                  onChange={(e) => setPwForm({ ...pwForm, confirm_password: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Button type="submit" disabled={pwLoading} className="bg-orange-500 hover:bg-orange-600">
                {pwLoading ? 'Saving...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
