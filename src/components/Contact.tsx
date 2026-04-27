'use client';
import { useEffect, useRef, useState } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const practiceAreas = [
  'Corporate Law',
  'Criminal Defense',
  'Property & Real Estate',
  'Family Law',
  'Constitutional Law',
  'Contract & Civil',
  'Other',
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState<FormState>('idle');
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', subject: '', message: '',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.1 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFormState('success');
        setForm({ full_name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  return (
    <section id="contact" className="contact section-padding" ref={sectionRef}>
      <div className="container">
        <div className="section-header text-center reveal">
          <span className="section-eyebrow">Get in Touch</span>
          <h2 className="section-title">Reach Out To Us</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Our chambers are open for confidential legal consultations. We respond within 24 hours.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info */}
          <div className="reveal-left" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="info-card">
              <div className="info-icon"><i className="fa-solid fa-location-dot" /></div>
              <div>
                <h4>Chamber Address</h4>
                <p>Sector 10, Islamabad, Pakistan</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon"><i className="fa-solid fa-phone" /></div>
              <div>
                <h4>Phone Enquiries</h4>
                <p>+92 (0) 51 000 0000</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon"><i className="fa-solid fa-envelope" /></div>
              <div>
                <h4>Email Us</h4>
                <p>consult@alavilaw.pk</p>
              </div>
            </div>
            <div className="office-hours-card">
              <h4>Office Hours</h4>
              <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
              <p>Saturday: By Appointment Only</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap reveal-right">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="full_name">Full Name *</label>
                  <input
                    id="full_name" name="full_name" type="text"
                    placeholder="Bilal Khan" required
                    value={form.full_name} onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email" name="email" type="email"
                    placeholder="bilal@example.com" required
                    value={form.email} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone" name="phone" type="tel"
                    placeholder="+92 300 0000000"
                    value={form.phone} onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Practice Area</label>
                  <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
                    <option value="">Select an area...</option>
                    {practiceAreas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Case Details / Message *</label>
                <textarea
                  id="message" name="message"
                  placeholder="Please describe your legal matter briefly. All information is kept strictly confidential."
                  required rows={5}
                  value={form.message} onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-100"
                disabled={formState === 'loading'}
                style={{ border: 'none', fontSize: '0.85rem', padding: '16px' }}
              >
                {formState === 'loading'
                  ? 'Sending...'
                  : 'Send Confidential Message'}
              </button>

              {formState === 'success' && (
                <div className="form-status success">
                  ✓ Message received. Our team will be in touch within 24 hours.
                </div>
              )}
              {formState === 'error' && (
                <div className="form-status error">
                  ✗ Failed to send. Please try again or email us directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
