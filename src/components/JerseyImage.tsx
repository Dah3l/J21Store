import { useState } from 'react';

interface JerseyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function JerseyImage({ src, alt, className = '' }: JerseyImageProps) {
  const [error, setError] = useState(false);

  // Placeholder SVG inline (camiseta genérica)
  const placeholder = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
      <rect width="200" height="200" fill="#27272a"/>
      <path d="M60 50 L80 40 L100 45 L120 40 L140 50 L160 70 L145 85 L135 75 L135 160 L65 160 L65 75 L55 85 L40 70 Z" fill="#3f3f46" stroke="#52525b" stroke-width="2"/>
      <text x="100" y="115" text-anchor="middle" fill="#71717a" font-size="14" font-family="sans-serif">Sin imagen</text>
    </svg>
  `)}`;

  if (!src || error) {
    return (
      <img
        src={placeholder}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
