/**
 * LUXORIA — Framer Motion Presets
 * Premium, cinematic animation variants for consistent luxury feel.
 */

// ─── Easing Curves ──────────────────────────────────────────────────────────
export const EASE_LUXE = [0.22, 1, 0.36, 1];        // Apple-like ease-out
export const EASE_SPRING = [0.34, 1.56, 0.64, 1];   // Slight overshoot
export const EASE_SMOOTH = [0.4, 0, 0.2, 1];        // Standard Material

// ─── Page Transitions ───────────────────────────────────────────────────────
export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_LUXE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: EASE_SMOOTH } },
};

// ─── Fade Variants ──────────────────────────────────────────────────────────
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: EASE_LUXE } },
};

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_LUXE } },
};

export const fadeDown = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_LUXE } },
};

export const fadeLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_LUXE } },
};

export const fadeRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_LUXE } },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_LUXE } },
};

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_LUXE } },
};

// ─── Scale Variants ─────────────────────────────────────────────────────────
export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE_SPRING } },
};

export const scaleUp = {
  initial: { opacity: 0, scale: 0.85, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE_SPRING } },
};

// ─── Stagger Containers ─────────────────────────────────────────────────────
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_LUXE } },
};

export const staggerItemScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_SPRING } },
};

// ─── Modal / Overlay Animations ─────────────────────────────────────────────
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_SPRING },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 5,
    transition: { duration: 0.2, ease: EASE_SMOOTH },
  },
};

// ─── Sidebar / Drawer Animations ────────────────────────────────────────────
export const slideDrawerLeft = {
  initial: { x: '-100%' },
  animate: { x: 0, transition: { duration: 0.4, ease: EASE_LUXE } },
  exit: { x: '-100%', transition: { duration: 0.3, ease: EASE_SMOOTH } },
};

export const slideDrawerRight = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { duration: 0.4, ease: EASE_LUXE } },
  exit: { x: '100%', transition: { duration: 0.3, ease: EASE_SMOOTH } },
};

// ─── Hover Interactions ─────────────────────────────────────────────────────
export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.25, ease: EASE_LUXE } },
  whileTap: { y: 0, scale: 0.98 },
};

export const hoverScale = {
  whileHover: { scale: 1.03, transition: { duration: 0.25, ease: EASE_LUXE } },
  whileTap: { scale: 0.97 },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 40px rgba(212, 175, 55, 0.15), 0 0 80px rgba(212, 175, 55, 0.05)',
    transition: { duration: 0.3 },
  },
};

// ─── Number Counter ─────────────────────────────────────────────────────────
export const countUp = (target) => ({
  initial: { value: 0 },
  animate: { value: target, transition: { duration: 1.5, ease: EASE_LUXE } },
});

// ─── Viewport-triggered animation (whileInView) ────────────────────────────
export const revealOnScroll = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: EASE_LUXE },
};
