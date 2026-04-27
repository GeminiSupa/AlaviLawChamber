'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestimonialsManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: '', testimonial: '', stars: 5, is_featured: true });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('public_testimonials').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    setItems(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (editingId) {
          const { error } = await supabase.from('public_testimonials').update(form).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('public_testimonials').insert([form]);
          if (error) throw error;
        }
        setEditingId(null);
        resetForm();
        fetchTestimonials();
        alert('Saved successfully!');
    } catch (err: any) {
        console.error(err);
        alert('Error: ' + err.message);
    }
  };

  const resetForm = () => {
    setForm({ name: '', role: '', testimonial: '', stars: 5, is_featured: true });
  };

  const handleEdit = (item: any) => {
    setForm({ 
      name: item.name, 
      role: item.role, 
      testimonial: item.testimonial, 
      stars: item.stars, 
      is_featured: item.is_featured 
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      const { error } = await supabase.from('public_testimonials').delete().eq('id', id);
      if (error) alert(error.message);
      fetchTestimonials();
    }
  };

  return (
    <div className="testi-mgmt">
      <header className="page-header">
        <h1>Client Voice</h1>
        <p>Manage and showcase professional feedback.</p>
      </header>

      <div className="layout-grid mt-4">
        <div className="form-section">
          <div className="admin-card">
            <h3>{editingId ? 'Edit Feedback' : 'Add Testimonial'}</h3>
            <p className="text-muted mb-4" style={{ fontSize: '0.82rem' }}>Recount a client's experience.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Client Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group mb-3">
                <label>Role</label>
                <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
              </div>
              <div className="form-group mb-3">
                <label>Feedback</label>
                <textarea rows={6} value={form.testimonial} onChange={e => setForm({ ...form, testimonial: e.target.value })} required />
              </div>
              <div className="form-group mb-3">
                <label>Rating</label>
                <select value={form.stars} onChange={e => setForm({ ...form, stars: parseInt(e.target.value) })}>
                  <option value="5">5 Stars</option><option value="4">4 Stars</option>
                </select>
              </div>
              <div className="form-group d-flex align-center mt-3">
                <input id="feat-check" type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} style={{ width: '20px', marginRight: '10px' }} />
                <label htmlFor="feat-check">Show on Website</label>
              </div>
              <div className="d-flex gap-3 mt-4">
                <button type="submit" className="btn-primary" style={{ flex: 1, border: 'none', cursor: 'pointer' }}>
                  <span>{editingId ? 'Update Feedback' : 'Save Testimonial'}</span>
                </button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); resetForm(); }} className="btn-secondary"><span>Cancel</span></button>}
              </div>
            </form>
          </div>
        </div>

        <div className="list-section">
          <div className="data-table">
            <table>
              <thead><tr><th>Client</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map(t => (
                  <tr key={t.id}>
                    <td><div className="fw-600">{t.name}</div><div className="text-muted" style={{ fontSize: '0.7rem' }}>"{t.testimonial.substring(0, 40)}..."</div></td>
                    <td><span className={`badge ${t.is_featured ? 'status-active' : 'status-draft'}`}>{t.is_featured ? 'LIVE' : 'HIDDEN'}</span></td>
                    <td><div className="d-flex gap-2"><button onClick={() => handleEdit(t)} className="edit-btn">Edit</button><button onClick={() => handleDelete(t.id)} className="delete-btn">Del</button></div></td>
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
        .layout-grid { display: grid; grid-template-columns: 340px 1fr; gap: 40px; align-items: start; }
        .admin-card { background: var(--white); padding: 30px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .data-table { background: var(--white); border: 1px solid var(--border); }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 12px 20px; background: #fdfdfd; border-bottom: 1px solid var(--bg-section); font-size: 0.7rem; text-align: left; }
        td { padding: 12px 20px; border-bottom: 1px solid var(--bg-section); font-size: 0.85rem; }
        .badge { padding: 3px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 700; }
        .status-active { background: #dcfce7; color: #166534; }
        .status-draft { background: #f1f5f9; color: #475569; }
        .btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 12px; cursor: pointer; flex: 1; }
        .edit-btn { color: var(--accent); background: none; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
        .delete-btn { color: #e63946; background: none; border: none; font-size: 0.75rem; cursor: pointer; }
      `}</style>
    </div>
  );
}
