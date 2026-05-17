import type { CardBrand } from '../utils/cardBrand';
import visaLogo from '../assets/card-brands/visa.svg';
import mastercardLogo from '../assets/card-brands/mastercard.svg';
import amexLogo from '../assets/card-brands/amex.svg';
import discoverLogo from '../assets/card-brands/discover.svg';
import rupayLogo from '../assets/card-brands/rupay.svg';

interface CardBrandIconProps {
  brand: CardBrand;
  className?: string;
}

const BRAND_LOGOS: Record<NonNullable<CardBrand>, { src: string; alt: string }> = {
  visa: { src: visaLogo, alt: 'Visa' },
  mastercard: { src: mastercardLogo, alt: 'Mastercard' },
  amex: { src: amexLogo, alt: 'American Express' },
  discover: { src: discoverLogo, alt: 'Discover' },
  rupay: { src: rupayLogo, alt: 'RuPay' },
};

const IMG_CLASS = 'h-8 w-auto max-w-[3.5rem] min-w-[2.75rem] object-contain object-right';

export default function CardBrandIcon({ brand, className = '' }: CardBrandIconProps) {
  if (!brand) return null;

  const logo = BRAND_LOGOS[brand];

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      title={logo.alt}
    >
      <img src={logo.src} alt={logo.alt} className={IMG_CLASS} loading="lazy" />
    </span>
  );
}
