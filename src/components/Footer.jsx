import { useState } from 'react';
import { subscribeNewsletter } from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  async function handleNewsletterSubmit(event) {
    event.preventDefault();
    setStatus('submitting');

    try {
      await subscribeNewsletter(email);
      setEmail('');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <footer className="footer">
    <div className="footer-inner">
      <div className="footer-grid">
        <div>
          <a href="/" className="footer-brand-name" style={{textDecoration:'none', display:'block'}}>SKYRA</a>
          <p className="footer-desc">Timeless jewellery crafted in  Sterling Silver. Designed to make every moment shine.
          </p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/skyra.india?igsh=MThsMG90M2E2djlhaA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <p className="footer-heading">Shop</p>
          <ul className="footer-links">
            <li><a href="/category-pendants">Necklaces</a></li>
            <li><a href="/category-rings">Rings</a></li>
            <li><a href="/category-earrings">Earrings</a></li>
            <li><a href="/category-bracelets">Bracelets</a></li>
            <li><a href="/category-anklets">Payals</a></li>
            <li><a href="/category-sets">Sets</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-heading">Legal</p>
          <ul className="footer-links">
            <li><a href="/terms-use">Terms Use</a></li>
            <li><a href="/terms-policy">Terms & Policy</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-heading">About</p>
          <ul className="footer-links">
            <li><a href="/our-story">Our Story</a></li>
            <li><a href="/#why-skyra">Why Skyra</a></li>
            <li><a href="mailto:info@skyrajewels.co.in">Contact Us</a></li>
            <li style={{marginTop:'4px'}}><a href="mailto:info@skyrajewels.co.in" style={{fontSize:'12px', opacity:'0.8'}}>info@skyrajewels.co.in</a></li>
            <li><a href="tel:+918669052740" style={{fontSize:'12px', opacity:'0.8'}}>+91 86690 52740</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-heading">Newsletter</p>
          <p className="footer-desc" style={{marginBottom: '12px'}}>Join our newsletter for exclusive offers &amp; new
            arrivals.</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="newsletter-btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Subscribing' : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && <p className="footer-desc" style={{ marginTop: '10px' }}>Subscribed successfully.</p>}
          {status === 'error' && <p className="footer-desc" style={{ marginTop: '10px' }}>Please try again.</p>}
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">&copy; 2025 SKYRA | Timeless Beauty. All rights reserved.</p>
        <div className="payment-icons">
          <span>VISA</span><span>MC</span><span>UPI</span><span>PayPal</span>
        </div>
      </div>
    </div>
  </footer>
  );
}
