'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function GalleryManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', image_url: '', category: 'Offices' });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    setItems(data || []);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

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
          const { error } = await supabase.from('gallery').update(form).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('gallery').insert([form]);
          if (error) throw error;
        }
        setEditingId(null);
        resetForm();
        fetchGallery();
        alert('Photo saved to gallery!');
    } catch (err: any) {
        console.error(err);
        alert('Error: ' + err.message);
    } finally {
        setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', image_url: '', category: 'Offices' });
  };

  const handleEdit = (item: any) => {
    setForm({ title: item.title, image_url: item.image_url, category: item.category });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this photo?')) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) alert(error.message);
      fetchGallery();
    }
  };

  return (
    <div className="gallery-mgmt">
      <header className="page-header">
        <h1>Photo Hub</h1>
        <p>Curate the gallery of Ellavi Law Chamber.</p>
      </header>

      <div className="layout-grid mt-4">
        <div className="form-section">
          <div className="admin-card">
            <h3>{editingId ? 'Edit Picture' : 'Upload Picture'}</h3>
            <p className="text-muted mb-4" style={{ fontSize: '0.82rem' }}>Add or edit gallery snapshots.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Caption</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Modern Chambers" />
              </div>
              <div className="form-group mb-3">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="Offices">Offices</option><option value="Court">Court</option><option value="Events">Events</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label>File</label>
                <input type="file" onChange={handleFileUpload} disabled={uploading} />
                {form.image_url && <div className="preview-rect mt-2"><img src={form.image_url} alt="P" /></div>}
              </div>
              <div className="d-flex gap-3 mt-4">
                <button type="submit" className="btn-primary" disabled={uploading} style={{ flex: 1, border: 'none', cursor: 'pointer' }}>
                  <span>{editingId ? 'Save Changes' : 'Save to Gallery'}</span>
                </button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); resetForm(); }} className="btn-secondary"><span>Cancel</span></button>}
              </div>
            </form>
          </div>
        </div>

        <div className="list-section">
          <div className="custom-gallery-grid">
            {items.map(item => (
              <div key={item.id} className="thumb-card thumb-mini">
                <div className="thumb-img-mini"><img src={item.image_url} alt="T" /><div className="thumb-tag">{item.category}</div></div>
                <div className="p-2 d-flex justify-between align-center">
                   <div style={{ fontSize: '0.7rem' }}>{item.title || 'Untitled'}</div>
                   <div className="d-flex gap-2">
                     <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                     <button onClick={() => handleDelete(item.id)} className="delete-btn">Del</button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .d-flex { display: flex; }
        .align-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-3 { gap: 15px; }
        .gap-2 { gap: 10px; }
        .mt-4 { margin-top: 40px; }
        .p-2 { padding: 10px; }
        .layout-grid { display: grid; grid-template-columns: 340px 1fr; gap: 40px; align-items: start; }
        .admin-card { background: var(--white); padding: 30px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .preview-rect { width: 100%; height: 120px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border); }
        .preview-rect img { width: 100%; height: 100%; object-fit: cover; }
        .custom-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; }
        .thumb-card { background: var(--white); border: 1px solid var(--border); }
        .thumb-img-mini { height: 120px; position: relative; }
        .thumb-img-mini img { width: 100%; height: 100%; object-fit: cover; }
        .thumb-tag { position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.6); color: white; padding: 1px 5px; font-size: 0.55rem; border-radius: 3px; }
        .btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 12px; font-size: 0.8rem; cursor: pointer; flex: 1; }
        .edit-btn { color: var(--accent); background: none; border: none; font-size: 0.7rem; font-weight: 700; cursor: pointer; }
        .delete-btn { color: #e63946; background: none; border: none; font-size: 0.7rem; cursor: pointer; }
      `}</style>
    </div>
  );
}
