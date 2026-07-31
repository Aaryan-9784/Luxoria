import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Lock, Scale, ChevronRight, Mail, ArrowLeft, CheckCircle2, AlertTriangle, Gavel } from 'lucide-react';
import { pageTransition, EASE_LUXE } from '@/lib/motion';

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: '1. Acceptance & Agreement' },
    { id: 'services', title: '2. Platform Description' },
    { id: 'eligibility', title: '3. Eligibility & 2FA Security' },
    { id: 'reservations', title: '4. Vehicle Reservations & Rules' },
    { id: 'payments', title: '5. Payments, Taxes & Refunds' },
    { id: 'prohibited', title: '6. Prohibited Vehicle Uses' },
    { id: 'insurance', title: '7. Insurance & Damage Claims' },
    { id: 'vendors', title: '8. Vendor Fleet Terms' },
    { id: 'liability', title: '9. Limitation of Liability' },
    { id: 'jurisdiction', title: '10. Governing Law & Contact' }
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
            <span className="text-[#C9A75D] font-bold">Terms of Service</span>
          </div>

          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#0F0F0F] tracking-tight uppercase mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_LUXE }}
          >
            Terms of <span className="text-[#C9A75D] italic font-light lowercase">Service</span>
          </motion.h1>

          <p className="text-[#555555] text-base leading-relaxed max-w-3xl font-normal">
            Master Agreement governing the reservation, rental, and operation of luxury vehicles, digital services, and partner fleet memberships under Luxoria Premium Private Limited.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-[#ECECEC] text-xs text-[#444444] font-medium">
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#C9A75D]" /> Last Updated: July 31, 2026
            </span>
            <span className="flex items-center gap-2">
              <Gavel className="w-4 h-4 text-[#16A34A]" /> IT Act 2000 & Motor Vehicles Act Compliant
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
                <FileText className="w-4 h-4 text-[#C9A75D]" /> Terms Navigation
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
                <p className="text-xs text-[#555555] mb-3 font-medium">Questions regarding terms?</p>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=aaryanpatel9784@gmail.com&su=Luxoria%20Terms%20%26%20Legal%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#C9A75D] hover:bg-[#1A1A1A] transition-all duration-300 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" /> Legal Support Desk
                </a>
              </div>
            </div>
          </div>

          {/* MAIN TERMS CARDS */}
          <div className="lg:col-span-8 space-y-8">
            
            <section id="acceptance" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Scale className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 1. Acceptance & Binding Agreement
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base mb-4 font-normal">
                By creating an account, initiating a vehicle reservation, or accessing <strong className="text-[#0F0F0F] font-semibold">LUXORIA</strong> at <a href="https://luxoria-plum.vercel.app" className="text-[#C9A75D] font-semibold hover:underline">https://luxoria-plum.vercel.app</a>, you enter into a legally binding contract with Luxoria Premium Private Limited ("Luxoria", "We", "Us").
              </p>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                This agreement incorporates our Privacy Policy, Cookie Policy, and Cancellation Rules. If you do not agree to these terms in their entirety, you must immediately cease accessing the platform and services.
              </p>
            </section>

            <section id="services" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <FileText className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 2. Platform Description & Operations
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base mb-4 font-normal">
                Luxoria provides a technology-driven luxury mobility marketplace enabling verified clients to reserve premium sports cars, luxury sedans, SUVs, and wedding fleets from curated vendors.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                Luxoria facilitates real-time vehicle discovery, automated date availability verification, encrypted Razorpay payment checkouts, digital concierge scheduling, and vendor fleet management.
              </p>
            </section>

            <section id="eligibility" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Lock className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 3. Eligibility, Verification & 2FA Security
              </h2>
              <ul className="space-y-4 text-sm text-[#4A4A4A] font-normal">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] stroke-[2] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F0F] font-semibold">Age & Driver License Requirements:</strong> You must be at least 21 years old and possess a valid, unexpired Indian Driving License or an International Driving Permit (IDP) with at least 2 years of driving history.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] stroke-[2] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F0F] font-semibold">2-Step OTP Authentication:</strong> All manual login attempts require 6-digit email verification code validation. OTP codes expire in 10 minutes and are protected via SHA-256 cryptographic hashing.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] stroke-[2] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F0F] font-semibold">Account Integrity:</strong> Creating duplicate accounts or providing false identification documents (Aadhaar, Passport, Driving License) will result in immediate permanent account termination and forfeiture of active deposits.
                  </div>
                </li>
              </ul>
            </section>

            <section id="reservations" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <ShieldCheck className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 4. Vehicle Reservations & Rental Rules
              </h2>
              <div className="space-y-4 text-[#4A4A4A] text-base font-normal">
                <p>
                  <strong className="text-[#0F0F0F] font-semibold">Real-Time Overlap Check:</strong> Reservations are locked dynamically. System validates start and end dates against existing confirmed bookings to prevent double-booking.
                </p>
                <p>
                  <strong className="text-[#0F0F0F] font-semibold">Pricing Calculation:</strong> Daily rental fee is calculated server-side as <code className="bg-[#F4F4F5] text-[#0F0F0F] border border-[#E4E4E7] font-mono text-xs font-semibold px-2.5 py-1 rounded-md">totalDays × pricePerDay</code>.
                </p>
                <p>
                  <strong className="text-[#0F0F0F] font-semibold">Delivery & Pick-up:</strong> Chauffeur or self-drive delivery is executed at the specified location upon digital verification of the primary driver's original physical license.
                </p>
              </div>
            </section>

            <section id="payments" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Scale className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 5. Payments, Taxes & Refund Policy
              </h2>
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-[#F9F9F9] border border-[#ECECEC]">
                  <h4 className="text-sm font-bold text-[#0F0F0F] mb-2">Razorpay Payment Processing</h4>
                  <p className="text-xs text-[#555555] leading-relaxed font-normal">
                    All financial transactions are authorized securely via Razorpay. Order creation generates an encrypted order ID, and payment confirmation requires an HMAC-SHA256 signature verification.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#F9F9F9] border border-[#ECECEC]">
                  <h4 className="text-sm font-bold text-[#0F0F0F] mb-2">Cancellation & Refund Schedule</h4>
                  <ul className="text-xs text-[#555555] space-y-2 font-normal">
                    <li>• <strong className="text-[#0F0F0F]">More than 48 Hours Before Trip:</strong> 100% full refund returned to original payment method within 5-7 business days.</li>
                    <li>• <strong className="text-[#0F0F0F]">24 to 48 Hours Before Trip:</strong> 50% partial refund minus administrative processing fees.</li>
                    <li>• <strong className="text-[#0F0F0F]">Less than 24 Hours / No-Show:</strong> 0% refund. Full reservation fee retained.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="prohibited" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#DC2626]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#DC2626] mb-4 flex items-center gap-3 tracking-tight">
                <AlertTriangle className="w-6 h-6 text-[#DC2626] stroke-[1.8]" /> 6. Prohibited Vehicle Uses (Zero Tolerance)
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">
                Operating a Luxoria fleet vehicle under any of the following conditions constitutes a material breach of contract, resulting in immediate vehicle repossession, police report filing, and legal prosecution:
              </p>
              <ul className="space-y-2 text-sm text-[#4A4A4A] list-disc pl-5 font-normal">
                <li>Driving under the influence of alcohol, narcotics, or prescription drugs (Zero Tolerance).</li>
                <li>Commercial sub-leasing, unauthorized ride-hailing, or unapproved third-party driving.</li>
                <li>Speed racing, track days, drag events, or stunt driving without written concierge authorization.</li>
                <li>Transporting hazardous goods, contraband, or illegal substances under the Indian Penal Code.</li>
                <li>Off-road driving, waterlogged terrain traversal, or exceeding vehicle passenger capacity.</li>
              </ul>
            </section>

            <section id="insurance" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <ShieldCheck className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 7. Insurance, Damage Claims & Deductibles
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">
                All vehicles carry comprehensive commercial insurance coverage under Motor Vehicles Act regulations. In the event of an accident or body damage:
              </p>
              <ul className="space-y-2 text-sm text-[#4A4A4A] list-disc pl-5 font-normal">
                <li>The renter must notify Luxoria Support within <strong className="text-[#0F0F0F] font-semibold">2 hours</strong> of the incident and file a Police FIR if third-party injury is involved.</li>
                <li>The renter's financial liability is capped at the maximum security deductible amount specified during checkout, provided no prohibited use rules were violated.</li>
              </ul>
            </section>

            <section id="vendors" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <FileText className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 8. Vendor Fleet Partner Terms
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                Vendors listing vehicles on Luxoria must maintain valid Registration Certificates (RC), commercial insurance policies, pollution fitness certificates (PUC), and maintain pristine mechanical standards. Luxoria reserves the right to reject or delist non-compliant vehicles.
              </p>
            </section>

            <section id="liability" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Lock className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 9. Limitation of Liability & Disclaimers
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed text-base font-normal">
                Luxoria shall not be liable for indirect, incidental, or special damages arising from mechanical breakdowns, severe weather delays, or third-party acts. Total monetary liability is capped strictly at the total booking fee paid by the user.
              </p>
            </section>

            <section id="jurisdiction" className="bg-white border border-[#ECECEC] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden group">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A75D]/40 to-transparent absolute top-0 left-0" />
              <h2 className="text-2xl font-bold text-[#0F0F0F] mb-4 flex items-center gap-3 tracking-tight">
                <Mail className="w-6 h-6 text-[#C9A75D] stroke-[1.8]" /> 10. Governing Law & Legal Contact
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 text-base font-normal">
                These terms are governed by and construed in accordance with the laws of the Republic of India. Any legal disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
              <div className="p-5 rounded-xl bg-[#FDFBF7] border border-[#C9A75D]/30 text-sm">
                <p className="text-[#0F0F0F] font-bold">Luxoria Legal & Governance Desk</p>
                <p className="text-[#555555] mt-1 font-medium">Email: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aaryanpatel9784@gmail.com&su=Luxoria%20Legal%20Desk%20Inquiry" target="_blank" rel="noopener noreferrer" className="text-[#C9A75D] font-semibold hover:underline">aaryanpatel9784@gmail.com</a></p>
                <p className="text-[#555555] font-medium">Official Phone: +91 82380 12515</p>
              </div>
            </section>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
