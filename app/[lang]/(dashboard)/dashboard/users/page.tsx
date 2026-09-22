'use client';

import React, { useState, useEffect, use } from 'react';
import {
  TbUsers,
  TbUserPlus,
  TbShieldCheck,
  TbTrash,
  TbKey,
  TbEdit,
  TbRefresh,
  TbX,
  TbCheck,
  TbAlertCircle,
  TbLock,
} from 'react-icons/tb';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'media buying' | 'hr';
  status: 'active' | 'suspended';
  createdAt?: string;
}

const ROLE_CONFIG: Record<
  string,
  { label: string; badgeClass: string; desc: string }
> = {
  admin: {
    label: 'Root Admin',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    desc: 'Unrestricted control: team RBAC, navigation, API keys, and all pages.',
  },
  editor: {
    label: 'Content Editor',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    desc: 'Edits all site pages, navigation, case studies, and media assets.',
  },
  author: {
    label: 'Author',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    desc: 'Drafts and publishes articles, insights, and media files.',
  },
  'media buying': {
    label: 'Media Buying',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    desc: 'Monitors inbound inquiries, discovery pipelines, and ad conversion metrics.',
  },
  hr: {
    label: 'HR / Talent',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    desc: 'Manages candidate ATS pipelines, CV downloads, and candidate emails.',
  },
};

export default function UsersManagementPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor' as UserRecord['role'],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password reset state
  const [resettingUser, setResettingUser] = useState<UserRecord | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', { cache: 'no-store' });
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load team users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'editor' });
        fetchUsers();
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch {
      setError('Connection error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRecord['role']) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser || newPassword.length < 6) return;
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resettingUser.id, newPassword }),
      });
      if (res.ok) {
        setResetSuccess(true);
        setTimeout(() => {
          setResettingUser(null);
          setNewPassword('');
          setResetSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Password reset failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove user "${email}" from the dashboard team?`)) return;
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-persici-crimson mb-1">
            <span>Access Control & Security</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Team & RBAC Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage administrative personnel, assign granular permission roles, and reset credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            <TbUserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
          <button
            type="button"
            onClick={fetchUsers}
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(ROLE_CONFIG).map(([roleKey, cfg]) => {
          const count = users.filter((u) => u.role === roleKey).length;
          return (
            <div key={roleKey} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${cfg.badgeClass}`}>
                  {cfg.label}
                </span>
                <span className="text-sm font-bold text-slate-900">{count}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2 pt-1">{cfg.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-persici-crimson border-t-transparent mb-3" />
            <p className="text-sm">Loading team users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[10px] text-slate-500 tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">User Details</th>
                  <th className="px-4 py-3.5">Assigned Role</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Created Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const cfg = ROLE_CONFIG[u.role] || ROLE_CONFIG.editor;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                            {u.name ? u.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{u.name}</div>
                            <div className="text-slate-400 text-xs">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value as UserRecord['role'])}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-persici-crimson"
                        >
                          <option value="admin">Root Admin</option>
                          <option value="editor">Content Editor</option>
                          <option value="author">Author</option>
                          <option value="media buying">Media Buying</option>
                          <option value="hr">HR / Talent</option>
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setResettingUser(u);
                              setNewPassword('');
                              setResetSuccess(false);
                            }}
                            className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-slate-100"
                            title="Reset Password"
                          >
                            <TbKey className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                            title="Delete User"
                          >
                            <TbTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                <TbAlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Al-Mansoor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@persiciagency.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">System Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRecord['role'] })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
                >
                  <option value="editor">Content Editor (All site pages & media)</option>
                  <option value="author">Author (Articles & thought leadership)</option>
                  <option value="media buying">Media Buying (Leads, discovery & analytics)</option>
                  <option value="hr">HR / Talent (Candidate ATS & emails)</option>
                  <option value="admin">Root Admin (Full system control)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-persici-crimson text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Reset Password for {resettingUser.name}
              </h3>
              <button
                type="button"
                onClick={() => setResettingUser(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <TbX className="w-4 h-4" />
              </button>
            </div>

            {resetSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-semibold flex items-center gap-2">
                <TbCheck className="w-4 h-4 text-emerald-600" />
                <span>Password updated successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Encrypted Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-persici-crimson"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setResettingUser(null)}
                    className="px-3 py-1.5 text-xs text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || newPassword.length < 6}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Set Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
