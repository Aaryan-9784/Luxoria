import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, ChevronRight, Mail, ArrowLeft, CheckCircle2, KeyRound, Database, UserCheck } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', title: '1. Privacy Commitment' },
    { id: 'data-collection', title: '2. Information We Collect' },
    { id: 'google-signin', title: '3. Google OAuth 2.0 Integration' },
    { id: 'data-usage', title: '4. How We Use Data' },
    { id: 'security', title: '5. Encryption & Security' },
    { id: 'third-party', title: '6. Third-Party Sharing' },
    { id: 'retention', title: '7. Retention & 90-Day Auto-Expiry' },
    { id: 'user-rights', title: '8. Data Rights & Erasure' },
    { id: 'contact', title: '9. Grievance Redressal' }
  ];

  // Smooth scroll handler with header offset
  const handleScrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140; // Account for fixed navbar height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // ScrollSpy listener to update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-[#FCFBF9] text-[#0F0F0F] pt-28 pb-24">
      
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <div className="relative py-16 bg-[#FDFBF7] border-b border-[#ECECEC] overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C9A75D]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#C9A75D]/5 via-transparent to-transparent opacity-60 pointer-events-none" />

        <div className="container-luxe mx-auto px-6 lg:px-20 relative z-10">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#666666] mb-4 font-semibold">
            <Link to="/" className="hover:text-[#C9A75D] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5 text-[#C9A75D]" /> Home
            </Link>
            <span>/</span>
            <span className="text-[#C9A75D] font-bold">Privacy Policy</span>
          </div>

          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#0F0F0F] tracking-tight uppercase mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_LUXE }}
          >
            Privacy <span className="text-[#C9A75D] italic font-light lowercase">Policy</span>
          </motion.h1>

          <p className="text-[#555555] text-base leading-relaxed max-w-3xl font-normal">
            Comprehensive Privacy & Data Governance Statement under the Digital Personal Data Protection (DPDP) Act and IT (Reasonable Security Practices) Rules.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-[#ECECEC] text-xs text-[#444444] font-medium">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A75D]" /> Last Updated: July 31, 2026
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#16A34A]" /> DPDP Act & AES-256 Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENT GRID (Matching Luxoria Structure) ───────────────── */}
      <div className="container-luxe mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* STICKY NAVIGATION SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-[#C9A75D] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C9A75D]" /> Privacy Sections
              </h3>
              <nav className="flex flex-col gap-1.5">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleScrollToSection(section.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-300 text-left cursor-pointer ${
                      activeSection === section.id
                        ? 'bg-white text-[#0F0F0F] font-bold shadow-xs border border-[#C9A75D]/40 border-l-4 border-l-[#C9A75D] pl-3.5'
                        : 'text-[#555555] hover:text-[#0F0F0F] hover:bg-white border border-transparent hover:border-[#ECECEC] font-medium'
                    }`}
                  >
                    <span>{section.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeSection === section.id ? 'text-[#C9A75D] translate-x-0.5' : 'text-[#888888]'}`} />
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-[#ECECEC] bg-[#FDFBF7] border rounded-xl p-4">
                <p className="text-xs text-[#555555] mb-3 font-medium">Privacy officer inquiries?</p>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=aaryanpatel9784@gmail.com&su=Luxoria%20Privacy%20Desk%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#C9A75D] hover:bg-[#1A1A1A] transition-all duration-300 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" /> Privacy Desk
                </a>
              </div>
            </div>
          </div>

          {/* MAIN PRIVACY CARDS */}
          <div className="lg:col-span-8 space-y-8">
            
            <section id="intro" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <ShieldCheck className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 1. Privacy Commitment & Scope
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base mb-4 font-normal">
                Luxoria Premium Private Limited ("Luxoria", "We", "Our") respects your personal data rights. This Privacy Policy sets out how we collect, store, encrypt, process, and safeguard your personal information when utilizing our luxury vehicle rental marketplace at <a href="https://luxoria-plum.vercel.app" className="text-[#C9A75D] font-semibold hover:underline">https://luxoria-plum.vercel.app</a>.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                This document is published in compliance with Rule 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011, and the Digital Personal Data Protection Act (DPDP), 2023.
              </p>
            </section>

            <section id="data-collection" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Database className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 2. Categories of Information We Collect
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">We collect data strictly required to facilitate verified luxury rentals:</p>
              <ul className="space-y-4 text-sm text-[#4A4A4A] font-normal">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] stroke-[2] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F0F] font-semibold">Personal Identifiers:</strong> Full Name, Email Address, Mobile Phone Number, Profile Avatar, and role authorization credentials (User, Vendor, Admin).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] stroke-[2] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F0F] font-semibold">Verification Documents:</strong> Physical Driving License numbers, Aadhaar / Passport identification data for identity verification during vehicle pickup.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] stroke-[2] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F0F] font-semibold">Cryptographic Authentication Data:</strong> SHA-256 encrypted 2-Step OTP login hashes, rotated refresh tokens, and password reset tokens.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] stroke-[2] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F0F] font-semibold">Financial & Transaction Data:</strong> Razorpay order IDs, payment verification signatures, rental transaction amounts, and refund records. (Full card numbers/UPI PINs are processed directly by Razorpay and never stored on Luxoria servers).
                  </div>
                </li>
              </ul>
            </section>

            <section id="google-signin" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <KeyRound className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 3. Google OAuth 2.0 Integration & Scopes
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">
                When using single sign-on via Google OAuth 2.0, Luxoria receives basic public profile details (Google ID, Full Name, Email Address, and Avatar URL).
              </p>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                We strictly request access to <code className="bg-[#F4F4F5] text-[#0F0F0F] border border-[#E4E4E7] font-mono text-xs font-semibold px-2.5 py-1 rounded-md">profile</code> and <code className="bg-[#F4F4F5] text-[#0F0F0F] border border-[#E4E4E7] font-mono text-xs font-semibold px-2.5 py-1 rounded-md">email</code> scopes only. Luxoria does NOT read, store, or access your Google Drive files, Gmail messages, or contacts.
              </p>
            </section>

            <section id="data-usage" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <UserCheck className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 4. How We Process & Use Your Information
              </h2>
              <ul className="space-y-2 text-sm text-[#4A4A4A] list-disc pl-5 font-normal">
                <li>Processing vehicle reservations and confirming date availability across vendor fleets.</li>
                <li>Executing encrypted Razorpay transaction order creation and signature verification.</li>
                <li>Dispatching 2-Step security OTP codes, booking invoices, and automated confirmation emails.</li>
                <li>Mitigating authentication fraud via refresh token rotation and session replay detection.</li>
                <li>Generating aggregated platform analytics for fleet health without selling individual user data.</li>
              </ul>
            </section>

            <section id="security" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Lock className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 5. Encryption & Security Standards
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                All client-server communications are protected with TLS 1.3 encryption. Passwords are hashed using bcrypt with salt factor 10. Refresh tokens are secured in HTTP-only, secure, SameSite cookies to protect against Cross-Site Scripting (XSS) and Session Hijacking.
              </p>
            </section>

            <section id="third-party" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <FileText className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 6. Third-Party Service Providers
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">
                Luxoria never sells user data to third-party advertisers. Data is shared strictly with essential service infrastructure partners:
              </p>
              <ul className="space-y-2 text-sm text-[#4A4A4A] list-disc pl-5 font-normal">
                <li><strong className="text-[#0F0F0F] font-semibold">Razorpay Technologies:</strong> Payment gateway processing and signature verification.</li>
                <li><strong className="text-[#0F0F0F] font-semibold">Nodemailer / SMTP Service:</strong> Secure email delivery for 2FA OTPs and booking receipts.</li>
                <li><strong className="text-[#0F0F0F] font-semibold">Cloudinary v2:</strong> Cloud media hosting for vehicle listings and user avatars.</li>
              </ul>
            </section>

            <section id="retention" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Database className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 7. Data Retention & 90-Day Auto-Expiry
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                User account profiles remain active until deletion requested. Platform notifications automatically expire and are purged from database records after <strong className="text-[#0F0F0F] font-semibold">90 days</strong> via MongoDB TTL (Time-To-Live) indexing. Refresh tokens automatically expire after 7 days.
              </p>
            </section>

            <section id="user-rights" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <ShieldCheck className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 8. Your Privacy Rights & Account Erasure
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                Under the DPDP Act, you hold the right to access, rectify, export, or request permanent erasure of your personal data. You can delete your profile directly from your Account Settings or email our Privacy Desk.
              </p>
            </section>

            <section id="contact" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Mail className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 9. Grievance Redressal & Contact
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">
                In accordance with the Information Technology Act, 2000, the name and contact details of the Grievance Officer are provided below:
              </p>
              <div className="p-5 rounded-xl bg-[#FDFBF7] border border-[#C9A75D]/30 text-sm">
                <p className="text-[#0F0F0F] font-bold">Luxoria Data Protection & Grievance Officer</p>
                <p className="text-[#555555] mt-1 font-medium">Email: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aaryanpatel9784@gmail.com&su=Luxoria%20Privacy%20Grievance%20Inquiry" target="_blank" rel="noopener noreferrer" className="text-[#C9A75D] font-semibold hover:underline">aaryanpatel9784@gmail.com</a></p>
                <p className="text-[#555555] font-medium">Phone: +91 82380 12515</p>
              </div>
            </section>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
