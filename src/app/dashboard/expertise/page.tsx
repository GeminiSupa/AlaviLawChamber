'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ExpertiseMgmt() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', icon: 'fa-scale-balanced', short_desc: '', full_desc: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('display_order', { ascending: true });
    setServices(data || []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('services').insert([form]);
    if (error) alert(error.message);
    else {
      setForm({ title: '', icon: 'fa-scale-balanced', short_desc: '', full_desc: '' });
      fetchServices();
      alert('Service added!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('services').delete().eq('id', id);
    fetchServices();
  };

  return (
    <div className="p-10">
      <header className="mb-10">
        <h1>Expertise Manager</h1>
        <p className="text-muted">Manage the legal practice areas shown on your homepage.</p>
      </header>

      <div className="mgmt-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
        <div>
          <table className="w-100">
            <thead>
              <tr>
                <th>Title</th>
                <th>Icon</th>
                <th>Short Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td><i className={`fa-solid ${s.icon}`} /></td>
                  <td style={{ maxWidth: '200px', fontSize: '0.8rem' }}>{s.short_desc}</td>
                  <td>
                    <button className="text-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="admin-form p-6 bg-white border" onSubmit={handleAdd}>
          <h3>Add New Service</h3>
          <div className="form-group mt-4">
            <label>Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Criminal Defense" />
          </div>
          <div className="form-group mt-4">
            <label>FontAwesome Icon Class</label>
            <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} required placeholder="fa-gavel" />
          </div>
          <div className="form-group mt-4">
            <label>Short Description</label>
            <textarea value={form.short_desc} onChange={e => setForm({...form, short_desc: e.target.value})} required rows={3} />
          </div>
          <div className="form-group mt-4">
            <label>Full Narrative</label>
            <textarea value={form.full_desc} onChange={e => setForm({...form, full_desc: e.target.value})} rows={5} />
          </div>
          <button type="submit" className="btn-primary w-100 mt-6">Add Expertise</button>
        </form>
      </div>
    </div>
  );
}
