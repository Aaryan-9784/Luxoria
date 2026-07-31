import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie, Lock, FileText, ChevronRight, Mail, ArrowLeft, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';

export default function CookiePolicyPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: '1. What Are Cookies' },
    { id: 'how-we-use', title: '2. How We Use Cookies' },
    { id: 'essential-cookies', title: '3. Essential Security Tokens' },
    { id: 'functional-cookies', title: '4. Preferences & Storage' },
    { id: 'third-party', title: '5. Third-Party Cookies' },
    { id: 'managing', title: '6. Managing Browser Controls' },
    { id: 'contact', title: '7. Cookie Desk Contact' }
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
            <span className="text-[#C9A75D] font-bold">Cookie Policy</span>
          </div>

          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#0F0F0F] tracking-tight uppercase mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_LUXE }}
          >
            Cookie <span className="text-[#C9A75D] italic font-light lowercase">Policy</span>
          </motion.h1>

          <p className="text-[#555555] text-base leading-relaxed max-w-3xl font-normal">
            Detailed breakdown of HTTP-only session tokens, local storage preferences, cryptographic cookies, and browser controls utilized on the Luxoria platform.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-[#ECECEC] text-xs text-[#444444] font-medium">
            <span className="flex items-center gap-2">
              <Cookie className="w-4 h-4 text-[#C9A75D]" /> Last Updated: July 31, 2026
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" /> GDPR & ePrivacy Directive Compliant
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
                <FileText className="w-4 h-4 text-[#C9A75D]" /> Policy Sections
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
                <p className="text-xs text-[#555555] mb-3 font-medium">Need assistance regarding cookies?</p>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=aaryanpatel9784@gmail.com&su=Luxoria%20Cookie%20Policy%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#C9A75D] hover:bg-[#1A1A1A] transition-all duration-300 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" /> Contact Legal Desk
                </a>
              </div>
            </div>
          </div>

          {/* MAIN POLICY CARDS */}
          <div className="lg:col-span-8 space-y-8">
            
            <section id="overview" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Cookie className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 1. What Are Cookies & Web Storage?
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base mb-4 font-normal">
                Cookies are tiny encrypted text files and browser storage mechanisms placed on your computer, smartphone, or tablet when visiting <strong className="text-[#0F0F0F] font-semibold">LUXORIA</strong>.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                They allow Luxoria's backend architecture to maintain secure authenticated user sessions, prevent forgery attacks, remember fleet filter preferences, and deliver optimized media assets without forcing you to re-authenticate on every page transition.
              </p>
            </section>

            <section id="how-we-use" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Lock className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 2. How Luxoria Utilizes Cookies
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-6 text-base font-normal">
                We use cookies and local storage exclusively for essential authentication, data security, user preference retention, and platform performance:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#F9F9F9] border border-[#ECECEC]">
                  <h4 className="text-sm font-bold text-[#0F0F0F] mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Session Authentication
                  </h4>
                  <p className="text-xs text-[#555555] leading-relaxed font-normal">
                    Rotated HTTP-only refresh tokens store session credentials safely, preventing client-side script theft (XSS protection).
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#F9F9F9] border border-[#ECECEC]">
                  <h4 className="text-sm font-bold text-[#0F0F0F] mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Fraud Prevention & CSRF
                  </h4>
                  <p className="text-xs text-[#555555] leading-relaxed font-normal">
                    SameSite security cookies validate cross-site requests to defend your active bookings against unauthorized forgery attacks.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#F9F9F9] border border-[#ECECEC]">
                  <h4 className="text-sm font-bold text-[#0F0F0F] mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Fleet Preference State
                  </h4>
                  <p className="text-xs text-[#555555] leading-relaxed font-normal">
                    Remembers your active vehicle category selections (Sports, SUV, Sedans) and sorting criteria during navigation.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#F9F9F9] border border-[#ECECEC]">
                  <h4 className="text-sm font-bold text-[#0F0F0F] mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Razorpay Checkout State
                  </h4>
                  <p className="text-xs text-[#555555] leading-relaxed font-normal">
                    Maintains payment iframe tokenization state while authorizing booking orders safely.
                  </p>
                </div>
              </div>
            </section>

            <section id="essential-cookies" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <ShieldCheck className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 3. Essential Security Tokens & Cookies
              </h2>
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-[#F9F9F9] border border-[#ECECEC]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[#0F0F0F]">refreshToken (HTTP-Only Cookie)</h4>
                    <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#DCFCE7] text-[#14532D] font-bold border border-[#86EFAC]">Strictly Essential</span>
                  </div>
                  <p className="text-xs text-[#555555] leading-relaxed font-normal">
                    Cryptographic JWT token used to issue short-lived access tokens. Stored in HTTP-Only, Secure, SameSite=Strict cookies with a 7-day expiration. Cannot be accessed by JavaScript.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#F9F9F9] border border-[#ECECEC]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[#0F0F0F]">XSRF-TOKEN (Security Cookie)</h4>
                    <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#DCFCE7] text-[#14532D] font-bold border border-[#86EFAC]">Strictly Essential</span>
                  </div>
                  <p className="text-xs text-[#555555] leading-relaxed font-normal">
                    Validates that request origins match Luxoria client domain, blocking malicious third-party site requests.
                  </p>
                </div>
              </div>
            </section>

            <section id="functional-cookies" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <SlidersHorizontal className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 4. Preferences & Local Storage
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">
                Luxoria uses browser <code className="bg-[#F4F4F5] text-[#0F0F0F] border border-[#E4E4E7] font-mono text-xs font-semibold px-2.5 py-1 rounded-md">localStorage</code> to save non-sensitive UI states:
              </p>
              <ul className="space-y-2 text-sm text-[#4A4A4A] list-disc pl-5 font-normal">
                <li><strong className="text-[#0F0F0F] font-semibold">luxoria_wishlist:</strong> Saved vehicle IDs on your personal wishlist.</li>
                <li><strong className="text-[#0F0F0F] font-semibold">luxoria_fleet_filter:</strong> Saved search filters (price range, brand, transmission).</li>
                <li><strong className="text-[#0F0F0F] font-semibold">luxoria_theme:</strong> User preferred color theme selection.</li>
              </ul>
            </section>

            <section id="third-party" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <FileText className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 5. Third-Party Integration Cookies
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">
                When utilizing specific third-party features, those providers set security cookies:
              </p>
              <ul className="space-y-2 text-sm text-[#4A4A4A] list-disc pl-5 font-normal">
                <li><strong className="text-[#0F0F0F] font-semibold">Google OAuth 2.0:</strong> Sets authentication session tokens when signing in with Google.</li>
                <li><strong className="text-[#0F0F0F] font-semibold">Razorpay SDK:</strong> Sets secure payment session cookies inside the Razorpay modal.</li>
              </ul>
            </section>

            <section id="managing" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Lock className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 6. Managing & Disabling Cookies
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">
                You can block or delete cookies via your browser settings (Chrome, Safari, Firefox, Edge). Please note that blocking essential authentication cookies will prevent you from logging into your account or making vehicle reservations.
              </p>
            </section>

            <section id="contact" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Mail className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 7. Cookie Desk Contact
              </h2>
              <div className="p-5 rounded-xl bg-[#FDFBF7] border border-[#C9A75D]/30 text-sm">
                <p className="text-[#0F0F0F] font-bold">Luxoria Cookie Compliance Desk</p>
                <p className="text-[#555555] mt-1 font-medium">Email: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aaryanpatel9784@gmail.com&su=Luxoria%20Cookie%20Policy%20Inquiry" target="_blank" rel="noopener noreferrer" className="text-[#C9A75D] font-semibold hover:underline">aaryanpatel9784@gmail.com</a></p>
                <p className="text-[#555555] font-medium">Direct Line: +91 82380 12515</p>
              </div>
            </section>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
