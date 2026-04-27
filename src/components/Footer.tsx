export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <a href="#home" className="logo">
              <span className="logo-main">ALAVI</span>
              <span className="logo-sub">LAW CHAMBER</span>
            </a>
            <p className="footer-desc">
              Redefining legal practice in Pakistan through modern infrastructure,
              cutting-edge strategy, and unwavering professional ethics.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in" />
              </a>
              <a href="#" className="social-link" aria-label="Twitter/X">
                <i className="fa-brands fa-x-twitter" />
              </a>
              <a href="#" className="social-link" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#expertise">Practice Areas</a></li>
              <li><a href="#about">Our Legacy</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Practice Areas */}
          <div className="footer-col">
            <h4>Practice Areas</h4>
            <ul>
              <li><a href="#expertise">Corporate Law</a></li>
              <li><a href="#expertise">Criminal Defense</a></li>
              <li><a href="#expertise">Property & Real Estate</a></li>
              <li><a href="#expertise">Family Law</a></li>
              <li><a href="#expertise">Constitutional Law</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Disclaimer</a></li>
              <li><a href="/login" className="text-gold">Chamber Login</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Alavi Law Chamber. All Rights Reserved. Islamabad, Pakistan.</p>
          <a href="mailto:consult@alavilaw.pk">consult@alavilaw.pk</a>
        </div>
      </div>
    </footer>
  );
}
