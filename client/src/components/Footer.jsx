import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Footer = () => {
  // Show button only after scrolling down a bit
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{background: '#fff', marginTop: 0, padding: 0, paddingTop: '7rem', paddingBottom: 0, position: 'relative'}}>
      <div className="container" style={{paddingBottom: '5rem'}}>
        {/* Top Row: Logo and Socials */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between py-3 mb-5">
          <span style={{fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.45rem', color: '#2997f7'}}>Tek Riders</span>
          <div className="d-flex gap-3 mt-3 mt-md-0">
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" style={{color: '#2997f7', fontSize: 20}}><i className="bi bi-facebook"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" style={{color: '#2997f7', fontSize: 20}}><i className="bi bi-instagram"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" style={{color: '#2997f7', fontSize: 20}}><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
        <hr className="my-2" />
        {/* Main Footer Grid */}
        <div className="row g-5 mb-5">
          <div className="col-12 col-md-3">
            <div className="fw-bold mb-2">Info</div>
            <Link to="/about" className="d-block text-secondary mb-2 text-decoration-none">About us</Link>
            <Link to="/courses" className="d-block text-secondary mb-2 text-decoration-none">Courses</Link>
            <Link to="/blogs" className="d-block text-secondary text-decoration-none">Blogs</Link>
          </div>
          <div className="col-12 col-md-3">
            <div className="fw-bold mb-2">Contact Us</div>
            <a href="mailto:info.tekriders@gmail.com" className="d-block text-secondary mb-2 text-decoration-none">info.tekriders@gmail.com</a>
            <a href="https://wa.me/250785961427" target="_blank" rel="noopener noreferrer" className="d-block text-secondary mb-2 text-decoration-none">+250 785 961 427</a>
            <a href="/live-chat" className="d-block text-secondary text-decoration-none">Live Chat</a>
          </div>
          <div className="col-12 col-md-3">
            <div className="fw-bold mb-2">Resources</div>
            <a href="/download" className="d-block text-secondary mb-2 text-decoration-none">Download Web App</a>
            <a href="/demo" className="d-block text-secondary mb-2 text-decoration-none">Watch a Demo</a>
            <a href="/support" className="d-block text-secondary text-decoration-none">Unlimited Support</a>
          </div>
          <div className="col-12 col-md-3">
            <div className="fw-bold mb-2" style={{ color: '#232b3b' }}>Newsletter</div>
            <form onSubmit={e => {e.preventDefault(); alert('Subscribed!')}} className="d-flex align-items-center gap-2 flex-wrap">
              <input type="email" required placeholder="Your Email" aria-label="Your Email" className="form-control flex-grow-1 mb-2 mb-md-0" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-light w-100 text-center py-3 mt-3 text-secondary fw-normal" style={{fontSize: '0.98rem', position: 'relative', paddingBottom: 0}}>
        ©2025 Tek Riders. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 