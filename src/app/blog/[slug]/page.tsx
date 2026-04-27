import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

export const revalidate = 60; 

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // NEXT.JS 16 REQUIREMENT: Await the params before using them
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !blog) {
    console.error('Blog Fetch Error:', error);
    notFound();
  }

  return (
    <main className="blog-detail-page">
      <Navbar />
      
      <section className="blog-hero">
        <div className="blog-hero-image">
          <img src={blog.cover_image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop'} alt={blog.title} />
          <div className="blog-hero-overlay">
            <div className="container">
              <div className="blog-header-content">
                <span className="blog-badge">Legal Insight</span>
                <h1>{blog.title}</h1>
                <div className="blog-meta-lg">
                  <div className="meta-item">
                    <span className="meta-label">Author</span>
                    <span className="meta-value">{blog.author_name}</span>
                  </div>
                  <div className="meta-sep" />
                  <div className="meta-item">
                    <span className="meta-label">Published</span>
                    <span className="meta-value">{new Date(blog.published_at || blog.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-body-section section-padding">
        <div className="container">
          <div className="blog-body-container">
            <div className="blog-content-main" dangerouslySetInnerHTML={{ __html: blog.content || 'Content coming soon...' }} />
            
            <div className="blog-sidebar-cta">
              <div className="cta-card">
                <h3>Need Legal Advice?</h3>
                <p>Consult with Ellavi Law Chamber today for expert guidance on your case.</p>
                <a href="/#contact" className="btn-primary w-100">
                  <span>Schedule Consultation</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
