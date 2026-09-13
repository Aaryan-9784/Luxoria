import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * AuthImage — Optimized background image loader for auth pages.
 *
 * Strategy:
 * 1. Immediately starts preloading via a hidden Image() object on mount.
 * 2. Shows a smooth shimmer placeholder while loading.
 * 3. Once the image is fully downloaded & decoded, fades it in with a
 *    cinematic scale animation — no more blank/broken states.
 * 4. Caches loaded URLs in a module-level Set so navigating between
 *    auth pages that share the same image is instant.
 */

const loadedCache = new Set();

export default function AuthImage({ src, alt = 'Background', style, ...rest }) {
  const [loaded, setLoaded] = useState(() => loadedCache.has(src));
  const imgRef = useRef(null);

  useEffect(() => {
    if (loadedCache.has(src)) {
      setLoaded(true);
      return;
    }

    let cancelled = false;
    const img = new Image();

    img.src = src;

    // Use decode() for non-blocking decode when available
    if (img.decode) {
      img.decode()
        .then(() => {
          if (!cancelled) {
            loadedCache.add(src);
            setLoaded(true);
          }
        })
        .catch(() => {
          // decode can fail on some browsers, fall back to onload
          if (!cancelled && img.complete) {
            loadedCache.add(src);
            setLoaded(true);
          }
        });
    }

    img.onload = () => {
      if (!cancelled) {
        loadedCache.add(src);
        setLoaded(true);
      }
    };

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <>
      {/* Shimmer placeholder while loading */}
      {!loaded && (
        <div
          className="auth-bg-placeholder"
          aria-hidden="true"
        />
      )}

      {/* Actual image — only animate once loaded */}
      <motion.img
        ref={imgRef}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={loaded ? { scale: 1, opacity: 1 } : { scale: 1.05, opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        src={src}
        alt={alt}
        className={`auth-bg-image${loaded ? ' loaded' : ''}`}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        style={style}
        {...rest}
      />
    </>
  );
}
