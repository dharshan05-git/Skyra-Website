import { useEffect } from 'react';

export default function OurStory() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) el.classList.add('revealed');
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <div className="our-story-page">
      <section className="story-hero">
        <p className="story-label">THE SKYRA JOURNEY</p>
        <h1 className="story-title">Our Story</h1>
        <div className="story-divider"></div>
      </section>
      <section className="story-content-section section">
        <div className="story-grid">
          <div className="story-narrative reveal">
            <h2 className="story-subtitle">Two friends, one shared dream.</h2>
            
            <p className="story-text">
              SKYRA began with a simple idea shared between two friends — to create something meaningful of their own. 
              What started as late-night conversations, creative ideas, and a dream to build a brand together slowly turned 
              into reality through passion, trust, and countless small steps forward.
            </p>
            
            <p className="story-text">
              We wanted jewellery to feel more than just an accessory. Every piece at SKYRA is designed to add confidence, 
              elegance, and a touch of individuality to everyday life. Our focus has always been to create beautiful 
              silver-plated jewellery that feels stylish, timeless, and accessible.
            </p>

            <blockquote className="story-quote">
              "We believe that true beauty lies in the journey, in learning, growing, and crafting items that tell a story."
            </blockquote>

            <p className="story-text">
              But SKYRA is more than products — it is a journey. A journey of learning, growing, improving, and building a 
              brand that people genuinely connect with.
            </p>

            <div className="story-inline-visual reveal">
              <img src="images/skyra-story-packaging.webp" alt="Packing with Care" className="story-inline-image" />
              <p className="story-caption">Every package is prepared with delicate attention and gratitude.</p>
            </div>

            <p className="story-text">
              From packing every order with care to constantly working on better designs and experiences, we aim to serve 
              our customers with honesty and dedication.
            </p>
            
            <p className="story-text">
              This is only the beginning for us. What started as two friends chasing a dream is growing into something much bigger. 
              Our vision is to take SKYRA to greater heights, reach people across the world, and build a brand known for 
              quality, trust, and style.
            </p>

            <p className="story-text story-highlight">
              And through every stage of this journey, one thing will always remain the same — our gratitude for every person 
              who supports SKYRA and becomes part of our story.
            </p>
          </div>

          <div className="story-visual reveal">
            <div className="story-image-wrapper">
              <img src="images/skyra-brand-story.webp" alt="SKYRA Brand Aesthetic" className="story-image" />
              <div className="story-image-overlay"></div>
            </div>
            <div className="story-badge">
              <span className="story-badge-year">Est. 2025</span>
              <span className="story-badge-dot">•</span>
              <span className="story-badge-text">Crafted with Gratitude</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
