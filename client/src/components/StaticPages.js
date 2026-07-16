import React from 'react';
import { Shield, FileText, Users } from 'lucide-react';

const PageLayout = ({ title, icon: Icon, children }) => (
  <div className="main-content fade-in" style={{ minHeight: '60vh', maxWidth: '800px', margin: '40px auto', background: 'var(--card-bg)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 10px 40px var(--shadow-color)' }}>
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <Icon size={48} color="var(--primary)" style={{ marginBottom: '15px' }} />
      <h1 style={{ fontSize: '32px', margin: 0 }}>{title}</h1>
    </div>
    <div style={{ lineHeight: 1.8, color: 'var(--gray)', fontSize: '16px' }}>
      {children}
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <PageLayout title="Privacy Policy" icon={Shield}>
    <h2>1. Information We Collect</h2>
    <p>We only collect the information necessary to provide you with the best shopping deals, including your search queries, wishlist items, and email (if you register).</p>
    <h2>2. How We Use Your Information</h2>
    <p>Your data is used strictly to power the price comparison engine and send you requested price drop alerts.</p>
    <h2>3. Security</h2>
    <p>We use industry-standard encryption to protect your data. We do not sell your personal data to third parties.</p>
  </PageLayout>
);

export const TermsOfService = () => (
  <PageLayout title="Terms of Service" icon={FileText}>
    <h2>1. Acceptance of Terms</h2>
    <p>By using Autonshop, you agree to these Terms of Service. If you do not agree, please do not use our platform.</p>
    <h2>2. Accuracy of Information</h2>
    <p>While we strive to provide real-time, accurate prices, e-commerce stores change prices frequently. We do not guarantee the final price until you reach checkout on the respective store.</p>
    <h2>3. Intellectual Property</h2>
    <p>All content on this site is the property of Autonshop and its creators.</p>
  </PageLayout>
);

export const AboutUs = () => (
  <PageLayout title="About Us" icon={Users}>
    <h2>Our Mission</h2>
    <p>Autonshop was built by the BIET team to revolutionize how people shop online in India. We aim to bring transparency to e-commerce pricing.</p>
    <h2>How It Works</h2>
    <p>Our proprietary engine scrapes and aggregates real-time data from major retailers like Amazon, Flipkart, Croma, and Reliance Digital so you don't have to check multiple tabs.</p>
  </PageLayout>
);
