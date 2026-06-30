import { useEffect } from 'react';

export default function TermsUse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="our-story-page">
      <section className="story-hero">
        <p className="story-label">SKYRA POLICIES</p>
        <h1 className="story-title">Terms of Use</h1>
        <div className="story-divider"></div>
      </section>

      <section className="story-content-section section" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="story-narrative" style={{ gap: '24px' }}>
          <p className="story-text">
            Welcome to SKYRA. These Terms of Use govern your access to and use of our website, services, and products. By accessing or using our website, you agree to comply with and be bound by these terms.
          </p>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--maroon)', marginTop: '20px' }}>1. Usage of the Site</h3>
          <p className="story-text">
            You agree to use this site for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the site. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.
          </p>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--maroon)', marginTop: '20px' }}>2. Product Information</h3>
          <p className="story-text">
            We make every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
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
              ✨ Please Note: YOUR PRODUCT WILL BE DELIVERED WITHIN 3-5 DAYS!
            </p>
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--maroon)', marginTop: '20px' }}>3. Intellectual Property</h3>
          <p className="story-text">
            All content included on this site, such as text, graphics, logos, images, digital downloads, and software, is the property of SKYRA and protected by applicable copyright and trademark laws.
          </p>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--maroon)', marginTop: '20px' }}>4. Changes to Terms</h3>
          <p className="story-text">
            We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms of Use by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.
          </p>
        </div>
      </section>
    </div>
  );
}
