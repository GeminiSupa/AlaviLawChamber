'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NewsMgmt() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data } = await supabase.from('news_ticker').select('*').order('created_at', { ascending: false });
    setNews(data || []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent) return;
    const { error } = await supabase.from('news_ticker').insert([{ content: newContent }]);
    if (error) alert(error.message);
    else {
      setNewContent('');
      fetchNews();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('news_ticker').delete().eq('id', id);
    fetchNews();
  };

  return (
    <div className="p-10">
      <header className="mb-10">
        <h1>News Ticker Manager</h1>
        <p className="text-muted">Manage the scrolling announcements at the top of the website.</p>
      </header>

      <form className="admin-form mb-10 p-6 bg-white border" onSubmit={handleAdd} style={{ maxWidth: '600px' }}>
        <h3>Add New Announcement</h3>
        <div className="form-group mt-4">
          <input 
            value={newContent} 
            onChange={e => setNewContent(e.target.value)} 
            placeholder="e.g. Alavi Law Chamber Opens New Office in Lahore..." 
            className="w-100"
            required
          />
        </div>
        <button type="submit" className="btn-primary mt-4">Add to Ticker</button>
      </form>

      <div className="news-list" style={{ maxWidth: '600px' }}>
        <h3>Active Announcements</h3>
        {news.map(item => (
          <div key={item.id} className="p-4 border mt-2 bg-white d-flex justify-between items-center">
            <span>{item.content}</span>
            <button className="text-danger" onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
