import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#888', marginBottom: '48px' }}>Last updated: July 31, 2026</p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>1. Introduction</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            Welcome to <strong style={{ color: '#fff' }}>LUXORIA</strong>. We are committed to protecting your personal
            information and your right to privacy. This Privacy Policy explains how we collect, use, and share
            information about you when you use our luxury vehicle rental services at{' '}
            <a href="https://luxoria-plum.vercel.app" style={{ color: '#c9a96e' }}>
              https://luxoria-plum.vercel.app
            </a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>2. Information We Collect</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc', marginBottom: '12px' }}>We collect information you provide directly to us, such as:</p>
          <ul style={{ paddingLeft: '24px', color: '#ccc', lineHeight: '2' }}>
            <li>Name and email address when you register an account</li>
            <li>Profile information when you sign in with Google</li>
            <li>Booking and payment information when you rent a vehicle</li>
            <li>Communications you send us (support requests, reviews)</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>3. How We Use Google Sign-In</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            When you choose to sign in with Google, we receive your name, email address, and profile picture
            from Google. We use this information solely to create and manage your LUXORIA account. We do not
            share your Google account information with third parties. We only request access to your basic
            profile and email (the <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>profile</code> and{' '}
            <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>email</code> scopes).
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>4. How We Use Your Information</h2>
          <ul style={{ paddingLeft: '24px', color: '#ccc', lineHeight: '2' }}>
            <li>To create and manage your account</li>
            <li>To process your vehicle bookings and payments</li>
            <li>To send you booking confirmations and updates via email</li>
            <li>To improve our services and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>5. Data Sharing</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            We do not sell your personal data. We may share your information with trusted service providers
            (payment processors, email services) solely to operate our platform. These providers are bound
            by confidentiality agreements.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>6. Data Security</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            We implement industry-standard security measures including HTTPS encryption, secure HTTP-only
            cookies, and JWT-based authentication to protect your data.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>7. Your Rights</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            You have the right to access, update, or delete your personal information at any time from your
            account dashboard. To request account deletion, contact us at{' '}
            <a href="mailto:aaryanpatel9784@gmail.com" style={{ color: '#c9a96e' }}>
              aaryanpatel9784@gmail.com
            </a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#c9a96e', marginBottom: '12px' }}>8. Contact Us</h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            If you have questions about this Privacy Policy, please contact us at:{' '}
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
