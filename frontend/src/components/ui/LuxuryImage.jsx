import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Premium fallback image (Rolls Royce interior/abstract luxury)
const FALLBACK_URL = "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=2069&auto=format&fit=crop";

export default function LuxuryImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = FALLBACK_URL, 
  priority = false,
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      // Only show alt text if we haven't encountered an error, 
      // otherwise hide alt text to prevent broken look.
      alt={hasError ? "" : alt}
      onError={handleError}
      className={cn("bg-surface transition-opacity duration-500", className)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      {...props}
    />
  );
}
