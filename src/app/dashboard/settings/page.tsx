'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SiteSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) console.error(error);
    const settingsMap = (data || []).reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    setSettings(settingsMap);
    setLoading(false);
  };

  const handleFileUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${key}_${Math.random()}.${fileExt}`;
    const filePath = `settings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('website_assets')
      .upload(filePath, file);

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('website_assets').getPublicUrl(filePath);
    
    const { error: dbError } = await supabase
      .from('site_settings')
      .upsert({ key, value: publicUrl });

    if (dbError) alert(dbError.message);
    else {
      setSettings((prev: any) => ({ ...prev, [key]: publicUrl }));
      alert('Asset updated successfully!');
    }
    setUploading(false);
  };

  const handleUpdateText = async (key: string, value: string) => {
    const { error } = await supabase.from('site_settings').upsert({ key, value });
    if (error) alert(error.message);
    else {
      setSettings((prev: any) => ({ ...prev, [key]: value }));
    }
  };

  if (loading) return <div className="p-10">Loading settings...</div>;

  return (
    <div className="settings-mgmt p-10">
      <header className="page-header mb-10">
        <h1>Site Customizer</h1>
        <p className="text-muted">Manage background images and public assets across your website.</p>
      </header>

      <div className="settings-section mb-10">
        <h2>Brand Story & Texts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="admin-form p-6 bg-white border">
            <div className="form-group">
              <label>About Us Section Title</label>
              <input 
                defaultValue={settings.about_title} 
                onBlur={(e) => handleUpdateText('about_title', e.target.value)}
                placeholder="e.g. Our Legacy"
              />
            </div>
            <div className="form-group mt-4">
              <label>Detailed Firm Narrative</label>
              <textarea 
                defaultValue={settings.about_story} 
                onBlur={(e) => handleUpdateText('about_story', e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted mt-2">TIP: Tab out of the box to auto-save.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section mb-10">
        <h2>Hero & Banner Images</h2>
        <div className="settings-grid mt-6">
          <div className="settings-card">
            <div className="card-info">
              <h3>Hero Background</h3>
              <p>The main large image at the top of your homepage.</p>
            </div>
            <div className="card-action">
              <div className="preview-sm mb-3">
                <img src={settings.hero_bg} alt="Hero" />
              </div>
              <input type="file" onChange={(e) => handleFileUpload('hero_bg', e)} disabled={uploading} />
            </div>
          </div>

          <div className="settings-card">
            <div className="card-info">
              <h3>About Section Photo</h3>
              <p>The image showing beside your firm story.</p>
            </div>
            <div className="card-action">
              <div className="preview-sm mb-3">
                <img src={settings.about_image} alt="About" />
              </div>
              <input type="file" onChange={(e) => handleFileUpload('about_image', e)} disabled={uploading} />
            </div>
          </div>

          <div className="settings-card">
            <div className="card-info">
              <h3>Banner Background</h3>
              <p>The background for the Consultation section.</p>
            </div>
            <div className="card-action">
              <div className="preview-sm mb-3">
                <img src={settings.banner_bg} alt="Banner" />
              </div>
              <input type="file" onChange={(e) => handleFileUpload('banner_bg', e)} disabled={uploading} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 30px; }
        .settings-card { 
          background: white; 
          padding: 30px; 
          border: 1px solid var(--border); 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between;
          height: 100%;
        }
        .card-info h3 { margin-bottom: 10px; color: var(--primary); font-size: 1.1rem; }
        .card-info p { font-size: 0.8rem; color: var(--text-light); margin-bottom: 25px; }
        .preview-sm { width: 100%; height: 180px; overflow: hidden; background: #f1f5f9; border: 1px solid var(--border); }
        .preview-sm img { width: 100%; height: 100%; object-fit: cover; }
        input[type="file"] { font-size: 0.8rem; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 8px; color: var(--primary); }
        input, textarea { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 4px; font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
