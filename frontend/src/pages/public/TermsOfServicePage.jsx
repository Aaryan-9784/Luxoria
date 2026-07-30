import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
          Terms of Service
        </h1>
        <p style={{ color: '#888', marginBottom: '48px' }}>Last updated: July 31, 2026</p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            By accessing or using <strong style={{ color: '#fff' }}>LUXORIA</strong> at{' '}
            <a href="https://luxoria-plum.vercel.app" style={{ color: '#c9a96e' }}>
              https://luxoria-plum.vercel.app
            </a>, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>2. Description of Services</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            LUXORIA is a premium luxury vehicle rental platform that connects customers with high-end vehicle
            providers. Our services include browsing luxury vehicles, making bookings, processing payments,
            and managing your rental experience.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>3. User Accounts</h2>
          <ul style={{ paddingLeft: '24px', color: '#ccc', lineHeight: '2' }}>
            <li>You must be at least 18 years old to create an account</li>
            <li>You are responsible for maintaining the security of your account credentials</li>
            <li>You must provide accurate and complete information when registering</li>
            <li>One person may not maintain more than one account</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>4. Bookings and Payments</h2>
          <ul style={{ paddingLeft: '24px', color: '#ccc', lineHeight: '2' }}>
            <li>All bookings are subject to vehicle availability</li>
            <li>Payments are processed securely through Razorpay</li>
            <li>Cancellation policies vary by vehicle and vendor</li>
            <li>LUXORIA is not responsible for disputes between customers and vendors</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>5. Prohibited Activities</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc', marginBottom: '12px' }}>You agree not to:</p>
          <ul style={{ paddingLeft: '24px', color: '#ccc', lineHeight: '2' }}>
            <li>Use our services for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Post false or misleading reviews</li>
            <li>Interfere with other users' experience</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>6. Limitation of Liability</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            LUXORIA shall not be liable for any indirect, incidental, or consequential damages arising from
            your use of our platform. Our total liability shall not exceed the amount you paid for the
            specific booking in question.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>7. Changes to Terms</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            We reserve the right to modify these terms at any time. We will notify you of significant changes
            via email. Continued use of LUXORIA after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>8. Contact</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            For questions about these Terms, contact us at:{' '}
            <a href="mailto:aaryanpatel9784@gmail.com" style={{ color: '#c9a96e' }}>
              aaryanpatel9784@gmail.com
            </a>
          </p>
        </section>

        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '32px', textAlign: 'center' }}>
          <a href="/" style={{ color: '#c9a96e', textDecoration: 'none' }}>← Back to LUXORIA</a>
        </div>
      </div>
    </div>
  );
}
