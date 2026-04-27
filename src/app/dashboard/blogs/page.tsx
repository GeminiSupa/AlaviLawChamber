'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    title: '', 
    excerpt: '', 
    content: '', 
    cover_image: '', 
    author_name: 'Ellavi Law Chamber',
    published_at: new Date().toISOString().split('T')[0],
    published: true 
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) console.error('Fetch error:', error);
    setBlogs(data || []);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blogs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('website_assets')
      .upload(filePath, file);

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('website_assets').getPublicUrl(filePath);
    setForm({ ...form, cover_image: publicUrl });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting blog...', form);
    
    if (!form.title) {
        alert('Please enter a title');
        return;
    }

    setUploading(true);
    const slug = form.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const dataToSave = { 
      ...form, 
      slug,
      published_at: new Date(form.published_at).toISOString()
    };

    try {
        if (editingId) {
          const { error } = await supabase.from('blogs').update(dataToSave).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('blogs').insert([dataToSave]);
          if (error) throw error;
        }
        setEditingId(null);
        resetForm();
        fetchBlogs();
        alert('Successfully saved!');
    } catch (err: any) {
        console.error('Submit error:', err);
        alert('Error saving: ' + (err.message || 'Unknown error'));
    } finally {
        setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({ 
      title: '', 
      excerpt: '', 
      content: '', 
      cover_image: '', 
      author_name: 'Ellavi Law Chamber',
      published_at: new Date().toISOString().split('T')[0],
      published: true 
    });
  };

  const handleEdit = (blog: any) => {
    setForm({ 
      title: blog.title, 
      excerpt: blog.excerpt, 
      content: blog.content, 
      cover_image: blog.cover_image, 
      author_name: blog.author_name || 'Ellavi Law Chamber',
      published_at: new Date(blog.published_at || blog.created_at).toISOString().split('T')[0],
      published: blog.published
    });
    setEditingId(blog.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this blog?')) {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) alert('Delete failed: ' + error.message);
        fetchBlogs();
    }
  };

  return (
    <div className="blog-mgmt">
      <header className="page-header">
        <h1>Blog Engine</h1>
        <p>Post and manage legal articles on the website.</p>
      </header>

      <div className="layout-grid mt-4">
        {/* Editor Form - Always Visible */}
        <div className="form-section">
          <div className="admin-card">
            <h3>{editingId ? 'Edit Article' : 'Write New Article'}</h3>
            <p className="text-muted mb-4" style={{ fontSize: '0.82rem' }}>Fill in the details below to publish.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Article Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Constitutional Law in Pakistan"
                />
              </div>

              <div className="form-group mb-3">
                <label>Writer Name</label>
                <input
                  type="text"
                  value={form.author_name}
                  onChange={e => setForm({ ...form, author_name: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <label>Publication Date</label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={e => setForm({ ...form, published_at: e.target.value })}
                />
              </div>

              <div className="form-group mb-3">
                <label>Article Body</label>
                <textarea
                  rows={10}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  required
                  placeholder="Start writing here..."
                  style={{ fontSize: '0.9rem', lineHeight: '1.6' }}
                />
              </div>

              <div className="form-group mb-3">
                <label>Cover Photo</label>
                <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                {form.cover_image && (
                  <div className="preview-rect mt-2">
                    <img src={form.cover_image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group d-flex align-center mt-3">
                <input
                  id="pub-check"
                  type="checkbox"
                  checked={form.published}
                  onChange={e => setForm({ ...form, published: e.target.checked })}
                  style={{ width: '20px', height: '20px', marginRight: '10px' }}
                />
                <label htmlFor="pub-check" style={{ marginBottom: 0, fontWeight: '600' }}>Publish Immediately</label>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button type="submit" className="btn-primary" disabled={uploading} style={{ flex: 1, border: 'none', cursor: 'pointer' }}>
                  <span>{editingId ? 'Save Changes' : (uploading ? 'Processing...' : 'Publish Article')}</span>
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); resetForm(); }} className="btn-secondary">
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="list-section">
          <div className="data-table">
            {loading ? <p className="p-4">Loading articles...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(b => (
                    <tr key={b.id}>
                      <td>
                        <div className="fw-600">{b.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{b.author_name}</div>
                      </td>
                      <td className="text-muted">{new Date(b.published_at || b.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button onClick={() => handleEdit(b)} className="edit-btn">Edit</button>
                          <button onClick={() => handleDelete(b.id)} className="delete-btn">Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .d-flex { display: flex; }
        .align-center { align-items: center; }
        .gap-3 { gap: 15px; }
        .gap-2 { gap: 10px; }
        .mt-4 { margin-top: 40px; }
        .mt-3 { margin-top: 20px; }
        .mb-3 { margin-bottom: 15px; }
        .mb-4 { margin-bottom: 25px; }
        .layout-grid { display: grid; grid-template-columns: 420px 1fr; gap: 40px; align-items: start; }
        .admin-card { background: var(--white); padding: 30px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .preview-rect { width: 100%; height: 120px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border); }
        .preview-rect img { width: 100%; height: 100%; object-fit: cover; }
        .data-table { background: var(--white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 15px 20px; background: #fdfdfd; border-bottom: 1px solid var(--bg-section); font-size: 0.7rem; text-transform: uppercase; color: var(--text-light); }
        td { padding: 15px 20px; border-bottom: 1px solid var(--bg-section); font-size: 0.85rem; }
        .btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 14px 20px; font-size: 0.8rem; font-weight: 600; flex: 1; cursor: pointer; }
        .edit-btn { color: var(--accent); background: none; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
        .delete-btn { color: #e63946; background: none; border: none; font-size: 0.75rem; cursor: pointer; }
        .edit-btn:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
