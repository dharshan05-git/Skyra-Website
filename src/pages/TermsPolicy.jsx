import { useEffect } from 'react';

export default function TermsPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="our-story-page">
      <section className="story-hero">
        <p className="story-label">SKYRA POLICIES</p>
        <h1 className="story-title">Terms & Policy</h1>
        <div className="story-divider"></div>
      </section>

      <section className="story-content-section section" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="story-narrative" style={{ gap: '24px' }}>
          <p className="story-text">
            At SKYRA, we are committed to providing you with the highest quality shopping experience and protecting your privacy. This page details our terms, shipping, returns, and privacy policies.
          </p>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--maroon)', marginTop: '20px' }}>1. Shipping &amp; Delivery</h3>
          <p className="story-text">
            We offer shipping across India. All orders are processed, securely packaged, and dispatched as quickly as possible to ensure they reach you in pristine condition.
          </p>
          <div style={{
            background: 'linear-gradient(135deg, rgba(201, 168, 78, 0.12), rgba(92, 26, 27, 0.05))',
            borderLeft: '4px solid var(--gold)',
            padding: '24px',
            borderRadius: '4px',
            margin: '24px 0',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              fontStyle: 'italic',
              color: 'var(--maroon)',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '0.5px',
              lineHeight: '1.5'
            }}>
              🚚 Shipping Guarantee: YOUR PRODUCT WILL BE DELIVERED WITHIN 3-5 DAYS!
            </p>
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--maroon)', marginTop: '20px' }}>2. Return &amp; Exchange Policy</h3>
          <p className="story-text">
            Customer satisfaction is our utmost priority. If you receive a damaged or incorrect product, please contact us within 48 hours of delivery with proof (unboxing video recommended) to initiate a return or replacement.
          </p>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--maroon)', marginTop: '20px' }}>3. Privacy Policy</h3>
          <p className="story-text">
            Your personal information is secure with us. We only collect the necessary details (such as address and contact info) to process and deliver your orders. We never sell or share your personal data with third-party advertisers.
          </p>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--maroon)', marginTop: '20px' }}>4. Customer Support</h3>
          <p className="story-text">
            For any queries or concerns regarding your order, shipping status, or product details, please reach out to us. We are here to ensure you have a seamless experience.
          </p>
        </div>
      </section>
    </div>
  );
}
