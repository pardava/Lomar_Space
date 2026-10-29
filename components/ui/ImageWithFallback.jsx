'use client';
import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * <img> that survives missing or 404 image URLs (common in the affiliate catalog).
 * Renders a quiet surface with an icon instead of a broken-image glyph.
 */
export default function ImageWithFallback({ src, alt = '', className = '', icon: Icon = ImageOff, ...rest }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || 'Image unavailable'}
        className={`grid place-items-center bg-gradient-to-br from-lomar-surface via-[#151b2b] to-[#1a1626] text-lomar-muted ${className}`}
      >
        <Icon className="h-8 w-8 opacity-60" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
