import React from 'react';
import { Product } from '../types';

interface ProductArtworkProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
}

export const PharmacySealSvg: React.FC<{ className?: string }> = ({
  className = 'w-11 h-11',
}) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M32 5L38.4 10.6L46.8 9.2L49.4 17.3L57.2 20.8L55.2 29.1L60 36.2L53.8 42.1L54.4 50.6L46 52.3L41.8 59.7L33.6 56.8L25.4 59.7L21.2 52.3L12.8 50.6L13.4 42.1L7.2 36.2L12 29.1L10 20.8L17.8 17.3L20.4 9.2L28.8 10.6L32 5Z"
      fill="#95D5B2"
      stroke="#141413"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle
      cx="32"
      cy="32"
      r="16"
      fill="#FDF6E9"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <path
      d="M25.5 32.5L29.8 36.8L39 27.5"
      stroke="#0F5C56"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DiscreetParcelSvg: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg
    viewBox="0 0 72 72"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="10"
      y="18"
      width="52"
      height="40"
      rx="5"
      fill="#E5B985"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <rect
      x="29"
      y="18"
      width="14"
      height="40"
      fill="#FFD166"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <rect
      x="16"
      y="34"
      width="24"
      height="16"
      rx="2"
      fill="#FDF6E9"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <line
      x1="20"
      y1="40"
      x2="34"
      y2="40"
      stroke="#141413"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="20"
      y1="45"
      x2="30"
      y2="45"
      stroke="#F26B50"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SmartLockerSvg: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg
    viewBox="0 0 72 72"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="12"
      y="8"
      width="48"
      height="56"
      rx="6"
      fill="#0F5C56"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <rect
      x="18"
      y="14"
      width="24"
      height="44"
      rx="3"
      fill="#95D5B2"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <rect
      x="46"
      y="18"
      width="8"
      height="14"
      rx="2"
      fill="#FFD166"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <circle cx="37" cy="36" r="2.5" fill="#141413" />
    <line
      x1="23"
      y1="22"
      x2="35"
      y2="22"
      stroke="#141413"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  product,
  size = 'sm',
}) => {
  const stageBg: Record<Product['accentTone'], string> = {
    teal: 'bg-[#95D5B2]',
    slate: 'bg-[#FFD166]',
    sage: 'bg-[#FDF6E9]',
    coral: 'bg-[#F26B50]',
  };

  const containerClass =
    size === 'lg'
      ? 'w-full h-44 rounded-2xl border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413]'
      : size === 'md'
      ? 'w-full h-24 rounded-xl border-[2.5px] border-[#141413]'
      : 'w-16 h-16 rounded-xl border-[2.5px] border-[#141413] shrink-0';

  const svgClass =
    size === 'lg' ? 'w-32 h-32' : size === 'md' ? 'w-16 h-16' : 'w-12 h-12';

  if (product.category === 'hydration') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${stageBg[product.accentTone]} ${containerClass}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 80 80"
          className={svgClass}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="27"
            y="8"
            width="26"
            height="11"
            rx="3"
            fill="#FFD166"
            stroke="#141413"
            strokeWidth="2.5"
          />
          <rect
            x="21"
            y="19"
            width="38"
            height="51"
            rx="9"
            fill="#FDF6E9"
            stroke="#141413"
            strokeWidth="2.5"
          />
          <path
            d="M40 30C40 30 31 40.5 31 46.5C31 51.47 35.03 55.5 40 55.5C44.97 55.5 49 51.47 49 46.5C49 40.5 40 30 40 30Z"
            fill="#0F5C56"
            stroke="#141413"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line
            x1="28"
            y1="62"
            x2="52"
            y2="62"
            stroke="#141413"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        {size === 'lg' && (
          <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#FDF6E9] border-[2px] border-[#141413] text-[11px] font-mono font-bold text-[#141413]">
            {product.nominalWidth}
          </span>
        )}
      </div>
    );
  }

  const packFill =
    product.accentTone === 'teal'
      ? '#0F5C56'
      : product.accentTone === 'slate'
      ? '#F26B50'
      : '#FFD166';

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${stageBg[product.accentTone]} ${containerClass}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 80 80"
        className={svgClass}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back foil shadow card */}
        <rect
          x="19"
          y="15"
          width="46"
          height="52"
          rx="6"
          fill="#141413"
        />
        {/* Stylized foil square pack */}
        <rect
          x="15"
          y="11"
          width="46"
          height="52"
          rx="6"
          fill={packFill}
          stroke="#141413"
          strokeWidth="2.5"
        />
        <rect
          x="21"
          y="17"
          width="34"
          height="11"
          rx="2.5"
          fill="#FDF6E9"
          stroke="#141413"
          strokeWidth="2.5"
        />
        <circle
          cx="38"
          cy="44"
          r="10"
          fill="#FDF6E9"
          stroke="#141413"
          strokeWidth="2.5"
        />
        <circle
          cx="38"
          cy="44"
          r="4"
          fill="#FFD166"
          stroke="#141413"
          strokeWidth="2.2"
        />
      </svg>
      {size === 'lg' && (
        <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#FDF6E9] border-[2px] border-[#141413] text-[11px] font-mono font-bold text-[#141413]">
          {product.thickness}
        </span>
      )}
    </div>
  );
};
