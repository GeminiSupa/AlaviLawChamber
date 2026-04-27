import CursorGlow   from '@/components/CursorGlow';
import Navbar       from '@/components/Navbar';
import Hero         from '@/components/Hero';
import Marquee      from '@/components/Marquee';
import Stats        from '@/components/Stats';
import Expertise    from '@/components/Expertise';
import About        from '@/components/About';
import TeamSection  from '@/components/TeamSection';
import GallerySection from '@/components/GallerySection';
import Banner       from '@/components/Banner';
import Testimonials from '@/components/Testimonials';
import BlogSection  from '@/components/BlogSection';
import Contact      from '@/components/Contact';
import Footer       from '@/components/Footer';

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Expertise />
        <About />
        <TeamSection />
        <GallerySection />
        <Banner />
        <Testimonials />
        <BlogSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
