'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TeamManagement() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', bio: '', image_url: '', linkedin_url: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
    if (error) console.error(error);
    setMembers(data || []);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // cleanup old image if replacing
    if (form.image_url && form.image_url.includes('website_assets')) {
      const oldPath = form.image_url.split('website_assets/')[1]?.split('?')[0];
      if (oldPath) await supabase.storage.from('website_assets').remove([oldPath]);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `team/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('website_assets')
      .upload(filePath, file);

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('website_assets').getPublicUrl(filePath);
    setForm({ ...form, image_url: publicUrl });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
        if (editingId) {
          const { error } = await supabase.from('team_members').update(form).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('team_members').insert([form]);
          if (error) throw error;
        }
        setEditingId(null);
        resetForm();
        fetchMembers();
        alert('Saved successfully!');
    } catch (err: any) {
        console.error(err);
        alert('Error: ' + err.message);
    } finally {
        setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', role: '', bio: '', image_url: '', linkedin_url: '' });
  };

  const handleEdit = (member: any) => {
    setForm({ 
      name: member.name, 
      role: member.role, 
      bio: member.bio, 
      image_url: member.image_url,
      linkedin_url: member.linkedin_url || '' 
    });
    setEditingId(member.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      const member = members.find(m => m.id === id);
      if (member?.image_url) {
        const path = member.image_url.split('website_assets/')[1]?.split('?')[0];
        if (path) await supabase.storage.from('website_assets').remove([path]);
      }
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) alert(error.message);
      fetchMembers();
    }
  };

  return (
    <div className="team-mgmt">
      <header className="page-header">
        <h1>Lawyer Profiles</h1>
        <p>Manage the team structure and professional bios.</p>
      </header>

      <div className="layout-grid mt-4">
        <div className="form-section">
          <div className="admin-card">
            <h3>{editingId ? 'Edit Profile' : 'Add New Member'}</h3>
            <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>Update lawyer details below.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group mb-3">
                <label>Designation</label>
                <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
              </div>
              <div className="form-group mb-3">
                <label>Bio</label>
                <textarea rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
              <div className="form-group mb-3">
                <label>LinkedIn URL</label>
                <input type="url" placeholder="https://linkedin.com/in/username" value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} />
              </div>
              <div className="form-group mb-3">
                <label>Photo</label>
                <input type="file" onChange={handleFileUpload} disabled={uploading} />
                {form.image_url && <div className="preview-wrap mt-2"><img src={form.image_url} alt="P" /></div>}
              </div>
              <div className="d-flex gap-3 mt-4">
                <button type="submit" className="btn-primary" disabled={uploading} style={{ flex: 1, border: 'none', cursor: 'pointer' }}>
                  <span>{editingId ? 'Update Member' : 'Add Member'}</span>
                </button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); resetForm(); }} className="btn-secondary"><span>Cancel</span></button>}
              </div>
            </form>
          </div>
        </div>

        <div className="list-section">
          <div className="data-table">
            <table>
              <thead><tr><th>Member</th><th>Actions</th></tr></thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="d-flex align-center gap-3">
                        <div className="avatar"><img src={m.image_url || 'https://via.placeholder.com/100'} alt="M" /></div>
                        <div><div className="fw-600">{m.name}</div><div className="text-muted" style={{ fontSize: '0.75rem' }}>{m.role}</div></div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleEdit(m)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDelete(m.id)} className="delete-btn">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .d-flex { display: flex; }
        .align-center { align-items: center; }
        .gap-3 { gap: 15px; }
        .gap-2 { gap: 10px; }
        .mt-4 { margin-top: 40px; }
        .mb-3 { margin-bottom: 15px; }
        .mb-4 { margin-bottom: 25px; }
        .layout-grid { display: grid; grid-template-columns: 360px 1fr; gap: 40px; align-items: start; }
        .admin-card { background: var(--white); padding: 30px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .preview-wrap { width: 60px; height: 60px; border-radius: 50%; overflow: hidden; border: 2px solid var(--accent); }
        .preview-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .data-table { background: var(--white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 12px 20px; background: #fdfdfd; border-bottom: 1px solid var(--bg-section); font-size: 0.7rem; color: var(--text-light); text-align: left; }
        td { padding: 12px 20px; border-bottom: 1px solid var(--bg-section); font-size: 0.85rem; }
        .btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 12px; font-size: 0.8rem; cursor: pointer; flex: 1; }
        .edit-btn { color: var(--accent); background: none; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
        .delete-btn { color: #e63946; background: none; border: none; font-size: 0.75rem; cursor: pointer; }
      `}</style>
    </div>
  );
}
